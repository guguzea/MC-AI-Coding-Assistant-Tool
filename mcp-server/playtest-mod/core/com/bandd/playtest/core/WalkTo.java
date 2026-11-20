package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * {@code walk_to} 的**执行器**：把 {@link Pathfinder} 算出来的路线变成"一 tick 走一步"的
 * 进度，并全程记账（血量 / 危险 tick / 搭桥 / 撤回）。
 *
 * <h3>为什么执行器在 core、而"真正让玩家动"在适配层</h3>
 * 移动必须走**游戏自己的移动按键状态**（neo：{@code KeyMapping#setDown}；
 * fabric：{@code KeyBinding#setPressed}），**绝不许**宿主级置前 / 键鼠注入。
 * core 里没有、也不许有 {@code net.minecraft.*} ⇒ core 只负责「现在该朝哪、该按什么」
 * 并与 {@link Arbitration} 同步按键持有状态，由适配层的 {@link GameBridge#walkDrive} 落到游戏输入上。
 *
 * <h3>安全前置（每次移动前）</h3>
 * 每一步都先 {@link Pathfinder#standable} 复验下一格：脚下是实心、脚与头都是空气。
 * 任何一条不成立 ⇒ 就地停（{@code WALK_BLOCKED}），**不赌**。
 *
 * <h3>保险与如实记账</h3>
 * <ul>
 *   <li>移动前记 {@code safeAnchor}（最近的安全点）与 {@code hpBefore}；</li>
 *   <li>每 tick 读一次血量：跌破 {@code minHp}（默认 10，**不是 0**）⇒ 主动撤回
 *       （{@code stopReason=DANGER_RETREAT}），退回 {@code safeAnchor}；</li>
 *   <li>回执里 {@code hpBefore/hpAfter/damageTaken/ticksInDanger/usedBridges} 一律**如实**；
 *       掉血绝不许写成"过去了就算成功"。</li>
 * </ul>
 *
 * <p>Java 8 可用（本类无任何 MC / 加载器类型）。
 */
public final class WalkTo {

    // ==================================================================
    // 错误码（回执里的 code，一字不改）
    // ==================================================================
    public static final String MISSING_REQUIRED_PARAM = "MISSING_REQUIRED_PARAM";
    public static final String BAD_REQUEST = "BAD_REQUEST";
    /** 目标格 / 路上某一格站不住（脚下无实心 / 头会撞 / 未知格）⇒ **不移动**。 */
    public static final String WALK_BLOCKED = "WALK_BLOCKED";
    /** {@code maxTicks} 走完还没到。 */
    public static final String WALK_TIMEOUT = "WALK_TIMEOUT";
    /** 不在世界 / 读不到玩家。 */
    public static final String NOT_IN_WORLD = "NOT_IN_WORLD";
    /** 本档没实现移动面。 */
    public static final String UNSUPPORTED = "WALK_UNSUPPORTED";

    /** 默认值（与任务书一致）。 */
    public static final double DEFAULT_TOLERANCE = 1.0;
    public static final int DEFAULT_MAX_TICKS = 600;
    /** 血量保险线：**默认 10（5 颗心），不是 0** —— 到 0 就死了，保险必须提前。 */
    public static final double DEFAULT_MIN_HP = 10.0;
    /** 每个路点最多花几个 tick（超了算卡住，换下一个）。 */
    public static final int TICKS_PER_WAYPOINT = 12;
    /** 连续几个 tick 位置没变 ⇒ 认为卡住。 */
    public static final int STUCK_TICKS = 8;
    /** 回执里 path 最多给前 N 个路点（截断要如实标）。 */
    public static final int PATH_PREVIEW = 24;

    private WalkTo() {
    }

    // ==================================================================
    // 参数
    // ==================================================================

    /** {@code walk_to} 的解析结果（{@code error != null} ⇒ 直接回这个错）。 */
    public static final class Params {
        public String error;
        public String errorMessage;
        public int x;
        public int y;
        public int z;
        public double tolerance = DEFAULT_TOLERANCE;
        public int maxTicks = DEFAULT_MAX_TICKS;
        public boolean allowJump = false;
        public boolean planOnly = false;
        public double minHp = DEFAULT_MIN_HP;
        public final Pathfinder.Config cfg = new Pathfinder.Config();
    }

    /**
     * 把原始参数 Map 解析成 {@link Params}。**不静默**：类型不对一律回错误码 + 人话。
     *
     * <p>{@code allow} 是**集合**（不是布尔）；也接受 JSON 数组 / 逗号分隔串两种写法。
     * 元素必须在 {@link Pathfinder#ALLOW_KINDS} 里 —— 拼错的许可名**当场拒**，
     * 免得调用方以为"给了许可"而实际上没给（那会变成"静默不生效"）。
     */
    @SuppressWarnings("unchecked")
    public static Params parse(Map<String, Object> p) {
        Params o = new Params();
        String miss = firstMissing(p, "x", "y", "z");
        if (miss != null) {
            o.error = MISSING_REQUIRED_PARAM;
            o.errorMessage = "缺少 " + miss + "（整数世界坐标；三个都必填）";
            return o;
        }
        Long x = integral(p.get("x"));
        Long y = integral(p.get("y"));
        Long z = integral(p.get("z"));
        if (x == null || y == null || z == null) {
            o.error = BAD_REQUEST;
            o.errorMessage = "x/y/z 必须是**整值**（8 / 8.0 / \"8\" 都行；8.7 一律拒，不静默 floor）收到 x="
                    + Json.of(p.get("x")) + " y=" + Json.of(p.get("y")) + " z=" + Json.of(p.get("z"));
            return o;
        }
        o.x = x.intValue();
        o.y = y.intValue();
        o.z = z.intValue();

        if (p.containsKey("tolerance")) {
            Double t = number(p.get("tolerance"));
            if (t == null || t.doubleValue() < 0) {
                o.error = BAD_REQUEST;
                o.errorMessage = "tolerance 必须是 ≥0 的数（格），收到 " + Json.of(p.get("tolerance"));
                return o;
            }
            o.tolerance = t.doubleValue();
        }
        if (p.containsKey("maxTicks")) {
            Long m = integral(p.get("maxTicks"));
            if (m == null || m.intValue() <= 0) {
                o.error = BAD_REQUEST;
                o.errorMessage = "maxTicks 必须是 ≥1 的整值，收到 " + Json.of(p.get("maxTicks"));
                return o;
            }
            o.maxTicks = m.intValue();
        }
        if (p.containsKey("minHp")) {
            Double h = number(p.get("minHp"));
            if (h == null || h.doubleValue() < 0) {
                o.error = BAD_REQUEST;
                o.errorMessage = "minHp 必须是 ≥0 的数，收到 " + Json.of(p.get("minHp"));
                return o;
            }
            o.minHp = h.doubleValue();
        }
        if (p.containsKey("maxNodes")) {
            Long n = integral(p.get("maxNodes"));
            if (n == null || n.intValue() <= 0) {
                o.error = BAD_REQUEST;
                o.errorMessage = "maxNodes 必须是 ≥1 的整值，收到 " + Json.of(p.get("maxNodes"));
                return o;
            }
            o.cfg.maxNodes = n.intValue();
        }
        if (p.containsKey("maxMillis")) {
            Long n = integral(p.get("maxMillis"));
            if (n == null || n.longValue() <= 0) {
                o.error = BAD_REQUEST;
                o.errorMessage = "maxMillis 必须是 ≥1 的整值，收到 " + Json.of(p.get("maxMillis"));
                return o;
            }
            o.cfg.maxMillis = n.longValue();
        }
        if (p.containsKey("maxFall")) {
            Long n = integral(p.get("maxFall"));
            if (n == null || n.intValue() < 0 || n.intValue() > Pathfinder.MAX_FALL_HARD) {
                o.error = BAD_REQUEST;
                o.errorMessage = "maxFall 必须是 0.." + Pathfinder.MAX_FALL_HARD + " 的整值，收到 "
                        + Json.of(p.get("maxFall"));
                return o;
            }
            o.cfg.maxFall = n.intValue();
        }
        o.allowJump = Json.bool(p, "allowJump", false);
        o.planOnly = Json.bool(p, "plan_only", Json.bool(p, "planOnly", false));
        o.cfg.allowJump = o.allowJump;
        o.cfg.tolerance = o.tolerance;

        // ---- allow：**集合**，逐类许可 ----
        if (p.containsKey("allow")) {
            Object raw = p.get("allow");
            List<String> names = new ArrayList<String>();
            if (raw instanceof Boolean) {
                // 老写法兜底：allow=true 等价于"全开"（但不含岩浆，岩浆永远不许走）
                if (((Boolean) raw).booleanValue()) {
                    names.addAll(Pathfinder.ALLOW_KINDS);
                    names.remove("probe");
                }
            } else if (raw instanceof List) {
                for (Object e : (List<Object>) raw) {
                    if (e != null) names.add(String.valueOf(e).trim());
                }
            } else if (raw instanceof String) {
                String s = (String) raw;
                for (String part : s.split(",")) {
                    if (!part.trim().isEmpty()) names.add(part.trim());
                }
            } else if (raw != null) {
                o.error = BAD_REQUEST;
                o.errorMessage = "allow 必须是字符串数组（如 [\"water\",\"fall\"]）、逗号分隔串或布尔；收到 "
                        + Json.of(raw);
                return o;
            }
            for (String n : names) {
                if (!Pathfinder.ALLOW_KINDS.contains(n)) {
                    o.error = BAD_REQUEST;
                    o.errorMessage = "allow 里有不认识的许可 " + Json.of(n) + "；合法值 = " + Pathfinder.ALLOW_KINDS
                            + "（**逐类许可**，不是一个大开关；拼错一律拒，免得你以为给了其实没给）";
                    return o;
                }
                o.cfg.allow.add(n);
            }
            // 显式给了 allow 就**不再默认加水**：调用方说了算（除非他自己写了 water）
            if (!names.isEmpty()) o.cfg.allow.retainAll(names);
        }
        if (o.cfg.allows("fall") && o.cfg.maxFall < Pathfinder.DEFAULT_MAX_FALL) {
            o.cfg.maxFall = Pathfinder.DEFAULT_MAX_FALL;
        }
        if (!o.cfg.allows("fall") && o.cfg.maxFall > Pathfinder.DEFAULT_MAX_FALL) {
            o.error = BAD_REQUEST;
            o.errorMessage = "maxFall=" + o.cfg.maxFall + " > " + Pathfinder.DEFAULT_MAX_FALL
                    + " 需要显式许可 allow:[\"fall\"]（≤" + Pathfinder.DEFAULT_MAX_FALL
                    + " 格落地**零伤害**，所以默认就允许；再高要你自己签字）";
            return o;
        }
        return o;
    }

    private static String firstMissing(Map<String, Object> p, String... keys) {
        for (String k : keys) {
            if (!p.containsKey(k) || p.get(k) == null) return k;
        }
        return null;
    }

    /** 整值：接受 Integer/Long/Double(整)/String(整)；8.7 这类回 null（**不 floor**）。 */
    static Long integral(Object v) {
        if (v instanceof Number) {
            double d = ((Number) v).doubleValue();
            if (Double.isNaN(d) || Double.isInfinite(d)) return null;
            if (d != Math.rint(d)) return null;
            return Long.valueOf((long) d);
        }
        if (v instanceof String) {
            try {
                double d = Double.parseDouble(((String) v).trim());
                if (d != Math.rint(d)) return null;
                return Long.valueOf((long) d);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    static Double number(Object v) {
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

    // ==================================================================
    // 执行状态（跨 tick；由 PlaytestCore 持有）
    // ==================================================================

    /** 一次 walk_to 的进行中状态。 */
    public static final class Session {
        public final Params params;
        public final Pathfinder.Result plan;
        /** 寻路用的世界视图（**同一份缓存**：执行期复验下一格不必重读方块）。 */
        public final Pathfinder.World world;
        public final List<Pathfinder.Cell> route;
        public int cursor;                  // 下一个要去的路点下标
        public int ticks;                   // 已走 tick
        public int ticksInDanger;
        public int usedBridges;
        public int dugBlocks;
        public double hpBefore;
        public double hpAfter;
        public double minHpSeen;
        public double damageTaken;
        /** 最近一个**脚下是硬地、周围无危险**的位置（撤回目标）。 */
        public Pathfinder.Cell safeAnchor;
        public final List<String> trail = new ArrayList<String>();
        public String stopReason;
        public String note;
        public boolean done;
        public int stuckTicks;
        /** 本次 walk_to 起步时的精确玩家坐标（用于计算真实位移 actualDisplacement / moved）。 */
        public double startX = Double.NaN;
        public double startY = Double.NaN;
        public double startZ = Double.NaN;
        public double lastX;
        public double lastY;
        public double lastZ;
        public int waypointTicks;
        /** 登记时是哪个 tick（同一 tick 内不重复推进，见 {@code PlaytestCore#tickWalks}）。 */
        public long registeredTick;
        /**
         * 已经**为哪些路点搭过桥 / 挖过道**（路点身份串 → true）。
         *
         * <p>为什么要有它：搭桥的路点**本来就站不住**（脚下是岩浆），执行器不能拿
         * {@link Pathfinder#standable} 去否它 —— 那会把 A* 刚算出来的桥面当成"过不去"。
         * 正确的做法是：这一格按"要工程化"处理 ⇒ 先记一次 {@code usedBridges} /
         * {@code dugBlocks}，然后**允许通过**（真机上这时该去 place_block / 破坏方块）。
         * 记账去重，同一个路点只算一次。
         */
        public final java.util.Set<String> engineered = new java.util.HashSet<String>();

        public Session(Params params, Pathfinder.Result plan, Pathfinder.World world) {
            this.params = params;
            this.plan = plan;
            this.world = world;
            this.route = plan.path;
            this.hpBefore = -1;
            this.hpAfter = -1;
            this.minHpSeen = Double.MAX_VALUE;
        }
    }

    /** 当前该驱动的方向（由 core 算，适配层照着写进游戏输入）。 */
    public static final class Drive {
        /** 目标点（脚所在格的中心）。 */
        public double tx;
        public double ty;
        public double tz;
        /** 前进量（-1..1）与横移量（-1..1）；写进 neo 的 forwardImpulse/leftImpulse。 */
        public float forward;
        public float strafe;
        /** 要不要跳（台阶 / allowJump 的抬升）。 */
        public boolean jump;
        /** 朝哪看（yaw，度）；NaN = 不改朝向。 */
        public float yaw = Float.NaN;
        /** 人话（进 trail，便于事后复盘）。 */
        public String note;
    }

    /**
     * 由玩家当前位置 + 下一个路点算出这一 tick 该给什么输入。
     * **纯函数**（不碰游戏），所以能在离线单测里逐条断言。
     */
    public static Drive driveToward(double px, double py, double pz,
                                    Pathfinder.Cell next, boolean needJump) {
        Drive d = new Drive();
        d.tx = next.x + 0.5;
        d.ty = next.y;
        d.tz = next.z + 0.5;
        double dx = d.tx - px;
        double dz = d.tz - pz;
        double horiz = Math.sqrt(dx * dx + dz * dz);
        // 朝目标看（MC 的 yaw：-180..180，0 = +Z，90 = -X）
        d.yaw = (float) Math.toDegrees(Math.atan2(-dx, dz));
        // forward/strafe 是**玩家本地坐标**：先把世界位移旋到玩家朝向系
        // （这里直接用 yaw 对齐 ⇒ 永远 forward=1、strafe=0，最稳）
        d.forward = horiz < 0.08 ? 0f : 1f;
        d.strafe = 0f;
        d.jump = needJump || (next.y > Math.floor(py + 0.001));
        d.note = "→" + next.xyz() + " d=" + round2(horiz);
        return d;
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    // ==================================================================
    // 回执
    // ==================================================================

    /**
     * 把一次（进行中或已完成的）会话拼成回执的 {@code data} 段。
     * **只有真的走到了**（{@code reached} 由执行器按"位置与目标距离 ≤ tolerance"判定）才写 true。
     */
    public static Map<String, Object> receipt(Session s, double px, double py, double pz, boolean reached) {
        Map<String, Object> d = new LinkedHashMap<String, Object>();
        Pathfinder.Cell from = s.route.isEmpty() ? null : s.route.get(0);
        d.put("from", from == null ? null : xyzMap(from));
        d.put("to", xyzMap(s.params.x, s.params.y, s.params.z));
        d.put("reached", Boolean.valueOf(reached));
        d.put("ticks", Integer.valueOf(s.ticks));
        d.put("maxTicks", Integer.valueOf(s.params.maxTicks));
        double dist = Math.sqrt(sq(px - (s.params.x + 0.5)) + sq(py - s.params.y) + sq(pz - (s.params.z + 0.5)));
        double sx0 = Double.isNaN(s.startX) ? s.lastX : s.startX;
        double sy0 = Double.isNaN(s.startY) ? s.lastY : s.startY;
        double sz0 = Double.isNaN(s.startZ) ? s.lastZ : s.startZ;
        double displacement = Math.sqrt(sq(px - sx0) + sq(py - sy0) + sq(pz - sz0));
        boolean moved = displacement > 0.01;
        d.put("distance", Double.valueOf(round2(dist)));
        d.put("tolerance", Double.valueOf(s.params.tolerance));
        d.put("startPos", xyzMap(round2(sx0), round2(sy0), round2(sz0)));
        d.put("position", xyzMap(round2(px), round2(py), round2(pz)));
        d.put("actualDisplacement", Double.valueOf(round2(displacement)));
        d.put("moved", Boolean.valueOf(moved));
        d.put("alreadyWithinTolerance", Boolean.valueOf(reached && s.ticks == 0 && !moved));
        d.put("stopReason", s.stopReason);
        if (s.note != null) d.put("note", s.note);
        // path：前 N 个路点（截断如实标）
        List<Object> path = new ArrayList<Object>();
        int n = Math.min(s.route.size(), PATH_PREVIEW);
        for (int i = 0; i < n; i++) path.add(xyzMap(s.route.get(i)));
        d.put("path", path);
        d.put("pathTotal", Integer.valueOf(s.route.size()));
        d.put("pathTruncated", Boolean.valueOf(s.route.size() > n));
        d.put("pathNote", s.route.size() > n
                ? "path 只给前 " + PATH_PREVIEW + " 个路点（共 " + s.route.size() + " 个）；完整路线请用 plan_only:true 取"
                : "path = 完整路线（含起点与终点）");
        // 危险记账
        List<Object> dangerList = new ArrayList<Object>();
        for (Pathfinder.Cell c : s.plan.dangers) {
            Map<String, Object> m = xyzMap(c);
            m.put("block", c.block);
            m.put("dangerKind", c.kindName());
            dangerList.add(m);
        }
        d.put("dangers", dangerList);
        d.put("dangerCount", Integer.valueOf(s.plan.dangers.size()));
        d.put("estimatedDamage", Double.valueOf(s.plan.estimatedDamage));
        d.put("estimated", Boolean.TRUE);
        d.put("estimatedNote", "estimatedDamage 是按**原版公式**估的（摔落：ceil((h-3)*m)；火/仙人掌/"
                + "甜浆果/粉雪/岩浆块按每格固定值）—— 是**估算**，真机读数以 hpBefore/hpAfter 为准");
        d.put("swimSteps", Integer.valueOf(s.plan.swimSteps));
        d.put("swimTicks", Integer.valueOf(s.plan.swimSteps * 2));
        d.put("detourAvailable", Boolean.valueOf(s.plan.detourAvailable));
        d.put("safeRouteLength", s.plan.safeRouteLen);
        d.put("safeRouteDangerCount", s.plan.safeRouteDangerCount);
        // 保险与血账（**如实**）
        d.put("hpBefore", Double.valueOf(s.hpBefore));
        d.put("hpAfter", Double.valueOf(s.hpAfter));
        d.put("damageTaken", Double.valueOf(round2(s.damageTaken)));
        d.put("minHp", Double.valueOf(s.params.minHp));
        d.put("minHpSeen", s.minHpSeen == Double.MAX_VALUE ? null : Double.valueOf(round2(s.minHpSeen)));
        d.put("ticksInDanger", Integer.valueOf(s.ticksInDanger));
        // 计划里算出来的 + 执行期真工程化的，取**大者**（二者对同一条路线应相等；
        // 取大者是为了"计划说 1 次、执行也记了 1 次"时不会报成 2 次）
        d.put("usedBridges", Integer.valueOf(Math.max(s.usedBridges, s.plan.usedBridges)));
        d.put("dugBlocks", Integer.valueOf(Math.max(s.dugBlocks, s.plan.dugBlocks)));
        d.put("safeAnchor", s.safeAnchor == null ? null : xyzMap(s.safeAnchor));
        d.put("allow", new ArrayList<Object>(s.params.cfg.allow));
        d.put("allowJump", Boolean.valueOf(s.params.allowJump));
        d.put("maxFall", Integer.valueOf(s.params.cfg.maxFall));
        d.put("planOnly", Boolean.valueOf(s.params.planOnly));
        d.put("nodesExpanded", Integer.valueOf(s.plan.nodesExpanded));
        d.put("planMillis", Long.valueOf(s.plan.elapsedMs));
        d.put("trail", new ArrayList<Object>(s.trail));
        return d;
    }

    static Map<String, Object> xyzMap(Pathfinder.Cell c) {
        return xyzMap(c.x, c.y, c.z);
    }

    static Map<String, Object> xyzMap(double x, double y, double z) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        if (x == Math.rint(x)) m.put("x", Integer.valueOf((int) x));
        else m.put("x", Double.valueOf(round2(x)));
        if (y == Math.rint(y)) m.put("y", Integer.valueOf((int) y));
        else m.put("y", Double.valueOf(round2(y)));
        if (z == Math.rint(z)) m.put("z", Integer.valueOf((int) z));
        else m.put("z", Double.valueOf(round2(z)));
        return m;
    }

    private static double sq(double v) {
        return v * v;
    }
}
