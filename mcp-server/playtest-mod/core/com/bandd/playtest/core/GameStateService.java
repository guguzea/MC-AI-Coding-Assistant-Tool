package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * **（半）实时游戏状态器**：在 mod 内**持续刷新并缓存**一张「网格 + 高度」的文本地图 + 状态快照，
 * 查询**只读缓存**（不是每次查询现场全扫）。
 *
 * <h3>线程与分帧纪律（硬约束）</h3>
 * <ul>
 *   <li>{@link #tick()} 由客户端 tick 线程调（{@link PlaytestCore#onTick()} 里挂钩）。</li>
 *   <li>扫描**每 tick 只推进 {@link StateConfig#columnsPerTick} 格**（分帧）——
 *       **绝不允许一次全扫**（48×48 = 2304 格一次扫会卡 tick 线程）。</li>
 *   <li>**扫完一整张才启用**：{@link #tick()} 里扫满一整张才会把 pending 提为 active；
 *       查询只读 active。扫描中途查询 ⇒ 回上一张已完成的图 + {@code scan} 进度。</li>
 *   <li>查询（{@link #query(Map)}）在 tick 线程（ActionQueue）跑，只读数组、不做 MC 调用。</li>
 * </ul>
 *
 * <h3>版本语义</h3>
 * {@code stateVersion} 只在**一张完整的图与上一张内容不同**时自增（维度/原点/步长/格内容任一不同）。
 * 扫描进行中或「重采后内容一模一样」都**不动**版本 ⇒ 客户端拿 {@code sinceVersion} 轮询时
 * 未变的那次只回 {@code {unchanged:true, stateVersion, tick}}，**不回整张图**。
 *
 * <h3>地图口径（用户拍板）</h3>
 * 每格 = **方块码 1 字符 + 高度数字定宽字段**（固定宽度 ⇒ 不靠空格对齐、不粘连）；
 * 玩家所在格把方块码换成 {@link StateConfig#playerMark}（高度字段保留）；
 * 未知格（{@code blockAt} 回 null）用 {@link StateConfig#unknownCode} + 高度全 '?'，**不崩**。
 *
 * <h3>图例口径（legend / legendUnused —— 只广告图里真有的码）</h3>
 * {@code legend} **只列本张渲染出来的 {@code grid} 里真实出现的码**（方块码按 id 升序）：
 * 未知码只在图里真有未知格时出现、方块码只在图里真采到时出现、溢出码只在实际画了溢出码时出现。
 * 玩家格的 {@link StateConfig#playerMark} **不是方块码**，永不进 {@code legend}（它由
 * {@code playerMark} + {@code playerCell}/{@code playerCellOutside} 自报）；
 * 因此若某方块**只出现在玩家那一格**，它的码不会进 {@code legend}，而是进 {@code legendUnused}。
 * 本张快照**已分配码、但没画进本图**的方块码（降采样/截断漏掉，或只被玩家标记盖住）如实列进
 * {@code legendUnused}（形如 {@code [{"code":"P","id":"minecraft:oak_fence"}]}，空数组 = 全用上）。
 * {@code legendOverflow} 语义不变：码位用尽时列出的额外 id 列表（本张快照里落在 overflowCode 的 id，按 id 升序）。
 *
 * <h3>会话码表（paletteEpoch / paletteSize）—— 修 bug：方块码跨扫描不稳定</h3>
 * 真机实证（fabric-1.21.11，{@code stateVersion} 6 → 7）：挖掉脚下一格 ⇒ 高度只降 1，但 2304 格里有
 * 2248 格的**方块码整体位移**（新暴露的 id 按字典序插到前面 ⇒ 后面全体 +1）⇒ AI 无法跨快照追踪
 * 同一块地、{@code sinceVersion} 省 token 的设计被架空。
 *
 * <p>新口径：码表**按会话持久、只追加**（{@code idToCode} / {@code nextSlot} / {@code usedCodes}）——
 * <ul>
 *   <li>同一 {@code paletteEpoch} 内，**同一方块 id 的码恒定不变**；</li>
 *   <li>新出现的 id 拿**未用过的**码；**永不回收、永不重排**已有码；</li>
 *   <li>码位（{@code cfg.palette}，默认 52 个：A-Z a-z）用尽后，新 id 一律画
 *       {@code cfg.overflowCode}（{@code '#'}）并进 {@code legendOverflow}；</li>
 *   <li>{@code paletteSize} = 本世代**已分配过码**的 id 总数（**含本图未出现的**；本张快照里已分配码
 *       但没画进 grid 的仍如实进 {@code legendUnused}）。码表**单调增**，只有换世代才会缩小。</li>
 * </ul>
 *
 * <p>**重置边界（只此三处，别处不许清空码表）**：
 * <ol>
 *   <li>换维度：{@code completeScan} 检测到 {@code sDim != dim}；</li>
 *   <li>换世界：{@code open_world} / {@code join_server} 由 {@link PlaytestCore} **显式**调
 *       {@link #resetPalette(String)}（同一维度名下的两个存档是**不同世界**，维度判据抓不到 ⇒ 必须显式重置）；</li>
 *   <li>渲染码表配置变了（{@code cfg.palette} 指纹变化 ⇒ 旧码可能已不在码表里）。</li>
 * </ol>
 * 重置时**丢弃当前快照**（{@code mapReady=false}）：旧世界的图不能拿新码表渲染（否则整张变 overflowCode）。
 * 同一会话内**正常重扫（refresh / 主动刷新）绝不重置** ⇒ 码稳定。
 *
 * <h3>step 参数口径（fail-loud，不许静默）</h3>
 * <ul>
 *   <li>省略 {@code step} ⇒ 自动降采样（按 maxChars 决定，最粗不超过 maxAutoStep）。</li>
 *   <li>{@code step < 1}（含 0 / 负数）⇒ 视为**未指定**、走自动规则；回执必带
 *       {@code stepClampedTo} + {@code stepNote}（不再静默变成 1）。</li>
 *   <li>{@code step >= 1} ⇒ 先抬到不小于扫描步长、再夹到不超过 {@code maxAutoStep}、最后对齐到扫描步长倍数；
 *       只要最终值与请求值不同，回执必带 {@code stepRequested}/{@code stepClampedTo}/{@code stepNote}。</li>
 * </ul>
 *
 * <h3>实体层（{@code entityGrid} / {@code entityLegend} / {@code entities[]}）—— 叠加，不是另起一张图</h3>
 * {@link StateConfig#includeEntities}（或本次调用的 {@code entities=true|false}）打开后，地图头里**多一层**
 * 与 {@code grid} **同几何**的定宽字符网格 {@code entityGrid}：
 * <ul>
 *   <li>同 {@code cols}/{@code rows}/{@code step}/{@code origin}/{@code cellWidth}（每格也是 {@code cellWidth} 个字符）；</li>
 *   <li>空格子 = 填充符 {@link #ENTITY_FILL}（{@code "."}）；玩家格画 {@code playerMark}；
 *       **该格内有实体时实体标记优先**（实体明细 {@code entities[]} 永远完整，不会因被标记盖住就丢）；</li>
 *   <li>**绝不许覆盖方块层**：方块码只出现在 {@code grid} 里；{@code entityGrid} 的标记是**另一个命名空间**
 *       （类别字母 {@code i/x/v/r/m/a/e}），有**独立**的 {@code entityLegend}，也**不进** {@code legend}/{@code legendUnused}；</li>
 *   <li>{@code entities[]} = 半径内实体的明细（type / cls / 类别 / 世界坐标 / 与玩家距离 / 是否落在图内 + 格坐标），
 *       **按距离由近到远排序**；</li>
 *   <li>半径内没实体 ⇒ 如实给**空层**（全填充符 + {@code entityCount:0} + {@code entityNote}），不是错误、更不是「编一个」；</li>
 *   <li>本档没有实体扫描面（{@code GameBridge#nearbyEntitiesJson} 回 null / 没自报
 *       {@code entityScanCapable()}）⇒ 头里如实写 {@code entitiesIncluded:false} + {@code entitiesNote}，**不假装有**。</li>
 * </ul>
 * 实体缓存由 {@link #tick()}（客户端 tick 线程）每 tick 刷新一次，查询只读缓存 —— 与方块层同一个纪律：
 * **HTTP / 查询侧一次 MC 调用都不做**。
 *
 * <p>Java 8 兼容（与 54 个老档共用同一份 core 源码）。
 */
public final class GameStateService {

    /** 状态快照 schema（动作回执顶层带它）。 */
    public static final String STATE_SCHEMA = "bandd-state/1";
    /** 地图 schema（地图头里带它）。 */
    public static final String MAP_SCHEMA = "bandd-state-map/1";
    /** 轴向说明（**写死**，不许靠读者猜）。 */
    public static final String AXIS_NOTE =
            "列 0..cols-1 向右 = +x（东）；行 0..rows-1 向下 = +z（南）；原点(左上角) = 最西北那格";
    /** 高度口径（写进地图头，别让读者猜 h 是什么）。 */
    public static final String HEIGHT_MODE =
            "每列最高非空气方块的 Y（WORLD_SURFACE 高度图：getTopY/getHeight(type,x,z) - 1）";
    /**
     * [T16] 本档（1.18+ 主世界口径）的**建高下限**：{@code topSolidY < 此值} ⇒ 该列**没有任何方块**
     * ⇒ 判未知（问号），不当地表画。
     *
     * <p>为什么必须有这条：真机两档都复现 —— 客户端在**未加载区块**上回的不是 null，而是
     * {@code minecraft:void_air} 且 {@code topSolidY=-65}（适配层那条加载判据实际没拦住）。
     * core 用两条判据兜底：① 该格地表方块 id 是 void_air；② topSolidY 低于本下限。
     * **不改**各档适配层的加载 API（跨版本四声部、风险大）。
     */
    public static final int SURFACE_MIN_BUILD_Y = -64;
    /** 未知格的图例名。 */
    public static final String UNKNOWN_ID = "<unknown:未加载/越界/本档不支持>";
    /** [T16] 地图把 void_air / 低于建高下限的格判未知时的人话（只在真有这种格时进地图头）。 */
    public static final String VOID_AIR_UNKNOWN_NOTE =
            "有格读到 minecraft:void_air（客户端在**未加载**区块回它而不是 null；真机两档 topSolidY=-65）"
            + " 或 topSolidY 低于本档建高下限 " + SURFACE_MIN_BUILD_Y
            + " ⇒ 这些格一律判**未知**（画 unknownCode、不进 legend），**不当地表方块画**；"
            + "已加载区域不受影响。要看清哪一列未加载请用 query_column（它的 unloadedSuspect 是同一件事的列级自证）";
    /**
     * 会话码表的自证说明（原样写进地图头 {@code paletteNote}）——
     * 别让调用方猜 {@code paletteEpoch}/{@code paletteSize} 是什么，也别让它以为「码会随扫描重排」。
     */
    public static final String PALETTE_NOTE =
            "同一 paletteEpoch 内，同一方块 id 的码恒定不变（码表只追加：新 id 拿未用过的码，"
                    + "已有码永不回收、永不重排）；码位用尽后新 id 一律画 overflowCode 并进 legendOverflow。"
                    + "paletteEpoch 只在换世界（open_world/join_server）/换维度/换码表配置时自增；"
                    + "paletteSize = 本世代已分配过码的 id 总数（含本图未出现的）";

    // ---- 实体层（叠加层）----
    /** 实体层空格子的填充符（写进地图头 {@code entityGridFill}，别让读者猜）。 */
    public static final String ENTITY_FILL = ".";
    /** 实体层的几何 / 填充口径（原样写进地图头 {@code entityGridNote}）。 */
    public static final String ENTITY_GRID_NOTE =
            "entityGrid 与 grid 同几何（同 cols/rows/step/origin/cellWidth），是**另一层**行宽相同的字符网格；"
                    + "每格 cellWidth 个字符：空格子 = entityGridFill 重复 cellWidth 次，"
                    + "有标记的格 = 标记字符 + entityGridFill 重复 (cellWidth-1) 次；"
                    + "玩家格画 playerMark，但**该格内有实体时实体标记优先**；"
                    + "方块码只出现在 grid 里，本层的标记（类别字母）是独立命名空间，见 entityLegend";
    /** 实体层标记的命名空间说明（写进地图头，避免与方块码混淆）。 */
    public static final String ENTITY_LEGEND_NOTE =
            "entityLegend 是**实体类别 → 标记字符**，与方块 legend 完全独立（不是方块码）；"
                    + "标记按实体注册名/类简单名的子串**启发式**归类（i=掉落物 x=经验球 v=载具 r=投射物 "
                    + "m=敌对 a=被动 e=其它），可能把模组实体归到 e；原始 type/cls 逐条写在 entities[] 里，不藏";
    /** 半径内没有实体时的话（如实给空层，不是错误）。 */
    public static final String ENTITY_EMPTY_NOTE =
            "本张地图的实体半径内当前**没有**实体 ⇒ entityGrid 全为填充符、entities 为空数组（如实给空层，不是编的）";

    private final GameBridge bridge;
    private final StateConfig cfg;

    // ---- 进行中的扫描（pending）----
    private boolean scanning;
    private int sStep, sOriginX, sOriginZ, sCols, sRows, sCursor;
    private String[] sCodes;
    private int[] sHeights;
    private String sDim;
    private int sStartedTick;
    private int sErrors;
    private String sLastError;
    /** [T16] 本次扫描里被判为 void_air 未知的格数（未加载区自证；写进地图头）。 */
    private int sVoidAir;

    // ---- 已完成的快照（active；查询只读这一份）----
    private boolean ready;
    private int version;
    private int cols, rows, step, originX, originZ;
    private String[] codes;
    private int[] heights;
    private String dim;
    private int builtTick;
    private int yMin = Integer.MAX_VALUE;
    private int yMax = Integer.MIN_VALUE;
    private int heightWidth = 1;
    /** [T16] 当前快照里因 void_air / 低于建高下限被判未知的格数（>0 才进地图头）。 */
    private int voidAirUnknown;
    // ---- 会话码表（**只追加**：同一 paletteEpoch 内同一 id 的码不变；见类注释）----
    /** id → 码。**只增不改**；只有 {@link #resetPalette(String)} 会清空（= 换世代）。 */
    private final Map<String, Character> idToCode = new LinkedHashMap<String, Character>();
    /** 本世代**已经发出去过**的码（不回收 ⇒ 新 id 拿到的码一定是本世代没出现过的字符）。 */
    private final Set<Character> usedCodes = new HashSet<Character>();
    /** palette 里下一个待分配的槽位（单调递增；配 {@link #usedCodes} 双保险）。 */
    private int nextSlot;
    /** 码表世代号：同一世代内同一 id 的码不变；重置时 +1（写进地图头 {@code paletteEpoch}）。 */
    private int paletteEpoch = 1;
    /** 本世代建立时对应的维度（诊断用）。 */
    private String paletteDim;
    /** 本世代建立时的 palette 指纹（配置改了 ⇒ 旧码可能非法 ⇒ 必须换世代）。 */
    private String paletteFingerprint;
    /** 重置次数 / 最近一次重置原因（{@code /status} 自报）。 */
    private int paletteResets;
    private String paletteResetReason;
    // ---- 本张快照的码记账（legend / legendUnused / legendOverflow 都是**按张**的）----
    /** 本张快照里**已分配到码**的 id（按 id 升序；= legend ∪ legendUnused 的签名域）。 */
    private final List<String> snapshotAllocatedIds = new ArrayList<String>();
    /** 本张快照里**没有码可用**（码位用尽）的 id（按 id 升序，最多留 64 个样本）。 */
    private final List<String> overflowIds = new ArrayList<String>();
    /** 本张快照落在 overflowCode 的 id **总数**（overflowIds 只留前 64 个样本）。 */
    private int overflowTotal;
    private boolean legendOverflow;

    // ---- 实体层缓存（由 tick() 每 tick 刷新；查询只读）----
    /** 半径内实体明细（**上一 tick** 的读数）。 */
    // 这些字段在 **tick 线程写、HTTP 线程（/status）读** ⇒ 全部 volatile（否则读到的是撕裂的旧值）。
    private volatile List<EntityRec> entities = new ArrayList<EntityRec>();
    /** 桥有没有真的给过实体数据（区分「不支持」与「这一刻真没有」）。 */
    private volatile boolean entitySupported;
    /** 有没有探测过（不支持的档只调一次，之后不再每 tick 空调）。 */
    private volatile boolean entityProbed;
    /** 上次刷新的 tick / 解析失败原因（自报用）。 */
    private volatile int entityRefreshedTick = -1;
    private volatile String entityLastError;
    /** 上次实体扫描用的半径（格）；-1 = 还没扫过。 */
    private volatile double entityRadiusUsed = -1.0;
    /** 上一 tick 桥报的实体总数（可能 > entities.size()，如实留档）。 */
    private volatile int entityReportedTotal = -1;

    // ---- [T14] 纵层 yMode：会话**纵层专用**码表（同一张 palette，**从末尾倒着发**）----
    /**
     * 地表图上**天然不出现**的 id（最典型的是 {@code minecraft:air}）用的纵层专用码。
     *
     * <p>为什么不并进 {@link #idToCode}：既有契约里 {@code paletteSize} = 「地表图发出过的码数」
     * （单测 StateTest K6/L1/L5 逐字钉着它）。纵层新出现的 id 若也写进 {@code idToCode}，
     * 会把那个口径改掉。这里改成**同一张 palette、同一个 {@link #usedCodes}、但从末尾倒着发的
     * 第二只只追加游标** ⇒ 同一 id 仍只有一个码、码仍全局唯一、仍只追加不回收，
     * 而 {@code paletteSize} 的口径一字不动（另给 {@code layerPaletteSize} 自报）。
     */
    private final Map<String, Character> layerIdToCode = new LinkedHashMap<String, Character>();
    /** 纵层专用游标：从 palette **末尾**往前找第一个没被 {@link #usedCodes} 占掉的字符。 */
    // ---- [T14] 纵层 yMode：分帧采样 job（进行中）与已发布快照（查询只读） ----
    private volatile YLJob ylJob;
    private volatile YLJob ylDone;
    private volatile boolean ylEverRan;
    private volatile int ylRuns;
    private String ylLastCancelReason;

    // ---- 计数 ----
    private int ticks;
    private int lastScanStart = -1000000;
    private int scansCompleted;
    private int refreshes;

    public GameStateService(GameBridge bridge, StateConfig cfg) {
        this.bridge = bridge;
        this.cfg = cfg == null ? new StateConfig() : cfg;
        this.cfg.sanitize();
    }

    /** 给 T3（设置页面）用的唯一入口：读就 {@code core.state().config()}。 */
    public StateConfig config() {
        return cfg;
    }

    // ==================================================================
    // 1. 每个客户端 tick：分帧推进扫描 + 到期主动重采
    // ==================================================================

    /**
     * 客户端 tick 线程每 tick 一次。**这里**是唯一调用 {@code blockAt}/{@code topSolidY}
     * 与 {@code nearbyEntitiesJson} 的地方（查询侧一次 MC 调用都不做）。
     */
    public void tick() {
        ticks++;
        refreshEntities();                          // 实体层：每 tick 刷一遍（不支持的档只调一次，之后不再空调）
        if (!bridge.stateMapCapable()) return;      // 本档没有取值面 ⇒ 一格都不扫（老档零开销）
        if (!bridge.ready()) {                       // 没有玩家/世界（菜单、加载中）
            scanning = false;                        // 中止进行中的扫描；已完成的快照留着
            sqActive = false;                        // [T13] 方框搜索同理中止（不假装还在扫）
            if (ylJob != null) {                     // [T14] 纵层采样同理中止（不假装还在扫）
                ylLastCancelReason = "玩家 / 世界不在场 ⇒ 本次纵层采样中止（已采的丢弃）";
                ylJob = null;
            }
            refreshPlayerDepth();                    // [T13] ⑦ 没有玩家 ⇒ 深度一律 null + 如实说明
            return;
        }
        refreshPlayerDepth();                        // [T13] ⑦ 每 tick 刷一次地表深度（1 次 topSolidY）
        advanceSearch();                             // [T13] ⑥b 分帧推进方框搜索（每 tick ≤ 256 格）
        advanceLayerScan();                          // [T14] ⑧ 分帧推进纵层采样（每 tick ≤ columnsPerTick 格）
        if (!scanning) {
            if (ticks - lastScanStart < cfg.refreshIntervalTicks) return;
            startScan(cfg.step, cfg.chunkRadius, false);
            if (!scanning) return;
        }
        scanSlice(cfg.columnsPerTick);
    }

    /** 立刻重采一张（分帧照旧；{@code refresh:true} 与主动刷新都走这里）。 */
    public boolean requestRefresh() {
        if (!bridge.stateMapCapable() || !bridge.ready()) return false;
        refreshes++;
        startScan(cfg.step, cfg.chunkRadius, true);
        return true;
    }

    private void startScan(int reqStep, int reqRadius, boolean force) {
        double[] pxz = playerXZ();
        if (pxz == null) return;
        int bx = (int) Math.floor(pxz[0]);
        int bz = (int) Math.floor(pxz[1]);
        int cx = floorDiv(bx, 16);
        int cz = floorDiv(bz, 16);
        int r = Math.max(0, reqRadius);
        int st = Math.max(1, reqStep);
        int side = (2 * r + 1) * 16;
        int c = ceilDiv(side, st);
        int rw = c;
        sStep = st;
        sOriginX = (cx - r) * 16;
        sOriginZ = (cz - r) * 16;
        sCols = c;
        sRows = rw;
        sCursor = 0;
        sErrors = 0;
        sLastError = null;
        sVoidAir = 0;
        sCodes = new String[c * rw];
        sHeights = new int[c * rw];
        sDim = dimOf();
        sStartedTick = ticks;
        scanning = true;
        lastScanStart = ticks;
        if (force) { /* 主动刷新：上一次未完成的扫描直接丢弃 */ }
    }

    private void scanSlice(int budget) {
        int total = sCols * sRows;
        int done = 0;
        while (done < budget && sCursor < total) {
            int idx = sCursor;
            int i = idx % sCols;
            int j = idx / sCols;
            int bx = sOriginX + i * sStep;
            int bz = sOriginZ + j * sStep;
            try {
                int top = bridge.topSolidY(bx, bz);
                // [T16] 未加载区块：客户端回的是 minecraft:void_air（不是 null）且 topSolidY 低到 -65。
                // 两条判据（id 是 void_air / 低于本档建高下限）都判**未知** —— 画问号、不进 legend。
                // 只在 core 判；**不动**各档适配层的加载 API（见 SURFACE_MIN_BUILD_Y 的类注释）。
                if (top == Integer.MIN_VALUE) {
                    sHeights[idx] = Integer.MIN_VALUE;      // 适配层如实回「取不到」
                    sCodes[idx] = null;
                } else if (top < SURFACE_MIN_BUILD_Y) {
                    sHeights[idx] = Integer.MIN_VALUE;      // 低于建高下限 = 这一列什么都没有（未加载形状）
                    sCodes[idx] = null;
                    sVoidAir++;
                } else {
                    String id = bridge.blockAt(bx, top, bz);
                    if (isVoidAirId(id)) {
                        sHeights[idx] = Integer.MIN_VALUE;  // 客户端在未加载区块回 void_air（不是 null）
                        sCodes[idx] = null;
                        sVoidAir++;
                    } else {
                        sHeights[idx] = top;
                        sCodes[idx] = id;
                    }
                }
            } catch (Throwable t) {
                // 适配层炸了也不许把游戏 tick 带崩：这一格记「未知」并如实计数
                sHeights[idx] = Integer.MIN_VALUE;
                sCodes[idx] = null;
                sErrors++;
                sLastError = String.valueOf(t);
            }
            sCursor++;
            done++;
        }
        if (sCursor >= total) completeScan();
    }

    private void completeScan() {
        scanning = false;
        // ---- 会话码表的**重置边界**（只此三处；别处不许清空码表）----
        // ① 换维度：新旧世界的 id 集合语义不同，旧码带过去就是张冠李戴。
        // ② 换码表配置：旧码可能已不在 cfg.palette 里 ⇒ 不能再用。
        // ③ 换世界（open_world / join_server）：不在维度判据里（同一维度名下的另一个存档是同名不同世界）
        //    ⇒ 由 PlaytestCore 显式调 resetPalette()。见类注释。
        boolean dimChanged = ready && (dim == null ? sDim != null : !dim.equals(sDim));
        if (dimChanged) resetPalette("dimension:" + (sDim == null ? "?" : sDim));
        if (paletteFingerprint != null && !paletteFingerprint.equals(cfg.palette)) {
            resetPalette("palette-config-changed");
        }
        boolean same = ready
                && step == sStep && originX == sOriginX && originZ == sOriginZ
                && cols == sCols && rows == sRows
                && (dim == null ? sDim == null : dim.equals(sDim));
        if (same) {
            for (int i = 0; i < codes.length; i++) {
                if (heights[i] != sHeights[i]) { same = false; break; }
                String a = codes[i];
                String b = sCodes[i];
                if (a == null ? b != null : !a.equals(b)) { same = false; break; }
            }
        }
        scansCompleted++;
        if (same) return;                 // 内容没变：stateVersion 不动（sinceVersion 才可能回 unchanged）
        codes = sCodes;
        heights = sHeights;
        voidAirUnknown = sVoidAir;
        step = sStep;
        originX = sOriginX;
        originZ = sOriginZ;
        cols = sCols;
        rows = sRows;
        dim = sDim;
        builtTick = ticks;
        rebuildLegend();
        version++;
        ready = true;
    }

    /**
     * 重建 yMin/yMax、高度字段宽度，并给本张快照的 id **分配/复用**会话码（只追加）。
     * 只在内容变化时做。
     */
    private void rebuildLegend() {
        yMin = Integer.MAX_VALUE;
        yMax = Integer.MIN_VALUE;
        TreeSet<String> ids = new TreeSet<String>();
        for (int i = 0; i < codes.length; i++) {
            int h = heights[i];
            if (h != Integer.MIN_VALUE) {
                if (h < yMin) yMin = h;
                if (h > yMax) yMax = h;
            }
            if (codes[i] != null) ids.add(codes[i]);
        }
        int w = 1;
        if (yMin != Integer.MAX_VALUE) {
            w = Math.max(Integer.toString(yMin).length(), Integer.toString(yMax).length());
        }
        heightWidth = Math.max(cfg.minHeightWidth, w);

        // ---- 会话码表：**只追加** --------------------------------------------------
        // 这里**绝不 clear()**：旧 bug 就是每张都从零重建、按 id 升序重排 ⇒ 插入一个字典序靠前的
        // 新 id 会把后面所有码整体 +1（真机 2248/2304 格变化）。只有 resetPalette() 才允许清空。
        if (paletteFingerprint == null) paletteFingerprint = cfg.palette;
        if (paletteDim == null) paletteDim = dim;
        snapshotAllocatedIds.clear();
        overflowIds.clear();
        overflowTotal = 0;
        for (String id : ids) {          // ids 是 TreeSet ⇒ 按 id 升序，输出顺序确定、可复现
            Character c = assignCode(id);
            if (c != null) {
                snapshotAllocatedIds.add(id);
            } else {
                overflowTotal++;
                if (overflowIds.size() < 64) overflowIds.add(id);
            }
        }
        legendOverflow = overflowTotal > 0;
    }

    /**
     * 取（必要时**新发**）一个 id 的方块码 —— 本类的核心不变量。
     *
     * <p>规则：本世代已分配过的 id ⇒ 直接回原码（**永不改码**）；新 id ⇒ 拿 palette 里下一个
     * **没用过**的槽位；槽位用尽 ⇒ 回 {@code null}（调用方按 {@code overflowCode} 画、
     * 并记进 {@code legendOverflow}）。**永不回收、永不重排**。
     */
    private Character assignCode(String id) {
        Character known = idToCode.get(id);
        if (known != null) return known;
        String pal = cfg.palette;
        while (nextSlot < pal.length() && usedCodes.contains(Character.valueOf(pal.charAt(nextSlot)))) {
            nextSlot++;                  // 防御：换过码表却没能换世代时，跳过本世代已用过的字符
        }
        if (nextSlot >= pal.length()) return null;   // 码位用尽：新 id 一律 overflowCode
        Character fresh = Character.valueOf(pal.charAt(nextSlot));
        nextSlot++;
        idToCode.put(id, fresh);
        usedCodes.add(fresh);
        return fresh;
    }

    /**
     * **换世代**：清空会话码表，并丢弃当前快照（旧世界的图不能拿新码表渲染 ⇒ 否则整张变 overflowCode）。
     *
     * <p>只许在类注释列出的三个边界调用：换世界（{@code open_world} / {@code join_server}，
     * 由 {@link PlaytestCore} 显式调）、换维度、换码表配置。**正常重扫（refresh）绝不调用。**
     *
     * <p>注意：这里**不动** {@code stateVersion}（版本只由「完整图内容变化」推进）；
     * 而 {@code ready=false} ⇒ 快照回执如实报 {@code mapReady=false} + {@code mapNote}，不拿旧图充数。
     */
    public void resetPalette(String reason) {
        paletteEpoch++;
        paletteResets++;
        paletteResetReason = reason;
        idToCode.clear();
        usedCodes.clear();
        nextSlot = 0;
        snapshotAllocatedIds.clear();
        overflowIds.clear();
        overflowTotal = 0;
        legendOverflow = false;
        paletteFingerprint = null;
        paletteDim = null;
        // [T14] 纵层专用码表 / 已发布快照与纵层采样**同属本世代** ⇒ 一起清（同一张 palette，同一套只追加规则）
        layerIdToCode.clear();
        ylDone = null;
        ylJob = null;
        ylLastCancelReason = "换世代（resetPalette）⇒ 纵层采样与已发布快照一并作废";
        ready = false;                 // 旧图作废：新世界的第一张图扫完一整张才会 mapReady=true
        scanning = false;
        lastScanStart = -1000000;      // 别等 refreshIntervalTicks：下一 tick 立刻重新开扫
    }

    // ==================================================================
    // 2. 查询（只读缓存）
    // ==================================================================

    /**
     * 取状态快照（可选地图）。参数面：
     * <ul>
     *   <li>{@code sinceVersion}（long，省略/负数 = 一定要整张）：与 {@code stateVersion} 相同 ⇒
     *       只回 {@code {unchanged:true, stateVersion, tick}}，**不回整张图**。</li>
     *   <li>{@code refresh}（bool）：要求**立刻重采**；仍分帧（本次回的是上一张已完成的图 +
     *       {@code scan} 进度），不是同步扫完。</li>
     *   <li>{@code step}（int，可选）：只对**渲染**降采样。{@code <1} 视为未指定（走自动规则）；
     *       合法的显式步长会被抬到不小于扫描步长、夹到不超过 {@code maxAutoStep}、并对齐到扫描步长倍数。
     *       只要没能逐字采纳，回执（顶层与地图头两处同值）必带
     *       {@code stepRequested}/{@code stepClampedTo}/{@code stepNote} —— 绝不静默。</li>
     *   <li>{@code maxChars}（int，可选）：只覆盖**本次**的地图正文上限。</li>
     *   <li>{@code entities}（bool，可选）：**只覆盖本次**要不要实体叠加层。省略 ⇒ 沿用
     *       {@link StateConfig#includeEntities}（配置口径）。本档没有实体扫描面 ⇒ 头里如实写
     *       {@code entitiesIncluded:false} + {@code entitiesNote}，不假装有。</li>
     * </ul>
     */
    public Map<String, Object> query(Map<String, Object> p) {
        return query(p, planY(p));
    }

    /**
     * 与 {@link #query(Map)} 同一个实现，只是**纵层请求（{@link YPlan}）已由调用方解析好**
     * （{@link PlaytestCore#dispatch} 先用 {@link #planY(Map)} 校验，参数不合法就回 BAD_REQUEST ——
     * 与 query_column / query_blocks 的参数校验同一个落点，不把错误混进 ok 回执里）。
     */
    public Map<String, Object> query(Map<String, Object> p, YPlan plan) {
        long since = -1L;
        try {
            since = (long) Double.parseDouble(Json.num(p, "sinceVersion", "-1").trim());
        } catch (RuntimeException ignored) {
        }
        boolean refresh = Json.bool(p, "refresh", false);
        // entities：调用方给了就以它为准，没给就沿用配置（默认 false）。与 step 一样「给了什么就按什么」。
        boolean entitiesOn = cfg.includeEntities;
        if (p != null && p.containsKey("entities") && p.get("entities") != null) {
            entitiesOn = Json.bool(p, "entities", entitiesOn);
        }
        // step 必须区分「没给」与「给了 0 / 负数」：后者以前会被静默当成「没给」⇒ 现在如实回 stepNote。
        boolean stepGiven = p != null && p.containsKey("step") && p.get("step") != null;
        int reqStep = intParam(p, "step", 0);
        int reqMax = intParam(p, "maxChars", 0);

        if (refresh) requestRefresh();
        else if (!ready && !scanning && bridge.ready()) startScan(cfg.step, cfg.chunkRadius, false);
        // [T14] 纵层：有效模式不是 surface 就 arm 一次分帧采样（同一件事不重复 arm；
        // 几何不同（换区块 / 改 step）⇒ 旧采样作废、按新几何重采）。arm 只排程，**不做 MC 调用**。
        if (plan != null && plan.layersOn && ready && bridge.ready()) armLayerScan(plan);

        Map<String, Object> out = new LinkedHashMap<String, Object>();
        out.put("schema", STATE_SCHEMA);
        boolean unchanged = ready && since >= 0L && since == (long) version;
        out.put("stateVersion", ready ? (Object) Integer.valueOf(version) : null);
        out.put("tick", ticks);
        out.put("unchanged", unchanged);
        if (unchanged) return out;      // 半实时：未变 ⇒ 只回这三样，不回整张图

        Map<String, Object> st = Json.parseObject(bridge.playerStateJson());
        Object dimNow = st.get("dimension");
        out.put("dimension", dimNow != null ? dimNow : (ready ? dim : null));
        out.put("player", playerJson(st));
        out.put("screen", bridge.screenName());
        Map<String, Object> env = envJson();
        out.put("time", env == null ? null : env.get("time"));
        out.put("weather", env == null ? null : env.get("weather"));
        if (env != null && env.get("note") != null) out.put("envNote", env.get("note"));
        // [T13] ⑦ 玩家地表深度（每 tick 在 tick 线程刷新，这里只读缓存；取不到 ⇒ null + note）
        out.putAll(depthJson());
        out.put("mapReady", ready);
        out.put("scan", scanJson());
        if (ready) {
            Map<String, Object> map = render(reqStep, reqMax, stepGiven, entitiesOn, plan);
            out.put("map", map);
            // step 诊断同时挂在回执顶层（旧契约里 stepClampedTo 就在这一层）与地图头里，两处同值、不漂移。
            mirrorStep(out, map);
        } else {
            out.put("map", null);
            out.put("mapNote", "首张地图还没扫完（分帧扫描中，每 tick " + cfg.columnsPerTick
                    + " 格）；扫完一整张才会启用。用 scan.done/scan.total 看进度。");
        }
        return out;
    }

    /** 只读缓存的自报段（给 /status）。 */
    public Map<String, Object> status() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("capable", bridge.stateMapCapable());
        m.put("ready", ready);
        m.put("stateVersion", ready ? (Object) Integer.valueOf(version) : null);
        m.put("scanInProgress", scanning);
        m.put("scansCompleted", scansCompleted);
        m.put("refreshRequests", refreshes);
        m.put("builtTick", ready ? (Object) Integer.valueOf(builtTick) : null);
        m.put("ticks", ticks);
        m.put("snapshotStep", step);
        m.put("snapshotOrigin", xy(originX, originZ));
        m.put("snapshotCols", cols);
        m.put("snapshotRows", rows);
        // 会话码表的自报（换世代后 paletteSize 会掉回 0，直到新世界的第一张图扫完）
        m.put("paletteEpoch", Integer.valueOf(paletteEpoch));
        m.put("paletteSize", Integer.valueOf(idToCode.size()));
        m.put("paletteCapacity", Integer.valueOf(cfg.palette.length()));
        m.put("paletteResets", Integer.valueOf(paletteResets));
        m.put("paletteResetReason", paletteResetReason);
        // 实体叠加层的自报（**只读缓存，不碰 MC** ⇒ /status 在 HTTP 线程上也安全）
        m.put("entityScan", entityStatus());
        // [T13] 方框搜索 job 与地表深度的自报（同样只读缓存 ⇒ /status 安全）
        m.put("blockSearch", blockSearchStatus());
        // [T14] 纵层只读自报（同样**不碰 MC** ⇒ HTTP 线程上安全）
        Map<String, Object> yl = new LinkedHashMap<String, Object>();
        yl.put("layerScan", layerScanJson());
        yl.put("layerPaletteSize", Integer.valueOf(layerIdToCode.size()));
        // [T16] 四个旋钮现在是**配置默认**（设置页可改）；这里如实报当前生效值。
        yl.put("yLayerMaxDefault", Integer.valueOf(cfg.yLayerMax));
        yl.put("yLayerHardMax", Integer.valueOf(Y_LAYER_HARD_MAX));
        yl.put("yAutoDepth", Integer.valueOf(cfg.yModeAutoDepth));
        yl.put("yAutoRange", Integer.valueOf(cfg.yAutoRange));
        yl.put("yModeAuto", Boolean.valueOf(cfg.yModeAuto));
        yl.put("cellsPerTick", Integer.valueOf(Math.max(1, cfg.columnsPerTick)));
        yl.put("note", Y_LAYER_SCAN_NOTE);
        m.put("yLayer", yl);
        m.put("playerDepth", depthJson());
        m.put("config", cfg.toJson());
        return m;
    }

    // ==================================================================
    // 3. 渲染（只读 active）
    // ==================================================================

    private Map<String, Object> render(int reqStep, int maxCharsIn, boolean stepGiven, boolean entitiesOn,
                                      YPlan plan) {
        int maxChars = maxCharsIn > 0 ? maxCharsIn : cfg.maxChars;
        // 渲染步长的硬上限 = maxAutoStep（对齐到扫描步长倍数）⇒ 显式 step 与自动降采样受**同一个**上限约束。
        int stepCap = quantize(Math.max(cfg.maxAutoStep, step), step);
        int rs;
        if (stepGiven && reqStep >= 1) {
            int want = Math.max(reqStep, step);
            if (want > stepCap) want = stepCap;
            rs = quantize(want, step);
        } else {
            // 未指定，或 step<1（明确按「未指定」处理）：自动降采样。
            rs = step;
            while (rs < stepCap && gridChars(rs) > maxChars) {
                int next = quantize(rs * 2, step);
                if (next <= rs) break;
                rs = next;
            }
        }
        int rc = colsAt(rs);
        int rr = rowsAt(rs);
        int cellW = cellWidth();
        int rowLen = rc * cellW;
        int total = gridChars(rs);
        int shownRows = rr;
        if (rowLen > 0) {
            long fit = (maxChars + 1L) / (rowLen + 1L);
            if (fit < rr) shownRows = (int) Math.max(0L, fit);
        } else {
            shownRows = 0;
        }
        boolean truncated = shownRows < rr;
        int shownChars = shownRows <= 0 ? 0 : shownRows * rowLen + (shownRows - 1);
        RenderedGrid rg = buildGrid(rs, shownRows);
        String grid = rg.text;

        int[] pc = playerCell(rs, rc, rr);
        boolean outside = pc[0] < 0 || pc[1] < 0;
        if (pc[0] < 0) pc[0] = 0;
        if (pc[1] < 0) pc[1] = 0;

        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("schema", MAP_SCHEMA);
        m.put("stateVersion", version);
        m.put("tick", ticks);
        m.put("builtTick", builtTick);
        m.put("dimension", dim);
        m.put("origin", xy(originX, originZ));
        m.put("axis", axisJson());
        m.put("step", rs);
        m.put("cols", rc);
        m.put("rows", rr);
        m.put("cellWidth", cellW);
        m.put("heightWidth", cfg.includeHeight ? (Object) Integer.valueOf(heightWidth) : null);
        m.put("includeHeight", cfg.includeHeight);
        m.put("heightMode", cfg.includeHeight ? HEIGHT_MODE : null);
        m.put("yMin", yMin == Integer.MAX_VALUE ? null : (Object) Integer.valueOf(yMin));
        m.put("yMax", yMax == Integer.MIN_VALUE ? null : (Object) Integer.valueOf(yMax));
        m.put("player", playerJson(Json.parseObject(bridge.playerStateJson())));
        m.put("playerMark", String.valueOf(cfg.playerMark));
        m.put("playerCell", cellJson(pc[0], pc[1]));
        m.put("playerCellOutside", outside);
        m.put("unknownCode", String.valueOf(cfg.unknownCode));
        m.put("overflowCode", String.valueOf(cfg.overflowCode));
        // 会话码表的**自证字段**：同一 paletteEpoch 内同一 id 的码不变（见 PALETTE_NOTE / 类注释）。
        m.put("paletteEpoch", Integer.valueOf(paletteEpoch));
        m.put("paletteSize", Integer.valueOf(idToCode.size()));
        m.put("paletteCapacity", Integer.valueOf(cfg.palette.length()));
        m.put("paletteNote", PALETTE_NOTE);
        m.put("legend", legendJson(rg));
        m.put("legendUnused", legendUnusedJson(rg));
        if (legendOverflow) {
            m.put("legendOverflow", new ArrayList<String>(overflowIds));
            m.put("legendOverflowTotal", Integer.valueOf(overflowTotal));
            m.put("legendOverflowNote", "码位（" + cfg.palette.length() + " 个）用尽：这 " + overflowTotal
                    + " 个 id 与其它同类共用 overflowCode（已有码不回收、不重排）");
        }
        // ================= 实体叠加层（**另一层平行网格**，绝不覆盖方块层）=================
        // 头里**无条件**自报能力位：调用方不看内容也能知道「本档会不会给实体层」。
        m.put("entityScanSupported", Boolean.valueOf(bridge.entityScanCapable()));
        if (entitiesOn) {
            if (entitySupported) {
                putEntityLayer(m, rs, rc, rr, shownRows);
            } else {
                m.put("entitiesIncluded", Boolean.FALSE);
                m.put("entitiesNote", "本次要求实体层（entities=true / StateConfig.includeEntities=true），"
                        + "但本档给不出实体读数："
                        + (bridge.entityScanCapable()
                                ? "适配层自报 entityScanCapable()=true，而 nearbyEntitiesJson 回 null"
                                        + "（此刻取不到，或玩家/世界不在场）"
                                : "GameBridge#nearbyEntitiesJson 回 null 且未自报 entityScanCapable()")
                        + " ⇒ 如实不含实体层，**不假装有**");
                if (entityLastError != null) m.put("entityLastError", entityLastError);
            }
        } else {
            m.put("entitiesIncluded", Boolean.FALSE);
            m.put("entitiesNote", "本次未请求实体层（entities=false / StateConfig.includeEntities=false）"
                    + " ⇒ 如实不含；要叠加请传 entities=true 或把 includeEntities 打开");
        }
        m.put("truncated", truncated);
        m.put("shownRows", shownRows);
        m.put("shownChars", shownChars);
        m.put("totalChars", total);
        m.put("maxChars", maxChars);
        m.put("maxAutoStep", cfg.maxAutoStep);
        // [T16] 未加载区自证：真有 void_air / 低于建高下限的格才加这两个键（全加载的默认图**逐字不变**）。
        if (voidAirUnknown > 0) {
            m.put("voidAirUnknownBlocks", Integer.valueOf(voidAirUnknown));
            m.put("voidAirUnknownNote", VOID_AIR_UNKNOWN_NOTE);
        }
        m.put("charsNote", "totalChars/shownChars 只数**网格正文**（含行间换行，不含头/图例）；maxChars 也只约束它");
        if (truncated) {
            m.put("truncatedNote", "即使降到 step=" + rs + "（maxAutoStep=" + cfg.maxAutoStep
                    + "）仍超 maxChars=" + maxChars + " ⇒ 按整行截断，只回前 " + shownRows + "/" + rr + " 行");
        }
        // step 诊断（写进**地图头**；调用方给的 step 没被逐字采纳就必须说明，绝不静默）。
        if (stepGiven) {
            m.put("stepRequested", Integer.valueOf(reqStep));
            if (reqStep < 1) {
                m.put("stepClampedTo", Integer.valueOf(rs));
                m.put("stepNote", "step=" + reqStep + " < 1 ⇒ 按「未指定」处理，走自动降采样；实际 step=" + rs);
            } else if (rs != reqStep) {
                m.put("stepClampedTo", Integer.valueOf(rs));
                m.put("stepNote", stepExplain(reqStep, rs, stepCap));
            }
        }
        // [T13] ⑦ 玩家地表深度（**地图头**里也给一份，与 query_state 顶层同源同值）
        m.putAll(depthJson());
        m.put("grid", grid);
        // [T14] 纵层（**只追加**：surface 且调用方没给任何纵层参数时，plan.present=false ⇒ 一个新键都不加，
        // 既有回执逐字不变；grid 本身在上面，位置与内容都没动）。
        if (plan != null && plan.present) putYMode(m, plan, rs, rc, rr, shownRows, maxChars);
        return m;
    }

    /** 把地图头里的 step 诊断镜像到回执顶层（旧契约 {@code stepClampedTo} 的落点），两处同值。 */
    private static void mirrorStep(Map<String, Object> out, Map<String, Object> map) {
        Object v = map.get("stepRequested");
        if (v != null) out.put("stepRequested", v);
        v = map.get("stepClampedTo");
        if (v != null) out.put("stepClampedTo", v);
        v = map.get("stepNote");
        if (v != null) out.put("stepNote", v);
    }

    private RenderedGrid buildGrid(int rs, int shownRows) {
        int k = rs / step;
        int rc = colsAt(rs);
        int[] pc = playerCell(rs, rc, rowsAt(rs));
        StringBuilder b = new StringBuilder();
        RenderedGrid out = new RenderedGrid();
        for (int j = 0; j < shownRows; j++) {
            if (j > 0) b.append('\n');
            int sj = j * k;
            for (int i = 0; i < rc; i++) {
                int idx = sj * cols + i * k;
                char ch;
                if (i == pc[0] && j == pc[1]) {
                    // 玩家标记**按角色**记账（不是按字符）：它永远不是方块码，所以永不进 legend。
                    ch = cfg.playerMark;
                    out.usedPlayerMark = true;
                } else {
                    String id = codes[idx];
                    if (id == null) {
                        ch = cfg.unknownCode;
                        out.usedUnknown = true;
                    } else {
                        Character c = idToCode.get(id);
                        if (c == null) {
                            ch = cfg.overflowCode;
                            out.usedOverflow = true;
                        } else {
                            ch = c.charValue();
                            out.usedBlockCodes.add(c);
                        }
                    }
                }
                b.append(ch);
                if (cfg.includeHeight) b.append(fmtHeight(heights[idx], heightWidth));
            }
        }
        out.text = b.toString();
        return out;
    }

    /** 渲染结果 + **本图真实用到的码**（按角色记账 ⇒ 玩家标记不会混进方块码）。 */
    private static final class RenderedGrid {
        String text = "";
        final Set<Character> usedBlockCodes = new HashSet<Character>();
        boolean usedPlayerMark;
        boolean usedUnknown;
        boolean usedOverflow;
    }

    /** 定宽高度字段：正数补前导 0、负数留符号位 ⇒ **宽度恒定**（不靠空格对齐、不粘连）。 */
    static String fmtHeight(int h, int w) {
        if (h == Integer.MIN_VALUE) {
            StringBuilder q = new StringBuilder();
            for (int i = 0; i < w; i++) q.append('?');
            return q.toString();
        }
        String s = Integer.toString(h);
        if (s.length() >= w) return s;
        StringBuilder b = new StringBuilder();
        int pad = w - s.length();
        if (h < 0) {
            b.append('-');
            for (int i = 1; i < pad; i++) b.append('0');
            b.append(s.substring(1));
        } else {
            for (int i = 0; i < pad; i++) b.append('0');
            b.append(s);
        }
        return b.toString();
    }

    private int cellWidth() {
        return 1 + (cfg.includeHeight ? heightWidth : 0);
    }

    private int colsAt(int rs) {
        return ceilDiv(cols * step, rs);
    }

    private int rowsAt(int rs) {
        return ceilDiv(rows * step, rs);
    }

    private int gridChars(int rs) {
        int rc = colsAt(rs);
        int rr = rowsAt(rs);
        int rowLen = rc * cellWidth();
        return (rc <= 0 || rr <= 0) ? 0 : (rr * rowLen + rr - 1);
    }

    /** 玩家格（列/行）；不在图内返回 {-1,-1}（调用方如实写 playerCellOutside）。 */
    private int[] playerCell(int rs, int rc, int rr) {
        double[] pxz = playerXZ();
        if (pxz == null) return new int[] { -1, -1 };
        int c = (int) Math.floor((pxz[0] - originX) / (double) rs);
        int r = (int) Math.floor((pxz[1] - originZ) / (double) rs);
        if (c < 0 || r < 0 || c >= rc || r >= rr) return new int[] { -1, -1 };
        return new int[] { c, r };
    }

    // ==================================================================
    // 4. 小工具
    // ==================================================================

    /**
     * 图例 = **本张 {@code grid} 里真实出现的码**（方块码按 id 升序）。玩家标记按角色排除；
     * 未知码 / 方块码 / 溢出码都只有真的画进图里才列。
     */
    private Map<String, Object> legendJson(RenderedGrid rg) {
        // 既有 legend 的语义**一字未动**：只列本张 grid 里真出现的码。
        return legendFor(rg.usedBlockCodes, rg.usedUnknown, rg.usedOverflow);
    }

    /**
     * 图例的公共实现（既有 {@code legend} 与新增 {@code layerLegend} 共用它 ⇒ 输出形状 / 排序 /
     * 未知码 / 溢出码的口径**完全一致**；只是喂进来的「用到的码」集合不同）。
     */
    private Map<String, Object> legendFor(Set<Character> usedCodesIn, boolean usedUnknown, boolean usedOverflow) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        if (usedUnknown) m.put(String.valueOf(cfg.unknownCode), UNKNOWN_ID);
        // 只遍历**本张快照**的 id（会话码表里更早快照留下的 id 不该被本图广告）；
        // 列表已按 id 升序 ⇒ 输出顺序确定、可复现。
        for (String id : snapshotAllocatedIds) {
            Character c = idToCode.get(id);
            if (c != null && usedCodesIn.contains(c)) {
                m.put(String.valueOf(c.charValue()), id);
            }
        }
        if (legendOverflow && usedOverflow) {
            m.put(String.valueOf(cfg.overflowCode), "<" + overflowTotal + " 种，见 legendOverflow>");
        }
        return m;
    }

    /** 本张快照**已分配码、但没画进本图**的方块码（按 id 升序；空数组 = 全部用上）。 */
    private List<Object> legendUnusedJson(RenderedGrid rg) {
        List<Object> out = new ArrayList<Object>();
        // 同 legend：只列**本张快照**里已分配码、却没画进本图的 id（按 id 升序）。
        for (String id : snapshotAllocatedIds) {
            Character c = idToCode.get(id);
            if (c != null && !rg.usedBlockCodes.contains(c)) {
                Map<String, Object> one = new LinkedHashMap<String, Object>();
                one.put("code", String.valueOf(c.charValue()));
                one.put("id", id);
                out.add(one);
            }
        }
        return out;
    }

    /** 显式 step 没被逐字采纳时的**人话**原因（fail-loud）。 */
    private String stepExplain(int req, int rs, int cap) {
        StringBuilder n = new StringBuilder("step=").append(req);
        if (req < step) n.append(" 细于扫描步长 ").append(step);
        if (req > cap) n.append(" 超过 maxAutoStep=").append(cfg.maxAutoStep).append(" 上限");
        if (req >= step && req <= cap) n.append(" 不是扫描步长 ").append(step).append(" 的整数倍");
        n.append(" ⇒ 实际 step=").append(rs).append("（如实回 stepClampedTo，不静默）");
        return n.toString();
    }

    private Map<String, Object> axisJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("right", "+x（东）");
        m.put("down", "+z（南）");
        m.put("left", "-x（西）");
        m.put("up", "-z（北）");
        m.put("note", AXIS_NOTE);
        return m;
    }

    private Map<String, Object> scanJson() {
        int total = sCols * sRows;
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("active", scanning);
        m.put("done", scanning || total == 0 ? sCursor : total);
        m.put("total", total);
        m.put("step", sStep);
        m.put("origin", xy(sOriginX, sOriginZ));
        m.put("cols", sCols);
        m.put("rows", sRows);
        m.put("startedTick", sStartedTick);
        m.put("errors", sErrors);
        if (sLastError != null) m.put("lastError", sLastError);
        return m;
    }

    private Map<String, Object> playerJson(Map<String, Object> st) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("x", intCell(st.get("x")));
        m.put("y", intCell(st.get("y")));
        m.put("z", intCell(st.get("z")));
        m.put("yaw", dbl(st.get("yaw")));
        m.put("pitch", dbl(st.get("pitch")));
        return m;
    }

    private Map<String, Object> envJson() {
        String s = bridge.worldEnvJson();
        if (s == null || s.isEmpty()) {
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            m.put("note", "本档未提供 worldEnvJson() ⇒ 时间/天气取不到，如实留 null（不是 0/白天）");
            return m;
        }
        Map<String, Object> src = Json.parseObject(s);
        Map<String, Object> time = new LinkedHashMap<String, Object>();
        // 时间字段按**长整数**回（Json.parse 会把 JSON 数字读成 Double ⇒ 直接透出会变 "6000.0"，
        // 时间戳是整数语义，别让它看起来像小数）。
        time.put("timeOfDay", longOrNull(src.get("timeOfDay")));
        time.put("dayTime", longOrNull(src.get("dayTime")));
        Map<String, Object> weather = new LinkedHashMap<String, Object>();
        weather.put("raining", src.get("raining"));
        weather.put("thundering", src.get("thundering"));
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("time", time);
        m.put("weather", weather);
        return m;
    }

    private double[] playerXZ() {
        Map<String, Object> st;
        try {
            st = Json.parseObject(bridge.playerStateJson());
        } catch (RuntimeException e) {
            return null;
        }
        Double x = dbl(st.get("x"));
        Double z = dbl(st.get("z"));
        if (x == null || z == null) return null;
        return new double[] { x.doubleValue(), z.doubleValue() };
    }

    private String dimOf() {
        try {
            Object d = Json.parseObject(bridge.playerStateJson()).get("dimension");
            return d == null ? null : String.valueOf(d);
        } catch (RuntimeException e) {
            return null;
        }
    }

    private static int intParam(Map<String, Object> p, String k, int dflt) {
        try {
            return (int) Double.parseDouble(Json.num(p, k, Integer.toString(dflt)).trim());
        } catch (RuntimeException e) {
            return dflt;
        }
    }

    private static Integer intCell(Object v) {
        Double d = dbl(v);
        return d == null ? null : Integer.valueOf((int) Math.floor(d.doubleValue()));
    }

    /** 数值（整数或整值小数）⇒ Long；取不到 ⇒ null（**不编 0**）。 */
    private static Object longOrNull(Object v) {
        Double d = dbl(v);
        return d == null ? null : (Object) Long.valueOf(d.longValue());
    }

    private static Double dbl(Object v) {
        if (v instanceof Number) return Double.valueOf(((Number) v).doubleValue());
        if (v instanceof String) {
            try {
                return Double.valueOf(Double.parseDouble(((String) v).trim()));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private static Map<String, Object> xy(int x, int z) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("x", Integer.valueOf(x));
        m.put("z", Integer.valueOf(z));
        return m;
    }

    private static Map<String, Object> cellJson(int col, int row) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("col", Integer.valueOf(col));
        m.put("row", Integer.valueOf(row));
        return m;
    }

    private static int quantize(int v, int base) {
        int b = Math.max(1, base);
        int q = ((v + b - 1) / b) * b;
        return Math.max(b, q);
    }

    private static int ceilDiv(int a, int b) {
        return b <= 0 ? 0 : (a + b - 1) / b;
    }

    private static int floorDiv(int a, int b) {
        int q = a / b;
        if ((a ^ b) < 0 && q * b != a) q--;
        return q;
    }

    // ==================================================================
    // 5. 实体层（叠加层）—— 缓存刷新 / 归类 / 渲染
    // ==================================================================

    /** 实体扫描半径（格）：足够覆盖整张图的对角（地图是正方形 ⇒ 半对角 = 边长×√2/2），再 +1 保险。 */
    private double entityRadiusBlocks() {
        int side = cfg.mapSideBlocks();
        return Math.max(4.0, Math.ceil(side * 0.7072) + 1.0);
    }

    /** 只读自报（给 /status；**不碰 MC**，HTTP 线程也能读）。 */
    public Map<String, Object> entityStatus() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("capable", Boolean.valueOf(bridge.entityScanCapable()));
        m.put("probed", Boolean.valueOf(entityProbed));
        m.put("supported", Boolean.valueOf(entitySupported));
        m.put("refreshedTick", entityRefreshedTick < 0 ? null : Integer.valueOf(entityRefreshedTick));
        m.put("radiusBlocks", entityRadiusUsed < 0 ? null : Integer.valueOf((int) Math.round(entityRadiusUsed)));
        m.put("cached", Integer.valueOf(entities.size()));
        m.put("reportedTotal", entityReportedTotal < 0 ? null : Integer.valueOf(entityReportedTotal));
        m.put("lastError", entityLastError);
        m.put("configIncludeEntities", Boolean.valueOf(cfg.includeEntities));
        m.put("fill", ENTITY_FILL);
        m.put("note", "实体层是**叠加**层：与 grid 同几何的平行网格，绝不动方块层；查询只读 tick() 刷新的缓存");
        return m;
    }

    /** 客户端 tick 线程每 tick 刷新实体缓存（不支持的档只调一次，之后直接返回）。 */
    private void refreshEntities() {
        if (!bridge.ready()) {
            entities = new ArrayList<EntityRec>();
            entitySupported = false;
            entityProbed = false;
            entityReportedTotal = -1;
            return;
        }
        if (entityProbed && !entitySupported) return;   // 已知不支持：不再每 tick 空调
        double r = entityRadiusBlocks();
        entityRadiusUsed = r;
        String json;
        try {
            json = bridge.nearbyEntitiesJson(r);
        } catch (Throwable t) {
            // 适配层炸了也不许把游戏 tick 带崩：如实记账，不当成「没有实体」
            entities = new ArrayList<EntityRec>();
            entitySupported = false;
            entityProbed = true;
            entityLastError = String.valueOf(t);
            entityReportedTotal = -1;
            return;
        }
        entityProbed = true;
        entityRefreshedTick = ticks;
        if (json == null) {
            entities = new ArrayList<EntityRec>();
            entitySupported = false;
            entityReportedTotal = -1;
            return;
        }
        entitySupported = true;
        entityLastError = null;
        entities = parseEntities(json);
    }

    /** 解析适配层给的实体 JSON；形状不对的**不编**，跳过并如实记 lastError。 */
    private List<EntityRec> parseEntities(String json) {
        List<EntityRec> out = new ArrayList<EntityRec>();
        Map<String, Object> src;
        try {
            src = Json.parseObject(json);
        } catch (RuntimeException e) {
            entityLastError = "解析实体 JSON 失败：" + e;
            entityReportedTotal = -1;
            return out;
        }
        Object cnt = src.get("count");
        entityReportedTotal = (cnt instanceof Number) ? ((Number) cnt).intValue() : -1;
        Object arr = src.get("entities");
        if (!(arr instanceof List)) {
            entityLastError = "实体 JSON 里没有 entities 数组";
            return out;
        }
        int bad = 0;
        for (Object o : (List<?>) arr) {
            if (!(o instanceof Map)) { bad++; continue; }
            Map<?, ?> e = (Map<?, ?>) o;
            Double x = dbl(e.get("x")), y = dbl(e.get("y")), z = dbl(e.get("z"));
            if (x == null || y == null || z == null) { bad++; continue; }   // 坐标取不到 ⇒ 不编
            String type = e.get("type") == null ? null : String.valueOf(e.get("type"));
            String cls = e.get("cls") == null ? null : String.valueOf(e.get("cls"));
            out.add(new EntityRec(type, cls, x.doubleValue(), y.doubleValue(), z.doubleValue()));
        }
        if (bad > 0) entityLastError = "有 " + bad + " 条实体项缺坐标/形状不对 ⇒ 未计入（不编坐标）";
        return out;
    }

    /**
     * **实体类别**（决定 entityGrid 的标记字母）—— 纯 core 侧启发式，按<b>实体注册名/类简单名</b>的
     * 子串归类（顺序即优先级）。**可能把模组实体归到 other** ⇒ 原始 {@code type}/{@code cls}
     * 逐条写在 {@code entities[]} 里，绝不藏。
     */
    static String categoryOf(String type, String cls) {
        String t = type == null ? "" : type.toLowerCase(java.util.Locale.ROOT);
        String c = cls == null ? "" : cls.toLowerCase(java.util.Locale.ROOT);
        if ("minecraft:item".equals(t) || "itementity".equals(c)) return "item";
        if (t.contains("experience_orb") || c.contains("experienceorb")) return "xp_orb";
        if (t.contains("boat") || t.contains("minecart") || c.contains("boat") || c.contains("minecart")) return "vehicle";
        if (t.contains("arrow") || t.contains("fireball") || t.contains("snowball") || t.contains("trident")
                || t.contains("wind_charge") || c.contains("arrow") || c.contains("fireball")
                || c.contains("snowball") || c.contains("trident") || c.contains("projectile")
                || c.contains("throwable")) return "projectile";
        for (int i = 0; i < HOSTILE_HINTS.length; i++) {
            if (t.contains(HOSTILE_HINTS[i]) || c.contains(HOSTILE_HINTS[i])) return "hostile";
        }
        for (int i = 0; i < PASSIVE_HINTS.length; i++) {
            if (t.contains(PASSIVE_HINTS[i]) || c.contains(PASSIVE_HINTS[i])) return "passive";
        }
        return "other";
    }

    /** 敌对生物提示词（按**注册名/类简单名**子串匹配；顺序无关，命中即 hostile）。 */
    private static final String[] HOSTILE_HINTS = {
            "zombie", "skeleton", "creeper", "spider", "enderman", "witch", "slime", "magma_cube",
            "blaze", "ghast", "guardian", "shulker", "phantom", "piglin", "hoglin", "zoglin",
            "wither", "drowned", "husk", "stray", "pillager", "vindicator", "evoker", "ravager",
            "silverfish", "endermite", "vex", "illusioner", "breeze", "bogged", "warden", "giant",
            "cave_spider", "elder_guardian", "zombified" };

    /** 被动 / 友好生物提示词（同上；**在 hostile 之后判**，所以 piglin 不会被 pig 抢走）。 */
    private static final String[] PASSIVE_HINTS = {
            "cow", "pig", "sheep", "chicken", "rabbit", "horse", "donkey", "mule", "llama", "wolf",
            "cat", "ocelot", "fox", "bee", "turtle", "panda", "polar_bear", "goat", "axolotl",
            "frog", "camel", "sniffer", "armadillo", "allay", "villager", "golem", "squid",
            "dolphin", "bat", "parrot", "strider", "animal", "mooshroom", "tadpole", "nautilus" };

    /** 类别 → 实体层标记字符（与方块码**不是**同一命名空间，见 ENTITY_LEGEND_NOTE）。 */
    static char markFor(String cat) {
        if ("item".equals(cat)) return 'i';
        if ("xp_orb".equals(cat)) return 'x';
        if ("vehicle".equals(cat)) return 'v';
        if ("projectile".equals(cat)) return 'r';
        if ("hostile".equals(cat)) return 'm';
        if ("passive".equals(cat)) return 'a';
        return 'e';
    }

    /** 类别 → 人话（写进 entityLegend）。 */
    static String labelFor(String cat) {
        if ("item".equals(cat)) return "掉落物";
        if ("xp_orb".equals(cat)) return "经验球";
        if ("vehicle".equals(cat)) return "载具（船/矿车）";
        if ("projectile".equals(cat)) return "投射物";
        if ("hostile".equals(cat)) return "敌对生物";
        if ("passive".equals(cat)) return "被动/友好生物";
        return "其它（未归类）";
    }

    /**
     * 渲染实体叠加层：**平行网格**（同 cols/rows/step/origin/cellWidth）+ 独立图例 + 明细列表。
     * **绝不写 {@code grid}**、绝不碰方块码表。
     */
    private void putEntityLayer(Map<String, Object> m, int rs, int rc, int rr, int shownRows) {
        int cellW = cellWidth();
        m.put("entitiesIncluded", Boolean.TRUE);
        m.put("entityCount", Integer.valueOf(entities.size()));
        m.put("entityRadiusBlocks", Integer.valueOf((int) Math.round(entityRadiusUsed)));
        m.put("entityGridFill", ENTITY_FILL);
        m.put("entityGridCols", Integer.valueOf(rc));
        m.put("entityGridRows", Integer.valueOf(shownRows));
        m.put("entityGridTotalRows", Integer.valueOf(rr));
        m.put("entityGridCellWidth", Integer.valueOf(cellW));
        m.put("entityGridNote", ENTITY_GRID_NOTE);
        m.put("entityLegendNote", ENTITY_LEGEND_NOTE);
        m.put("entityGridTruncated", Boolean.valueOf(shownRows < rr));
        if (shownRows < rr) {
            m.put("entityGridTruncatedNote", "方块层按整行截断到 " + shownRows + "/" + rr
                    + " 行 ⇒ 实体层同几何一并截断（落在截断行里的实体仍在 entities[] 里，inGrid=false）");
        }

        double px = 0.0, py = 0.0, pz = 0.0;
        boolean havePlayer = false;
        double[] xyz = playerXYZ();
        if (xyz != null) { px = xyz[0]; py = xyz[1]; pz = xyz[2]; havePlayer = true; }
        if (!havePlayer) m.put("entityDistNote", "读不到玩家坐标 ⇒ dist 以世界原点(0,0,0)为基准（如实说明，不假装）");

        final double fpx = px, fpy = py, fpz = pz;
        List<EntityRec> sorted = new ArrayList<EntityRec>(entities);
        java.util.Collections.sort(sorted, new java.util.Comparator<EntityRec>() {
            public int compare(EntityRec a, EntityRec b) {
                double da = a.dist2(fpx, fpy, fpz);
                double db = b.dist2(fpx, fpy, fpz);
                if (da < db) return -1;
                if (da > db) return 1;
                return a.sortKey().compareTo(b.sortKey());
            }
        });

        char[][] marks = new char[shownRows][rc];
        int[] pc = playerCell(rs, rc, rr);
        if (pc[0] >= 0 && pc[1] >= 0 && pc[1] < shownRows) marks[pc[1]][pc[0]] = cfg.playerMark;

        Map<String, Object> legend = new LinkedHashMap<String, Object>();
        List<Object> detail = new ArrayList<Object>();
        int onGrid = 0;
        for (EntityRec e : sorted) {
            String cat = categoryOf(e.type, e.cls);
            char mark = markFor(cat);
            int col = (int) Math.floor((e.x - originX) / (double) rs);
            int row = (int) Math.floor((e.z - originZ) / (double) rs);
            boolean inGrid = col >= 0 && col < rc && row >= 0 && row < shownRows;
            if (inGrid) {
                marks[row][col] = mark;                     // 实体标记优先于玩家标记（玩家仍在 entities[] 之外）
                legend.put(String.valueOf(mark), labelFor(cat));
                onGrid++;
            }
            Map<String, Object> one = new LinkedHashMap<String, Object>();
            one.put("type", e.type);
            one.put("cls", e.cls);
            one.put("category", cat);
            one.put("mark", String.valueOf(mark));
            one.put("x", Double.valueOf(e.x));
            one.put("y", Double.valueOf(e.y));
            one.put("z", Double.valueOf(e.z));
            one.put("dist", Double.valueOf(round3(Math.sqrt(e.dist2(px, py, pz)))));
            one.put("inGrid", Boolean.valueOf(inGrid));
            one.put("cell", inGrid ? cellJson(col, row) : null);
            detail.add(one);
        }

        StringBuilder b = new StringBuilder();
        String fillRun = repeat(ENTITY_FILL, cellW);
        String markPad = repeat(ENTITY_FILL, cellW - 1);
        for (int j = 0; j < shownRows; j++) {
            if (j > 0) b.append('\n');
            for (int i = 0; i < rc; i++) {
                char c = marks[j][i];
                if (c == 0) b.append(fillRun);
                else b.append(c).append(markPad);
            }
        }
        m.put("entityGrid", b.toString());
        m.put("entityLegend", legend);
        m.put("entitiesOnGridCount", Integer.valueOf(onGrid));
        m.put("entities", detail);
        if (detail.isEmpty()) {
            m.put("entityNote", ENTITY_EMPTY_NOTE);
        } else if (onGrid == 0) {
            m.put("entityNote", "半径内有 " + detail.size() + " 个实体，但**没有一个落在本图范围内**"
                    + "（或都落在被截断的行里）⇒ entityGrid 全为填充符；明细见 entities[]");
        }
        if (entityReportedTotal >= 0 && entityReportedTotal != detail.size()) {
            m.put("entityCountNote", "适配层报 count=" + entityReportedTotal + "，其中 " + detail.size()
                    + " 条带完整坐标可入图；差 " + (entityReportedTotal - detail.size()) + " 条未计入（不编坐标）");
        }
    }

    private static String repeat(String s, int n) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < n; i++) b.append(s);
        return b.toString();
    }

    private static double round3(double d) {
        return Math.round(d * 1000.0) / 1000.0;
    }

    /** 玩家 (x,y,z)；取不到 y 时 y 记 0（并在头里如实说明）。 */
    private double[] playerXYZ() {
        Map<String, Object> st;
        try {
            st = Json.parseObject(bridge.playerStateJson());
        } catch (RuntimeException e) {
            return null;
        }
        Double x = dbl(st.get("x"));
        Double z = dbl(st.get("z"));
        if (x == null || z == null) return null;
        Double y = dbl(st.get("y"));
        return new double[] { x.doubleValue(), y == null ? 0.0 : y.doubleValue(), z.doubleValue() };
    }

    /** 一条实体读数（世界里的一条：type/cls + 绝对坐标）。 */
    private static final class EntityRec {
        final String type;
        final String cls;
        final double x, y, z;

        EntityRec(String type, String cls, double x, double y, double z) {
            this.type = type;
            this.cls = cls;
            this.x = x;
            this.y = y;
            this.z = z;
        }

        double dist2(double px, double py, double pz) {
            double dx = x - px, dy = y - py, dz = z - pz;
            return dx * dx + dy * dy + dz * dz;
        }

        String sortKey() {
            return (type == null ? "" : type) + "|" + (cls == null ? "" : cls);
        }
    }

    // ==================================================================
    // [T13] 单列纵剖面 query_column / 按条件搜方块 query_blocks
    //       + playerDepthBelowSurface（地表深度）
    //
    // 口径（都是**新增面**，与既有 query_state / query_map 的缓存、版本、码表语义**互不相干**）：
    //   · 取值口**复用** GameBridge#blockAt(x,y,z)（本来就吃任意 Y；用户原话「正好区块就是有整个
    //     Z 轴的」）⇒ **不碰** Chunk / LevelChunkSection / PalettedContainer 这类跨版本容器 API
    //     （四代分叉、收益不成比例）。成本靠**分帧预算**控，不靠换 API。
    //   · query_column：单列（≤ COLUMN_MAX_BLOCKS 次 blockAt）同步读，天然有界。
    //   · query_blocks：**独立的分帧 job**（每 tick ≤ SEARCH_BLOCKS_PER_TICK 次 blockAt）；
    //     与地图扫描共用 tick 线程，但**字段完全分开** ⇒ 绝不动地图的分帧 / 版本 / 码表语义。
    //   · 两者都**只读**，不写任何地图状态。
    // ==================================================================

    /** query_column 回执 schema。 */
    public static final String COLUMN_SCHEMA = "bandd-state-column/1";
    /** query_blocks 回执 schema。 */
    public static final String SEARCH_SCHEMA = "bandd-state-search/1";
    /** 纵剖面逐行顺序（写死，别让读者猜）。 */
    public static final String COLUMN_ORDER = "desc";
    /** 顺序的人话说明。 */
    public static final String COLUMN_ORDER_NOTE =
            "blocks[] 从**高 Y 到低 Y**（降序）逐行给：第 0 项 = y2，末尾 = 本次真正读到的最后一层；"
            + "空气**如实出现**（id=minecraft:air），这是判「洞 / 头顶有没有遮挡」的关键";
    /** id=null 的口径（与 air 必须分清）。 */
    public static final String UNKNOWN_ROW_NOTE =
            "id=null = 那一格**取不到**（越界 / 未加载 / 本档不支持）—— 与空气语义不同，不许当空气读；"
            + "判据在适配层（GameBridge#blockAt 回 null）";
    /** 空气口径。 */
    public static final String AIR_ID_NOTE =
            "isAir 口径：id 以 :air / :cave_air / :void_air 结尾，或整串等于 air / cave_air / void_air"
            + "（与 WORLD_SURFACE 高度图的空气口径对齐）";

    /** query_column 的 maxBlocks 默认值（省略或 ≤0 时用它；有界）。 */
    public static final int COLUMN_DEFAULT_MAX_BLOCKS = 96;
    /** query_column 的 maxBlocks 硬上限（超了如实回 maxBlocksClampedTo）。 */
    public static final int COLUMN_MAX_BLOCKS = 512;
    /** 默认窗口：玩家脚下 32 层。 */
    public static final int COLUMN_WINDOW_DOWN = 32;
    /** 默认窗口：玩家头上 16 层。 */
    public static final int COLUMN_WINDOW_UP = 16;
    /** 默认窗口的人话。 */
    public static final String COLUMN_DEFAULT_WINDOW_NOTE =
            "省略 y1/y2 ⇒ 用**有界**默认窗口 [floor(玩家Y) - " + COLUMN_WINDOW_DOWN + ", floor(玩家Y) + "
            + COLUMN_WINDOW_UP + "]（共 " + (COLUMN_WINDOW_UP + COLUMN_WINDOW_DOWN + 1) + " 层）";
    /** 只给了一个 y 时的补法说明。 */
    public static final String COLUMN_PARTIAL_Y_NOTE =
            "只给了 y1 / y2 中的一个 ⇒ 另一个按**默认窗口**补（**不**编一个中点出来）";

    // ---- query_blocks 的旋钮（**故意不放进 StateConfig**：本轮是新增面，不动既有设置键 / 文件 / 单测）----
    /** 每个客户端 tick 最多读多少格（分帧预算；绝不一次全扫）。 */
    public static final int SEARCH_BLOCKS_PER_TICK = 256;
    public static final int SEARCH_DEFAULT_RADIUS = 8;
    public static final int SEARCH_MAX_RADIUS = 32;
    public static final int SEARCH_DEFAULT_MAX_MATCHES = 64;
    public static final int SEARCH_MAX_MATCHES = 512;
    /** 默认 y 窗口：玩家上下各 16 层。 */
    public static final int SEARCH_WINDOW_UP = 16;
    public static final int SEARCH_WINDOW_DOWN = 16;
    /** y 跨度硬上限（层）：超了从上面裁，并如实回 yClampedTo。 */
    public static final int SEARCH_MAX_Y_SPAN = 128;
    /** filter 列表最多几条。 */
    public static final int SEARCH_MAX_FILTERS = 64;
    /** filter 的口径（**原样进回执头**，别让调用方猜通配与命名空间规则）。 */
    public static final String FILTER_NOTE =
            "filter 是**id 通配列表**，命中任一即算命中（OR）："
            + "① 匹配对**大小写不敏感**；"
            + "② * 通配任意长度（可为空）的子串，可多个；其它字符（含 . 与 ?）都是**字面**匹配，不是正则；"
            + "③ pattern **不含冒号**时，既比完整 id，也比 id 里冒号之后那一段（例：air 命中 minecraft:air）；"
            + "④ id=null（未加载 / 越界）**永不参与匹配**，只记进 scan.unknownBlocks";
    /** matches 排序口径。 */
    public static final String SEARCH_SORT_NOTE =
            "matches 按与**本次扫描起点**（= 扫描开始那一刻的玩家位置，见 origin）的三维欧氏距离"
            + "**由近到远**排序；距离相同的按 (x,y,z) 升序定序（可复现）";
    /** 分帧说明。 */
    public static final String SEARCH_SCAN_NOTE =
            "搜索是**分帧**的：每客户端 tick 最多读 " + SEARCH_BLOCKS_PER_TICK
            + " 格（scan.blocksPerTick）；scan.active=true ⇒ **还没扫完**，matched 只是**已扫范围内**的命中数，"
            + "不是最终值。换条件（filter / radius / y1 / y2 / maxMatches 任一不同）⇒ **自动重扫**"
            + "（restarted=true + restartedReason=condition_changed，绝不拿上一次条件的结果配本次条件）；"
            + "refresh=true 强制重扫。";

    /**
     * [T20-②] 条件变了 ⇒ **自动重扫**的人话（原样进回执）。
     *
     * <p>为什么改口径（旧行为是真机实测出的静默错误）：换 filter / radius / y1 / y2 却不带 refresh 时，
     * 旧的顶层 {@code filter} 回显**新条件**，而 {@code matched} / {@code matches} 仍是**上一次**扫描的
     * 结果（唯一诚实字段是 {@code scan.filterApplied}）—— 实测者点名要 {@code minecraft:iron_ore}
     * 却拿回 11 条 {@code minecraft:air}，差点当成矿物结论。
     *
     * <p>新口径（**选项 a：条件变即自动重扫**；不选「拒绝并要求 refresh」是因为分帧 job 天然支持重启，
     * 拒绝只会逼调用方多发一次往返，且旧结果的诱惑仍在）：条件与上一次不同 ⇒ 立即用**本次条件**起新一轮，
     * {@code restarted=true} + {@code restartedReason=condition_changed} + {@code previousCondition}
     * （上一次用的条件原样回出去）⇒ 回执里**永远不会**出现「新条件配旧结果」。
     */
    public static final String SEARCH_RESTARTED_NOTE =
            "本次请求的条件（filter / radius / y1..y2 / maxMatches）与上一次扫描**不同** ⇒ 已**自动重扫**"
            + "（restarted=true / restartedReason=condition_changed）：matches / matched / truncated / scan "
            + "**全部来自本次条件的新一轮**，绝不用上一次条件的结果配本次条件的回显；"
            + "上一次用的条件在 previousCondition 里原样给出。新扫描照旧分帧 ⇒ scan.active=true 时 "
            + "matched 只是**已扫范围内**的命中数。";

    /** [T20-②] 条件与上一次**逐字相同** ⇒ 复用同一轮扫描（不重启）的人话。 */
    public static final String SEARCH_REUSED_NOTE =
            "本次条件与上一次扫描**逐字相同**（filter / radius / y1..y2 / maxMatches 全等）"
            + " ⇒ 复用同一轮扫描（restarted=false / reused=true），进度接着走，**不重置**。";

    /** [T20-②] 显式 refresh=true 时的人话。 */
    public static final String SEARCH_REFRESH_NOTE =
            "调用方显式传了 refresh=true ⇒ 无条件重扫（restarted=true / restartedReason=refresh_requested）。";
    /** 扫描没起来时的原因说明（如实自报，不假装扫过）。 */
    public static final String SEARCH_NOT_STARTED_NOTE =
            "扫描**没有起**（本档没有 blockAt 取值面 / 玩家与世界不在场 / 读不到玩家坐标）"
            + " ⇒ scan.active=false、doneBlocks=0、matches=[]；这是**如实读数**，不是「扫完了没有命中」";
    /** 空结果的说明（空结果是合法读数）。 */
    public static final String SEARCH_EMPTY_NOTE =
            "本次筛条件在**已扫范围内**零命中 ⇒ matched:0 + matches:[]（空结果是**合法读数**，不是错误）";
    /** 命中数到 maxMatches 时的说明（fail-loud：剩余区域**没扫**）。 */
    public static final String SEARCH_TRUNCATED_NOTE =
            "命中数已达 maxMatches ⇒ 搜索**提前停止**：truncated=true，且 scan.doneBlocks < scan.totalBlocks"
            + " ⇒ **剩余区域没有扫**（不是「只有这些」）。要看完请调大 maxMatches 再 refresh=true";

    /**
     * [T22] {@code query_blocks} 顶层 {@code complete} / {@code stoppedBy} / {@code remainingBlocks}
     * 的口径（**原样进回执头**，别让调用方把「提前停」读成「扫完了」）。
     *
     * <p>为什么必须有它：真机实测（T18 fabric 1.21.11，{@code maxMatches=128}）撞上限时回了
     * {@code active=false + truncated=true}，而 {@code doneBlocks=32783 < totalBlocks=266175}
     * ⇒ 调用方只看到 {@code active=false} 就把「提前停」读成「扫完了」。
     *
     * <p>语义：{@code complete=true} 仅当**整盒扫完且没提前停**；{@code complete=false} 时
     * {@code remainingBlocks} 是**还没扫**的格子数（不是命中数）；{@code stoppedBy} 取值：
     * {@code "maxMatches"}（撞命中上限提前停）/ {@code "scanning"}（还在分帧扫，还没停）/
     * {@code "aborted"}（玩家 / 世界离场导致中止）/ {@code "notStarted"}（本轮扫描没起）/
     * {@code null}（自然扫完）。
     */
    public static final String SEARCH_COMPLETE_NOTE =
            "complete=true 仅当**整个扫描盒都扫完且没提前停**；complete=false 时 remainingBlocks 是"
            + "**还没扫**的格子数（不是「只有这些命中」）。stoppedBy：maxMatches=命中数撞 maxMatches"
            + "提前停；scanning=还在分帧扫（尚未停）；aborted=玩家/世界离场导致中止；notStarted=扫描没起；"
            + "null=自然扫完。truncated 语义不变（= 命中被 maxMatches 截断）。";

    // ---- ⑦ 地表深度：每 tick 在 tick 线程刷新一次，查询只读缓存 ----
    /** playerDepthBelowSurface 的公式与人话（**原样进地图头与 query_state 顶层**）。 */
    public static final String DEPTH_NOTE =
            "playerDepthBelowSurface = **地表平面 Y** 减 玩家 Y，其中地表平面 Y = 该列最高非空气方块的 Y + 1"
            + "（也就是玩家站在地表方块顶上时脚所在的 Y）⇒ **正值 = 玩家在地表以下**（地下 / 洞 / 矿道），"
            + "0 = 正站在地表上，负值 = 高于地表（树上 / 水里 / 跳起 / 飞）。"
            + "playerSurfaceBlockY = 该列最高非空气方块的 Y（与 query_map 高度字段的 h **同义**）；"
            + "playerStandY = playerSurfaceBlockY + 1。"
            + "取不到（无玩家 / 该列未加载 / 本档不支持）⇒ 三个字段一律 null 并如实标注，**绝不填 0 冒充**";
    private volatile Double depthPlayerY;
    private volatile Integer depthSurfaceBlockY;
    private volatile Integer depthStandY;
    private volatile Double depthValue;
    private volatile String depthNote = "还没刷新过（玩家 / 世界不在场）";
    private volatile int depthRefreshedTick = -1;

    private void clearDepth(String why) {
        depthPlayerY = null;
        depthSurfaceBlockY = null;
        depthStandY = null;
        depthValue = null;
        depthNote = why == null ? DEPTH_NOTE : why;
    }

    /** 客户端 tick 线程每 tick 刷一次（1 次 topSolidY + 1 次 playerStateJson；查询侧一次 MC 调用都不做）。 */
    private void refreshPlayerDepth() {
        if (!bridge.stateMapCapable() || !bridge.ready()) {
            clearDepth("本档没有 blockAt/topSolidY 取值面，或玩家 / 世界不在场 ⇒ 如实留 null（不填 0 冒充）");
            return;
        }
        Map<String, Object> st;
        try {
            st = Json.parseObject(bridge.playerStateJson());
        } catch (RuntimeException e) {
            clearDepth("playerStateJson 解析失败：" + e);
            return;
        }
        Double x = dbl(st.get("x")), y = dbl(st.get("y")), z = dbl(st.get("z"));
        if (x == null || y == null || z == null) {
            clearDepth("玩家 x/y/z 取不全 ⇒ 如实留 null（不填 0 冒充）");
            return;
        }
        int bx = (int) Math.floor(x.doubleValue());
        int bz = (int) Math.floor(z.doubleValue());
        int top;
        try {
            top = bridge.topSolidY(bx, bz);
        } catch (Throwable t) {
            clearDepth("topSolidY 抛异常：" + t);
            return;
        }
        depthPlayerY = y;
        depthRefreshedTick = ticks;
        if (top == Integer.MIN_VALUE) {
            depthSurfaceBlockY = null;
            depthStandY = null;
            depthValue = null;
            depthNote = "玩家所在列 (x=" + bx + ", z=" + bz + ") 的地表取不到（未加载 / 越界 / 本档不支持）"
                    + " ⇒ playerDepthBelowSurface 如实回 null，**不填 0 冒充**";
            return;
        }
        // **未加载**的列，客户端回的是 void_air（不是 null），topSolidY 会低到 -65（真机实证 2026-11-11）。
        // 这里**不额外调 blockAt**（tick 上的读格预算要保持原样，见 StateTest C2），改用**建高下限**判：
        // 正常世界的最低建高是 -64（1.18+），topSolidY < 该下限只可能是「这一列什么都没有」= 未加载/虚空。
        if (top < SURFACE_MIN_BUILD_Y) {
            depthSurfaceBlockY = null;
            depthStandY = null;
            depthValue = null;
            depthNote = "玩家所在列 (x=" + bx + ", z=" + bz + ") 的地表取不到：topSolidY=" + top
                    + " < 本档建高下限 " + SURFACE_MIN_BUILD_Y
                    + " ⇒ 该列**疑似未加载**（客户端在未加载区块回 void_air 而不是 null）"
                    + " ⇒ playerDepthBelowSurface 如实回 null，**不填 0 冒充**";
            return;
        }
        depthSurfaceBlockY = Integer.valueOf(top);
        depthStandY = Integer.valueOf(top + 1);
        depthValue = Double.valueOf(round3((top + 1) - y.doubleValue()));
        depthNote = DEPTH_NOTE;
    }

    /** ⑦ 的四个字段（query_state 顶层与地图头**同源同值**；取不到就是 null + 人话）。 */
    public Map<String, Object> depthJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("playerDepthBelowSurface", depthValue);
        m.put("playerSurfaceBlockY", depthSurfaceBlockY);
        m.put("playerStandY", depthStandY);
        m.put("playerY", depthPlayerY);
        m.put("playerDepthNote", depthNote);
        m.put("playerDepthRefreshedTick", depthRefreshedTick < 0 ? null : Integer.valueOf(depthRefreshedTick));
        return m;
    }

    // ==================================================================
    // ⑧ 纵层 yMode（地图的纵层视图 + 地下自动切层）
    //
    // 设计口径（**只追加**，不动任何既有字段）：
    //   · 取值口**复用** GameBridge#blockAt(x,y,z)（本来就吃任意 Y；用户原话「正好区块就是有整个
    //     Z 轴的」）⇒ **不为纵层**去碰 Chunk / LevelChunkSection / PalettedContainer（跨版本四代、
    //     收益不成比例）。成本靠**分帧预算**控：纵层采样是**独立的分帧 job**（每 tick ≤
    //     StateConfig#columnsPerTick **格**，列×层一起算），与地图扫描 / 方框搜索共用 tick 线程但
    //     **字段完全分开** ⇒ 绝不动地图的分帧 / 版本 / 码表语义。
    //   · 几何**必须与地图一致**：层网格的 cols/rows/step/origin/cellWidth 逐字取本地图快照
    //     ⇒ 每行长度仍等于 cols × cellWidth（与 grid 同一个等式）。
    //   · 码表**共用**（同一 id 在 grid 与层网格里码相同）但**不动既有 legend 语义**：
    //     既有 legend 仍只列 grid 里真出现的码；纵层另给一张**并集**图例 layerLegend。
    //   · fail-loud：减层（层数上限 / 渲染字符预算 / 地图按行截断）**逐条写进头**，绝不静默丢层。
    //   · 向后兼容：**不给任何纵层参数、且没触发自动切层**时，回执与改动前**逐字一致**（零新键）。
    // ==================================================================

    /** 纵层模式名：既有行为（**默认**）。 */
    public static final String Y_MODE_SURFACE = "surface";
    /** 纵层模式名：以**玩家脚下方块 Y** 为基准。 */
    public static final String Y_MODE_PLAYER = "player";
    /** 纵层模式名：yRange 直接给**绝对 Y**。 */
    public static final String Y_MODE_ABSOLUTE = "absolute";
    /** 一次请求采样的层数上限（默认；每次可用 yLayerMax 覆盖）。 */
    public static final int Y_LAYER_MAX_DEFAULT = 8;
    /** 层数**硬上限**（yLayerMax 超了夹到这里，并如实回 yLayerMaxNote）。 */
    public static final int Y_LAYER_HARD_MAX = 16;
    /** 一次回执最多渲染多少层（就算字符预算够也不超过它）。 */
    public static final int Y_LAYER_RENDER_HARD = 16;
    /** 请求的层区间跨度硬上限（层）；超了以请求区间中点为中心夹窄，并如实说明。 */
    public static final int Y_RANGE_HARD_SPAN = 256;
    /** 自动切层的地下判据：playerDepthBelowSurface ≥ 此值 ⇒ 默认改用 player 纵层。 */
    public static final int Y_AUTO_DEPTH = 3;
    /** 自动切层 / player 模式省略 yRange 时的 dy 半径（±N ⇒ 2N+1 层）。 */
    public static final int Y_AUTO_RANGE = 2;

    /** yMode 的口径（原样进地图头，别让调用方猜）。 */
    public static final String Y_MODE_NOTE =
            "yMode = 地图的**纵层**口径："
            + "surface（默认）= **既有行为**（每格 = 该列最高非空气方块的码 + 定宽高度），逐字不变；"
            + "player = 以玩家脚下方块 Y（= yLayerBaseY）为基准，按 yRange 的 **dy** 逐层取方块；"
            + "absolute = yRange / y1+y2 直接给**绝对 Y**。"
            + "层网格与 grid **同几何**（同 cols/rows/step/origin/cellWidth ⇒ 每行长度仍等于 cols×cellWidth）；"
            + "层网格**不画玩家标记**（那会盖住玩家脚下那一格的读数），玩家位置看 playerCell。"
            + "**只追加**：surface 且调用方没给任何纵层参数时，回执一个新键都不加。";

    /** 层网格的口径（原样进地图头）。 */
    public static final String Y_LAYER_GRID_NOTE =
            "layers[] 每项 = **一层**的定宽字符网格：与 grid **同几何**（同 cols/rows/step/origin/cellWidth），"
            + "每格 cellWidth 个字符 = 方块码 + **与 grid 同一列的定宽高度字段**（高度是列属性、与层无关）；"
            + "layer.playerCellId = 该层里**玩家所在那格**的方块 id 原串（玩家格在层网格外 ⇒ null）；"
            + "码表**共用**（同一 id 在 grid 与层网格里码相同），层里第一次出现的新 id 只追加、不回收、不重排；"
            + "图例见 layerLegend / layerLegendUnused —— 既有 legend 的语义**一字未动**。";

    /** 纵层分帧采样的人话（原样进地图头）。 */
    public static final String Y_LAYER_SCAN_NOTE =
            "纵层采样是**独立的分帧 job**：与地图扫描共用 tick 线程，但每 tick 最多读 StateConfig.columnsPerTick "
            + "**格**（列×层一起算）⇒ 层数越多、采满越慢，**不会**把 tick 线程卡住。"
            + "查询只读**已完成**的那一份（layerSnapshot）；还没采完 ⇒ layers 为空数组 + layerScan.active=true，"
            + "**不假装有层**。";

    /** yMode 回执块（一次查询的解析结果 + 自动切层自证）。 */
    static final class YPlan {
        /** 回执里要不要出现 yMode 块（调用方给过任一纵层参数，或有效模式不是 surface）。 */
        boolean present;
        /** 要不要渲染纵层。 */
        boolean layersOn;
        /** 有效模式：surface / player / absolute。 */
        String mode = Y_MODE_SURFACE;
        /** 调用方**显式**给的 yMode（null = 没给）。 */
        String requested;
        /** 这次是不是自动切层切过来的（**必须自证**，不许悄悄换）。 */
        boolean autoSwitched;
        /** 人话原因。 */
        String reason;
        /** 请求的层区间（player: dy；absolute: 绝对 Y）。 */
        int low, high;
        /** player: floor(玩家Y)；absolute: 0。 */
        int baseY;
        /** 请求的层数（夹之前）。 */
        int requestedLayers;
        /** 实际要采样的层绝对 Y（升序；已按 yLayerMax 减层）。 */
        int[] ys;
        /** 减层的人话（null = 没减）。 */
        String reduceNote;
        /** 夹过的本次层数上限 + 原始请求值 + 人话。 */
        int layerMax = Y_LAYER_MAX_DEFAULT;
        Integer layerMaxRequested;
        String layerMaxNote;
        /** 层网格正文的总字符预算（null = 用本次 maxChars）。 */
        Integer layersMaxChars;
        /** yRange 形状 / 默认 / 夹取的人话（null = 没有要说的）。 */
        String rangeNote;
        String rangeClampNote;
        /** 非 null ⇒ 调用方回 BAD_REQUEST。 */
        String error;
    }

    /** 一层纵层采样的分帧 job（也用来当**已发布快照**：采完后只读、不再改）。 */
    private static final class YLJob {
        String mode;
        int baseY;
        int[] ys;
        int requested;
        String reduceNote;
        int cols, rows, step, originX, originZ;
        String dim;
        String[] ids;
        int cursor;
        int totalCells;
        int errors;
        String lastError;
        int startedTick = -1;
        int finishedTick = -1;
        int mapVersion = -1;
        String key;
    }

    private static boolean yHas(Map<String, Object> p, String k) {
        return p != null && p.containsKey(k) && p.get(k) != null;
    }

    /**
     * 解析这一次查询的纵层请求（**纯函数**，不 arm、不采样；排程副作用只在 query 里的 armLayerScan）。
     *
     * <p>错误一律走 {@link YPlan#error}（调用方回 BAD_REQUEST）—— 与 query_column / query_blocks
     * 的参数校验同一个落点，不把错误混进 ok 回执里。
     */
    public YPlan planY(Map<String, Object> p) {
        YPlan y = new YPlan();
        Object mv = p == null ? null : p.get("yMode");
        String m = mv == null ? null : String.valueOf(mv).trim();
        boolean modeGiven = m != null && !m.isEmpty();
        if (modeGiven && !Y_MODE_SURFACE.equals(m) && !Y_MODE_PLAYER.equals(m) && !Y_MODE_ABSOLUTE.equals(m)) {
            y.error = "yMode 只能是 surface | player | absolute，收到 " + Json.of(mv);
            return y;
        }
        y.requested = modeGiven ? m : null;
        boolean autoGiven = yHas(p, "yModeAuto");
        // [T16] 自动切层的**配置默认**：调用方给了 yModeAuto 就以它为准（只覆盖本次）；
        // 没给就用 cfg.yModeAuto（设置页 / 配置文件；默认 true）。
        boolean auto = autoGiven ? Json.bool(p, "yModeAuto", cfg.yModeAuto) : cfg.yModeAuto;
        // 配置把自动切层关掉了（且调用方本次没给 yModeAuto）⇒ 回执要**自证**这件事（见 present）。
        boolean autoCfgOff = !autoGiven && !cfg.yModeAuto;
        boolean rangeGiven = yHas(p, "yRange") || yHas(p, "y1") || yHas(p, "y2");
        boolean maxGiven = yHas(p, "yLayerMax");
        boolean charsGiven = yHas(p, "layersMaxChars");

        // ---- 有效模式：自动切层在这里判，理由**必须**写进 reason（不许悄悄换）----
        Double dep = depthValue;
        if (modeGiven) {
            y.mode = m;
            y.autoSwitched = false;
            y.reason = "调用方**显式**给了 yMode=" + m + " ⇒ 按它走（自动切层不参与）";
        } else if (!auto) {
            y.mode = Y_MODE_SURFACE;
            y.reason = (autoGiven ? "参数 yModeAuto=false" : "配置 StateConfig.yModeAuto=false（设置页 / 配置文件）")
                    + " ⇒ 自动切层被**显式关掉** ⇒ 沿用 surface（既有行为）；"
                    + "要纵层请显式给 yMode=player|absolute";
        } else if (dep != null && dep.doubleValue() >= (double) cfg.yModeAutoDepth) {
            y.mode = Y_MODE_PLAYER;
            y.autoSwitched = true;
            y.reason = "playerDepthBelowSurface=" + dep + " ≥ " + cfg.yModeAutoDepth
                    + "（配置 yModeAutoDepth）⇒ 玩家明显在地下 ⇒ **自动**改用 player 纵层"
                    + "（配置 yAutoRange=±" + cfg.yAutoRange + " 层）；"
                    + "显式给 yMode，或把 yModeAuto 关掉，都能关掉它";
        } else {
            y.mode = Y_MODE_SURFACE;
            y.reason = dep == null
                    ? "playerDepthBelowSurface=null（地表深度取不到）⇒ **不**自动切层，沿用 surface"
                    : "playerDepthBelowSurface=" + dep + " < " + cfg.yModeAutoDepth
                            + "（配置 yModeAutoDepth）⇒ 不在明显地下，沿用 surface";
        }
        // autoCfgOff：配置关了自动切层、本次又没给任何参数 ⇒ 仍给一小块自证（yMode=surface +
        // yModeAutoSwitched=false + 人话），否则调用方看不出「是配置关的」。
        // 默认配置（yModeAuto=true）下 autoCfgOff=false ⇒ 既有「零新键」契约**逐字不变**。
        y.present = modeGiven || autoGiven || rangeGiven || maxGiven || charsGiven
                || !Y_MODE_SURFACE.equals(y.mode) || autoCfgOff;
        if (!y.present) return y;                       // ★ 零新键：回执与改动前逐字一致
        if (Y_MODE_SURFACE.equals(y.mode)) return y;    // 调用方给了参数但结果是 surface：只自证「没切层」

        // ---- 层区间 ----
        y.layersOn = true;
        if (Y_MODE_ABSOLUTE.equals(y.mode)) {
            y.baseY = 0;
            if (yHas(p, "yRange")) {
                int[] r = yRangeOf(p.get("yRange"));
                if (r == null) {
                    y.error = "yMode=absolute 的 yRange 形状不对：要 数字 / [a,b] / \"a..b\"（**整数绝对 Y**），收到 "
                            + Json.of(p.get("yRange"));
                    return y;
                }
                y.low = r[0];
                y.high = r[1];
            } else if (yHas(p, "y1") || yHas(p, "y2")) {
                Object a = yHas(p, "y1") ? longOrNull(p.get("y1")) : null;
                Object b = yHas(p, "y2") ? longOrNull(p.get("y2")) : null;
                if (!(a instanceof Long) || !(b instanceof Long)) {
                    y.error = "yMode=absolute 的 y1/y2 必须**都给整数**（收到 y1=" + Json.of(p.get("y1"))
                            + " y2=" + Json.of(p.get("y2")) + "）";
                    return y;
                }
                y.low = (int) Math.min(((Long) a).longValue(), ((Long) b).longValue());
                y.high = (int) Math.max(((Long) a).longValue(), ((Long) b).longValue());
            } else {
                y.error = "yMode=absolute 必须给 yRange（绝对 Y 区间，如 [64,70] / \"64..70\"）或 y1+y2；"
                        + "本动作**不猜**世界高度";
                return y;
            }
        } else {
            double[] xyz = playerXYZ();
            if (xyz == null) {
                y.error = "yMode=player 要玩家的 x/y/z 来定基准，但取不到（playerStateJson 里没有）";
                return y;
            }
            y.baseY = (int) Math.floor(xyz[1]);
            if (yHas(p, "yRange")) {
                int[] r = yRangeOf(p.get("yRange"));
                if (r == null) {
                    y.error = "yMode=player 的 yRange 形状不对：要 数字（±n） / [a,b] / \"a..b\"（**整数 dy**），收到 "
                            + Json.of(p.get("yRange"));
                    return y;
                }
                y.low = r[0];
                y.high = r[1];
                if (p.get("yRange") instanceof Number) {
                    y.rangeNote = "yRange 给了单个数字 ⇒ 按**对称区间** [−n, +n] = [" + y.low + ".." + y.high + "] 读（dy）";
                }
            } else {
                y.low = -cfg.yAutoRange;
                y.high = cfg.yAutoRange;
                y.rangeNote = "没给 yRange ⇒ 用**有界**默认 ±" + cfg.yAutoRange
                        + "（配置 yAutoRange；共 " + (2 * cfg.yAutoRange + 1) + " 层，dy）";
            }
        }
        if (y.low > y.high) {
            int t = y.low; y.low = y.high; y.high = t;
        }
        int span = y.high - y.low + 1;
        if (span > Y_RANGE_HARD_SPAN) {
            int mid = y.low + span / 2;
            int lo = mid - Y_RANGE_HARD_SPAN / 2;
            int hi = lo + Y_RANGE_HARD_SPAN - 1;
            y.rangeClampNote = "请求的层跨度 " + span + " 层 > 硬上限 " + Y_RANGE_HARD_SPAN
                    + " ⇒ 以请求区间中点为心夹到 [" + lo + ".." + hi + "]（如实回 yLayerRange，不静默）";
            y.low = lo;
            y.high = hi;
            span = Y_RANGE_HARD_SPAN;
        }
        y.requestedLayers = span;

        // ---- 层数上限（每次可覆盖；夹了必须说）----
        // [T16] 默认取配置 yLayerMax（默认 8）；调用方给 yLayerMax 只覆盖本次。硬上限仍是常量 16。
        int lm = yHas(p, "yLayerMax") ? intParam(p, "yLayerMax", cfg.yLayerMax) : cfg.yLayerMax;
        y.layerMaxRequested = Integer.valueOf(lm);
        if (lm < 1) {
            y.layerMax = 1;
            y.layerMaxNote = "yLayerMax=" + lm + " < 1 ⇒ 夹到 1（至少采一层；不静默）";
        } else if (lm > Y_LAYER_HARD_MAX) {
            y.layerMax = Y_LAYER_HARD_MAX;
            y.layerMaxNote = "yLayerMax=" + lm + " 超过硬上限 " + Y_LAYER_HARD_MAX + " ⇒ 夹到 "
                    + Y_LAYER_HARD_MAX + "（如实回 yLayerMaxRequested，不静默）";
        } else {
            y.layerMax = lm;
        }

        // ---- 渲染字符预算（每次可覆盖；默认与本次 maxChars 同值）----
        if (yHas(p, "layersMaxChars")) {
            int v = intParam(p, "layersMaxChars", 0);
            if (v > 0) y.layersMaxChars = Integer.valueOf(v);
            else y.rangeNote = yAppend(y.rangeNote, "layersMaxChars=" + v + " ≤ 0 ⇒ 视为未给，用本次 maxChars 当层预算");
        }

        // ---- 实际采样的层（按 yLayerMax 减层；减了必须说）----
        int mm = Math.min(span, y.layerMax);
        if (mm < 1) mm = 1;
        int[] a;
        if (mm >= span) {
            a = new int[span];
            for (int i = 0; i < span; i++) a[i] = y.low + i;
        } else {
            a = new int[mm];
            int last = Integer.MIN_VALUE;
            for (int k = 0; k < mm; k++) {
                int v = y.low + (int) (((long) k * span) / mm);
                if (v <= last) v = last + 1;
                a[k] = v;
                last = v;
            }
            // 「玩家那一层」(dy=0) 必须在采样列表里（只在它落在请求区间内时）——
            // 否则调用方拿不到 dy=0 那一层，B② 的交叉验证就无从谈起。
            if (Y_MODE_PLAYER.equals(y.mode) && y.low <= 0 && y.high >= 0) {
                boolean hasZero = false;
                for (int i = 0; i < a.length; i++) if (a[i] == 0) { hasZero = true; break; }
                if (!hasZero) {
                    a[mm / 2] = 0;
                    java.util.Arrays.sort(a);
                    for (int i = 1; i < a.length; i++) if (a[i] <= a[i - 1]) a[i] = a[i - 1] + 1;
                }
            }
            StringBuilder kept = new StringBuilder();
            for (int i = 0; i < a.length; i++) {
                if (i > 0) kept.append(',');
                kept.append(a[i] + y.baseY);
            }
            y.reduceNote = "请求 " + span + " 层 > 本次上限 yLayerMax=" + y.layerMax
                    + " ⇒ **只采样 " + a.length + " 层**（跨整个请求区间均匀挑，并保证玩家那一层 dy=0 在内），"
                    + "实际层的绝对 Y = [" + kept + "] —— 这是**没采**，不是那里没有方块；"
                    + "要全采请调大 yLayerMax（硬上限 " + Y_LAYER_HARD_MAX + "）或缩小 yRange";
        }
        y.ys = new int[a.length];
        for (int i = 0; i < a.length; i++) y.ys[i] = a[i] + y.baseY;
        return y;
    }

    private static String yAppend(String a, String b) {
        if (a == null) return b;
        return a + "；" + b;
    }

    /** 层的绝对 Y 区间回执。 */
    private static Map<String, Object> yRangeJson(int low, int high) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("from", Integer.valueOf(low));
        m.put("to", Integer.valueOf(high));
        m.put("count", Integer.valueOf(high - low + 1));
        return m;
    }

    /**
     * yRange 的形状：数字 n ⇒ [−n, +n]（对称）；{@code [a,b]} / {@code "a..b"} ⇒ [min,max]。
     * **非整值一律拒**（回 null ⇒ 调用方 BAD_REQUEST），不静默取整。
     */
    private static int[] yRangeOf(Object v) {
        if (v instanceof Number) {
            Integer n = yIntOf(dbl(v));
            if (n == null) return null;
            int a = Math.abs(n.intValue());
            return new int[] { -a, a };
        }
        if (v instanceof String) {
            String s = ((String) v).trim();
            int p = s.indexOf("..");
            if (p < 0) {
                Integer n = yIntOf(dbl(s));
                if (n == null) return null;
                int a = Math.abs(n.intValue());
                return new int[] { -a, a };
            }
            Integer a = yIntOf(dbl(s.substring(0, p)));
            Integer b = yIntOf(dbl(s.substring(p + 2)));
            if (a == null || b == null) return null;
            return new int[] { Math.min(a.intValue(), b.intValue()), Math.max(a.intValue(), b.intValue()) };
        }
        if (v instanceof List) {
            List<?> l = (List<?>) v;
            if (l.size() != 2) return null;
            Integer a = yIntOf(dbl(l.get(0)));
            Integer b = yIntOf(dbl(l.get(1)));
            if (a == null || b == null) return null;
            return new int[] { Math.min(a.intValue(), b.intValue()), Math.max(a.intValue(), b.intValue()) };
        }
        return null;
    }

    /** 必须是**整值**（8 / 8.0 行；8.7 拒）。 */
    private static Integer yIntOf(Double d) {
        if (d == null) return null;
        double x = d.doubleValue();
        if (Double.isNaN(x) || Double.isInfinite(x)) return null;
        if (x != Math.rint(x)) return null;
        return Integer.valueOf((int) x);
    }

    /** 取（必要时**发**）一个层里出现的 id 的码 —— 先查会话码表，再查纵层专用尾段。 */
    private Character layerCodeOf(String id) {
        Character c = idToCode.get(id);
        if (c != null) return c;
        Character k = layerIdToCode.get(id);
        if (k != null) return k;
        String pal = cfg.palette;
        for (int i = pal.length() - 1; i >= 0; i--) {
            Character cand = Character.valueOf(pal.charAt(i));
            if (usedCodes.contains(cand)) continue;    // 全局唯一：地表图用过的码不许再发
            usedCodes.add(cand);
            layerIdToCode.put(id, cand);
            return cand;
        }
        return null;                                   // 码位用尽 ⇒ overflowCode，并如实进 layerLegendOverflowNote
    }

    /** arm / 复用一次纵层分帧采样（**只排程，不做 MC 调用**）。 */
    private void armLayerScan(YPlan plan) {
        if (!ready || !bridge.ready()) return;
        int n = cols * rows;
        if (n <= 0 || plan.ys == null || plan.ys.length == 0) return;
        String key = ylKey(plan.mode, plan.baseY, plan.ys, originX, originZ, step, cols, rows, dim);
        if (ylJob != null && key.equals(ylJob.key)) return;                    // 同一件事正在采
        if (ylJob == null && ylDone != null && key.equals(ylDone.key)) return; // 同一件事已经采好
        YLJob j = new YLJob();
        j.mode = plan.mode;
        j.baseY = plan.baseY;
        j.ys = plan.ys.clone();
        j.requested = plan.requestedLayers;
        j.reduceNote = plan.reduceNote;
        j.cols = cols;
        j.rows = rows;
        j.step = step;
        j.originX = originX;
        j.originZ = originZ;
        j.dim = dim;
        j.totalCells = j.ys.length * n;
        j.ids = new String[j.totalCells];
        j.cursor = 0;
        j.startedTick = ticks;
        j.mapVersion = version;
        j.key = key;
        ylJob = j;
        ylRuns++;
    }

    private static String ylKey(String mode, int baseY, int[] ys, int ox, int oz, int step, int cols, int rows, String dim) {
        StringBuilder b = new StringBuilder();
        b.append(mode).append('|').append(baseY).append('|');
        for (int i = 0; i < ys.length; i++) {
            if (i > 0) b.append(',');
            b.append(ys[i]);
        }
        b.append('|').append(ox).append(',').append(oz).append(',').append(step)
                .append(',').append(cols).append(',').append(rows).append('|').append(dim);
        return b.toString();
    }

    /**
     * 每个客户端 tick 推进一帧纵层采样（**独立字段，绝不碰地图扫描 / 方框搜索**）。
     * 预算 = {@link StateConfig#columnsPerTick} **格**（列×层一起算）。
     */
    private void advanceLayerScan() {
        YLJob j = ylJob;
        if (j == null) return;
        if (!ready) {
            ylLastCancelReason = "地图快照不在场（换世界 / 换世代）⇒ 本次纵层采样作废";
            ylJob = null;
            return;
        }
        if (j.cols != cols || j.rows != rows || j.step != step
                || j.originX != originX || j.originZ != originZ) {
            ylLastCancelReason = "地图几何变了（origin/step/cols/rows）⇒ 本次纵层采样作废，等下一次查询按新几何重采";
            ylJob = null;
            return;
        }
        int budget = Math.max(1, cfg.columnsPerTick);
        int n = Math.max(1, cols * rows);
        while (budget > 0 && j.cursor < j.totalCells) {
            int idx = j.cursor % n;
            int k = j.cursor / n;
            int i = idx % cols;
            int jj = idx / cols;
            int bx = j.originX + i * j.step;
            int bz = j.originZ + jj * j.step;
            try {
                String id = bridge.blockAt(bx, j.ys[k], bz);
                // [T16] 层里同样：void_air = 未加载（客户端不回 null）⇒ 判未知，不当地表/空气画。
                j.ids[j.cursor] = isVoidAirId(id) ? null : id;
            } catch (Throwable t) {
                j.ids[j.cursor] = null;                // 适配层炸了不许把 tick 线程带崩
                j.errors++;
                j.lastError = String.valueOf(t);
            }
            j.cursor++;
            budget--;
        }
        if (j.cursor >= j.totalCells) {
            j.finishedTick = ticks;
            ylDone = j;                                // 发布（此后只读）
            ylJob = null;
            ylEverRan = true;
        }
    }

    /** 纵层采样的自报（给地图头与 /status；只读缓存，不碰 MC）。 */
    public Map<String, Object> layerScanJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        YLJob j = ylJob;
        m.put("active", Boolean.valueOf(j != null));
        m.put("doneCells", Integer.valueOf(j == null ? 0 : j.cursor));
        m.put("totalCells", Integer.valueOf(j == null ? 0 : j.totalCells));
        m.put("layers", Integer.valueOf(j == null ? 0 : j.ys.length));
        m.put("startedTick", j == null ? null : Integer.valueOf(j.startedTick));
        m.put("finishedTick", ylDone == null ? null : Integer.valueOf(ylDone.finishedTick));
        m.put("runs", Integer.valueOf(ylRuns));
        m.put("errors", Integer.valueOf(j == null ? 0 : j.errors));
        if (j != null && j.lastError != null) m.put("lastError", j.lastError);
        if (j != null && j.reduceNote != null) m.put("reduceNote", j.reduceNote);
        if (j == null && ylLastCancelReason != null) m.put("lastCancelReason", ylLastCancelReason);
        m.put("note", j != null
                ? "纵层采样进行中（分帧）：doneCells/totalCells 是**列×层**的进度；采完一整份才发布，查询不读半成品"
                : (ylEverRan ? "纵层采样**没在跑**（上一份已完成或已作废）" : "还没有纵层采样请求"));
        return m;
    }

    private Map<String, Object> layerSnapshotJson(YLJob d) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("mode", d.mode);
        m.put("baseY", Integer.valueOf(d.baseY));
        m.put("requested", Integer.valueOf(d.requested));
        m.put("scanned", Integer.valueOf(d.ys.length));
        List<Object> ys = new ArrayList<Object>();
        for (int i = 0; i < d.ys.length; i++) ys.add(Integer.valueOf(d.ys[i]));
        m.put("ys", ys);
        m.put("finishedTick", Integer.valueOf(d.finishedTick));
        m.put("mapVersionAtScan", Integer.valueOf(d.mapVersion));
        m.put("geometry", ylGeomJson(d.cols, d.rows, d.step, d.originX, d.originZ));
        if (d.reduceNote != null) m.put("reduceNote", d.reduceNote);
        if (d.errors > 0) m.put("errors", Integer.valueOf(d.errors));
        if (d.lastError != null) m.put("lastError", d.lastError);
        return m;
    }

    private static Map<String, Object> ylGeomJson(int cols, int rows, int step, int ox, int oz) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("origin", xy(ox, oz));
        m.put("step", Integer.valueOf(step));
        m.put("cols", Integer.valueOf(cols));
        m.put("rows", Integer.valueOf(rows));
        return m;
    }

    /**
     * 把纵层块写进地图头。**只在 {@code plan.present} 时调用** ⇒ 默认（surface + 没给任何参数）
     * 路径一个新键都不加，既有回执逐字不变。
     */
    private void putYMode(Map<String, Object> m, YPlan plan, int rs, int rc, int rr, int shownRows, int maxChars) {
        m.put("yMode", plan.mode);
        m.put("yModeRequested", plan.requested);
        m.put("yModeAutoSwitched", Boolean.valueOf(plan.autoSwitched));
        m.put("yModeReason", plan.reason);
        m.put("yModeNote", Y_MODE_NOTE);
        if (!plan.layersOn) {
            m.put("layersIncluded", Boolean.FALSE);
            m.put("layersNote", "有效 yMode=surface ⇒ **就是既有行为**（grid 逐字不变），本次不含纵层；"
                    + "要纵层请给 yMode=player|absolute（或别关掉自动切层）");
            return;
        }

        m.put("layersIncluded", Boolean.TRUE);
        m.put("yLayerBaseY", Integer.valueOf(plan.baseY));
        m.put("yLayerRange", yRangeJson(plan.low, plan.high));
        if (plan.rangeNote != null) m.put("yRangeNote", plan.rangeNote);
        if (plan.rangeClampNote != null) m.put("yRangeClampNote", plan.rangeClampNote);
        m.put("yLayerMax", Integer.valueOf(plan.layerMax));
        if (plan.layerMaxNote != null) {
            m.put("yLayerMaxRequested", plan.layerMaxRequested);
            m.put("yLayerMaxNote", plan.layerMaxNote);
        }
        m.put("yLayerCellsPerTick", Integer.valueOf(Math.max(1, cfg.columnsPerTick)));
        m.put("yLayerScanNote", Y_LAYER_SCAN_NOTE);
        m.put("layerScan", layerScanJson());
        m.put("layersRequested", Integer.valueOf(plan.requestedLayers));

        // ---- 有没有可渲染的成品快照（几何 + 请求指纹都要对得上）----
        YLJob d = ylDone;
        boolean geomOk = d != null
                && d.cols == cols && d.rows == rows && d.step == step
                && d.originX == originX && d.originZ == originZ
                && (d.dim == null ? dim == null : d.dim.equals(dim));
        boolean reqOk = geomOk && ylKey(d.mode, d.baseY, d.ys, originX, originZ, step, cols, rows, dim)
                .equals(ylKey(plan.mode, plan.baseY, plan.ys, originX, originZ, step, cols, rows, dim));
        m.put("layerSnapshot", geomOk ? layerSnapshotJson(d) : null);
        m.put("layerSnapshotMatchesRequest", Boolean.valueOf(reqOk));
        if (!geomOk) {
            m.put("layersScanned", Integer.valueOf(0));
            m.put("layersShown", Integer.valueOf(0));
            m.put("layersDropped", Integer.valueOf(plan.requestedLayers));
            m.put("layersOmitted", Integer.valueOf(0));
            m.put("layerTruncated", Boolean.TRUE);
            m.put("layers", new ArrayList<Object>());
            m.put("layersDroppedNote", "要的 " + plan.requestedLayers + " 层**还没采完 / 上一份几何对不上**"
                    + "（layerScan.active=" + (ylJob != null) + "）⇒ 本次 layers=[] —— 这是**还没有**，"
                    + "不是「那里没有方块」；等 layerScan.doneCells == totalCells 再取一次");
            m.put("layerLegend", new LinkedHashMap<String, Object>());
            m.put("layerLegendUnused", new ArrayList<Object>());
            m.put("layerLegendNote", Y_LAYER_GRID_NOTE);
            m.put("layerNote", "**本次没有任何一层可渲染** ⇒ 如实给空数组 + 原因，不编、不静默");
            return;
        }

        // ---- 渲染预算：层数 × 每层字符 ≤ layersMaxChars（默认 = 本次 maxChars）----
        int cellW = cellWidth();
        int rowLen = rc * cellW;
        int budget = plan.layersMaxChars != null ? plan.layersMaxChars.intValue() : maxChars;
        int perLayer = shownRows <= 0 ? 0 : shownRows * rowLen + (shownRows - 1);
        int byBudget = perLayer <= 0 ? 0 : budget / perLayer;
        int scanned = d.ys.length;
        int shown = Math.min(scanned, Math.min(byBudget, Y_LAYER_RENDER_HARD));
        if (shown < 0) shown = 0;

        // 丢掉的是**边缘**层：以「玩家那一层（player）/ 请求区间中点（absolute）」为心取连续窗口 ——
        // 这样「这一层是空气、上一层是石头」的相邻两层一定在一起。
        int targetDy = Y_MODE_PLAYER.equals(d.mode) ? 0 : (plan.low + plan.high) / 2;
        int idxBase = 0;
        int best = Integer.MAX_VALUE;
        for (int k = 0; k < scanned; k++) {
            int dist = Math.abs((d.ys[k] - d.baseY) - targetDy);
            if (dist < best) { best = dist; idxBase = k; }
        }
        int start = idxBase - (shown - 1) / 2;
        if (start < 0) start = 0;
        if (start + shown > scanned) start = Math.max(0, scanned - shown);

        // ---- 逐层渲染（几何与 grid 一模一样；**不画玩家标记**）----
        int[] pc = playerCell(rs, rc, rr);
        boolean pcIn = pc[0] >= 0 && pc[1] >= 0;
        int kk = rs / step;
        int n = cols * rows;
        Set<Character> layerUsed = new HashSet<Character>();
        Set<String> layerOverflowIds = new HashSet<String>();
        boolean usedUnknown = false, usedOverflow = false;
        List<Object> layers = new ArrayList<Object>();
        for (int li = 0; li < shown; li++) {
            int k = start + li;
            StringBuilder b = new StringBuilder();
            for (int j = 0; j < shownRows; j++) {
                if (j > 0) b.append('\n');
                int sj = j * kk;
                for (int i = 0; i < rc; i++) {
                    int idx = sj * cols + i * kk;
                    String id = d.ids[k * n + idx];
                    char ch;
                    if (id == null) {
                        ch = cfg.unknownCode;
                        usedUnknown = true;
                    } else {
                        Character c = layerCodeOf(id);
                        if (c == null) {
                            ch = cfg.overflowCode;
                            usedOverflow = true;
                            layerOverflowIds.add(id);
                        } else {
                            ch = c.charValue();
                            layerUsed.add(c);
                        }
                    }
                    b.append(ch);
                    if (cfg.includeHeight) b.append(fmtHeight(heights[idx], heightWidth));
                }
            }
            int chars = shownRows <= 0 ? 0 : shownRows * rowLen + (shownRows - 1);
            Map<String, Object> L = new LinkedHashMap<String, Object>();
            L.put("y", Integer.valueOf(d.ys[k]));
            L.put("dy", Integer.valueOf(d.ys[k] - d.baseY));
            L.put("yIsAbsolute", Boolean.TRUE);
            L.put("cols", Integer.valueOf(rc));
            L.put("rows", Integer.valueOf(rr));
            L.put("shownRows", Integer.valueOf(shownRows));
            L.put("cellWidth", Integer.valueOf(cellW));
            L.put("rowLength", Integer.valueOf(rowLen));
            L.put("shownChars", Integer.valueOf(chars));
            L.put("truncated", Boolean.valueOf(shownRows < rr));
            if (pcIn) {
                String pid = d.ids[k * n + (pc[1] * kk) * cols + pc[0] * kk];
                L.put("playerCellId", pid);
                L.put("playerCell", cellJson(pc[0], pc[1]));
            } else {
                L.put("playerCellId", null);
                L.put("playerCell", null);
            }
            L.put("grid", b.toString());
            layers.add(L);
        }

        int dropped = Math.max(0, plan.requestedLayers - scanned);
        int omitted = Math.max(0, scanned - shown);
        m.put("layersScanned", Integer.valueOf(scanned));
        m.put("layersShown", Integer.valueOf(shown));
        m.put("layersDropped", Integer.valueOf(dropped));
        m.put("layersOmitted", Integer.valueOf(omitted));
        m.put("layerTruncated", Boolean.valueOf(dropped > 0 || omitted > 0 || shownRows < rr));
        if (dropped > 0) {
            String why;
            if (reqOk) {
                why = "本次上限 yLayerMax=" + plan.layerMax + " ⇒ **只采了 " + scanned + " 层**（差 " + dropped
                        + " 层**根本没采**）" + (plan.reduceNote != null ? "；" + plan.reduceNote : "");
            } else {
                why = "本次渲染的是**上一次请求**的 " + scanned + " 层快照（与本次请求不是同一份，"
                        + "见 layerSnapshotMismatchNote）⇒ 相对本次请求的 " + plan.requestedLayers + " 层，还有 "
                        + dropped + " 层没到；本次请求那一份正在 layerScan 里采（active=" + (ylJob != null) + "）";
            }
            m.put("layersDroppedNote", "请求 " + plan.requestedLayers + " 层，" + why
                    + " —— 这是**没采 / 还没到**，不是「那里没有方块」；不许静默读成「只有这些层」");
        }
        if (omitted > 0) {
            m.put("layersOmittedNote", "已采 " + scanned + " 层，但层网格正文预算 layersMaxChars=" + budget
                    + "（每层 " + perLayer + " 字符）只放得下 " + shown + " 层 ⇒ **只回了 " + shown + " 层**"
                    + "（丢掉 " + omitted + " 层，取的是**以基准层为中心的连续窗口** y=["
                    + d.ys[start] + ".." + d.ys[start + shown - 1] + "]）—— 要全要请调大 layersMaxChars / maxChars，"
                    + "或缩小 yRange / 调大 step");
        }
        if (shownRows < rr) {
            m.put("layersRowsNote", "地图本身按行截断成 " + shownRows + "/" + rr + " 行（见 truncatedNote）"
                    + " ⇒ 层网格**同步**只回这几行（几何必须与 grid 一致，不许偷偷换几何）");
        }
        m.put("layers", layers);
        m.put("layerLegend", layerLegendJson(layerUsed, usedUnknown, usedOverflow, layerOverflowIds));
        m.put("layerLegendUnused", layerLegendUnusedJson(layerUsed));
        if (usedOverflow) {
            m.put("layerLegendOverflowNote", "层里有 id 拿不到码（palette " + cfg.palette.length()
                    + " 位已被地表图 / 纵层发完）⇒ 画 " + cfg.overflowCode
                    + "；真实 id 见 layerLegendUnused 与 layerPaletteSize 的自报");
        }
        m.put("layerLegendNote", Y_LAYER_GRID_NOTE);
        m.put("layerNote", "layers 是**只读快照**（layerSnapshot.finishedTick 那一 tick 采的，分帧、每 tick ≤ "
                + Math.max(1, cfg.columnsPerTick) + " 格）；层网格**不画玩家标记** ⇒ 玩家格的方块 id 看每层的 playerCellId");
        if (!reqOk) {
            m.put("layerSnapshotMismatchNote", "这份层快照是**上一次请求**采的（模式 / 基准 Y / 层集合 / 几何与本次不同）"
                    + " ⇒ layerSnapshotMatchesRequest=false，请以 layerSnapshot 里的 mode/baseY/ys 为准；"
                    + "新的那一份正在 layerScan 里采");
        }
    }

    /**
     * **纵层并集图例**：列各层真用到的码（按 id 升序；形状与既有 {@code legend} 完全一致）。
     *
     * <p>为什么不能直接复用 {@code legendJson}：它的签名域是 {@code snapshotAllocatedIds}
     * （**地表图**发过码的 id）；纵层会出现地表图天然没有的 id（最典型 {@code minecraft:air}），
     * 那些码在 {@link #layerIdToCode} 里 ⇒ 这里取**两者并集**。既有 {@code legend} 一字未动。
     */
    private Map<String, Object> layerLegendJson(Set<Character> used, boolean usedUnknown, boolean usedOverflow,
                                                Set<String> overflowIdsInLayers) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        if (usedUnknown) m.put(String.valueOf(cfg.unknownCode), UNKNOWN_ID);
        TreeSet<String> ids = new TreeSet<String>();
        ids.addAll(snapshotAllocatedIds);
        ids.addAll(layerIdToCode.keySet());
        for (String id : ids) {
            Character c = idToCode.get(id);
            if (c == null) c = layerIdToCode.get(id);
            if (c != null && used.contains(c)) m.put(String.valueOf(c.charValue()), id);
        }
        if (usedOverflow) {
            m.put(String.valueOf(cfg.overflowCode), "<" + overflowIdsInLayers.size() + " 种，见 layerLegendOverflowNote>");
        }
        return m;
    }

    /** 纵层并集图例的「已发码但没画进任何层」清单（按 id 升序）。 */
    private List<Object> layerLegendUnusedJson(Set<Character> used) {
        List<Object> out = new ArrayList<Object>();
        TreeSet<String> ids = new TreeSet<String>();
        ids.addAll(snapshotAllocatedIds);
        ids.addAll(layerIdToCode.keySet());
        for (String id : ids) {
            Character c = idToCode.get(id);
            if (c == null) c = layerIdToCode.get(id);
            if (c != null && !used.contains(c)) {
                Map<String, Object> one = new LinkedHashMap<String, Object>();
                one.put("code", String.valueOf(c.charValue()));
                one.put("id", id);
                out.add(one);
            }
        }
        return out;
    }

    // ==================================================================
    // ⑥a query_column（单列纵剖面）
    // ==================================================================

    /**
     * 单列纵剖面：从 yHigh 到 yLow **降序**逐层给 {@code {y, id}}（空气也如实出现）。
     *
     * <p>调用方（{@link PlaytestCore#dispatch}）已校验 x/z 必填且为整数，并把 y1/y2 的缺省补好。
     * 本方法只做「读 + 有界 + 账目」：**最多读 maxBlocks 层**，超了 fail-loud（truncated + 丢掉哪一段）。
     */
    public Map<String, Object> queryColumn(int x, int z, int y1In, int y2In, int maxBlocksIn) {
        Map<String, Object> out = new LinkedHashMap<String, Object>();
        out.put("schema", COLUMN_SCHEMA);
        out.put("x", Integer.valueOf(x));
        out.put("z", Integer.valueOf(z));
        out.put("order", COLUMN_ORDER);
        out.put("orderNote", COLUMN_ORDER_NOTE);

        int maxBlocks = maxBlocksIn <= 0 ? COLUMN_DEFAULT_MAX_BLOCKS : Math.min(maxBlocksIn, COLUMN_MAX_BLOCKS);
        out.put("maxBlocks", Integer.valueOf(maxBlocks));
        out.put("maxBlocksDefault", Integer.valueOf(COLUMN_DEFAULT_MAX_BLOCKS));
        out.put("maxBlocksMax", Integer.valueOf(COLUMN_MAX_BLOCKS));
        if (maxBlocksIn <= 0) {
            out.put("maxBlocksNote", "未给 maxBlocks（或给了 ≤0）⇒ 用默认 " + COLUMN_DEFAULT_MAX_BLOCKS
                    + "（**有界**，绝不整列无界返回）");
        } else if (maxBlocksIn > COLUMN_MAX_BLOCKS) {
            out.put("maxBlocksClampedTo", Integer.valueOf(COLUMN_MAX_BLOCKS));
            out.put("maxBlocksNote", "maxBlocks=" + maxBlocksIn + " 超过硬上限 " + COLUMN_MAX_BLOCKS
                    + " ⇒ 夹到 " + COLUMN_MAX_BLOCKS + "（如实回 maxBlocksClampedTo，不静默）");
        }

        int yHigh = Math.max(y1In, y2In);
        int yLow = Math.min(y1In, y2In);
        out.put("y1", Integer.valueOf(yLow));
        out.put("y2", Integer.valueOf(yHigh));
        out.put("y1Requested", Integer.valueOf(y1In));
        out.put("y2Requested", Integer.valueOf(y2In));
        if (y1In > y2In) {
            out.put("ySwapNote", "调用方给的 y1=" + y1In + " > y2=" + y2In
                    + " ⇒ 按 [yLow..yHigh] 读；回执里的 y1/y2 已按升序规范化（y1=" + yLow + ", y2=" + yHigh + "）");
        }

        List<Object> rows = new ArrayList<Object>();
        int unknown = 0, air = 0, nonAir = 0, voidAir = 0;
        Integer firstNonAirY = null;
        String firstNonAirId = null;
        String colError = null;
        boolean truncated = false;
        int droppedFromY = 0, droppedToY = 0;
        int y = yHigh;
        while (true) {
            if (rows.size() >= maxBlocks) {
                if (y >= yLow) {
                    truncated = true;
                    droppedFromY = y;
                    droppedToY = yLow;
                }
                break;
            }
            if (y < yLow) break;
            String id;
            try {
                id = bridge.blockAt(x, y, z);
            } catch (Throwable t) {
                id = null;                                  // 适配层炸了也不许把回执编成空气
                if (colError == null) colError = String.valueOf(t);
            }
            Map<String, Object> row = new LinkedHashMap<String, Object>();
            row.put("y", Integer.valueOf(y));
            row.put("id", id);
            rows.add(row);
            if (id == null) {
                unknown++;
            } else if (isAirId(id)) {
                air++;
                if (isVoidAirId(id)) voidAir++;
            } else {
                nonAir++;
                if (firstNonAirY == null) {
                    firstNonAirY = Integer.valueOf(y);
                    firstNonAirId = id;
                }
            }
            y--;
        }

        out.put("count", Integer.valueOf(rows.size()));
        out.put("blocks", rows);
        out.put("truncated", Boolean.valueOf(truncated));
        if (truncated) {
            out.put("droppedFromY", Integer.valueOf(droppedFromY));
            out.put("droppedToY", Integer.valueOf(droppedToY));
            out.put("truncatedNote", "只读了 " + rows.size() + " 层（maxBlocks=" + maxBlocks
                    + "）⇒ **没读**的那一段 = y " + droppedFromY + " .. " + droppedToY + "（共 "
                    + (droppedFromY - droppedToY + 1) + " 层被丢下）—— 是**没读**，不是那里没有方块");
        } else {
            out.put("droppedFromY", null);
            out.put("droppedToY", null);
        }
        out.put("readFromY", Integer.valueOf(yHigh));
        out.put("readToY", rows.isEmpty() ? null : ((Map<?, ?>) rows.get(rows.size() - 1)).get("y"));
        out.put("airCount", Integer.valueOf(air));
        out.put("unknownCount", Integer.valueOf(unknown));
        out.put("nonAirCount", Integer.valueOf(nonAir));
        out.put("firstNonAirY", firstNonAirY);
        out.put("firstNonAirId", firstNonAirId);
        out.put("voidAirCount", Integer.valueOf(voidAir));
        out.put("unknownNote", UNKNOWN_ROW_NOTE);
        out.put("airIdNote", AIR_ID_NOTE);
        if (unknown > 0) {
            out.put("unknownRowsNote", "本次读的 " + rows.size() + " 层里有 " + unknown
                    + " 层取不到（id=null）—— 多半是未加载区块 / 越界 Y；这些层**不参与** firstNonAirY 判定");
        }
        if (colError != null) out.put("lastError", colError);

        // ---- 与地图高度语义的**自检口**（B① 判据用得上）----
        int top = Integer.MIN_VALUE;
        try {
            top = bridge.topSolidY(x, z);
        } catch (Throwable ignored) {
            top = Integer.MIN_VALUE;
        }
        out.put("topSolidY", top == Integer.MIN_VALUE ? null : (Object) Integer.valueOf(top));
        // **疑似未加载**的自证（真机实证 2026-11-11：距玩家 600 格的列，fabric 1.21.11 与 neoforge 1.20.1
        // **都**回 minecraft:void_air（不是 null）且 topSolidY=-65 ⇒ 适配层的区块加载判据在客户端没生效）。
        // 这里**如实点名**，别让调用方把未加载区读成「一片空气」。
        boolean allVoidAir = rows.size() > 0 && voidAir == rows.size();
        out.put("unloadedSuspect", Boolean.valueOf(allVoidAir));
        if (allVoidAir) {
            out.put("unloadedSuspectNote", "本列读到的 " + rows.size() + " 层**全部**是 minecraft:void_air"
                    + "（且 topSolidY=" + (top == Integer.MIN_VALUE ? "null" : String.valueOf(top)) + "）"
                    + " ⇒ 极可能**该区块未加载**：适配层的加载判据没生效，GameBridge#blockAt **没有**回 null"
                    + "（真机实证：距玩家 600 格的列就是这个形状）⇒ **别把这里当空气读**；"
                    + "要确认请换个近处的坐标再读一次");
        }
        Integer mapH = mapHeightAt(x, z);
        out.put("mapHeightAtColumn", mapH);
        out.put("heightCrossCheckNote",
                "topSolidY = 该列最高非空气方块的 Y（= query_map 高度字段的 h）；"
                + "mapHeightAtColumn = **本地图快照**里 (x,z) 那一格的高度（该列没被采到 / 没有图 ⇒ null）；"
                + "firstNonAirY = 本次读的窗口里最高的非空气层 ⇒ 窗口盖住地表时三者应当相等");
        return out;
    }

    /** 地图快照里 (x,z) 那一格的高度；该列没被采到 / 还没有图 ⇒ null（不编）。只读。 */
    public Integer mapHeightAt(int x, int z) {
        if (!ready) return null;
        int i = x - originX, j = z - originZ;
        if (i < 0 || j < 0) return null;
        if (step <= 0 || i % step != 0 || j % step != 0) return null;
        int col = i / step, row = j / step;
        if (col >= cols || row >= rows) return null;
        int h = heights[row * cols + col];
        return h == Integer.MIN_VALUE ? null : Integer.valueOf(h);
    }

    // ==================================================================
    // ⑥b query_blocks（按条件搜方块；**独立的分帧 job**）
    // ==================================================================
    private volatile boolean sqActive;
    private volatile boolean sqEverRan;
    /**
     * [T20-②] 本次扫描是否真有原点（读到了玩家坐标）。
     * 没有 ⇒ origin / scan.origin / scan.center / scan.y1 / scan.y2 **一律 null**，
     * 绝不回上一次扫描的原点或编一个 0,0,0（那正是「旧数据配新条件」的另一种形态）。
     */
    private volatile boolean sqHasOrigin;
    private volatile boolean sqTruncated;
    private volatile int sqCursor, sqTotalBlocks, sqBlocksDone, sqTotalCols, sqYCount;
    private volatile int sqCols, sqRadius, sqOriginX, sqOriginZ, sqCenterX, sqCenterZ, sqY1, sqY2, sqMaxMatches;
    private volatile int sqErrors, sqUnknown, sqHitCount, sqRuns, sqVoidAir;
    private volatile long sqStartedTick = -1, sqFinishedTick = -1;
    private volatile String sqLastError, sqStopReason, sqStartBlocked;
    private volatile List<String> sqFilter = new ArrayList<String>();
    private volatile boolean sqFilterDirty;
    private final List<BlockHit> sqHits = new ArrayList<BlockHit>();
    private List<String> sqFilterApplied = new ArrayList<String>();
    private double sqPx, sqPy, sqPz;

    /**
     * 起一次搜索（丢弃上一次的命中 / 进度 / **原点**）。
     *
     * <p>[T20-②] **先清后判**：任何一条早退路径（本档没有取值面 / 玩家或世界不在场 / 读不到玩家坐标）
     * 都必须先把状态落成「**本次条件 + 空命中**」再返回 —— 否则旧命中会配着新条件回出去
     * （旧实现就有这个洞：起不动时 sqHits / sqFilterApplied 仍是上一次的）。
     */
    private boolean startSearch(int radius, int yLow, int yHigh, List<String> filter, int maxMatches) {
        // ---- ① 先把「本次条件 + 空账」落到位（不依赖能不能起得来）----
        sqActive = false;
        sqEverRan = false;
        sqHasOrigin = false;
        sqStartBlocked = null;
        sqTruncated = false;
        sqStopReason = null;
        sqLastError = null;
        sqErrors = 0;
        sqUnknown = 0;
        sqHitCount = 0;
        sqVoidAir = 0;
        sqRadius = radius;
        sqY1 = yLow;
        sqY2 = yHigh;
        sqYCount = Math.max(0, yHigh - yLow + 1);
        sqCols = 2 * radius + 1;
        sqTotalCols = sqCols * sqCols;
        sqTotalBlocks = sqTotalCols * sqYCount;
        sqCursor = 0;
        sqBlocksDone = 0;
        sqMaxMatches = maxMatches;
        sqHits.clear();
        sqFilter = new ArrayList<String>(filter);
        sqFilterApplied = new ArrayList<String>(filter);
        sqFilterDirty = false;
        sqStartedTick = ticks;
        sqFinishedTick = -1;

        // ---- ② 起不动就如实记原因（命中已清空 ⇒ 不会拿旧结果冒充新条件）----
        if (!bridge.stateMapCapable() || !bridge.ready() || colPlayerXYZ() == null) {
            sqStartBlocked = SEARCH_NOT_STARTED_NOTE;
            return false;
        }
        double[] xyz = colPlayerXYZ();
        sqRuns++;
        sqActive = true;
        // **以玩家为中心**：盒 = [floor(px)-r, floor(px)+r] × [floor(pz)-r, floor(pz)+r]
        // （origin 存**最小角**；center 存玩家所在那格，两者都写进回执，别让调用方猜）。
        sqCenterX = (int) Math.floor(xyz[0]);
        sqCenterZ = (int) Math.floor(xyz[2]);
        sqOriginX = sqCenterX - radius;
        sqOriginZ = sqCenterZ - radius;
        sqPx = xyz[0];
        sqPy = xyz[1];
        sqPz = xyz[2];
        sqHasOrigin = true;
        sqEverRan = true;
        return true;
    }

    /** 客户端 tick 线程每 tick 推进一小段（**分帧**）。没有进行中的搜索 ⇒ 立即返回。 */
    private void advanceSearch() {
        if (!sqActive) return;
        int budget = SEARCH_BLOCKS_PER_TICK;
        int yCount = sqYCount;
        while (budget > 0 && sqCursor < sqTotalBlocks) {
            int col = sqCursor / yCount;
            int y = sqY1 + (sqCursor % yCount);
            int bx = sqOriginX + (col % sqCols);
            int bz = sqOriginZ + (col / sqCols);
            String id;
            try {
                id = bridge.blockAt(bx, y, bz);
            } catch (Throwable t) {
                id = null;
                sqErrors++;
                sqLastError = String.valueOf(t);
            }
            if (id == null) {
                sqUnknown++;
            } else if (isVoidAirId(id)) {
                // 客户端在**未加载**区块上会回 void_air（不是 null）⇒ 单列**如实记账**，
                // 且**不参与**任何 filter 匹配（避免把未加载区当成空气命中）。
                sqVoidAir++;
            } else if (idMatches(id, sqFilterApplied)) {
                if (sqHitCount >= sqMaxMatches) {
                    // 这一格已经读到了，但**不**收（超出 maxMatches）⇒ 记账照样 +1，再提前收工。
                    // fail-loud：truncated=true 且 complete=false（剩余区域**没扫**，不是「只有这些」）。
                    sqTruncated = true;
                    sqStopReason = SEARCH_TRUNCATED_NOTE;
                    sqCursor++;
                    sqBlocksDone++;
                    sqCursor = sqTotalBlocks;
                    break;
                }
                sqHits.add(new BlockHit(bx, y, bz, id, dist2FromOrigin(bx, y, bz)));
                sqHitCount++;
            }
            sqCursor++;
            budget--;
            sqBlocksDone++;
        }
        if (sqCursor >= sqTotalBlocks) {
            sqActive = false;
            if (sqFinishedTick < 0) sqFinishedTick = ticks;
            if (sqStopReason == null && sqTruncated) sqStopReason = SEARCH_TRUNCATED_NOTE;
        }
    }

    private double dist2FromOrigin(int x, int y, int z) {
        double dx = x + 0.5 - sqPx, dy = y + 0.5 - sqPy, dz = z + 0.5 - sqPz;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * query_blocks：按条件搜方块，**只回命中坐标**。
     *
     * <p>调用方已校验 filter 必填、把 radius / y1 / y2 / maxMatches 的缺省补好。本方法负责：
     * 起扫描（refresh 或首次）、把当前进度与**已扫范围内**的命中如实回出去。
     */
    public Map<String, Object> queryBlocks(int radiusIn, int y1In, int y2In, List<String> filter,
            int maxMatchesIn, boolean refresh) {
        int radius = radiusIn <= 0 ? SEARCH_DEFAULT_RADIUS : Math.min(radiusIn, SEARCH_MAX_RADIUS);
        int maxMatches = maxMatchesIn <= 0 ? SEARCH_DEFAULT_MAX_MATCHES : Math.min(maxMatchesIn, SEARCH_MAX_MATCHES);
        int yLow = Math.min(y1In, y2In);
        int yHigh = Math.max(y1In, y2In);
        boolean yClamped = false;
        if (yHigh - yLow + 1 > SEARCH_MAX_Y_SPAN) {
            yHigh = yLow + SEARCH_MAX_Y_SPAN - 1;
            yClamped = true;
        }
        // [T20-②] 条件签名 = (filter, radius, y1, y2, maxMatches) **规范化之后**的值。
        // 任一不同 ⇒ 与「显式 refresh」同样处理：**立即用本次条件重扫**（选项 a）。
        // 旧行为（真机实测的静默错误）：只标 filterChanged，却把上一次条件的 matches 配着新 filter 回出去。
        boolean hadRun = sqEverRan;
        boolean sameAsApplied = hadRun && sameCondition(radius, yLow, yHigh, maxMatches, filter);
        boolean conditionChanged = hadRun && !sameAsApplied;
        Map<String, Object> previousCondition = conditionChanged ? appliedConditionJson() : null;
        boolean restarted = refresh || !hadRun || conditionChanged;
        boolean started = false;
        if (restarted) {
            started = startSearch(radius, yLow, yHigh, filter, maxMatches);
        }
        sqFilterDirty = conditionChanged;

        Map<String, Object> out = new LinkedHashMap<String, Object>();
        out.put("schema", SEARCH_SCHEMA);
        out.put("filter", new ArrayList<String>(filter));
        out.put("filterNote", FILTER_NOTE);
        out.put("filterCount", Integer.valueOf(filter.size()));
        out.put("filterMax", Integer.valueOf(SEARCH_MAX_FILTERS));
        out.put("radius", Integer.valueOf(radius));
        out.put("radiusRequested", Integer.valueOf(radiusIn));
        out.put("radiusDefault", Integer.valueOf(SEARCH_DEFAULT_RADIUS));
        out.put("radiusMax", Integer.valueOf(SEARCH_MAX_RADIUS));
        if (radiusIn <= 0) {
            out.put("radiusNote", "未给 radius（或给了 ≤0）⇒ 用默认水平半径 " + SEARCH_DEFAULT_RADIUS
                    + " 格（正方形，共 " + ((2 * SEARCH_DEFAULT_RADIUS + 1) * (2 * SEARCH_DEFAULT_RADIUS + 1))
                    + " 列）");
        } else if (radiusIn > SEARCH_MAX_RADIUS) {
            out.put("radiusClampedTo", Integer.valueOf(SEARCH_MAX_RADIUS));
            out.put("radiusNote", "radius=" + radiusIn + " 超过硬上限 " + SEARCH_MAX_RADIUS
                    + " ⇒ 夹到 " + SEARCH_MAX_RADIUS + "（如实回 radiusClampedTo，不静默）");
        }
        out.put("y1", Integer.valueOf(yLow));
        out.put("y2", Integer.valueOf(yHigh));
        out.put("y1Requested", Integer.valueOf(y1In));
        out.put("y2Requested", Integer.valueOf(y2In));
        out.put("ySpanMax", Integer.valueOf(SEARCH_MAX_Y_SPAN));
        if (yHigh != Math.max(y1In, y2In)) {
            out.put("yClampedTo", yLow + ".." + yHigh);
            out.put("yNote", "y 跨度超过硬上限 " + SEARCH_MAX_Y_SPAN + " 层 ⇒ 从上面裁到 [" + yLow + ".." + yHigh
                    + "]（如实回 yClampedTo，不静默）");
        } else if (y1In > y2In) {
            out.put("ySwapNote", "调用方给的 y1=" + y1In + " > y2=" + y2In + " ⇒ 按 [yLow..yHigh] 读");
        }
        out.put("maxMatches", Integer.valueOf(maxMatches));
        out.put("maxMatchesRequested", Integer.valueOf(maxMatchesIn));
        out.put("maxMatchesDefault", Integer.valueOf(SEARCH_DEFAULT_MAX_MATCHES));
        out.put("maxMatchesMax", Integer.valueOf(SEARCH_MAX_MATCHES));
        if (maxMatchesIn <= 0) {
            out.put("maxMatchesNote", "未给 maxMatches（或给了 ≤0）⇒ 用默认 " + SEARCH_DEFAULT_MAX_MATCHES);
        } else if (maxMatchesIn > SEARCH_MAX_MATCHES) {
            out.put("maxMatchesClampedTo", Integer.valueOf(SEARCH_MAX_MATCHES));
            out.put("maxMatchesNote", "maxMatches=" + maxMatchesIn + " 超过硬上限 " + SEARCH_MAX_MATCHES
                    + " ⇒ 夹到 " + SEARCH_MAX_MATCHES + "（如实回 maxMatchesClampedTo，不静默）");
        }
        out.put("refreshRequested", Boolean.valueOf(refresh));
        out.put("restarted", Boolean.valueOf(restarted));
        out.put("reused", Boolean.valueOf(!restarted));
        out.put("scanStarted", Boolean.valueOf(started));
        if (conditionChanged) {
            out.put("restartedReason", "condition_changed");
            out.put("conditionChanged", Boolean.TRUE);
            out.put("previousCondition", previousCondition);
        } else if (refresh) {
            out.put("restartedReason", "refresh_requested");
            out.put("restartedNote", SEARCH_REFRESH_NOTE);
        } else if (!hadRun) {
            out.put("restartedReason", "first_run");
            out.put("restartedNote", "本会话还没有过扫描 ⇒ 直接起一轮（restartedReason=first_run）。");
        } else {
            out.put("restartedReason", null);
            out.put("reusedNote", SEARCH_REUSED_NOTE);
        }

        Map<String, Object> origin = new LinkedHashMap<String, Object>();
        // [T20-②] 没有本次原点（扫描没起得来）⇒ 一律 null：**绝不**回上一次扫描的原点或编 0,0,0。
        origin.put("x", sqHasOrigin ? Double.valueOf(round3(sqPx)) : null);
        origin.put("y", sqHasOrigin ? Double.valueOf(round3(sqPy)) : null);
        origin.put("z", sqHasOrigin ? Double.valueOf(round3(sqPz)) : null);
        origin.put("block", sqHasOrigin ? xy(sqCenterX, sqCenterZ) : null);
        origin.put("boxMin", sqHasOrigin ? xy(sqOriginX, sqOriginZ) : null);
        origin.put("boxMax", sqHasOrigin ? xy(sqOriginX + 2 * sqRadius, sqOriginZ + 2 * sqRadius) : null);
        origin.put("available", Boolean.valueOf(sqHasOrigin));
        origin.put("note", sqHasOrigin
                ? "x/y/z = **本次扫描开始那一刻**的玩家位置（dist 的基准）；"
                + "block = 玩家所在那格；boxMin/boxMax = 扫描盒的两个角（水平面，闭区间，以玩家那格为中心）"
                : "本次扫描**没有起点**（起不动：见 scanNote）⇒ 各字段一律 null（不编 0,0,0）");
        out.put("origin", origin);
        out.put("orderNote", SEARCH_SORT_NOTE);

        List<Object> matches = sortedMatches();
        out.put("matches", matches);
        out.put("matched", Integer.valueOf(matches.size()));
        out.put("truncated", Boolean.valueOf(sqTruncated));
        if (sqTruncated) out.put("truncatedNote", SEARCH_TRUNCATED_NOTE);
        // [T22] 截断契约：把「扫完了没有」与「为什么停」提到**顶层**（scan.complete 仍在，语义一致），
        //   complete=false 时**明说还剩多少格没扫**（绝不把提前停读成扫完了）。
        boolean complete = searchComplete();
        int remaining = Math.max(0, sqTotalBlocks - sqBlocksDone);
        out.put("complete", Boolean.valueOf(complete));
        out.put("stoppedBy", searchStoppedBy());
        out.put("remainingBlocks", Integer.valueOf(remaining));
        out.put("completeNote", SEARCH_COMPLETE_NOTE);
        if (!complete) out.put("completeReasonNote", searchCompleteNote(remaining));
        out.put("scan", searchScanJson());
        if (!sqEverRan) {
            out.put("scanNote", sqStartBlocked == null ? SEARCH_NOT_STARTED_NOTE : sqStartBlocked);
        }
        if (conditionChanged) {
            // 旧行为下这里配的是**旧条件的 matches**（真机实测的静默错误）；现在 matches 已来自新条件的新一轮。
            out.put("filterChanged", Boolean.TRUE);
            out.put("filterChangedNote", SEARCH_RESTARTED_NOTE);
        }
        if (matches.isEmpty() && !conditionChanged) {
            out.put("matchNote", sqActive ? SEARCH_EMPTY_NOTE + "（注意：扫描**还在进行中**，后面可能还有命中）"
                    : SEARCH_EMPTY_NOTE);
        }
        return out;
    }

    /**
     * [T20-②] **完整的条件签名**比较（不是只看 filter）：filter + radius + y1 + y2 + maxMatches。
     *
     * <p>为什么必须全比：真机实测过「只换 radius / y1 / y2 而不带 refresh」也会把旧结果配着新条件的
     * 回显回出去（旧实现只比 filter，其它旋钮根本没进判据）。
     */
    private boolean sameCondition(int radius, int yLow, int yHigh, int maxMatches, List<String> filter) {
        return radius == sqRadius && yLow == sqY1 && yHigh == sqY2
                && maxMatches == sqMaxMatches && sameFilter(filter, sqFilterApplied);
    }

    /** [T20-②] 上一次扫描**实际用的**条件（原样回给调用方供核对，**不猜**）。 */
    private Map<String, Object> appliedConditionJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("filter", new ArrayList<String>(sqFilterApplied));
        m.put("radius", Integer.valueOf(sqRadius));
        m.put("y1", Integer.valueOf(sqY1));
        m.put("y2", Integer.valueOf(sqY2));
        m.put("maxMatches", Integer.valueOf(sqMaxMatches));
        m.put("scannedBlocks", Integer.valueOf(sqBlocksDone));
        m.put("hits", Integer.valueOf(sqHitCount));
        return m;
    }

    /** 两个 filter 列表是否逐字相同（trim + 小写后比；顺序无关）。 */
    static boolean sameFilter(List<String> a, List<String> b) {
        java.util.List<String> na = normFilter(a), nb = normFilter(b);
        if (na.size() != nb.size()) return false;
        for (String s : na) if (!nb.contains(s)) return false;
        return true;
    }

    private static java.util.List<String> normFilter(List<String> in) {
        java.util.List<String> out = new ArrayList<String>();
        if (in == null) return out;
        for (String s : in) {
            if (s == null) continue;
            String t = s.trim().toLowerCase(java.util.Locale.ROOT);
            if (!t.isEmpty() && !out.contains(t)) out.add(t);
        }
        return out;
    }

    /** 命中按与扫描原点的距离由近到远排序（并列按 (x,y,z) 升序 ⇒ 可复现）。 */
    private List<Object> sortedMatches() {
        List<BlockHit> copy = new ArrayList<BlockHit>(sqHits);
        java.util.Collections.sort(copy, new java.util.Comparator<BlockHit>() {
            public int compare(BlockHit a, BlockHit b) {
                if (a.dist2 < b.dist2) return -1;
                if (a.dist2 > b.dist2) return 1;
                if (a.y != b.y) return a.y - b.y;
                if (a.x != b.x) return a.x - b.x;
                return a.z - b.z;
            }
        });
        List<Object> out = new ArrayList<Object>();
        for (BlockHit h : copy) {
            Map<String, Object> one = new LinkedHashMap<String, Object>();
            one.put("x", Integer.valueOf(h.x));
            one.put("y", Integer.valueOf(h.y));
            one.put("z", Integer.valueOf(h.z));
            one.put("id", h.id);
            one.put("dist", Double.valueOf(round3(Math.sqrt(h.dist2))));
            out.add(one);
        }
        return out;
    }

    private Map<String, Object> searchScanJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("active", Boolean.valueOf(sqActive));
        m.put("complete", Boolean.valueOf(!sqActive && !sqTruncated && sqTotalBlocks > 0
                && sqBlocksDone >= sqTotalBlocks));
        m.put("doneBlocks", Integer.valueOf(sqBlocksDone));
        m.put("totalBlocks", Integer.valueOf(sqTotalBlocks));
        m.put("doneCols", Integer.valueOf(sqYCount <= 0 ? 0 : sqBlocksDone / sqYCount));
        m.put("totalCols", Integer.valueOf(sqTotalCols));
        m.put("radius", Integer.valueOf(sqRadius));
        m.put("cols", Integer.valueOf(sqCols));
        // [T20-②] 没有本次原点 ⇒ 一律 null（绝不回上一次的原点 / 编 0,0,0）。
        m.put("origin", sqHasOrigin ? xy(sqOriginX, sqOriginZ) : null);
        m.put("originNote", "origin = 扫描盒的**最小角**（min corner，含）；盒 = [origin.x, origin.x+cols-1] × [origin.z, origin.z+cols-1]");
        m.put("center", sqHasOrigin ? xy(sqCenterX, sqCenterZ) : null);
        m.put("y1", sqHasOrigin ? Integer.valueOf(sqY1) : null);
        m.put("y2", sqHasOrigin ? Integer.valueOf(sqY2) : null);
        m.put("blocksPerTick", Integer.valueOf(SEARCH_BLOCKS_PER_TICK));
        m.put("startedTick", sqStartedTick < 0 ? null : Long.valueOf(sqStartedTick));
        m.put("finishedTick", sqFinishedTick < 0 ? null : Long.valueOf(sqFinishedTick));
        m.put("runs", Integer.valueOf(sqRuns));
        m.put("hits", Integer.valueOf(sqHitCount));
        m.put("errors", Integer.valueOf(sqErrors));
        m.put("unknownBlocks", Integer.valueOf(sqUnknown));
        m.put("voidAirBlocks", Integer.valueOf(sqVoidAir));
        if (sqVoidAir > 0) {
            m.put("voidAirNote", "有 " + sqVoidAir + " 格读到 minecraft:void_air ⇒ 这些格**疑似未加载**"
                    + "（适配层没回 null），已**不参与**任何 filter 匹配、只记进本计数");
        }
        m.put("stopReason", sqStopReason);
        m.put("filterApplied", new ArrayList<String>(sqFilterApplied));
        if (sqLastError != null) m.put("lastError", sqLastError);
        m.put("note", SEARCH_SCAN_NOTE);
        return m;
    }

    /**
     * [T22] {@code complete}：仅当**本轮扫描真的起了、已停、没被 maxMatches 截断、且整盒都扫完**。
     * 与 {@code scan.complete} 同一个判据（这里提到顶层给调用方，免得钻进 scan 段读错）。
     * 扫描没起（{@code sqEverRan=false}）⇒ 恒 false（**不假装扫完了**）。
     */
    private boolean searchComplete() {
        return sqEverRan && !sqActive && !sqTruncated
                && sqTotalBlocks > 0 && sqBlocksDone >= sqTotalBlocks;
    }

    /**
     * [T22] {@code stoppedBy}：为什么这一轮没扫完（或没起）。取值见 {@link #SEARCH_COMPLETE_NOTE}。
     * 自然扫完 ⇒ {@code null}。
     */
    private String searchStoppedBy() {
        if (!sqEverRan) return "notStarted";
        if (sqTruncated) return "maxMatches";
        if (sqActive) return "scanning";
        if (sqBlocksDone < sqTotalBlocks) return "aborted";
        return null;
    }

    /** [T22] {@code complete=false} 时的人话（明说还剩多少格没扫 + 这一轮为什么停）。 */
    private String searchCompleteNote(int remaining) {
        if (!sqEverRan) {
            return "扫描**没有起**（见 scanNote）⇒ 无从谈 complete；remainingBlocks=" + remaining
                    + " 是整盒格数（**一格都没扫**）";
        }
        if (sqTruncated) {
            return SEARCH_TRUNCATED_NOTE + "（remainingBlocks=" + remaining + " = **没扫**的格数，"
                    + "不是命中数；调大 maxMatches 并 refresh=true 可继续）";
        }
        if (sqActive) {
            return "扫描**还在进行中**（scan.active=true，stoppedBy=scanning）⇒ 剩余 " + remaining
                    + " 格还没扫；条件不变继续轮询即可（续扫，不重置进度）";
        }
        return "扫描被**中止**（玩家 / 世界离场导致 scan.active=false，stoppedBy=aborted）⇒ 剩余 "
                + remaining + " 格没扫；回到世界后条件不变会继续（或 refresh=true 重扫）";
    }

    /** 只读自报（给 /status；**不碰 MC、不碰命中列表**，HTTP 线程也能读）。 */
    public Map<String, Object> blockSearchStatus() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("capable", Boolean.valueOf(bridge.stateMapCapable()));
        m.put("everRan", Boolean.valueOf(sqEverRan));
        m.put("active", Boolean.valueOf(sqActive));
        m.put("doneBlocks", Integer.valueOf(sqBlocksDone));
        m.put("totalBlocks", Integer.valueOf(sqTotalBlocks));
        m.put("hits", Integer.valueOf(sqHitCount));
        m.put("truncated", Boolean.valueOf(sqTruncated));
        m.put("runs", Integer.valueOf(sqRuns));
        m.put("radius", Integer.valueOf(sqRadius));
        m.put("y1", Integer.valueOf(sqY1));
        m.put("y2", Integer.valueOf(sqY2));
        m.put("blocksPerTick", Integer.valueOf(SEARCH_BLOCKS_PER_TICK));
        m.put("filterApplied", new ArrayList<String>(sqFilterApplied));
        m.put("startedTick", sqStartedTick < 0 ? null : Long.valueOf(sqStartedTick));
        m.put("finishedTick", sqFinishedTick < 0 ? null : Long.valueOf(sqFinishedTick));
        m.put("startBlocked", sqStartBlocked);
        m.put("note", "query_blocks 是**独立的分帧 job**：与地图扫描共用 tick 线程但字段完全分开，"
                + "绝不动地图的分帧 / 版本 / 码表语义；本段只读缓存（不碰 MC）");
        return m;
    }

    // ---- query_column / query_blocks 的小工具 ----

    /** 玩家 (x,y,z)；缺任一 ⇒ null（**不编 0**）。 */
    private double[] colPlayerXYZ() {
        Map<String, Object> st;
        try {
            st = Json.parseObject(bridge.playerStateJson());
        } catch (RuntimeException e) {
            return null;
        }
        Double x = dbl(st.get("x")), y = dbl(st.get("y")), z = dbl(st.get("z"));
        if (x == null || y == null || z == null) return null;
        return new double[] { x.doubleValue(), y.doubleValue(), z.doubleValue() };
    }

    /** 该 id 算不算「空气」（口径写进回执头的 airIdNote）。 */
    static boolean isAirId(String id) {
        if (id == null) return false;
        if (id.endsWith(":air") || id.endsWith(":cave_air") || id.endsWith(":void_air")) return true;
        return "air".equals(id) || "cave_air".equals(id) || "void_air".equals(id);
    }

    /** 该 id 是不是「虚空空气」（客户端在**未加载**区块上会回它，而不是 null）。 */
    static boolean isVoidAirId(String id) {
        if (id == null) return false;
        return id.endsWith(":void_air") || "void_air".equals(id);
    }

    /** 命中判定：filter 里任一 pattern 命中即算命中（口径见 {@link #FILTER_NOTE}）。 */
    static boolean idMatches(String id, List<String> patterns) {
        if (id == null || patterns == null) return false;
        String full = id.toLowerCase(java.util.Locale.ROOT);
        String path = full;
        int c = full.indexOf(':');
        if (c >= 0 && c + 1 < full.length()) path = full.substring(c + 1);
        for (String raw : patterns) {
            if (raw == null) continue;
            String p = raw.trim().toLowerCase(java.util.Locale.ROOT);
            if (p.isEmpty()) continue;
            if (globMatch(p, full)) return true;
            if (p.indexOf(':') < 0 && globMatch(p, path)) return true;
        }
        return false;
    }

    /** 极简 glob：* 通配任意（可空）子串；其余字符字面比较（**不是**正则）。两个串都应当已小写化。 */
    static boolean globMatch(String pat, String text) {
        int p = 0, t = 0, star = -1, mark = 0;
        while (t < text.length()) {
            if (p < pat.length() && pat.charAt(p) == '*') {
                star = p++;
                mark = t;
            } else if (p < pat.length() && pat.charAt(p) == text.charAt(t)) {
                p++;
                t++;
            } else if (star >= 0) {
                p = star + 1;
                t = ++mark;
            } else {
                return false;
            }
        }
        while (p < pat.length() && pat.charAt(p) == '*') p++;
        return p == pat.length();
    }

    /** 一条命中（坐标 + id + 与扫描原点的距离平方）。 */
    private static final class BlockHit {
        final int x, y, z;
        final String id;
        final double dist2;

        BlockHit(int x, int y, int z, String id, double dist2) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.id = id;
            this.dist2 = dist2;
        }
    }
}
