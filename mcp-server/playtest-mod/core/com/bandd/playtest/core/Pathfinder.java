package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

/**
 * **真寻路**（A*）：在「玩家脚所在的那一格」构成的格图上搜索，避开岩浆 / 水 / 火 / 仙人掌 /
 * 甜浆果 / 粉雪 / 悬崖 / 窒息位。
 *
 * <h3>为什么在 core 里、且一个 {@code net.minecraft.*} 都不许出现</h3>
 * 判据必须能在**纯离线桩**上跑（造几张固定小地图，断言"绝不穿岩浆""不跳断崖""未知区域不走"）。
 * 真机验不出这些 —— 随机地形里你没法断言"这条 7 格的路一定存在"。所以方块信息全部经
 * {@link GameBridge#blockAt} 流进来，本类只认字符串 id 与 {@link DangerTable} 的分类。
 *
 * <h3>格图约定（与 {@link DangerTable} 同一套）</h3>
 * 「站在 (x,y,z)」= 脚在 (x,y,z)、头在 (x,y+1,z)、地板在 (x,y-1,z)。一次移动要同时满足：
 * <pre>
 *   脚下那格（y-1）  = 实心（SOLID / MAGMA）        —— 踩得实
 *   脚那格（y）      = PASSABLE（或已许可的水）      —— 放得进身体
 *   头那格（y+1）    = PASSABLE                      —— **头顶必须留 2 格**（防窒息）
 * </pre>
 * 未知（{@code blockAt} 回 null）**一格都不许走** —— 这是上一次 {@code void_air} 那个坑的同类：
 * 未加载区块被读成一片空气 ⇒ 地图上画出一片"能走"的假地面。
 *
 * <h3>移动集（只有 4 个水平方向，**没有对角**）</h3>
 * 对角移动会从两个方块的接触角"切过去"，那条缝在原版里其实过不去 —— 少一类假阳性比多一条捷径值。
 *
 * <h3>落差：默认允许 ≤3 格</h3>
 * 原版摔落伤害从 **4 格**起算（{@link DangerTable#fallDamage(int)} 有字节码出处）。
 * 所以默认 {@code maxFall=3}；要 &gt;3 必须显式给 {@code allow:["fall"]} + {@code maxFall}。
 *
 * <h3>预算与"如实报"</h3>
 * {@code maxNodes}（默认 20000）与 {@code maxMillis}（默认 2000）任一耗尽 ⇒
 * {@link #BUDGET}，**绝不**把"没搜完"说成"到不了"、更不会说成"到了"。
 *
 * <p>Java 8 可用（本类无任何 MC / 加载器类型）。
 */
public final class Pathfinder {

    // ==================================================================
    // 停止理由（回执里的 stopReason，一字不改）
    // ==================================================================
    /** 真的到了（位置与目标的距离 ≤ tolerance）。**只有执行器能下这个结论**。 */
    public static final String REACHED = "REACHED";
    /** 走满了 {@code maxTicks} 还没到。 */
    public static final String MAX_TICKS = "MAX_TICKS";
    /** 前面确实过不去（无路可走，且不是预算耗尽）。 */
    public static final String BLOCKED = "BLOCKED";
    /** 路线必须穿过**未许可**的危险格 ⇒ 停住，把代价如实报给调用方。 */
    public static final String DANGER = "DANGER";
    /** 不在世界里 / 读不到玩家 / 起点站不住。 */
    public static final String NOT_IN_WORLD = "NOT_IN_WORLD";
    /** 搜索预算（节点数 / 毫秒）耗尽 —— **不是**"到不了"。 */
    public static final String BUDGET = "BUDGET";
    /** 血量跌破 {@code minHp} ⇒ 主动撤回。 */
    public static final String DANGER_RETREAT = "DANGER_RETREAT";
    /** {@code plan_only:true}：只算路不动人。 */
    public static final String PLANNED = "PLANNED";

    /** 全部 stopReason 取值（供单测与文档自检）。 */
    public static final List<String> STOP_REASONS = java.util.Collections.unmodifiableList(
            java.util.Arrays.asList(REACHED, MAX_TICKS, BLOCKED, DANGER, NOT_IN_WORLD,
                    BUDGET, DANGER_RETREAT, PLANNED));

    // ==================================================================
    // 预算默认值
    // ==================================================================
    public static final int DEFAULT_MAX_NODES = 20000;
    public static final long DEFAULT_MAX_MILLIS = 2000L;
    /** 默认允许的落差（格）。4 格起才有摔落伤害 ⇒ 3 是"零伤害"的上界。 */
    public static final int DEFAULT_MAX_FALL = 3;
    /** {@code fall} 许可下 {@code maxFall} 的硬上限（再高就不是"走"了）。 */
    public static final int MAX_FALL_HARD = 64;
    /** 单次搜索里搭桥 / 挖道的次数上限（防"一路搭过去"把预算烧光）。 */
    public static final int DEFAULT_MAX_BRIDGE = 8;
    public static final int DEFAULT_MAX_DIG = 8;

    /** {@code allow} 集合的合法元素（**逐类许可，不是一个大开关**）。 */
    public static final List<String> ALLOW_KINDS = java.util.Collections.unmodifiableList(
            java.util.Arrays.asList("water", "fall", "fire", "cactus", "sweetBerry",
                    "powderSnow", "magma", "witherRose", "bridge", "dig", "probe"));

    private Pathfinder() {
    }

    // ==================================================================
    // 配置
    // ==================================================================

    /** 一次寻路的全部旋钮。寻路期间只读。 */
    public static final class Config {
        public int maxNodes = DEFAULT_MAX_NODES;
        public long maxMillis = DEFAULT_MAX_MILLIS;
        /** 许可集合（元素见 {@link #ALLOW_KINDS}）。**默认只含水**：水能游，其余要显式开。 */
        public final Set<String> allow = new HashSet<String>();
        /** 允许的最大落差（格）。只有 {@code allow} 含 "fall" 时才会 &gt;3。 */
        public int maxFall = DEFAULT_MAX_FALL;
        /** 允许上跳（1 格台阶在 MC 里真的需要跳）。默认 false。 */
        public boolean allowJump = false;
        public int maxBridge = DEFAULT_MAX_BRIDGE;
        public int maxDig = DEFAULT_MAX_DIG;
        public boolean allowProbe = false;
        /** 到点判据（格）。 */
        public double tolerance = 1.0;
        /**
         * **搜索窗口半径**（格）：只在「起点↔终点包围盒」各向外扩这么多格的范围内搜。
         *
         * <p>为什么必须有它：没有窗口时，一片开阔地上被一道无限长的墙挡住，A* 会把整片
         * 平坦地面全搜一遍 —— 那不是"到不了"，是"往无穷远处找"。真机上一次 walk_to 也不该
         * 去考虑 200 格外的路。窗口内搜完仍无路 ⇒ {@link #BLOCKED}（**已确实搜过**），
         * 窗口外一律不看，回执的 {@code note} 里如实写窗口有多大。
         */
        public int windowRadius = 64;

        public Config() {
            allow.add("water");     // 水默认允许（可游泳），回执里报 swimTicks
        }

        public boolean allows(String kind) {
            return allow.contains(kind);
        }
    }

    // ==================================================================
    // 结果
    // ==================================================================

    /** 路径上的一格（含它为什么危险）。 */
    public static final class Cell {
        public final int x;
        public final int y;
        public final int z;
        public final String block;
        public final int kind;
        /** 这一步是否**需要许可**才敢走（水/火/…）；false = 完全无害。 */
        public final boolean hazard;

        Cell(int x, int y, int z, String block, int kind, boolean hazard) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.block = block;
            this.kind = kind;
            this.hazard = hazard;
        }

        public String kindName() {
            return DangerTable.kindName(kind);
        }

        public String xyz() {
            return "(" + x + "," + y + "," + z + ")";
        }
    }

    /** 寻路结果。 */
    public static final class Result {
        /** 真的算出了一条**可行**路线（≠"人到了"）。 */
        public boolean found;
        public String stopReason = BLOCKED;
        /** 人话说明（进回执）。 */
        public String note;
        /** 路点（含起点与终点；每个元素是脚所在格）。 */
        public final List<Cell> path = new ArrayList<Cell>();
        /** 路径长度（格；水平 1、每抬升/下落 1 格按 dy 折进斜距）。 */
        public double length;
        public int nodesExpanded;
        public long elapsedMs;
        /** 是否撞了预算（true ⇒ stopReason 一定是 {@link #BUDGET}）。 */
        public boolean budgetHit;
        /** 沿途的危险格（按路径顺序；含已许可的）。 */
        public final List<Cell> dangers = new ArrayList<Cell>();
        /** 沿途危险格的**估算**伤害（按原版公式；只是估算，回执里标 estimated）。 */
        public double estimatedDamage;
        /** 泳过的格数（回执报 swimTicks）。 */
        public int swimSteps;
        /** 有危险但**未许可** ⇒ 这是第一个卡住的位置（stopReason=DANGER 时必填）。 */
        public Cell dangerAt;
        public String dangerKind;
        /** 有没有一条**完全安全**的绕路（更安全但可能更长）。 */
        public boolean detourAvailable;
        /** 那条安全路的长度与危险格数（没有就是 null）。 */
        public Double safeRouteLen;
        public Integer safeRouteDangerCount;
        /** 若放开许可，最便宜的那条"风险路线"要多长、过几处危险、估多少伤害。 */
        public Double riskRouteLen;
        public Integer riskRouteDangerCount;
        public Double riskRouteDamage;
        /** 缺哪些许可（人话，直接可填进下一次调用的 allow）。 */
        public final List<String> needAllow = new ArrayList<String>();
        /**
         * 无路可走时，**边界上最近的那一格「未许可的危险」**（深层 {@code stopReason=DANGER} 的落点）。
         * {@code null} = 不是因为危险走不通。
         */
        public Cell hazardAt;
        /** 搜索窗口（格）：回执里如实告诉调用方"我搜了多大一圈"。 */
        public int windowRadius;
        /** 用了多少次搭桥 / 挖道。 */
        public int usedBridges;
        public int dugBlocks;
    }

    // ==================================================================
    // 世界视图（带缓存；方块只经 GameBridge#blockAt 拿）
    // ==================================================================

    /** 一次寻路用一个实例：缓存 + 计数器都挂在这里。 */
    public static final class World {
        private final GameBridge bridge;
        private final Map<Long, String> blockCache = new HashMap<Long, String>();
        private final Map<Long, Integer> kindCache = new HashMap<Long, Integer>();
        /** 本世界视图累计调了多少次 {@code blockAt}（诊断用）。 */
        public int blockAtCalls;

        public World(GameBridge bridge) {
            this.bridge = bridge;
        }

        /** 方块 id；取不到（越界/未加载/本档不支持）回 null。 */
        public String block(int x, int y, int z) {
            long k = key(x, y, z);
            if (blockCache.containsKey(k)) return blockCache.get(k);
            String b = bridge.blockAt(x, y, z);
            blockAtCalls++;
            blockCache.put(Long.valueOf(k), b);
            return b;
        }

        /** 通行类别；未知 ⇒ {@link DangerTable#UNKNOWN}。 */
        public int kind(int x, int y, int z) {
            long k = key(x, y, z);
            Integer c = kindCache.get(k);
            if (c != null) return c.intValue();
            int kk = DangerTable.classify(block(x, y, z));
            kindCache.put(Long.valueOf(k), Integer.valueOf(kk));
            return kk;
        }
    }

    static long key(int x, int y, int z) {
        return ((long) (x & 0x3FFFFFF) << 38) | ((long) (z & 0x3FFFFFF) << 12) | (long) (y & 0xFFF);
    }

    // ==================================================================
    // 站得住判定（**一处**，搜索与执行器共用）
    // ==================================================================

    /** 站得住吗（脚 (x,y,z)）—— 只看几何，不看许可（非实心危险脚格由 relax/hazardKindOf 按 allow 裁决）。 */
    public static boolean standable(World w, int x, int y, int z) {
        int feet = w.kind(x, y, z);
        if (feet == DangerTable.UNKNOWN) return false;                 // 未知：不走
        if (feet != DangerTable.PASSABLE && feet != DangerTable.WATER
                && !DangerTable.isWalkableHazardFeet(feet)) return false;
        int head = w.kind(x, y + 1, z);
        if (head != DangerTable.PASSABLE) return false;                // **头顶留 2 格**
        int floorKind = w.kind(x, y - 1, z);
        if (!DangerTable.isFloor(floorKind)) return false;             // 未知地板 ⇒ 不踩
        return true;
    }

    /**
     * 该格的危险类别（PASSABLE = 完全无害）。看脚、地板、头三格。
     *
     * <p>次序有讲究：**脚那格**（身体占的格）优先，其次**地板**（踩着的东西：火 / 岩浆块 /
     * 甜浆果 / 粉雪 / 凋零玫瑰），最后头。地板排在头前面 —— 因为"踩在火上"比"头顶有火"
     * 常见得多，报出来的 dangerKind 要贴近真机第一反应。
     */
    public static int hazardKindOf(World w, int x, int y, int z) {
        int feet = w.kind(x, y, z);
        if (DangerTable.isHazard(feet) || feet == DangerTable.WATER) return feet;
        int floor = w.kind(x, y - 1, z);
        if (DangerTable.isHazard(floor)) return floor;                 // 岩浆块 / 火 / 甜浆果 / 粉雪
        int head = w.kind(x, y + 1, z);
        if (DangerTable.isHazard(head)) return head;
        return DangerTable.PASSABLE;
    }

    // ==================================================================
    // A*（状态全部在这个私有内部类里，**没有静态槽**）
    // ==================================================================

    private static final int[][] DIRS = { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };

    private static final class Node {
        final int x;
        final int y;
        final int z;
        double g;
        double f;
        Node parent;
        String via;

        Node(int x, int y, int z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    /** 一次搜索的全部可变状态（线程安全由"每次调用 new 一个"保证）。 */
    private static final class Search {
        final World w;
        final Config cfg;
        final int tx;
        final int ty;
        final int tz;
        final boolean ignoreAllow;

        final PriorityQueue<Node> open;
        final Map<Long, Node> best = new HashMap<Long, Node>();
        final Set<Long> closed = new HashSet<Long>();
        int expanded;
        /** 搜索窗口（含端点；由起点与终点算出，见 {@link Config#windowRadius}）。 */
        final int minX, maxX, minZ, maxZ, minY, maxY;
        /** 因为**未许可的危险**而被拒的边界格（无路可走时用来回答"是卡在哪类危险上"）。 */
        final List<Cell> hazardFrontier = new ArrayList<Cell>();

        Search(World w, Config cfg, int tx, int ty, int tz, boolean ignoreAllow,
               int sx, int sy, int sz) {
            this.w = w;
            this.cfg = cfg;
            this.tx = tx;
            this.ty = ty;
            this.tz = tz;
            this.ignoreAllow = ignoreAllow;
            int r = Math.max(1, cfg.windowRadius);
            this.minX = Math.min(sx, tx) - r;
            this.maxX = Math.max(sx, tx) + r;
            this.minZ = Math.min(sz, tz) - r;
            this.maxZ = Math.max(sz, tz) + r;
            this.minY = Math.min(sy, ty) - 24;
            this.maxY = Math.max(sy, ty) + 24;
            this.open = new PriorityQueue<Node>(64, new Comparator<Node>() {
                public int compare(Node a, Node b) {
                    int c = Double.compare(a.f, b.f);
                    return c != 0 ? c : Double.compare(a.g, b.g);   // 同 f 偏向 g 大的（更接近目标）
                }
            });
        }

        double h(int x, int y, int z) {
            double dx = tx - x;
            double dz = tz - z;
            double dy = ty - y;
            // 水平欧氏 + 竖直半权（落下去比走过去"便宜"，但不为负 ⇒ 仍可采纳）
            return Math.sqrt(dx * dx + dz * dz) + Math.abs(dy) * 0.5;
        }

        int effectiveMaxFall() {
            int mf = cfg.maxFall;
            if (mf < DEFAULT_MAX_FALL) mf = DEFAULT_MAX_FALL;
            if (mf > MAX_FALL_HARD) mf = MAX_FALL_HARD;
            if (!ignoreAllow && !cfg.allows("fall")) mf = DEFAULT_MAX_FALL;   // 没许可 ⇒ 只有 ≤3
            return mf;
        }

        /** 从 (x, yFrom) 往下到 yTo（含）这一段是不是全空（能不能掉下去）。 */
        boolean columnClear(int x, int yFrom, int yTo, int z) {
            for (int y = yFrom; y >= yTo; y--) {
                int k = w.kind(x, y, z);
                if (k != DangerTable.PASSABLE && k != DangerTable.WATER) return false;
            }
            return true;
        }

        /** 挖道：**脚**那格是实心、且挖掉后站得住（头是空的）。 */
        boolean mayDigThrough(int x, int y, int z) {
            if (w.kind(x, y, z) != DangerTable.SOLID) return false;    // 只挖实心；岩浆/水不挖
            return w.kind(x, y + 1, z) == DangerTable.PASSABLE;
        }

        /** 这一格在不在搜索窗口里。**窗口外一律不看**（见 {@link Config#windowRadius}）。 */
        boolean inWindow(int x, int y, int z) {
            return x >= minX && x <= maxX && z >= minZ && z <= maxZ && y >= minY && y <= maxY;
        }

        void relax(Node cur, int nx, int ny, int nz, double base, String via) {
            if (!inWindow(nx, ny, nz)) return;
            long nk = key(nx, ny, nz);
            Long boxed = Long.valueOf(nk);
            if (closed.contains(boxed)) return;
            // 搭桥 / 挖道这两步**不按 standable 判**：它们的前提恰恰是"原本站不住"
            // （桥 = 脚下是岩浆，挖 = 脚那格本来是实心），由调用点自己把前置判完了。
            boolean engineered = "bridge".equals(via) || "dig".equals(via);
            if (!engineered && !standable(w, nx, ny, nz)) return;
            int hk = hazardKindOf(w, nx, ny, nz);
            double extra = 0;
            if (engineered) {
                // 桥面 / 挖出来的通道：脚与头都是空气（调用点已验），**不按地板 hazard 判**
                // —— 桥面下面那格本来就是岩浆，那正是要跨过它的原因。
                hk = DangerTable.PASSABLE;
            }
            if (hk != DangerTable.PASSABLE) {
                if (DangerTable.isLethal(hk)) return;                  // 岩浆：**永不**走
                String allowName = DangerTable.allowName(hk);
                boolean permitted = ignoreAllow || (allowName != null && cfg.allows(allowName));
                if (!permitted) {
                    // 未许可 ⇒ 这一格不进搜索，但**记下它是哪类危险**：
                    // 无路可走时用它回答「第一处卡在哪」（回执 dangerAt/dangerKind 的落点）。
                    if (hazardFrontier.size() < 64) {
                        hazardFrontier.add(new Cell(nx, ny, nz, w.block(nx, ny, nz), hk, true));
                    }
                    return;
                }
                extra = DangerTable.extraCost(hk);
            }
            // 落差伤害：这一步往下掉了几格就按原版公式把伤害折进代价。
            // 为什么折进代价：A* 会在「同样长但摔得更狠」与「稍长但零伤害」之间选后者 ——
            // 这正是「能走」之外还要看「敢走」的那一层。
            int fall = cur.y - ny;
            if (fall > 0) extra += DangerTable.fallDamage(fall) * 2.0;
            double g = cur.g + base + extra;
            Node prev = best.get(boxed);
            if (prev != null && prev.g <= g) return;
            Node n = prev != null ? prev : new Node(nx, ny, nz);
            n.g = g;
            n.parent = cur;
            n.via = via;
            n.f = g + h(nx, ny, nz);
            best.put(boxed, n);
            open.add(n);
        }

        /** 回执里"第一处卡住的危险格"：优先取**路径上**的，没有就取边界上最近的一个。 */
        Cell firstHazard(int sx, int sy, int sz) {
            Cell best = null;
            double bestD = Double.MAX_VALUE;
            for (Cell c : hazardFrontier) {
                double d = Math.abs(c.x - sx) + Math.abs(c.z - sz) + Math.abs(c.y - sy) * 0.5;
                if (d < bestD) { bestD = d; best = c; }
            }
            return best;
        }

        Result run(int sx, int sy, int sz) {
            long t0 = System.currentTimeMillis();
            Result res = new Result();
            if (!standable(w, sx, sy, sz)) {
                res.stopReason = NOT_IN_WORLD;
                res.note = "起点 (x=" + sx + ",y=" + sy + ",z=" + sz + ") 站不住（脚下无实心 / 脚或头不是空气 / 未知格）"
                        + " ⇒ 不猜起点，直接如实拒";
                res.elapsedMs = System.currentTimeMillis() - t0;
                return res;
            }
            Node start = new Node(sx, sy, sz);
            start.g = 0;
            start.f = h(sx, sy, sz);
            open.add(start);
            best.put(Long.valueOf(key(sx, sy, sz)), start);

            Node goal = null;
            boolean budget = false;
            while (!open.isEmpty()) {
                if (expanded >= cfg.maxNodes || (System.currentTimeMillis() - t0) >= cfg.maxMillis) {
                    budget = true;
                    break;
                }
                Node cur = open.poll();
                Long ck = Long.valueOf(key(cur.x, cur.y, cur.z));
                if (closed.contains(ck)) continue;
                closed.add(ck);
                expanded++;
                if (cur.x == tx && cur.y == ty && cur.z == tz) {
                    goal = cur;
                    break;
                }
                int maxFall = effectiveMaxFall();
                for (int[] d : DIRS) {
                    int nx = cur.x + d[0];
                    int nz = cur.z + d[1];
                    // ① 平走
                    relax(cur, nx, cur.y, nz, 1.0, null);
                    // ② 抬升 1 格（MC 里真的需要跳 ⇒ 要 allowJump）
                    if (cfg.allowJump || ignoreAllow) {
                        relax(cur, nx, cur.y + 1, nz, 1.0 + DangerTable.JUMP_COST, null);
                    }
                    // ③ 落下 k 格（1..maxFall）
                    for (int k = 1; k <= maxFall; k++) {
                        int ny = cur.y - k;
                        if (!columnClear(nx, cur.y - 1, ny, nz)) break;      // 中间被挡 ⇒ 更深的也到不了
                        if (!standable(w, nx, ny, nz)) continue;
                        relax(cur, nx, ny, nz, 1.0 + 0.15 * k, null);
                    }
                    // ④ 搭桥跨过 1 格岩浆（要 allow:bridge）
                    // **注意**：搭桥/挖道**不受 ignoreAllow 影响** —— 它们是"能力"（要真有方块、
                    // 真去挖），不是"风险容忍度"。风险路线那趟只是放开危险品类的许可，
                    // 不能顺手替调用方把桥搭了（那样回执会报"过 0 处危险"，是假话）。
                    if (cfg.allows("bridge")) {
                        int bx = cur.x + d[0];
                        int bz = cur.z + d[1];
                        if (w.kind(bx, cur.y - 1, bz) == DangerTable.LETHAL
                                && w.kind(bx, cur.y, bz) == DangerTable.PASSABLE
                                && w.kind(bx, cur.y + 1, bz) == DangerTable.PASSABLE) {
                            relax(cur, bx, cur.y, bz, 1.0 + DangerTable.BRIDGE_COST, "bridge");
                        }
                    }
                    // ⑤ 挖掉挡路的一格（要 allow:dig）—— 同上，不受 ignoreAllow 影响
                    if (cfg.allows("dig")) {
                        if (mayDigThrough(nx, cur.y, nz) && canStandAfterDig(nx, cur.y, nz)) {
                            relax(cur, nx, cur.y, nz, 1.0 + DangerTable.DIG_COST, "dig");
                        }
                    }
                }
            }

            res.nodesExpanded = expanded;
            res.elapsedMs = System.currentTimeMillis() - t0;
            res.budgetHit = budget;
            if (goal == null) {
                res.found = false;
                res.stopReason = budget ? BUDGET : BLOCKED;
                res.note = budget
                        ? "搜索预算耗尽（expanded=" + expanded + " / maxNodes=" + cfg.maxNodes
                                + "，elapsed=" + res.elapsedMs + "ms / maxMillis=" + cfg.maxMillis
                                + "）⇒ **不是**「到不了」，是**没搜完**；把 maxNodes/maxMillis 调大再试"
                        : "无路可走（已搜 " + expanded + " 个节点）：目标要么被挡住、要么要穿过未许可的危险格 / 未知区块";
                return res;
            }
            res.found = true;
            res.stopReason = REACHED;
            List<Node> chain = new ArrayList<Node>();
            for (Node n = goal; n != null; n = n.parent) chain.add(0, n);
            double len = 0;
            for (int i = 0; i < chain.size(); i++) {
                Node n = chain.get(i);
                String blk = w.block(n.x, n.y, n.z);
                int hk = hazardKindOf(w, n.x, n.y, n.z);
                boolean hazard = hk != DangerTable.PASSABLE;
                Cell c = new Cell(n.x, n.y, n.z, blk, hk, hazard);
                res.path.add(c);
                if (hazard) {
                    res.dangers.add(c);
                    if (hk == DangerTable.WATER) res.swimSteps++;
                    res.estimatedDamage += DangerTable.hazardDamagePerStep(hk);
                }
                if (i > 0) {
                    Node p = chain.get(i - 1);
                    int dy = n.y - p.y;
                    len += Math.sqrt(1.0 + (double) dy * (double) dy);
                    if ("bridge".equals(n.via)) res.usedBridges++;
                    if ("dig".equals(n.via)) res.dugBlocks++;
                    // **下落伤害也要计入估算**（这是"敢不敢走"的核心读数之一）：
                    // 掉 k 格按原版 ceil((k-3)*1) 算，1..3 格为 0。
                    if (dy < 0) {
                        double fall = DangerTable.fallDamage(-dy);
                        if (fall > 0) {
                            res.estimatedDamage += fall;
                            res.dangers.add(c);      // 落点也算一处危险（plan_only 清单要列出来）
                        }
                    }
                } else if (res.path.isEmpty()) { /* unreachable */ }
            }
            res.length = len;
            res.note = "找到一条路：长 " + round2(len) + " 格、" + res.path.size() + " 个路点、"
                    + res.dangers.size() + " 处危险（估算伤害 " + round2(res.estimatedDamage) + "）；"
                    + "搜索展开 " + expanded + " 个节点 / " + res.elapsedMs + "ms";
            return res;
        }

        /** 挖掉 (x,y,z) 之后那格能不能站（头留空 + 脚下实心）。 */
        boolean canStandAfterDig(int x, int y, int z) {
            if (w.kind(x, y + 1, z) != DangerTable.PASSABLE) return false;
            return DangerTable.isFloor(w.kind(x, y - 1, z));
        }
    }

    /** 单趟 A*（不掺"安全绕路/风险路"那两趟）。 */
    public static Result searchOnce(World w, Config cfg, int sx, int sy, int sz,
                                    int tx, int ty, int tz, boolean ignoreAllow) {
        Search s = new Search(w, cfg, tx, ty, tz, ignoreAllow, sx, sy, sz);
        Result r = s.run(sx, sy, sz);
        if (!r.found && s.firstHazard(sx, sy, sz) != null) {
            // 无路可走时把「边界上最近的危险格」记下来 —— 上层据此报 DANGER 而不是一句 BLOCKED。
            if (r.hazardAt == null) r.hazardAt = s.firstHazard(sx, sy, sz);
        }
        return r;
    }

    // ==================================================================
    // 对外主入口：一次调用把"能走 / 敢走"两件事分开算清楚
    // ==================================================================

    /**
     * 算一条从起点到终点的路线，并把**代价**说清楚。
     *
     * <p>三次搜索，语义分开（这就是"能走"与"敢走"分家的落点）：
     * <ol>
     *   <li><b>允许路</b>（按 {@code cfg.allow}）—— 真按调用方给的许可算。找到就用它。</li>
     *   <li><b>安全路</b>（一处危险都不许，水也不许）—— 用来回答"绕路要付多少"
     *       （{@code detourAvailable} + {@code safeRouteLen} + {@code safeRouteDangerCount}）。</li>
     *   <li><b>风险路</b>（放开全部危险许可；岩浆仍永不通行）—— 只在①找不到时算，用来回答
     *       "如果敢走，最便宜要付多少血"（{@code riskRoute*} + {@code dangerAt}/{@code dangerKind}）。</li>
     * </ol>
     */
    public static Result plan(World w, Config cfg, int sx, int sy, int sz, int tx, int ty, int tz) {
        Result direct = searchOnce(w, cfg, sx, sy, sz, tx, ty, tz, false);
        if (NOT_IN_WORLD.equals(direct.stopReason)) return direct;   // 起点站不住：直接如实拒
        Config safeCfg = noHazards(cfg);
        Result safe = searchOnce(w, safeCfg, sx, sy, sz, tx, ty, tz, false);

        if (direct.found) {
            if (direct.dangers.isEmpty()) {
                direct.detourAvailable = false;                 // 已经是最安全的了，谈不上"绕路"
                direct.safeRouteLen = Double.valueOf(round2(direct.length));
                direct.safeRouteDangerCount = Integer.valueOf(0);
            } else if (safe.found) {
                direct.detourAvailable = true;
                direct.safeRouteLen = Double.valueOf(round2(safe.length));
                direct.safeRouteDangerCount = Integer.valueOf(safe.dangers.size());
            } else {
                direct.detourAvailable = false;                 // 没有更安全的备选 ⇒ 如实报 false
                direct.safeRouteLen = null;
                direct.safeRouteDangerCount = null;
            }
            return direct;
        }

        // ①失败：放开全部危险许可，量"敢走的话要付多少"
        Result risk = searchOnce(w, cfg, sx, sy, sz, tx, ty, tz, true);

        Result out = new Result();
        out.nodesExpanded = direct.nodesExpanded + safe.nodesExpanded + risk.nodesExpanded;
        out.elapsedMs = direct.elapsedMs + safe.elapsedMs + risk.elapsedMs;
        out.budgetHit = direct.budgetHit || risk.budgetHit;
        out.windowRadius = cfg.windowRadius;

        if (risk.found) {
            out.found = false;
            out.stopReason = DANGER;
            Cell first = risk.dangers.isEmpty() ? null : risk.dangers.get(0);
            out.dangerAt = first;
            out.dangerKind = first == null ? null : first.kindName();
            out.riskRouteLen = Double.valueOf(round2(risk.length));
            out.riskRouteDangerCount = Integer.valueOf(risk.dangers.size());
            out.riskRouteDamage = Double.valueOf(round2(risk.estimatedDamage));
            out.detourAvailable = safe.found;
            if (safe.found) {
                out.safeRouteLen = Double.valueOf(round2(safe.length));
                out.safeRouteDangerCount = Integer.valueOf(safe.dangers.size());
            }
            Set<String> need = new LinkedHashSet<String>();
            for (Cell c : risk.dangers) {
                String a = DangerTable.allowName(c.kind);
                if (a != null && !cfg.allows(a)) need.add(a);
            }
            out.needAllow.addAll(need);
            out.note = "按当前 allow 走不过去；但有一条**要付出代价**的路：长 " + out.riskRouteLen
                    + " 格、过 " + out.riskRouteDangerCount + " 处危险、估算掉血 " + out.riskRouteDamage
                    + "。第一处卡在 " + (first == null ? "?" : first.xyz() + " "
                            + first.block + " [" + first.kindName() + "]")
                    + (safe.found
                            ? "；**存在完全安全的绕路**：长 " + out.safeRouteLen + " 格、0 处危险"
                            : "；**没有任何完全安全的绕路**")
                    + (out.needAllow.isEmpty() ? "" : "。要冒险就把这些放进 allow：" + out.needAllow);
            return out;
        }

        out.found = false;
        // 有"未许可的危险格"顶边界 ⇒ 那是 DANGER（有代价但不敢走），不是 BLOCKED（真过不去）。
        // 这个区分决定调用方下一步：DANGER 要它决定"要不要冒险"，BLOCKED 要它换个目标。
        if (direct.hazardAt != null && !(direct.stopReason == BUDGET || risk.budgetHit)) {
            out.stopReason = DANGER;
            out.dangerAt = direct.hazardAt;
            out.dangerKind = direct.hazardAt.kindName();
            out.detourAvailable = safe.found;
            if (safe.found) {
                out.safeRouteLen = Double.valueOf(round2(safe.length));
                out.safeRouteDangerCount = Integer.valueOf(safe.dangers.size());
            }
            Set<String> need = new LinkedHashSet<String>();
            String a = DangerTable.allowName(direct.hazardAt.kind);
            if (a != null && !cfg.allows(a)) need.add(a);
            out.needAllow.addAll(need);
            out.note = "走不过去：边界上最近的通行障碍是 " + direct.hazardAt.xyz() + " "
                    + direct.hazardAt.block + " [" + direct.hazardAt.kindName() + "]（**未许可**）"
                    + "，而且放开许可也到不了（可能被岩浆/未知区块/实心墙挡死）"
                    + (safe.found
                            ? "；但存在一条完全安全的绕路：长 " + out.safeRouteLen + " 格"
                            : "；**没有任何完全安全的绕路**")
                    + (out.needAllow.isEmpty() ? "" : "。缺的许可：" + out.needAllow);
            return out;
        }
        out.stopReason = (direct.stopReason == BUDGET || risk.budgetHit) ? BUDGET : BLOCKED;
        out.detourAvailable = safe.found;
        if (safe.found) {
            out.safeRouteLen = Double.valueOf(round2(safe.length));
            out.safeRouteDangerCount = Integer.valueOf(safe.dangers.size());
        }
        out.note = BUDGET.equals(out.stopReason)
                ? "搜索预算耗尽 ⇒ **不是**「到不了」，是**没搜完**；调大 maxNodes/maxMillis 再试"
                : "无路可走：连放开全部危险许可都到不了（岩浆/未知区块/实心墙挡死）"
                        + (safe.found ? "；但存在一条完全安全的绕路（长 " + out.safeRouteLen + " 格）" : "");
        return out;
    }

    /** 复制一份"一处危险都不许"的配置（安全绕路那一趟用）。 */
    private static Config noHazards(Config cfg) {
        Config c = new Config();
        c.maxNodes = cfg.maxNodes;
        c.maxMillis = cfg.maxMillis;
        c.maxFall = DEFAULT_MAX_FALL;          // 安全路只走 ≤3 格落差（零伤害）
        c.allowJump = cfg.allowJump;
        c.maxBridge = cfg.maxBridge;
        c.maxDig = cfg.maxDig;
        c.allow.clear();                        // 水也不许 —— "完全安全"就是一处危险都没有
        c.allowProbe = cfg.allowProbe;
        c.tolerance = cfg.tolerance;
        c.windowRadius = cfg.windowRadius;
        return c;
    }

    private static double round2(double d) {
        return Math.round(d * 100.0) / 100.0;
    }
}
