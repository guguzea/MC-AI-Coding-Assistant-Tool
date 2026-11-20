package com.bandd.playtest.core;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 「游戏状态器」的**全部可调项集中在这一个类里**（T3 的设置页面只需要接这一个类）。
 *
 * <p>为什么单独一个类：状态器的行为全是旋钮（多久重采一次 / 半径多大 / 采样多密 /
 * 一张图最多多少字符 / 要不要高度 / 玩家怎么标），散落在 {@link GameStateService} 里就没法
 * 让设置界面「一处读、一处写」。本类只放**纯数据**，不含任何逻辑与时序 —— 逻辑在
 * {@link GameStateService}，本轮**不做**界面。
 *
 * <p>**默认值即用户拍板口径**：{@code chunkRadius = 1} ⇒ 玩家所在区块 ±1 ⇒ **3×3 区块 = 48×48 格**。
 *
 * <p>本类 **Java 8 兼容**（core 与 54 个老档共用同一份源码 ⇒ 不许用 record / var / List.of）。
 */
public final class StateConfig {

    // ---- 刷新与范围 ----
    /** 主动重采间隔（客户端 tick 数）。默认 40 = 2s。 */
    public int refreshIntervalTicks = 40;
    /** 地图半径（**区块**数）。1 = 3×3 区块 = 48×48 格（默认，= 用户拍板口径）。 */
    public int chunkRadius = 1;

    // ---- 采样与容量 ----
    /** 采样步长（格）：1 = 逐格；2 = 隔一格采一格。会**逐字写进地图头**的 {@code step}。 */
    public int step = 1;
    /** 分帧预算：每个客户端 tick 最多扫多少**格**。绝不一次全扫（会卡 tick 线程）。 */
    public int columnsPerTick = 128;
    /** 单次回执里**地图网格正文**的字符上限（不含头/图例；头里逐字写 {@code maxChars}）。 */
    public int maxChars = 12000;
    /** 自动降采样的最大步长；到这个步长还超 {@code maxChars} ⇒ 按行截断并写 {@code truncated:true}。 */
    public int maxAutoStep = 4;

    // ---- 内容开关 ----
    /** 每格是否带高度数字（关掉 ⇒ 每格只有 1 个方块码字符）。 */
    public boolean includeHeight = true;
    /**
     * 是否在地图上**叠加实体层**（{@code entityGrid} + {@code entityLegend} + {@code entities[]}）。
     *
     * <p>**已实现**（2026-11-11）：默认 false = 不叠加；打开后地图头里多一层**独立**的
     * 定宽字符网格（与 {@code grid} 同几何），**方块层一个字符都不受影响**（方格码只出现在
     * {@code grid} 里）。每个调用还可以用参数 {@code entities=true|false} **只覆盖本次**
     * （见 {@code query_map}/{@code query_state}）。本档没实现实体扫描面
     * （{@code GameBridge#nearbyEntitiesJson} 回 null）⇒ 地图头如实写 {@code entitiesIncluded:false}
     * 与 {@code entitiesNote}，**不假装有实体层**。
     */
    public boolean includeEntities = false;

    // ---- [T16] 纵层 yMode 的配置默认（四个旋钮进设置页；每次调用仍可用同名参数**只覆盖本次**）----
    /** 地下自动切层总开关（默认 true）。关掉 ⇒ 不给 yMode 时一律 surface（不再自动切层）。 */
    public boolean yModeAuto = true;
    /** 自动切层的地下判据：playerDepthBelowSurface ≥ 此值 ⇒ 默认改用 player 纵层（默认 3）。 */
    public int yModeAutoDepth = 3;
    /** 一次请求采样的层数上限（默认 8；**硬上限 16** —— 超过一律拒，设置面不静默夹回）。 */
    public int yLayerMax = 8;
    /** 自动切层 / player 模式省略 yRange 时的 dy 半径（±N ⇒ 2N+1 层；默认 2）。 */
    public int yAutoRange = 2;

    // ---- 渲染字符 ----
    /** 玩家所在格的标记字符（画在玩家那格，代替方块码）。 */
    public char playerMark = '+';
    /** 未知格（{@code blockAt} 回 null：越界 / 未加载 / 本档不支持）的方块码。 */
    public char unknownCode = '?';
    /** 码位用完后的「其它」码（图例里另附 {@code legendOverflow} 列出真实 id）。 */
    public char overflowCode = '#';
    /** 方块码候选字符表（每个码**恰好 1 字符** ⇒ 网格固定宽度不靠空格对齐）。 */
    public String palette = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    /** 高度字段最小宽度（实际宽度由本图 yMin/yMax 决定，只增不减）。 */
    public int minHeightWidth = 1;

    public StateConfig() {
    }

    public StateConfig(StateConfig other) {
        this.refreshIntervalTicks = other.refreshIntervalTicks;
        this.chunkRadius = other.chunkRadius;
        this.step = other.step;
        this.columnsPerTick = other.columnsPerTick;
        this.maxChars = other.maxChars;
        this.maxAutoStep = other.maxAutoStep;
        this.includeHeight = other.includeHeight;
        this.includeEntities = other.includeEntities;
        this.yModeAuto = other.yModeAuto;
        this.yModeAutoDepth = other.yModeAutoDepth;
        this.yLayerMax = other.yLayerMax;
        this.yAutoRange = other.yAutoRange;
        this.playerMark = other.playerMark;
        this.unknownCode = other.unknownCode;
        this.overflowCode = other.overflowCode;
        this.palette = other.palette;
        this.minHeightWidth = other.minHeightWidth;
    }

    /** 地图边长（格）= (2×半径区块 + 1) × 16。默认 = 48。 */
    public int mapSideBlocks() {
        return (2 * chunkRadius + 1) * 16;
    }

    /**
     * 把外部（配置文件 / 设置界面）塞进来的值夹到安全范围。
     * 为什么必须夹：这些值直接决定「每 tick 扫多少格」与「回执多大」，
     * 一个 0 或负数会让扫描永不推进或死循环。
     */
    public void sanitize() {
        if (refreshIntervalTicks < 1) refreshIntervalTicks = 1;
        if (chunkRadius < 0) chunkRadius = 0;
        if (chunkRadius > 8) chunkRadius = 8;
        if (step < 1) step = 1;
        if (step > 16) step = 16;
        if (columnsPerTick < 1) columnsPerTick = 1;
        if (columnsPerTick > 4096) columnsPerTick = 4096;
        if (maxChars < 64) maxChars = 64;
        if (maxChars > 200000) maxChars = 200000;
        if (maxAutoStep < step) maxAutoStep = step;
        if (maxAutoStep > 64) maxAutoStep = 64;
        if (minHeightWidth < 1) minHeightWidth = 1;
        if (minHeightWidth > 4) minHeightWidth = 4;
        // [T16] 纵层四个旋钮的文件面夹取（设置面 settings_set 更严：越界直接拒，见 SettingsEdit）。
        if (yModeAutoDepth < 1) yModeAutoDepth = 1;
        if (yModeAutoDepth > 256) yModeAutoDepth = 256;
        if (yLayerMax < 1) yLayerMax = 1;
        if (yLayerMax > 16) yLayerMax = 16;          // 硬上限：与 GameStateService.Y_LAYER_HARD_MAX 同值
        if (yAutoRange < 0) yAutoRange = 0;
        if (yAutoRange > 64) yAutoRange = 64;
        if (palette == null || palette.isEmpty()) palette = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < palette.length(); i++) {
            char c = palette.charAt(i);
            if (c != playerMark && c != unknownCode && c != overflowCode
                    && b.indexOf(String.valueOf(c)) < 0) {
                b.append(c);
            }
        }
        if (b.length() == 0) b.append("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        palette = b.toString();
    }

    /** 供设置界面 / 状态自报读出的形状（字段名即旋钮名）。 */
    public Map<String, Object> toJson() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("refreshIntervalTicks", refreshIntervalTicks);
        m.put("chunkRadius", chunkRadius);
        m.put("mapSideBlocks", mapSideBlocks());
        m.put("step", step);
        m.put("columnsPerTick", columnsPerTick);
        m.put("maxChars", maxChars);
        m.put("maxAutoStep", maxAutoStep);
        m.put("includeHeight", includeHeight);
        m.put("includeEntities", includeEntities);
        m.put("yModeAuto", Boolean.valueOf(yModeAuto));
        m.put("yModeAutoDepth", Integer.valueOf(yModeAutoDepth));
        m.put("yLayerMax", Integer.valueOf(yLayerMax));
        m.put("yAutoRange", Integer.valueOf(yAutoRange));
        m.put("playerMark", String.valueOf(playerMark));
        m.put("unknownCode", String.valueOf(unknownCode));
        m.put("overflowCode", String.valueOf(overflowCode));
        m.put("palette", palette);
        m.put("minHeightWidth", minHeightWidth);
        return m;
    }

    /** 设置界面回写用：只认已知键，缺键保持原值，最后自动 {@link #sanitize()}。 */
    public void applyJson(Map<String, Object> m) {
        if (m == null) return;
        if (m.containsKey("refreshIntervalTicks")) refreshIntervalTicks = intOf(m.get("refreshIntervalTicks"), refreshIntervalTicks);
        if (m.containsKey("chunkRadius")) chunkRadius = intOf(m.get("chunkRadius"), chunkRadius);
        if (m.containsKey("step")) step = intOf(m.get("step"), step);
        if (m.containsKey("columnsPerTick")) columnsPerTick = intOf(m.get("columnsPerTick"), columnsPerTick);
        if (m.containsKey("maxChars")) maxChars = intOf(m.get("maxChars"), maxChars);
        if (m.containsKey("maxAutoStep")) maxAutoStep = intOf(m.get("maxAutoStep"), maxAutoStep);
        if (m.containsKey("includeHeight")) includeHeight = boolOf(m.get("includeHeight"), includeHeight);
        if (m.containsKey("includeEntities")) includeEntities = boolOf(m.get("includeEntities"), includeEntities);
        if (m.containsKey("yModeAuto")) yModeAuto = boolOf(m.get("yModeAuto"), yModeAuto);
        if (m.containsKey("yModeAutoDepth")) yModeAutoDepth = intOf(m.get("yModeAutoDepth"), yModeAutoDepth);
        if (m.containsKey("yLayerMax")) yLayerMax = intOf(m.get("yLayerMax"), yLayerMax);
        if (m.containsKey("yAutoRange")) yAutoRange = intOf(m.get("yAutoRange"), yAutoRange);
        if (m.containsKey("minHeightWidth")) minHeightWidth = intOf(m.get("minHeightWidth"), minHeightWidth);
        if (m.containsKey("palette")) {
            Object v = m.get("palette");
            if (v != null) palette = String.valueOf(v);
        }
        Character pc = charOf(m.get("playerMark"));
        if (pc != null) playerMark = pc.charValue();
        Character uc = charOf(m.get("unknownCode"));
        if (uc != null) unknownCode = uc.charValue();
        Character oc = charOf(m.get("overflowCode"));
        if (oc != null) overflowCode = oc.charValue();
        sanitize();
    }

    private static int intOf(Object v, int dflt) {
        if (v instanceof Number) return ((Number) v).intValue();
        if (v instanceof String) {
            try {
                return (int) Double.parseDouble(((String) v).trim());
            } catch (NumberFormatException e) {
                return dflt;
            }
        }
        return dflt;
    }

    private static boolean boolOf(Object v, boolean dflt) {
        if (v instanceof Boolean) return ((Boolean) v).booleanValue();
        if (v instanceof String) return Boolean.parseBoolean((String) v);
        return dflt;
    }

    private static Character charOf(Object v) {
        if (v == null) return null;
        String s = String.valueOf(v);
        return s.isEmpty() ? null : Character.valueOf(s.charAt(0));
    }
}
