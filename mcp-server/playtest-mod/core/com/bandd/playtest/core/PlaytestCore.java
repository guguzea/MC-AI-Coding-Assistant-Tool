package com.bandd.playtest.core;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 版本无关的核心：协议 / 动作派发 / 仲裁 / 证据。
 * **不许出现任何 net.minecraft.* 或加载器类型** —— 逐档差异全在 adapter（GameBridge 的实现）。
 */
public final class PlaytestCore {
    /** 仓库口径的禁列（意图菜单禁 kill/tnt/fill）—— 这里对命令级动作也拦一道。 */
    private static final List<String> FORBIDDEN_PREFIX = Arrays.asList("kill", "tnt", "fill");

    /** 本档没实现读背包面时的错误码（{@code GameBridge#inventoryJson} 回 null）。 */
    public static final String INVENTORY_UNSUPPORTED = "INVENTORY_UNSUPPORTED";
    /**
     * {@code idKind} 的口径说明（**原样进回执**）。为什么必须写死这一句：
     * 桥路线（forge 1.7.10–1.12.2）的 {@code query_inventory} 给的是 **unlocalizedName**（{@code item.stone}），
     * 而驱动路线给的是**现代注册名**（{@code minecraft:stone}）—— 形状对齐、**口径不同源**，
     * 调用方拿这两串直接比会永远不等 ⇒ 必须在回执里当面说清。
     */
    private static final String ID_KIND_NOTE =
            "idKind = itemId 的口径。本档走现代注册名 registryName（如 minecraft:stone）；"
                    + "桥路线（forge 1.7.10–1.12.2）同类字段给的是 unlocalizedName（如 item.stone）"
                    + " —— 两个口径**逐字不同源**，别拿同一个串直接比";

    /** [T22] gameMode 的口径说明（原样进 query_player_state 的 player 段）。 */
    private static final String GAMEMODE_NOTE =
            "gameMode = 原版游戏模式枚举名（survival / creative / adventure / spectator）；"
            + "只报**本档当场读到**的值，读不到一律 null（不编）。";

    /** 化身（第二个角色）= 玩家形状的 mannequin 实体（1.21.9+ 起存在；本仓 primer 一手证实）。 */
    public static final String BOT_TAG = "bandd_bot";
    /** 收回化身的**逐字**命令（禁列 kill 的唯一例外，不接受任何其它形态）。 */
    public static final String BOT_KILL = "kill @e[tag=" + BOT_TAG + ",limit=1]";
    private static final String BOT_SELECTOR = "@e[tag=" + BOT_TAG + ",limit=1]";

    private final GameBridge bridge;
    private final Arbitration arb = new Arbitration();
    private final ActionQueue queue = new ActionQueue();
    private final EvidenceWriter evidence;
    private final PlanInterpreter plan;
    private final String token;
    /**
     * **（半）实时游戏状态器**：地图 + 状态快照，持续刷新并缓存（查询只读缓存）。
     * 全部旋钮在 {@link StateConfig}（T3 的设置页面接这一个类）。
     */
    private final GameStateService state;
    /**
     * **那一个可手改的配置文件**（fabric-1.21.11 / neoforge-1.20.1 两档接；其余 54 档为 {@code null}）。
     * 接了 ⇒ 状态器的旋钮从文件读、设置页面写回同一个文件；没接 ⇒ 仍用内存默认值，
     * 但 {@code /status} 的 {@code settings} 段**照样**给出文件绝对路径 + 全部键名与默认值 + 手改提示。
     */
    private final Settings settings;
    // ---- 化身（第二个角色）状态 ----
    private boolean botSpawned = false;
    private boolean botFollow = false;
    private String botName = "AI";
    private String botKind = "none";
    private final List<String> chatHistory = new ArrayList<>();
    private int botFollowTick = 0;
    private final long started = System.currentTimeMillis();
    private volatile int port = 0;
    private int requests = 0;
    // ---- [T35] drop_item 的「落地校验」（跨 tick；不许同一 tick 下结论）----
    /** 点击后**最少等几个客户端 tick**再复读该格（≈5 tick ≈ 250ms @20TPS）。 */
    static final int DROP_VERIFY_MIN_TICKS = 5;
    /** 客户端 tick 计数（落地校验按 **tick** 计时，不按墙钟 —— 卡顿时 tick 才是真时间轴）。 */
    private long tickCount = 0;
    /** 当前正在执行的**排队** job（null = 直接 dispatch，例如单测 / plan）—— 只有排队路径才跨 tick。 */
    private ActionQueue.Job currentJob = null;
    /** 跨 tick 待办：drop_item 的落地校验（按 job 关联）。 */
    private final List<PendingDrop> pendingDrops = new ArrayList<PendingDrop>();
    /** 内部标记：这一发要跨 tick 完成（**绝不许漏进用户回执**，见 {@link #isDeferred}）。 */
    static final String DEFER_KEY = "__deferTicks";

    /** 老入口：**不接管配置文件**。54 个老档一行不改，行为与从前逐字一致。 */
    public PlaytestCore(GameBridge bridge, Path evidenceDir, String token) {
        this(bridge, evidenceDir, token, null);
    }

    /**
     * 新入口：接管那一个配置文件 —— 状态器的旋钮从文件读（缺键回默认），设置页面写回**同一个文件**。
     *
     * <p>为什么是**加**一个构造器而不是改老的：core 与 54 个老档共用同一份源码，
     * 改老签名会让那 54 档当场编译不过。
     */
    public PlaytestCore(GameBridge bridge, Path evidenceDir, String token, Settings settings) {
        this.bridge = bridge;
        this.evidence = new EvidenceWriter(evidenceDir);
        this.plan = new PlanInterpreter(bridge, this.evidence, evidenceDir.resolve("plan.txt"));
        this.token = token;
        this.settings = settings;
        // 状态器与设置页面**共用同一个 StateConfig 实例** ⇒ 页面上改一个值，
        // 状态器下一轮 startScan 就用新值（不需要任何「同步」代码）。见 GameStateService#config()。
        this.state = new GameStateService(bridge, settings == null ? new StateConfig() : settings.config());
        if (settings != null) settings.config().sanitize();
        logSettings();
    }

    public GameBridge bridge() { return bridge; }

    public Arbitration arbitration() { return arb; }

    public ActionQueue queue() { return queue; }

    public EvidenceWriter evidence() { return evidence; }

    public PlanInterpreter plan() { return plan; }

    /** 状态器（T3 设置页面走 {@code core.state().config()} 读写旋钮）。 */
    public GameStateService state() { return state; }

    /**
     * 那一个可手改的配置文件；本档没接就是 {@code null}（老档）。
     * 设置页面：{@code core.settings().config()} 读写旋钮，{@code core.settings().save()} 落盘。
     */
    public Settings settings() { return settings; }

    /**
     * **服务端线程**每 tick 调用（由入口挂 ServerTickEvent.Post）。
     * 为什么单独一个入口：化身是服务端对象，服务端实体的操作必须在**服务端线程**做；
     * 从客户端 tick 线程去碰它属于跨线程访问（捡拾曾因此静默失效）。
     */
    public void onServerTick() {
        bridge.tickBot();
    }

    /**
     * 化身的"跟随"：每 20 tick 把 mannequin 放到玩家侧后方 1.5 格。
     * 说明：化身是 **mannequin**（玩家形状、无连接玩家），移动靠服务端 /tp —— 不是真玩家物理。
     */
    private void botFollowStep() {
        if (!botSpawned || !botFollow) return;
        if (++botFollowTick % 20 != 0) return;
        Map<String, Object> st = Json.parseObject(bridge.playerStateJson());
        Object x = st.get("x"), y = st.get("y"), z = st.get("z");
        if (!(x instanceof Number) || !(y instanceof Number) || !(z instanceof Number)) return;
        double bx = ((Number) x).doubleValue() + 1.5;
        double by = ((Number) y).doubleValue();
        double bz = ((Number) z).doubleValue() + 1.5;
        bridge.moveBotTo(bx, by, bz);
    }

    /** 取 x/y/z 三个数字参数；缺任一返回 null。 */
    private static double[] xyz(Map<String, Object> p) {
        String x = Json.num(p, "x", ""), y = Json.num(p, "y", ""), z = Json.num(p, "z", "");
        if (x.isEmpty() || y.isEmpty() || z.isEmpty()) return null;
        try {
            return new double[] { Double.parseDouble(x), Double.parseDouble(y), Double.parseDouble(z) };
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /** tellraw 的 JSON 文本转义（反斜杠与双引号）。 */
    private static String escJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    /** 最近聊天（供 /status 的 chat 段）。 */
    public List<String> chatHistory() {
        return new ArrayList<>(chatHistory);
    }

    /** [T39] 平方（walk_to 的距离计算到处要用）。 */
    private static double sq(double v) {
        return v * v;
    }

    /**
     * [T39] 从 JSON 解析出来的数里取值。{@link Json#parseObject} 把裸数字读成 {@code Double}，
     * 字符串数字（{@code "64"}）原样留着 ⇒ 两条路都要认。取不到回 {@code dflt}（**不编 0**）。
     */
    private static double numOf(Object v, double dflt) {
        if (v instanceof Number) {
            double d = ((Number) v).doubleValue();
            return (Double.isNaN(d) || Double.isInfinite(d)) ? dflt : d;
        }
        if (v instanceof String) {
            try {
                return Double.parseDouble(((String) v).trim());
            } catch (NumberFormatException e) {
                return dflt;
            }
        }
        return dflt;
    }

    /** [T39] 危险类别去重列表（回执里 {@code dangerKinds} 用；顺序 = 出现顺序）。 */
    private static List<Object> kindsOf(List<Pathfinder.Cell> cells) {
        java.util.LinkedHashSet<String> seen = new java.util.LinkedHashSet<String>();
        for (Pathfinder.Cell c : cells) seen.add(c.kindName());
        return new ArrayList<Object>(seen);
    }

    private static String round3(double d) {
        return String.valueOf(Math.round(d * 1000.0) / 1000.0);
    }

    /** 化身自报（供 /status）。 */
    public Map<String, Object> botStatus() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("spawned", botSpawned);
        m.put("name", botName);
        m.put("kind", botKind);
        m.put("follow", botFollow);
        m.put("note2", "FakePlayer.tick() 被 NeoForge 置空 ⇒ 捡拾由本模组每 5 tick 显式驱动");
        m.put("note", "fake_player = 服务端假玩家（有物品栏/能破坏放置，但不在 PlayerList、无真实连接）；"
                + "mannequin = 玩家形状化身（无物品栏）");
        return m;
    }

    /**
     * 每个动作的等待预算（ms）。**真机教训（2026-11-01）**：open_world 读档会阻塞客户端线程
     * 十余秒 ⇒ 原先一刀切 5s 会把它误报成 PLAYTEST_TIMEOUT（动作其实成功了）。
     */
    public long timeoutMsFor(String action) {
        switch (action) {
            case "open_world": return 90000;
            case "walk_to": return 35000;
            case "screenshot": return 15000;
            case "chat_command": return 10000;
            default: return 5000;
        }
    }

    /**
     * 该动作是否允许在 **HTTP 线程**直接执行（不入 tick 队列）。
     * 为什么：`query_log` 的 waitMs 有界等待最长 60s，若放到客户端 tick 线程会把游戏冻住；
     * 它只读文件（不碰 MC 状态），所以放 HTTP 线程跑。默认 false = 一切照旧入队。
     */
    public boolean isOffThreadAction(String action) {
        return "query_log".equals(action);
    }

    public String token() { return token; }

    public void setPort(int p) { this.port = p; }

    // ================= [T35] drop_item 落地校验（跨 tick）=================

    /** 供 {@link ActionQueue} 调用：带 job 上下文的 dispatch（**只有排队路径**允许跨 tick 回执）。 */
    Map<String, Object> dispatchJob(ActionQueue.Job job, String action, Map<String, Object> p) {
        this.currentJob = job;
        try {
            return dispatch(action, p);
        } finally {
            this.currentJob = null;
        }
    }

    /**
     * 这一发是不是要**跨 tick** 完成 —— 是则**摘掉**内部标记（绝不许漏进用户回执）。
     * 只有 {@code drop_item} 的落地校验会置它。
     */
    boolean isDeferred(Map<String, Object> res) {
        return res != null && Boolean.TRUE.equals(res.remove(DEFER_KEY));
    }

    /**
     * 推进一个跨 tick 待办。返回 {@code null} = **还没到点**（下一个 tick 再来）。
     *
     * <p>到点后就地读一次 {@code inventoryJson}（适配层的内存快照），与点击前记下的期待值比对：
     * 相符 ⇒ {@code applied:true}；不符 ⇒ {@link GuiResult#DROP_ITEM_NOT_APPLIED}（fail-loud）。
     */
    Map<String, Object> advanceDeferred(ActionQueue.Job job) {
        // [T39] walk_to 的 job 也会落到 ActionQueue.waiting 里（首发是"跨 tick"），
        // 但它由 tickWalks() 自己推进并 completeNow()。这里必须**先认领**它，
        // 否则会掉进下面"待办状态丢失"的坑 —— 那是给 drop_item 用的判据，套到 walk 上就是错的。
        for (PendingWalk pw : walkSessions) {
            if (pw.job == job) return null;      // 还在走：下个 tick 再来（**不是**丢失）
        }
        PendingDrop pd = null;
        for (PendingDrop d : pendingDrops) {
            if (d.job == job) { pd = d; break; }
        }
        if (pd == null) {
            // [T39] walk_to 的会话由 tickWalks() 自己推进并 completeNow；
            // 走到这里说明这是个**已经没人认领**的 job ⇒ 如实报，不静默。
            return error("EXEC_FAILED", "跨 tick 待办状态丢失（action=" + job.action() + "）");
        }
        if (tickCount < pd.dueTick) return null;
        pendingDrops.remove(pd);
        return finishDropVerify(pd);
    }

    /** 到点复读该格，跟期待值比对 ⇒ 如实回「真丢了 / 没丢」（**不再同一 tick 下结论**）。 */
    private Map<String, Object> finishDropVerify(PendingDrop pd) {
        Map<String, Object> data = new LinkedHashMap<String, Object>(pd.phase1);
        long elapsed = tickCount - pd.clickTick;
        data.put("verified", Boolean.TRUE);
        data.put("ticksElapsed", Long.valueOf(elapsed));
        String json = bridge.inventoryJson();
        if (json == null) {
            Map<String, Object> e = error(GuiResult.DROP_ITEM_VERIFY_UNREADABLE,
                    "drop_item 落地校验到点后**读不到背包**（GameBridge#inventoryJson 回 null）"
                            + " ⇒ 校验做不了，**不假装丢成功**；请先让这一档自报 inventoryCapable");
            e.put("slot", Integer.valueOf(pd.slot));
            e.put("beforeCount", Integer.valueOf(pd.beforeCount));
            e.put("requestedCount", Integer.valueOf(pd.want));
            e.put("ticksElapsed", Long.valueOf(elapsed));
            evidence.log("[QA] drop_item: " + GuiResult.DROP_ITEM_VERIFY_UNREADABLE
                    + " slot=" + pd.slot + " before=" + pd.beforeCount + " elapsedTicks=" + elapsed);
            return e;
        }
        Map<String, Object> inv = parseInventory(json);
        Map<String, Object> hit = findSlot(inv, pd.slot);
        int actual = hit == null || !(hit.get("count") instanceof Number)
                ? 0 : ((Number) hit.get("count")).intValue();
        data.put("remaining", Integer.valueOf(actual));
        data.put("afterCount", Integer.valueOf(actual));
        data.put("empty", Boolean.valueOf(actual == 0));
        data.put("id", actual == 0 ? null
                : (hit.get("itemId") == null ? null : String.valueOf(hit.get("itemId"))));
        if (actual == pd.expectedRemaining) {
            data.put("applied", Boolean.TRUE);
            evidence.log("[QA] drop_item: 落地校验 PASS slot=" + pd.slot + " before=" + pd.beforeCount
                    + " dropped=" + pd.want + " after=" + actual + " ticks=" + elapsed);
            return ok(data);
        }
        Map<String, Object> e = error(GuiResult.DROP_ITEM_NOT_APPLIED,
                "drop_item **点击没落地**：slot=" + pd.slot + " 点击前 " + pd.beforeCount + " 个，"
                        + "请求丢 " + pd.want + " 个 ⇒ 期待剩 " + pd.expectedRemaining + " 个，"
                        + "但等 " + elapsed + " 个 tick（≥" + DROP_VERIFY_MIN_TICKS + "）后复读**仍是 "
                        + actual + " 个**。最可能的原因：菜单 containerId 与客户端当前菜单不一致"
                        + "（原版 handleInventoryMouseClick / clickSlot 只记一条 WARN 就丢掉这一击）"
                        + " ⇒ 先 press inventory / use_on 把容器界面开好再丢，"
                        + "或换一个**当前菜单里确实有**的 slot");
        e.put("data", data);
        e.put("slot", Integer.valueOf(pd.slot));
        e.put("beforeCount", Integer.valueOf(pd.beforeCount));
        e.put("requestedCount", Integer.valueOf(pd.want));
        e.put("expectedRemaining", Integer.valueOf(pd.expectedRemaining));
        e.put("actualRemaining", Integer.valueOf(actual));
        e.put("ticksElapsed", Long.valueOf(elapsed));
        evidence.log("[QA] drop_item: " + GuiResult.DROP_ITEM_NOT_APPLIED + " slot=" + pd.slot
                + " before=" + pd.beforeCount + " want=" + pd.want + " expected=" + pd.expectedRemaining
                + " actual=" + actual + " ticks=" + elapsed);
        return e;
    }

    // ================= [T39] walk_to（跨 tick 移动 + 血量保险）=================

    /** 进行中的 walk_to（每个 job 至多一个）。 */
    private final List<PendingWalk> walkSessions = new ArrayList<PendingWalk>();

    /** 当前由 walk_to 驱动并登记到 Arbitration.owned 的移动键（与 press 按下的键隔离，停走时只撤这部分）。 */
    private final java.util.Set<String> walkOwnedKeys = new java.util.LinkedHashSet<String>();

    /** 一条进行中的 walk_to：会话 + 它属于哪个 job。 */
    private static final class PendingWalk {
        final ActionQueue.Job job;
        final WalkTo.Session s;

        PendingWalk(ActionQueue.Job job, WalkTo.Session s) {
            this.job = job;
            this.s = s;
        }
    }

    /** 停走并同步撤回 walk_to 记在 Arbitration 里的移动键（不动 press 按下的键，也不清真人键）。 */
    private void stopWalkBridge() {
        bridge.walkStop();
        if (!walkOwnedKeys.isEmpty()) {
            for (String k : walkOwnedKeys) {
                arb.noteOwned(k, false);
            }
            walkOwnedKeys.clear();
        }
    }

    /** 驱动一 tick 的移动并把实际按下的移动键记入 Arbitration.owned，避免 AUTO 模式把 AI 走动误判成真人。 */
    private boolean applyWalkDrive(WalkTo.Drive d) {
        boolean drove = bridge.walkDrive(d.forward, d.strafe, d.jump, d.yaw);
        if (!drove) return false;
        syncWalkOwnedKey("forward", d.forward > 0.05f);
        syncWalkOwnedKey("back", d.forward < -0.05f);
        syncWalkOwnedKey("left", d.strafe > 0.05f);
        syncWalkOwnedKey("right", d.strafe < -0.05f);
        syncWalkOwnedKey("jump", d.jump);
        return true;
    }

    private void syncWalkOwnedKey(String key, boolean want) {
        if (want) {
            walkOwnedKeys.add(key);
            arb.noteOwned(key, true);
        } else if (walkOwnedKeys.remove(key)) {
            arb.noteOwned(key, false);
        }
    }

    /** 立即中止所有进行中的 walk_to 并释放移动键（用于 AUTO 让位 / DUAL / release_all / shutdown）。 */
    private void abortActiveWalks(String stopReason, String note) {
        stopWalkBridge();
        if (walkSessions.isEmpty()) return;
        Map<String, Object> st = Json.parseObject(bridge.playerStateJson());
        boolean present = Boolean.TRUE.equals(st.get("present"));
        double hp = present ? numOf(st.get("health"), -1) : -1;
        java.util.Iterator<PendingWalk> it = walkSessions.iterator();
        while (it.hasNext()) {
            PendingWalk pw = it.next();
            WalkTo.Session s = pw.s;
            if (s.done) {
                it.remove();
                continue;
            }
            double px = present ? numOf(st.get("x"), s.lastX) : s.lastX;
            double py = present ? numOf(st.get("y"), s.lastY) : s.lastY;
            double pz = present ? numOf(st.get("z"), s.lastZ) : s.lastZ;
            if (hp >= 0) s.hpAfter = hp;
            s.done = true;
            s.stopReason = stopReason;
            s.note = note;
            s.trail.add(stopReason + " ticks=" + s.ticks);
            evidence.log("[QA] walk_to: " + stopReason + " ticks=" + s.ticks + " -- " + note);
            pw.job.completeNow(ok(WalkTo.receipt(s, px, py, pz, false)));
            it.remove();
        }
    }

    /** 检查 AUTO 模式下真人是否介入；若介入则让位并立刻中止进行中的 walk_to。 */
    private void checkAutoYield() {
        if (arb.mode() == Arbitration.Mode.AUTO && arb.aiOwns() && arb.humanHasControl(bridge)) {
            arb.yieldToHuman(bridge, "auto-yield: human input detected");
            abortActiveWalks("YIELDED", "真人接管控制（AUTO 让位），已立即停走并释放 AI 移动键");
            evidence.log("[QA] arbitration AUTO → yield to human（已释放 AI 按下的键）");
        }
    }

    /**
     * 推进一个 walk_to。返回 {@code null} = 还没结束（下个 tick 继续）。
     *
     * <p>每 tick 的次序（**顺序不能乱**）：
     * <ol>
     *   <li>仲裁与存在性复核：失去控制权或玩家离开世界 ⇒ 立刻停手；</li>
     *   <li>读玩家位置 + 血量；血量跌破 {@code minHp} ⇒ 撤回（先停手，最重要）；</li>
     *   <li>到了没有（距离 ≤ tolerance）—— **这是唯一能下 "reached=true" 的地方**；</li>
     *   <li>下一格安全前置（standable）复验；不过 ⇒ BLOCKED（停手）；</li>
     *   <li>算这一 tick 的方向 → 交给适配层驱动移动按键并同步 Arbitration 记账；</li>
     *   <li>记账：血量、危险 tick、卡住检测、tick 预算。</li>
     * </ol>
     */
    private Map<String, Object> advanceWalk(PendingWalk pw) {
        WalkTo.Session s = pw.s;
        if (arb.mode() == Arbitration.Mode.DUAL || !arb.aiOwns()) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = arb.mode() == Arbitration.Mode.DUAL ? "DRIVER_DISABLED" : "YIELDED";
            s.note = arb.mode() == Arbitration.Mode.DUAL
                    ? "仲裁模式为 DUAL：AI 停走并释放移动键"
                    : "持权方已切为真人（" + arb.lastReason() + "）：AI 停走并释放移动键";
            s.trail.add(s.stopReason + " ticks=" + s.ticks);
            evidence.log("[QA] walk_to: " + s.stopReason + " ticks=" + s.ticks + " -- " + s.note);
            return ok(WalkTo.receipt(s, s.lastX, s.lastY, s.lastZ, false));
        }
        Map<String, Object> st = Json.parseObject(bridge.playerStateJson());
        if (!Boolean.TRUE.equals(st.get("present"))) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = WalkTo.NOT_IN_WORLD;
            s.note = "走到一半玩家没了（present != true）";
            return ok(WalkTo.receipt(s, s.lastX, s.lastY, s.lastZ, false));
        }
        double px = numOf(st.get("x"), s.lastX);
        double py = numOf(st.get("y"), s.lastY);
        double pz = numOf(st.get("z"), s.lastZ);
        double hp = numOf(st.get("health"), -1);

        // ---- ① 血量保险（**先于一切**：跌破 minHp 立刻撤）----
        if (hp >= 0 && s.hpBefore >= 0) {
            if (hp < s.minHpSeen) s.minHpSeen = hp;
            if (hp < s.hpBefore - s.damageTaken - 0.001) {
                s.damageTaken = s.hpBefore - hp;
            }
            if (hp < s.params.minHp) {
                stopWalkBridge();
                s.hpAfter = hp;
                s.damageTaken = Math.max(0, s.hpBefore - hp);
                s.done = true;
                s.stopReason = Pathfinder.DANGER_RETREAT;
                s.note = "血量 " + hp + " 跌破 minHp=" + s.params.minHp + " ⇒ **主动撤回**"
                        + (s.safeAnchor == null ? "（还没有安全锚点，就地停）"
                                : "（退回最近安全点 " + s.safeAnchor.xyz() + "）");
                s.trail.add("RETREAT hp=" + hp + " < " + s.params.minHp);
                evidence.log("[QA] walk_to: DANGER_RETREAT hp=" + hp + " < minHp=" + s.params.minHp
                        + " ticks=" + s.ticks + " damage=" + s.damageTaken);
                return ok(WalkTo.receipt(s, px, py, pz, false));
            }
        }
        s.hpAfter = hp;

        // ---- ② 到了没有（**唯一**能下 reached=true 的地方）----
        double dist = Math.sqrt(sq(px - (s.params.x + 0.5)) + sq(py - s.params.y) + sq(pz - (s.params.z + 0.5)));
        if (dist <= s.params.tolerance) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = Pathfinder.REACHED;
            double sx0 = Double.isNaN(s.startX) ? s.lastX : s.startX;
            double sy0 = Double.isNaN(s.startY) ? s.lastY : s.startY;
            double sz0 = Double.isNaN(s.startZ) ? s.lastZ : s.startZ;
            double disp = Math.sqrt(sq(px - sx0) + sq(py - sy0) + sq(pz - sz0));
            boolean actuallyMoved = disp > 0.01;
            if (s.ticks == 0 && !actuallyMoved) {
                s.note = "初始已在容差内，未发生位移（ticks=0，位移=" + round3(disp)
                        + "，距离=" + round3(dist) + " ≤ tolerance=" + s.params.tolerance
                        + "；若需精准走到方块中心，请传更小的 tolerance）";
            } else {
                s.note = "真的到了：位置与目标距离 " + round3(dist) + " ≤ tolerance=" + s.params.tolerance
                        + "（位移=" + round3(disp) + "，ticks=" + s.ticks + "）";
            }
            s.trail.add("REACHED dist=" + round3(dist) + " ticks=" + s.ticks
                    + " moved=" + actuallyMoved + " disp=" + round3(disp));
            evidence.log("[QA] walk_to: REACHED dist=" + round3(dist) + " ticks=" + s.ticks
                    + " moved=" + actuallyMoved + " disp=" + round3(disp)
                    + " hp=" + s.hpBefore + "->" + hp + " damage=" + s.damageTaken
                    + " dangerTicks=" + s.ticksInDanger);
            return ok(WalkTo.receipt(s, px, py, pz, true));
        }

        // ---- ③ tick 预算 ----
        if (s.ticks >= s.params.maxTicks) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = Pathfinder.MAX_TICKS;
            s.note = "走满 maxTicks=" + s.params.maxTicks + " 还没到（还差 " + round3(dist) + " 格）";
            s.trail.add("MAX_TICKS dist=" + round3(dist));
            evidence.log("[QA] walk_to: MAX_TICKS ticks=" + s.ticks + " dist=" + round3(dist));
            return ok(WalkTo.receipt(s, px, py, pz, false));
        }

        // ---- ④ 找下一个路点（只跳过已经"贴着"的中间路点；终点在 dist > tolerance 时绝不跳过）----
        Pathfinder.World w = s.world;
        if (s.route.isEmpty()) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = Pathfinder.BLOCKED;
            s.note = "路线为空但离目标还有 " + round3(dist) + " 格 > tolerance=" + s.params.tolerance;
            s.trail.add("BLOCKED empty route dist=" + round3(dist));
            evidence.log("[QA] walk_to: BLOCKED empty route dist=" + round3(dist) + " ticks=" + s.ticks);
            return ok(WalkTo.receipt(s, px, py, pz, false));
        }
        int idx = Math.min(s.cursor, s.route.size() - 1);
        while (idx < s.route.size() - 1) {
            Pathfinder.Cell c = s.route.get(idx);
            double d = Math.sqrt(sq(px - (c.x + 0.5)) + sq(py - c.y) + sq(pz - (c.z + 0.5)));
            if (d <= 1.15) { idx++; continue; }
            break;
        }
        s.cursor = idx;
        Pathfinder.Cell next = s.route.get(idx);

        // ---- ⑤ 下一格的安全前置（**每次移动前**复验；这是防窒息/防摔的核心）----
        // 例外：**搭桥 / 挖道**出来的路点本来就站不住（脚下是岩浆 / 原本是实心）——
        // 那正是要工程化的原因。按路点身份去重记账，然后放行；其余一律照 standable 判。
        boolean engineeredCell = false;
        String cellKey = next.x + "," + next.y + "," + next.z;
        int feetKind = w.kind(next.x, next.y, next.z);
        int headKind = w.kind(next.x, next.y + 1, next.z);
        int floorKind = w.kind(next.x, next.y - 1, next.z);
        boolean bodyFits = DangerTable.isClear(feetKind) || feetKind == DangerTable.WATER;
        if (bodyFits && headKind == DangerTable.PASSABLE
                && DangerTable.isLethal(floorKind) && s.params.cfg.allows("bridge")) {
            engineeredCell = true;                       // 桥面：脚下岩浆但脚/头都是空的
        } else if (!Pathfinder.standable(w, next.x, next.y, next.z)
                && s.params.cfg.allows("dig") && s.plan.dugBlocks > 0) {
            engineeredCell = true;                       // 挖出来的通道
        }
        if (engineeredCell && s.engineered.add(cellKey)) {
            if (DangerTable.isLethal(floorKind)) s.usedBridges++;
            else s.dugBlocks++;
            s.trail.add("engineer " + next.xyz() + (DangerTable.isLethal(floorKind) ? " bridge" : " dig"));
            evidence.log("[QA] walk_to: engineer " + next.xyz()
                    + (DangerTable.isLethal(floorKind) ? " bridge" : " dig"));
        }
        if (!engineeredCell && !Pathfinder.standable(w, next.x, next.y, next.z)) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = Pathfinder.BLOCKED;
            s.note = "下一格 " + next.xyz() + " **站不住**（脚下无实心 / 头会撞 / 未知格）⇒ 就地停，不赌";
            s.trail.add("BLOCKED standable " + next.xyz());
            evidence.log("[QA] walk_to: BLOCKED standable " + next.xyz());
            return ok(WalkTo.receipt(s, px, py, pz, false));
        }

        // ---- ⑥ 危险记账（这一 tick 是不是在危险格里）----
        int hereKind = Pathfinder.hazardKindOf(w, (int) Math.floor(px), (int) Math.floor(py + 0.001),
                (int) Math.floor(pz));
        if (hereKind != DangerTable.PASSABLE) s.ticksInDanger++;
        // 安全锚点：脚下实心 + 当前格无害 ⇒ 记下来（撤回目标）
        if (hereKind == DangerTable.PASSABLE && Boolean.TRUE.equals(bridge.playerOnGround() == null
                ? Boolean.TRUE : bridge.playerOnGround())) {
            s.safeAnchor = new Pathfinder.Cell((int) Math.floor(px), (int) Math.floor(py + 0.001),
                    (int) Math.floor(pz), null, DangerTable.PASSABLE, false);
        }

        // ---- ⑦ 卡住检测 ----
        double moved = Math.sqrt(sq(px - s.lastX) + sq(py - s.lastY) + sq(pz - s.lastZ));
        if (moved < 0.01) {
            s.stuckTicks++;
            s.waypointTicks++;
        } else {
            s.stuckTicks = 0;
            s.waypointTicks++;
        }
        if (s.waypointTicks > WalkTo.TICKS_PER_WAYPOINT && s.stuckTicks >= WalkTo.STUCK_TICKS) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = Pathfinder.BLOCKED;
            s.note = "连续 " + s.stuckTicks + " 个 tick 位置没变（卡在 " + next.xyz()
                    + "）⇒ 就地停，不硬顶";
            s.trail.add("BLOCKED stuck " + next.xyz());
            evidence.log("[QA] walk_to: BLOCKED stuck at " + next.xyz() + " ticks=" + s.ticks);
            return ok(WalkTo.receipt(s, px, py, pz, false));
        }
        if (s.waypointTicks > WalkTo.TICKS_PER_WAYPOINT * 3) {
            s.waypointTicks = 0;      // 换下一个路点重试（不走极端）
        }
        s.lastX = px;
        s.lastY = py;
        s.lastZ = pz;

        // ---- ⑧ 算方向 → 交给适配层写进游戏移动按键，并同步 Arbitration 持有记账 ----
        boolean needJump = next.y > Math.floor(py + 0.001);
        if (!s.params.allowJump && needJump && next.y - Math.floor(py + 0.001) >= 1) {
            // A* 已经把"要跳才能上"的台阶挡在 allowJump 之外；能走到这里说明是 ≤1 格的自然抬升
            // （原版 auto-jump / 台阶）。不额外拒，但如实记一笔。
        }
        WalkTo.Drive d = WalkTo.driveToward(px, py, pz, next, needJump);
        boolean drove = applyWalkDrive(d);
        if (!drove) {
            stopWalkBridge();
            s.done = true;
            s.stopReason = Pathfinder.BLOCKED;
            s.note = "适配层 walkDrive 回了 false（无玩家 / 界面正开着 / 写不进移动按键）⇒ 停，不假装在走";
            evidence.log("[QA] walk_to: walkDrive returned false");
            return ok(WalkTo.receipt(s, px, py, pz, false));
        }
        s.ticks++;
        if (s.trail.size() < 64) s.trail.add("t" + s.ticks + " " + round3(px) + "," + round3(py) + ","
                + round3(pz) + " " + d.note + (d.jump ? " jump" : ""));
        return null;
    }

    /**
     * 推进全部进行中的 walk_to（由 {@link #onTick} 调；**每 tick 一次**）。
     */
    private void tickWalks() {
        if (walkSessions.isEmpty()) return;
        java.util.Iterator<PendingWalk> it = walkSessions.iterator();
        while (it.hasNext()) {
            PendingWalk pw = it.next();
            if (pw.s.done) continue;
            if (pw.s.registeredTick == tickCount) continue;   // 本 tick 刚登记 ⇒ 下一 tick 才走第一步
            Map<String, Object> res = advanceWalk(pw);
            if (res != null) {
                pw.s.done = true;
                pw.job.completeNow(res);
                it.remove();
            }
        }
    }

    /** [T35] 一条跨 tick 待办：点击前快照 → 期待值 → 何时复读。 */
    private static final class PendingDrop {
        final ActionQueue.Job job;
        final int slot;
        final int beforeCount;
        final int want;
        final int expectedRemaining;
        final long clickTick;
        final long dueTick;
        final Map<String, Object> phase1;

        PendingDrop(ActionQueue.Job job, int slot, int beforeCount, int want,
                    int expectedRemaining, long clickTick, long dueTick, Map<String, Object> phase1) {
            this.job = job;
            this.slot = slot;
            this.beforeCount = beforeCount;
            this.want = want;
            this.expectedRemaining = expectedRemaining;
            this.clickTick = clickTick;
            this.dueTick = dueTick;
            this.phase1 = phase1;
        }
    }

    /** 客户端 tick 调用（MC 线程）。 */
    public void onTick() {
        tickCount++;     // [T35] 先走时钟：落地校验按 tick 计时
        bridge.tick();   // 让适配层有机会做「跨 tick 的持续动作」（如挖矿进度）
        state.tick();    // 状态器：**分帧**推进地图扫描（每 tick 只扫几格，绝不全扫）
        queue.drain(this);   // 先排空队列：这一 tick 可能**刚登记**一个 walk_to 会话
        checkAutoYield();    // [T41] 走动前先查 AUTO 让位：真人在本 tick 介入时不覆盖真人键
        tickWalks();         // [T39] 再推进进行中的 walk_to（顺序反了会白等一整 tick）
        plan.tick(this);
        botFollowStep();
        checkAutoYield();    // 本 tick 动作之后再核一次 AUTO 让位
    }

    public void onShutdown() {
        abortActiveWalks("SHUTDOWN", "会话关闭，已停走并释放 AI 移动键");
        arb.releaseOwned(bridge);
        evidence.log("[QA] shutdown：已释放 AI 按下的全部键");
        evidence.exitCode(0);
    }

    public Map<String, Object> status() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ok", true);
        m.put("mod", "bandd_playtest");
        m.put("platform", bridge.platform());
        m.put("mcVersion", bridge.mcVersion());
        m.put("httpPort", port);
        m.put("ready", bridge.ready());
        // 「判据不可靠」两个坑的修复口（两者都由适配层取证后透出）：
        // ① ready 在 AI 自己的单人世界里也是 true ⇒ 另给 clientPhase 区分 单机/多人（见 GameBridge#clientPhase）；
        // ② 人类日志里的 LAN 端口会残留旧会话 ⇒ lanPort 取自当前活着的集成服务器对象（见 GameBridge#lanPort）。
        m.put("clientPhase", bridge.clientPhase());
        m.put("lanPort", bridge.lanPort());
        m.put("tokenRequired", true);
        // 能力自报**按适配层自报的缺口过滤**（见 GameBridge#unavailableActions）。
        // 默认实现返回空 ⇒ 未实现的适配层行为与从前逐字一致。
        List<String> unavailable = new ArrayList<>(bridge.unavailableActions());
        // 状态器面（query_state / query_map）额外要求适配层实现 blockAt + topSolidY：
        // 那两个方法各有 default 实现（null / MIN_VALUE），**不可能从返回值区分**
        // 「本档压根没实现」与「此刻这一格真取不到」⇒ 由适配层用 stateMapCapable() 自报。
        // 默认 false ⇒ 54 个老档不用改一行，/status 里也会**如实**把它们列进 actionsUnavailable。
        if (!bridge.stateMapCapable()) {
            for (String a : Capabilities.STATE_MAP) {
                if (!unavailable.contains(a)) unavailable.add(a);
            }
            // [T13] query_column / query_blocks 依赖**同一个**取值面（blockAt）⇒ 同一条判据。
            // 不并进 STATE_MAP：那会改到既有常量（既有单测 STATE_MAP 的断言一条不动）。
            for (String a : Capabilities.STATE_QUERY) {
                if (!unavailable.contains(a)) unavailable.add(a);
            }
        }
        // 设置面同样**如实过滤**：
        //   open_settings 要「本档接了图形设置页」（Cloth 件 + 接线）—— 默认 false 的 54 档 + 11 个
        //     上游没有 Cloth 件的档都列进 actionsUnavailable，而不是谎报会开屏。
        //   settings_set / settings_save 要「本档接管了那一个配置文件」（settings != null）——
        //     没接管的档这两个动作会 fail-loud（SETTINGS_UNSUPPORTED），/status 里也如实列着。
        if (!bridge.configGuiAvailable() && !unavailable.contains("open_settings")) {
            unavailable.add("open_settings");
        }
        if (settings == null) {
            if (!unavailable.contains("settings_set")) unavailable.add("settings_set");
            if (!unavailable.contains("settings_save")) unavailable.add("settings_save");
        }
        // 背包面（query_inventory / query_inventory_slot）同样**如实过滤**：要适配层自报
        // inventoryCapable()（默认 false）⇒ 54 个老档一行不改，/status 里也如实列进 actionsUnavailable，
        // 而不是谎报「会读背包」。为什么不现场调 inventoryJson 探测：/status 跑在 HTTP 线程上（见 HttpApi）。
        if (!bridge.inventoryCapable()) {
            for (String a : Capabilities.INVENTORY) {
                if (!unavailable.contains(a)) unavailable.add(a);
            }
        }
        // [T19] 「点屏幕 / 操作容器」一族同样**如实过滤**：要适配层自报 guiActionCapable()（默认 false）
        // ⇒ 其余 54 档一行不改，/status 里也如实列进 actionsUnavailable，
        // 而不是谎报「会点屏幕 / 会读容器槽位」。为什么不现场调 slotsJson() 探测：
        // /status 跑在 HTTP 线程上（见 HttpApi），那是跨线程读游戏状态。
        if (!bridge.guiActionCapable()) {
            for (String a : Capabilities.GUI_ACTIONS) {
                if (!unavailable.contains(a)) unavailable.add(a);
            }
            // [T22] select_slot / drop_item 与那五条**同一面**（同一个自报位）⇒ 同一条判据。
            // 不并进 GUI_ACTIONS：那会改到既有常量与既有单测（GuiActionsTest F5/F7 逐字钉着
            // GUI_ACTIONS 的 5 条）；这里按 STATE_QUERY 的先例另立子表。
            for (String a : Capabilities.HOTBAR) {
                if (!unavailable.contains(a)) unavailable.add(a);
            }
        }
        // [T39] 安全移动一条同样**如实过滤**：要适配层自报 walkCapable()（默认 false）
        // ⇒ 其余 54 档一行不改，/status 里如实列进 actionsUnavailable，
        // 而不是谎报"会走路"。为什么不现场调 walkDrive 探测：/status 跑在 HTTP 线程上（见 HttpApi），
        // 那是往 MC 的输入结构里写字 —— 跨线程写游戏状态，比读还糟。
        if (!bridge.walkCapable()) {
            for (String a : Capabilities.WALK) {
                if (!unavailable.contains(a)) unavailable.add(a);
            }
        }
        List<String> available = new ArrayList<>();
        for (String a : Capabilities.all()) {
            if (!unavailable.contains(a)) available.add(a);
        }
        m.put("actions", available);
        m.put("actionsUnavailable", unavailable);
        Map<String, Object> caps = new LinkedHashMap<>();
        caps.put("bridge", Capabilities.BRIDGE);
        caps.put("driver", Capabilities.DRIVER);
        // 设置面两条是 BRIDGE 的**子集**（同 STATE_MAP 先例），这里另给一份便于调用方直接读。
        caps.put("settings", Capabilities.SETTINGS);
        // 背包面两条同样是 BRIDGE 的子集（不依赖屏幕/按键，见 Capabilities.INVENTORY 的注释）
        caps.put("inventory", Capabilities.INVENTORY);
        // [T13] 纵剖面 / 方框搜索两条同样是 BRIDGE 的子集（不依赖屏幕/按键，见 Capabilities.STATE_QUERY）
        caps.put("stateQuery", Capabilities.STATE_QUERY);
        // [T19] 「点屏幕 / 操作容器」五条是 **DRIVER 的子集**（客户端界面动作，见 Capabilities.GUI_ACTIONS）
        caps.put("guiActions", Capabilities.GUI_ACTIONS);
        // [T22] select_slot / drop_item 同为 DRIVER 的子集（与 GUI_ACTIONS 同一面，见 Capabilities.HOTBAR）
        caps.put("hotbarActions", Capabilities.HOTBAR);
        // [T39] 安全移动一条（DRIVER 的子集，见 Capabilities.WALK）
        caps.put("walk", Capabilities.WALK);
        // driver 面「可用」= 仲裁没禁它 **且** 基线 driver 动作一个不缺（保守：缺一个就报 false）
        // [T39] 判据集 = DRIVER_BASELINE（= DRIVER 去掉 WALK）。为什么把 walk_to 排除：
        // 它是一条**新能力轴**，并进这条判据会让其余 54 个"能按能挖、只是不会走路"的档
        // **当场假否定**成 driverAvailable=false。walk_to 的可用性单独由 walkAvailable 报。
        boolean driverAvailable = arb.mode() != Arbitration.Mode.DUAL;
        for (String a : Capabilities.DRIVER_BASELINE) {
            if (unavailable.contains(a)) { driverAvailable = false; break; }
        }
        caps.put("driverAvailable", driverAvailable);
        // [T39] 安全移动单独一档如实报（不看 GUI 能力，只看适配层有没有自报 walkCapable）
        boolean walkAvailable = !unavailable.contains("walk_to");
        caps.put("walkAvailable", Boolean.valueOf(walkAvailable));
        caps.put("supportedKeys", bridge.supportedKeys());
        m.put("capabilities", caps);
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("mode", arb.mode().name());
        a.put("aiOwns", arb.aiOwns());
        a.put("yields", arb.yields());
        a.put("ownedKeys", arb.ownedCount());
        a.put("lastReason", arb.lastReason());
        m.put("arbitration", a);
        m.put("plan", plan.status());
        m.put("stateMap", state.status());
        m.put("settings", settingsStatus());
        m.put("bot", botStatus());
        m.put("chatCount", chatHistory.size());
        m.put("evidenceDir", evidence.dir().toString());
        m.put("uptimeMs", System.currentTimeMillis() - started);
        m.put("requests", requests);
        return m;
    }

    /**
     * {@code /status} 的 {@code settings} 段 —— **56 档全有**，且一个字段都不谎报。
     *
     * <p>内容按用户要求给全：**文件绝对路径** + **全部键名与默认值**（{@code keys}）+
     * 能不能图形化（{@code guiAvailable}，只由适配层自报，默认 false）+ 一句
     * 「本档不支持图形设置，请手改该文件」。
     *
     * <p>11 个 Cloth **上游根本没有件**的档（liteloader / rift / modloader 三族 + forge 1.12.2 /
     * 1.13.2）额外拿到 {@code clothUpstreamMissing=true} 与点名原因 —— 这条判定用的是
     * {@link Settings#clothUpstreamMissing(String, String)} 里那张**有出处的静态表**
     * （出处 artifacts/cloth-config-调研.md），不是猜的。
     */
    public Map<String, Object> settingsStatus() {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("file", settingsFilePath());
        boolean gui = bridge.configGuiAvailable();
        boolean upstreamMissing = Settings.clothUpstreamMissing(bridge.platform(), bridge.mcVersion());
        s.put("guiAvailable", gui);
        s.put("guiProvider", gui ? bridge.configGuiProvider() : null);
        s.put("guiOpen", gui ? bridge.configGuiOpenHint() : null);
        s.put("clothUpstreamMissing", upstreamMissing);
        s.put("guiUnavailableReason", gui ? null
                : (upstreamMissing
                        ? "Cloth Config 上游没有 " + bridge.platform() + " " + bridge.mcVersion() + " 的件"
                        : "本档未接入图形设置页（Cloth 件存在但本档没接线）"));
        s.put("writable", settings == null ? null : Boolean.valueOf(settings.writable()));
        s.put("exists", settings == null ? null : Boolean.valueOf(settings.exists()));
        if (settings != null && settings.lastError() != null) s.put("lastError", settings.lastError());
        s.put("keys", Settings.defaultsDoc());
        s.put("hint", gui
                ? "游戏内改：" + bridge.configGuiOpenHint() + "；不想用界面也行 —— 直接编辑 " + settingsFilePath()
                        + "（键名与默认值见 keys）"
                : "本档不支持图形设置，请手改该文件：" + settingsFilePath()
                        + "（键名与默认值见 keys；改完重启游戏生效；越界值会被自动夹回；删掉本文件 = 回默认）");
        s.put("clothUpstreamNote", Settings.clothUpstreamNote());
        return s;
    }

    /** 配置文件绝对路径：接了就用传入的；没接就按 {@code <gameDir>/config/bandd_playtest.json} 推。 */
    private String settingsFilePath() {
        if (settings != null && settings.file() != null) return settings.file().toString();
        String dir = bridge.gameDirectory();
        if (dir == null || dir.isEmpty()) return null;
        return Paths.get(dir, "config", Settings.FILE_NAME).toString();
    }

    /** 启动时把「设置在哪、能不能图形化」写一行进 qa.log（56 档共用这一条路，老档不改一行也有）。 */
    private void logSettings() {
        Map<String, Object> s = settingsStatus();
        boolean gui = Boolean.TRUE.equals(s.get("guiAvailable"));
        evidence.log("[QA] settings: gui=" + (gui ? "available(" + s.get("guiProvider") + ")" : "unavailable")
                + " file=" + s.get("file")
                + " -- " + s.get("hint"));
    }

    /** 在 MC 线程上执行一个动作（由 ActionQueue 调用）。 */
    public Map<String, Object> dispatch(String action, Map<String, Object> p) {
        requests++;
        switch (action == null ? "" : action) {
            case "ping":
                return ok(single("pong", Boolean.TRUE));
            case "status":
                return status();
            case "query_player_state": {
                Map<String, Object> m = new LinkedHashMap<>();
                Map<String, Object> player = Json.parseObject(bridge.playerStateJson());
                // [T22] 模式 / 能力自报：**只喂这一条**（不并进 playerStateJson —— 否则会改到
                // query_state / query_map 的既有回执形状）。取不到就留 null + 人话，**不编**。
                String metaJson = bridge.playerMetaJson();
                Map<String, Object> meta = null;
                if (metaJson != null) {
                    try { meta = Json.parseObject(metaJson); } catch (RuntimeException ignored) { meta = null; }
                }
                player.put("gameMode", meta == null ? null : meta.get("gameMode"));
                player.put("flying", meta == null ? null : meta.get("flying"));
                player.put("canFly", meta == null ? null : meta.get("canFly"));
                player.put("cheats", meta == null ? null : meta.get("cheats"));
                player.put("gameModeNote", GAMEMODE_NOTE);
                player.put("playerMetaNote", meta == null
                        ? "本档不报玩家模式 / 能力（GameBridge#playerMetaJson 回 null）⇒ "
                                + "gameMode/flying/canFly/cheats 一律 null（**不编**）"
                        : (meta.get("note") == null
                                ? "本档自报玩家模式 / 能力（GameBridge#playerMetaJson）"
                                : String.valueOf(meta.get("note"))));
                m.put("player", player);
                m.put("screen", bridge.screenName());
                evidence.log("[QA] query_player_state: present=" + player.get("present")
                        + " screen=" + m.get("screen") + " gameMode=" + player.get("gameMode")
                        + " flying=" + player.get("flying") + " cheats=" + player.get("cheats"));
                return ok(m);
            }
            case "query_screen":
                return ok(single("screen", bridge.screenName()));
            case "query_widgets": {
                // 当前 Screen 的控件清单；**没有界面时返回空清单（不是错误）**。
                String json = bridge.widgetsJson();
                Object list = Json.parse(json == null ? "[]" : json);
                if (!(list instanceof List)) list = new ArrayList<>();
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("screen", bridge.screenName());
                m.put("count", ((List<?>) list).size());
                m.put("widgets", list);
                return ok(m);
            }
            case "query_log": {
                // 日志游标增量读 + 有界等待（waitMs 封顶 60s）。路径 = <gameDir>/logs/latest.log。
                String dir = bridge.gameDirectory();
                if (dir == null || dir.isEmpty()) {
                    return error("LOG_UNSUPPORTED", "本档未提供游戏目录 ⇒ 无法定位 logs/latest.log");
                }
                // 数值参数必须走 Json.num：裸数字经 Json.str 会变成 "1500.0"，Long.parseLong 当场抛错
                // 再被 catch 吞掉 ⇒ 静默落回 0（真机实证：数值 waitMs 被当成 0，70ms 就回 timedOut）。
                long since = 0L;
                try { since = Long.parseLong(Json.num(p, "sinceOffset", "0").trim()); } catch (NumberFormatException ignored) { }
                long waitMs = 0L;
                try { waitMs = Long.parseLong(Json.num(p, "waitMs", "0").trim()); } catch (NumberFormatException ignored) { }
                if (waitMs < 0) waitMs = 0;
                if (waitMs > LogTail.MAX_WAIT_MS) waitMs = LogTail.MAX_WAIT_MS;
                String pattern = Json.str(p, "waitForPattern", "");
                Path log = Paths.get(dir, "logs", "latest.log");
                try {
                    Map<String, Object> data = LogTail.read(log, since, pattern, waitMs);
                    data.put("logFile", log.toString());
                    evidence.log("[QA] query_log: since=" + since + " next=" + data.get("nextOffset")
                            + " matched=" + data.get("matched") + " timedOut=" + data.get("timedOut")
                            + " rotated=" + data.get("rotated"));
                    return ok(data);
                } catch (java.util.regex.PatternSyntaxException e) {
                    return error("BAD_PATTERN", "waitForPattern 不是合法正则：" + e.getMessage());
                } catch (java.io.IOException e) {
                    return error("LOG_READ_FAILED", "读日志失败：" + e);
                }
            }
            case "query_state": {
                // **（半）实时状态器**：状态在 mod 内持续刷新并缓存，这里只**读缓存**
                // （绝不现场全扫 —— 现场全扫会卡死 tick 线程）。
                if (!bridge.stateMapCapable()) {
                    return error("STATE_MAP_UNSUPPORTED",
                            "本档未实现状态器取值面（blockAt/topSolidY；见 GameBridge#stateMapCapable）"
                                    + " ⇒ 不假装会画地图（/status 的 actionsUnavailable 里也如实列着它）");
                }
                // [T14] 纵层参数面（yMode / yRange / yLayerMax / yModeAuto / layersMaxChars）在这里校验：
                // 参数不合法回 BAD_REQUEST（与 query_column / query_blocks 同一个落点），不混进 ok 回执。
                GameStateService.YPlan yp = state.planY(p);
                if (yp.error != null) return error("BAD_REQUEST", yp.error);
                return ok(state.query(p, yp));
            }
            case "query_map": {
                // query_map = query_state 的一个**切片**：只要地图（+ 版本/扫描进度）。
                if (!bridge.stateMapCapable()) {
                    return error("STATE_MAP_UNSUPPORTED",
                            "本档未实现状态器取值面（blockAt/topSolidY）—— query_map 同 query_state");
                }
                GameStateService.YPlan yp = state.planY(p);
                if (yp.error != null) return error("BAD_REQUEST", yp.error);
                Map<String, Object> full = state.query(p, yp);
                Map<String, Object> slice = new LinkedHashMap<>();
                // **契约统一（2026-11-10）**：query_map 与 query_state 的回执顶层都带 schema，
                // 未变（unchanged）时也一样 —— 否则调用方拿到的 {unchanged,stateVersion,tick}
                // 不知道自己读的是哪个契约的哪一版。query_map 是 query_state 的切片，故同用 STATE_SCHEMA。
                slice.put("schema", GameStateService.STATE_SCHEMA);
                slice.put("unchanged", full.get("unchanged"));
                slice.put("stateVersion", full.get("stateVersion"));
                slice.put("tick", full.get("tick"));
                if (!Boolean.TRUE.equals(full.get("unchanged"))) {
                    slice.put("mapReady", full.get("mapReady"));
                    slice.put("scan", full.get("scan"));
                    slice.put("map", full.get("map"));
                    if (full.get("mapNote") != null) slice.put("mapNote", full.get("mapNote"));
                    // step 诊断与 query_state 顶层同形（step<1 / 被夹 / 非整数倍都如实转达，不静默）
                    if (full.get("stepRequested") != null) slice.put("stepRequested", full.get("stepRequested"));
                    if (full.get("stepClampedTo") != null) slice.put("stepClampedTo", full.get("stepClampedTo"));
                    if (full.get("stepNote") != null) slice.put("stepNote", full.get("stepNote"));
                }
                return ok(slice);
            }
            // ================= 纵剖面 / 按条件搜方块（[T13] 新增面）=================
            // 为什么进 BRIDGE 而不是 DRIVER：这两条**不依赖屏幕、也不依赖按键** —— 它们只是**读数**
            // （走适配层**已有**的 blockAt(x,y,z) 取值面，任意 Y 都能取；用户原话「正好区块就是有整个
            // Z 轴的」）⇒ 与 query_state / query_map 同一面。缺口由适配层自报 stateMapCapable()，
            // 没实现的档在 /status 的 actionsUnavailable 里**如实**列着，/execute 回 STATE_MAP_UNSUPPORTED。
            case "query_column": {
                if (!bridge.stateMapCapable()) {
                    return error("STATE_MAP_UNSUPPORTED",
                            "本档未实现状态器取值面（blockAt/topSolidY；见 GameBridge#stateMapCapable）"
                                    + " ⇒ query_column 同 query_state，不假装会读方块");
                }
                if (!has(p, "x") || !has(p, "z")) {
                    return error("MISSING_REQUIRED_PARAM", "需要 x 与 z（整数世界坐标）");
                }
                Long xv = longOrNull(p, "x"), zv = longOrNull(p, "z");
                if (xv == null || zv == null) {
                    return error("BAD_REQUEST", "x/z 必须是**整值**（8 / 8.0 / \"8\" 都行；8.7 一律拒，"
                            + "不静默 floor）收到 x=" + Json.of(p.get("x")) + " z=" + Json.of(p.get("z")));
                }
                if (has(p, "y1") && longOrNull(p, "y1") == null) {
                    return error("BAD_REQUEST", "y1 必须是整值，收到 " + Json.of(p.get("y1")));
                }
                if (has(p, "y2") && longOrNull(p, "y2") == null) {
                    return error("BAD_REQUEST", "y2 必须是整值，收到 " + Json.of(p.get("y2")));
                }
                if (has(p, "maxBlocks") && longOrNull(p, "maxBlocks") == null) {
                    return error("BAD_REQUEST", "maxBlocks 必须是整值，收到 " + Json.of(p.get("maxBlocks")));
                }
                YRange yr = resolveY(p, GameStateService.COLUMN_WINDOW_UP, GameStateService.COLUMN_WINDOW_DOWN);
                if (yr == null) {
                    return error("NO_PLAYER", "y1/y2 没给全、又读不到玩家 Y ⇒ 定不出默认窗口；"
                            + "请显式给 y1 与 y2（本动作不猜世界高度）");
                }
                int mb = 0;
                if (has(p, "maxBlocks")) mb = longOrNull(p, "maxBlocks").intValue();
                Map<String, Object> col = state.queryColumn(xv.intValue(), zv.intValue(),
                        yr.y1, yr.y2, mb);
                if (yr.note != null) col.put("yDefaultNote", yr.note);
                if (yr.partial) col.put("yPartial", Boolean.TRUE);
                evidence.log("[QA] query_column: x=" + xv + " z=" + zv + " y=" + yr.y1 + ".." + yr.y2
                        + " count=" + col.get("count") + " truncated=" + col.get("truncated")
                        + " firstNonAirY=" + col.get("firstNonAirY") + " topSolidY=" + col.get("topSolidY"));
                return ok(col);
            }
            case "query_blocks": {
                if (!bridge.stateMapCapable()) {
                    return error("STATE_MAP_UNSUPPORTED",
                            "本档未实现状态器取值面（blockAt/topSolidY）—— query_blocks 同 query_state");
                }
                List<String> raw = filterList(p);
                if (raw == null) {
                    return error("MISSING_REQUIRED_PARAM",
                            "缺少 filter（字符串数组，如 [\"minecraft:stone\", \"*_ore\"]；也可给单个字符串）");
                }
                List<String> filter = new ArrayList<String>();
                for (String s : raw) {
                    if (s != null && !s.trim().isEmpty()) filter.add(s.trim());
                }
                if (filter.isEmpty()) {
                    return error("BAD_REQUEST", "filter 是**必填**且不能是空的（0 条 / 全空白 ⇒ 没有判据；"
                            + "这是调用方的错，不是「空结果」）");
                }
                if (filter.size() > GameStateService.SEARCH_MAX_FILTERS) {
                    return error("BAD_REQUEST", "filter 最多 " + GameStateService.SEARCH_MAX_FILTERS
                            + " 条，收到 " + filter.size());
                }
                if (has(p, "radius") && longOrNull(p, "radius") == null) {
                    return error("BAD_REQUEST", "radius 必须是整值，收到 " + Json.of(p.get("radius")));
                }
                if (has(p, "maxMatches") && longOrNull(p, "maxMatches") == null) {
                    return error("BAD_REQUEST", "maxMatches 必须是整值，收到 " + Json.of(p.get("maxMatches")));
                }
                if (has(p, "y1") && longOrNull(p, "y1") == null) {
                    return error("BAD_REQUEST", "y1 必须是整值，收到 " + Json.of(p.get("y1")));
                }
                if (has(p, "y2") && longOrNull(p, "y2") == null) {
                    return error("BAD_REQUEST", "y2 必须是整值，收到 " + Json.of(p.get("y2")));
                }
                YRange yr = resolveY(p, GameStateService.SEARCH_WINDOW_UP, GameStateService.SEARCH_WINDOW_DOWN);
                if (yr == null) {
                    return error("NO_PLAYER", "y1/y2 没给全、又读不到玩家 Y ⇒ 定不出默认窗口；请显式给 y1 与 y2");
                }
                int radius = has(p, "radius") ? longOrNull(p, "radius").intValue() : 0;
                int maxMatches = has(p, "maxMatches") ? longOrNull(p, "maxMatches").intValue() : 0;
                boolean refresh = Json.bool(p, "refresh", false);
                Map<String, Object> sb = state.queryBlocks(radius, yr.y1, yr.y2, filter, maxMatches, refresh);
                if (yr.note != null) sb.put("yDefaultNote", yr.note);
                if (yr.partial) sb.put("yPartial", Boolean.TRUE);
                Map<String, Object> sc = mapAtOf(sb, "scan");
                evidence.log("[QA] query_blocks: filter=" + filter + " radius=" + sb.get("radius")
                        + " matched=" + sb.get("matched") + " truncated=" + sb.get("truncated")
                        + " complete=" + sb.get("complete") + " stoppedBy=" + sb.get("stoppedBy")
                        + " remaining=" + sb.get("remainingBlocks")
                        + " scanActive=" + sc.get("active") + " done=" + sc.get("doneBlocks") + "/" + sc.get("totalBlocks"));
                return ok(sb);
            }
            // ================= 背包面（query_inventory / query_inventory_slot）=================
            // 回执形状**照桥路线**（forge 1.7.10–1.12.2 的 query_inventory/query_inventory_slot）：
            //   {size, slots:[{slot, empty, itemId, idKind, count}...]}   ← **跳过空格子**，与桥一致
            // 额外三项（玩家真用得上）：selectedSlot / mainHand / hotbar 摘要。
            // 形状对齐、**idKind 口径不同源**（现代 registryName vs 桥的 unlocalizedName）—— 回执里当面说清。
            case "query_inventory": {
                String json = bridge.inventoryJson();
                if (json == null) {
                    return error(INVENTORY_UNSUPPORTED,
                            "本档未实现读背包（GameBridge#inventoryJson 回 null）⇒ 不假装能读；"
                                    + "/status 的 actionsUnavailable 里如实列着 query_inventory/query_inventory_slot");
                }
                Map<String, Object> inv = parseInventory(json);
                inv.put("idKindNote", ID_KIND_NOTE);
                inv.put("emptySkipped", Boolean.TRUE);
                inv.put("emptySkippedNote", "slots 只列**非空**格子（与桥路线 query_inventory 一致）；"
                        + "要知道某一格空不空请用 query_inventory_slot");
                evidence.log("[QA] query_inventory: size=" + inv.get("size") + " slotCount=" + inv.get("slotCount")
                        + " selectedSlot=" + inv.get("selectedSlot"));
                return ok(inv);
            }
            case "query_inventory_slot": {
                String json = bridge.inventoryJson();
                if (json == null) {
                    return error(INVENTORY_UNSUPPORTED,
                            "本档未实现读背包（GameBridge#inventoryJson 回 null）⇒ query_inventory_slot 同 query_inventory");
                }
                if (p == null || !p.containsKey("slot") || p.get("slot") == null) {
                    return error("MISSING_REQUIRED_PARAM", "缺少 slot（整数，0..size-1）");
                }
                int slot;
                try {
                    slot = (int) Math.floor(Double.parseDouble(Json.num(p, "slot", "NaN")));
                } catch (NumberFormatException e) {
                    return error("BAD_REQUEST", "slot 必须是整数，收到：" + Json.of(p.get("slot")));
                }
                Map<String, Object> inv = parseInventory(json);
                Object sizeV = inv.get("size");
                int size = sizeV instanceof Number ? ((Number) sizeV).intValue() : -1;
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("slot", Integer.valueOf(slot));
                Map<String, Object> hit = findSlot(inv, slot);
                if (hit == null) {
                    // 空槽 / 越界都如实回 empty:true，**不许编**一个 itemId 出来（与桥路线一致）
                    data.put("empty", Boolean.TRUE);
                    data.put("itemId", null);
                    data.put("idKind", null);
                    data.put("count", Integer.valueOf(0));
                    data.put("slotNote", size >= 0 && (slot < 0 || slot >= size)
                            ? "slot 越界（size=" + size + "）⇒ 如实回 empty:true，不假装读到东西"
                            : "该格是空的 ⇒ empty:true（与桥路线一致）");
                } else {
                    data.putAll(hit);
                }
                Object sel = inv.get("selectedSlot");
                data.put("isSelectedSlot",
                        Boolean.valueOf(sel instanceof Number && ((Number) sel).intValue() == slot));
                data.put("idKindNote", ID_KIND_NOTE);
                return ok(data);
            }
            // ================= 设置面（settings_set / settings_save）=================
            // 为什么走 BRIDGE：这两条**不依赖屏幕**（core 里一个 net.minecraft.* 都没有），
            // 只动内存里的 StateConfig 与那一个文件；见 Capabilities.SETTINGS 的注释。
            case "settings_set": {
                if (settings == null) {
                    return error(SettingsEdit.UNSUPPORTED,
                            "本档没有接管配置文件（Settings=null）⇒ 不能改设置；"
                                    + "/status 的 actionsUnavailable 里如实列着它");
                }
                String key = Json.str(p, "key", "");
                if (key.isEmpty()) {
                    return error("MISSING_REQUIRED_PARAM", "缺少 key；可改的键：" + SettingsEdit.keysLine());
                }
                // **白名单**（用户拍板：禁止任意 JSON 写入）。不在表里的一律 fail-loud，
                // 且三类各有独立错误码：protected（顶层握手/装配）/ derived（派生值）/ unknown。
                if (!SettingsEdit.known(key)) {
                    Map<String, Object> e;
                    if (SettingsEdit.protectedTop(key)) {
                        e = error(SettingsEdit.PROTECTED_KEY,
                                "不许改该键：" + key + "（顶层握手/装配键，白名单外；"
                                        + "port 与 token 更是外部驱动的凭据，逐字不许动）");
                    } else if (Settings.DERIVED_KEY.equals(key)) {
                        e = error(SettingsEdit.DERIVED_KEY_CODE,
                                key + " 是派生值（(2×chunkRadius+1)×16），不是旋钮 ⇒ 改 chunkRadius 即可");
                    } else {
                        e = error(SettingsEdit.UNKNOWN_KEY, "不是可改的键：" + key);
                    }
                    e.put("key", key);
                    e.put("allowedKeys", SettingsEdit.KEYS);
                    evidence.log("[QA] settings_set: 拒绝 key=" + key + " code=" + e.get("code"));
                    return e;
                }
                if (!p.containsKey("value")) {
                    return error("MISSING_REQUIRED_PARAM",
                            "缺少 value；" + key + " 接受：" + SettingsEdit.specOf(key));
                }
                Object rawValue = p.get("value");
                SettingsEdit.Verdict verdict = SettingsEdit.coerce(key, rawValue);
                if (!verdict.ok) {
                    // **不许静默夹回**：越界/类型不符直接拒，把人话区间写进回执。
                    Map<String, Object> e = error(SettingsEdit.BAD_VALUE, "非法值：" + verdict.message);
                    e.put("key", key);
                    e.put("spec", SettingsEdit.specOf(key));
                    e.put("received", Json.of(rawValue));
                    evidence.log("[QA] settings_set: 拒绝 key=" + key + " value=" + Json.of(rawValue)
                            + " code=" + SettingsEdit.BAD_VALUE);
                    return e;
                }
                StateConfig cfg = settings.config();
                Map<String, Object> before = SettingsEdit.snapshot(cfg);
                SettingsEdit.apply(cfg, key, verdict.value);
                // 与设置页面保存按钮**同一条口径**：写完过一遍 sanitize
                // （palette 去重 / 剔除标记码；maxAutoStep 让位于 step）。连带调整如实报。
                cfg.sanitize();
                Map<String, Object> after = SettingsEdit.snapshot(cfg);
                List<String> changed = SettingsEdit.diff(before, after);
                Object effective = after.get(key);
                boolean adjusted = !SettingsEdit.same(verdict.value, effective);
                // **让状态器下一轮就用新值**：请求立刻重采（下一张图就换几何）。
                // 为什么在这里叫：状态器与设置面共用**同一个** StateConfig 实例（见构造器），
                // 但进行中的那张扫描是按开始时读到的参数跑完的 ⇒ 要立刻生效就得重新起一张。
                boolean refreshed = bridge.stateMapCapable() && state.requestRefresh();
                Map<String, Object> data = new LinkedHashMap<String, Object>();
                data.put("key", key);
                data.put("value", effective);
                data.put("requested", verdict.value);
                data.put("adjusted", Boolean.valueOf(adjusted));
                data.put("applied", Boolean.TRUE);
                data.put("sameInstanceAsStateService", Boolean.valueOf(state.config() == settings.config()));
                data.put("refreshRequested", Boolean.valueOf(refreshed));
                data.put("changedKeys", changed);
                evidence.log("[QA] settings_set: " + key + "=" + effective + " (requested="
                        + Json.of(verdict.value) + " adjusted=" + adjusted + " refresh=" + refreshed
                        + " changed=" + changed + ")");
                return ok(data);
            }
            case "settings_save": {
                if (settings == null) {
                    return error(SettingsEdit.UNSUPPORTED,
                            "本档没有接管配置文件（Settings=null）⇒ 没有可落盘的东西；"
                                    + "/status 的 actionsUnavailable 里如实列着它");
                }
                // changedKeys = 这次保存**真正会变动**的键（内存 vs 文件里现存的 state 段）。
                // 幂等判据落在它上面：连存两次，第二次必须是**空表**、sha256 也不变。
                List<String> changed = settings.changedKeysVsFile();
                boolean saved = settings.save();
                String file = settings.file() == null ? null : settings.file().toString();
                if (!saved) {
                    Map<String, Object> e = error(SettingsEdit.SAVE_FAILED,
                            "写盘失败：" + settings.lastError());
                    e.put("file", file);
                    e.put("changedKeys", changed);
                    return e;
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>();
                data.put("saved", Boolean.TRUE);
                data.put("file", file);
                data.put("changedKeys", changed);
                data.put("bytes", Long.valueOf(settings.sizeBytes()));
                data.put("sha256", settings.sha256());
                evidence.log("[QA] settings_save: file=" + file + " changedKeys=" + changed
                        + " sha256=" + data.get("sha256"));
                return ok(data);
            }
            case "open_settings": {
                // **客户端动作**：打开游戏内设置屏（Cloth）。逐档差异全在适配层的
                // GameBridge#openSettingsScreen；core 只负责「如实报有没有开出来」。
                String beforeScreen = bridge.screenName();
                if (!bridge.configGuiAvailable()) {
                    boolean upstream = Settings.clothUpstreamMissing(bridge.platform(), bridge.mcVersion());
                    Map<String, Object> e = error(SettingsEdit.GUI_UNSUPPORTED,
                            upstream
                                    ? "Cloth Config 上游没有 " + bridge.platform() + " " + bridge.mcVersion()
                                            + " 的件 ⇒ 本档没有图形设置页（不假装打开）"
                                    : "本档未接入图形设置页（Cloth 件存在但本档没接线）⇒ 不假装打开");
                    e.put("guiAvailable", Boolean.FALSE);
                    e.put("clothUpstreamMissing", Boolean.valueOf(upstream));
                    e.put("screenBefore", beforeScreen);
                    e.put("screen", beforeScreen);
                    e.put("hint", "手改配置文件：" + settingsFilePath());
                    evidence.log("[QA] open_settings: SETTINGS_GUI_UNSUPPORTED (guiAvailable=false; "
                            + "clothUpstreamMissing=" + upstream + ")");
                    return e;
                }
                String returned = bridge.openSettingsScreen();
                String afterScreen = bridge.screenName();
                if (returned == null && afterScreen == null) {
                    Map<String, Object> e = error(SettingsEdit.GUI_UNSUPPORTED,
                            "适配层自报有设置页，但没能打开（openSettingsScreen 返回 null）"
                                    + " ⇒ 如实报失败，不假装打开");
                    e.put("guiAvailable", Boolean.TRUE);
                    e.put("screenBefore", beforeScreen);
                    e.put("screen", afterScreen);
                    return e;
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>();
                data.put("opened", Boolean.TRUE);
                // 屏的类名**以此刻实际打开的 Screen 为准**（调用方拿它去 query_widgets 交叉验证）。
                data.put("screen", afterScreen == null ? returned : afterScreen);
                data.put("returnedScreen", returned);
                data.put("screenBefore", beforeScreen);
                data.put("provider", bridge.configGuiProvider());
                evidence.log("[QA] open_settings: -> " + data.get("screen") + " (before=" + beforeScreen + ")");
                return ok(data);
            }
            // ================= [T19] 点屏幕 / 操作容器 五条 =================
            // 为什么进 DRIVER：它们都是**客户端界面动作**（与 query_widgets / close_screen /
            // open_settings 同一面）。core 只做「参数解析 + 没界面 / 越界 的 fail-loud + 如实透出」，
            // 真正的 MC 调用全在适配层（GameBridge#slotsJson / clickSlot / clickWidget / useOn / placeBlock）。
            // 两档共用这一份校验 ⇒ 「越界」「没开界面」的判据逐字一致（这是 core 单测钉得住的那半边）。
            case "query_slots": {
                if (!bridge.guiActionCapable()) {
                    return error(GuiResult.UNSUPPORTED,
                            "本档未实现「点屏幕 / 操作容器」一族（GameBridge#guiActionCapable=false）"
                                    + " ⇒ 不假装能读容器槽位；/status 的 actionsUnavailable 里如实列着这五条");
                }
                String json = bridge.slotsJson();
                if (json == null) {
                    // **fail-loud**：没有界面 ⇒ 明确错误码，**绝不**假装空列表 ——
                    // 「容器里的东西读不到」与「容器是空的」是两件完全不同的事。
                    Map<String, Object> e = error(GuiResult.NO_SCREEN_OPEN,
                            "当前没有打开任何容器界面（隐藏的玩家背包也没开）⇒ 读不到槽位；"
                                    + "先用 use_on 右键工作台/熔炉/箱子，或 press inventory 打开背包");
                    e.put("screen", bridge.screenName());
                    evidence.log("[QA] query_slots: " + GuiResult.NO_SCREEN_OPEN
                            + "（screen=" + bridge.screenName() + "）");
                    return e;
                }
                Map<String, Object> data;
                try {
                    data = SlotRoles.decorate(Json.parseObject(json));
                } catch (RuntimeException ex) {
                    return error("SLOTS_PARSE_FAILED", "适配层给的槽位 JSON 解析失败：" + ex);
                }
                Map<String, Object> pr = mapAtOf(data, "playerRange");
                evidence.log("[QA] query_slots: screen=" + data.get("screen") + " menuType=" + data.get("menuType")
                        + " containerId=" + data.get("containerId") + " slotCount=" + data.get("slotCount")
                        + " playerRange=" + (pr.isEmpty() ? "null" : (pr.get("from") + ".." + pr.get("to")))
                        + " roleKnown=" + data.get("roleKnown"));
                return ok(data);
            }
            case "click_slot": {
                if (!bridge.guiActionCapable()) {
                    return error(GuiResult.UNSUPPORTED,
                            "本档未实现 click_slot（GameBridge#guiActionCapable=false）");
                }
                if (!has(p, "slot")) {
                    return error("MISSING_REQUIRED_PARAM", "缺少 slot（整数下标，0..slotCount-1）");
                }
                Long sv = longOrNull(p, "slot");
                if (sv == null) {
                    return error("BAD_REQUEST", "slot 必须是**整值**，收到：" + Json.of(p.get("slot")));
                }
                int button = 0;
                if (has(p, "button")) {
                    Long bv = longOrNull(p, "button");
                    if (bv == null) return error("BAD_REQUEST", "button 必须是整值，收到：" + Json.of(p.get("button")));
                    button = bv.intValue();
                }
                if (button != 0 && button != 1) {
                    return error("BAD_REQUEST", "button 只支持 0（左键）与 1（右键）—— 照原版点击语义；收到 " + button);
                }
                boolean shift = Json.bool(p, "shift", false);
                String json = bridge.slotsJson();
                if (json == null) {
                    Map<String, Object> e = error(GuiResult.NO_SCREEN_OPEN,
                            "当前没有打开容器界面 ⇒ 没有槽位可点；先 use_on 开容器 / press inventory");
                    e.put("screen", bridge.screenName());
                    evidence.log("[QA] click_slot: " + GuiResult.NO_SCREEN_OPEN + "（screen=" + bridge.screenName() + "）");
                    return e;
                }
                int slotCount = slotCountOf(json);
                int slot = sv.intValue();
                if (slot < 0 || (slotCount >= 0 && slot >= slotCount)) {
                    Map<String, Object> e = error(GuiResult.SLOT_OUT_OF_RANGE,
                            "slot=" + slot + " 越界（本菜单 slotCount="
                                    + (slotCount < 0 ? "读不到" : String.valueOf(slotCount)) + "；合法区间 0.."
                                    + (slotCount - 1) + "）—— 越界**不静默**当成点击了 0 号格");
                    e.put("slot", Integer.valueOf(slot));
                    e.put("slotCount", slotCount < 0 ? null : Integer.valueOf(slotCount));
                    evidence.log("[QA] click_slot: " + GuiResult.SLOT_OUT_OF_RANGE
                            + " slot=" + slot + " slotCount=" + slotCount);
                    return e;
                }
                GuiResult r = bridge.clickSlot(slot, button, shift);
                if (!r.ok) {
                    Map<String, Object> extra = new LinkedHashMap<String, Object>();
                    extra.put("slot", Integer.valueOf(slot));
                    extra.put("button", Integer.valueOf(button));
                    extra.put("shift", Boolean.valueOf(shift));
                    return guiFail("click_slot", r, extra);
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>(r.data);
                data.put("slot", Integer.valueOf(slot));
                data.put("button", Integer.valueOf(button));
                data.put("shift", Boolean.valueOf(shift));
                // 原版点击类型的落点（如实写清我们按 shift/button 映射到哪个枚举常量）
                data.put("actionType", shift ? "QUICK_MOVE" : "PICKUP");
                data.put("actionTypeNote", shift
                        ? "shift=true ⇒ QUICK_MOVE（快速移动，原版 shift 左键）"
                        : (button == 1
                                ? "button=1 ⇒ PICKUP（原版右键：拿一半 / 放一个）"
                                : "button=0 ⇒ PICKUP（原版左键：拿/放整叠）"));
                data.put("slotCount", slotCount < 0 ? null : Integer.valueOf(slotCount));
                evidence.log("[QA] click_slot: slot=" + slot + " button=" + button + " shift=" + shift
                        + " actionType=" + data.get("actionType") + " containerId=" + data.get("containerId")
                        + " slotCount=" + slotCount);
                return ok(data);
            }
            case "click_widget": {
                if (!bridge.guiActionCapable()) {
                    return error(GuiResult.UNSUPPORTED,
                            "本档未实现 click_widget（GameBridge#guiActionCapable=false）");
                }
                if (!has(p, "index")) {
                    return error("MISSING_REQUIRED_PARAM", "缺少 index（对应 query_widgets 列表里的下标）");
                }
                Long iv = longOrNull(p, "index");
                if (iv == null) {
                    return error("BAD_REQUEST", "index 必须是整值，收到：" + Json.of(p.get("index")));
                }
                String screen = bridge.screenName();
                if (screen == null) {
                    Map<String, Object> e = error(GuiResult.NO_SCREEN_OPEN,
                            "当前没有打开任何界面 ⇒ 没有控件可点（先 open_settings / use_on 打开一个界面）");
                    e.put("screen", null);
                    evidence.log("[QA] click_widget: " + GuiResult.NO_SCREEN_OPEN + "（screen=null）");
                    return e;
                }
                String wj = bridge.widgetsJson();
                Object wl = Json.parse(wj == null ? "[]" : wj);
                int count = (wl instanceof List) ? ((List<?>) wl).size() : 0;
                int index = iv.intValue();
                if (index < 0 || index >= count) {
                    Map<String, Object> e = error(GuiResult.WIDGET_OUT_OF_RANGE,
                            "index=" + index + " 越界（当前界面 " + screen + " 的控件数=" + count
                                    + "；合法区间 0.." + (count - 1) + "）—— 先 query_widgets 取清单");
                    e.put("index", Integer.valueOf(index));
                    e.put("widgetCount", Integer.valueOf(count));
                    e.put("screen", screen);
                    evidence.log("[QA] click_widget: " + GuiResult.WIDGET_OUT_OF_RANGE
                            + " index=" + index + " count=" + count);
                    return e;
                }
                GuiResult r = bridge.clickWidget(index);
                if (!r.ok) {
                    Map<String, Object> extra = new LinkedHashMap<String, Object>();
                    extra.put("index", Integer.valueOf(index));
                    extra.put("screen", screen);
                    extra.put("widgetCount", Integer.valueOf(count));
                    return guiFail("click_widget", r, extra);
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>(r.data);
                data.put("index", Integer.valueOf(index));
                data.put("screen", screen);
                data.put("widgetCount", Integer.valueOf(count));
                data.put("clickPath", "界面鼠标点击入口（Screen.mouseClicked）敲控件中心 —— "
                        + "**不是** OS 级按键/鼠标注入");
                evidence.log("[QA] click_widget: index=" + index + " screen=" + screen
                        + " type=" + data.get("type") + " at=" + data.get("x") + "," + data.get("y")
                        + " accepted=" + data.get("accepted"));
                return ok(data);
            }
            case "use_on": {
                if (!bridge.guiActionCapable()) {
                    return error(GuiResult.UNSUPPORTED, "本档未实现 use_on（GameBridge#guiActionCapable=false）");
                }
                if (!has(p, "x") || !has(p, "y") || !has(p, "z")) {
                    return error("MISSING_REQUIRED_PARAM", "需要 x/y/z（整数方块坐标）");
                }
                Long xv = longOrNull(p, "x"), yv = longOrNull(p, "y"), zv = longOrNull(p, "z");
                if (xv == null || yv == null || zv == null) {
                    return error("BAD_REQUEST", "x/y/z 必须是**整值**（8 / 8.0 / \"8\" 都行；8.7 一律拒，"
                            + "不静默 floor）收到 x=" + Json.of(p.get("x")) + " y=" + Json.of(p.get("y"))
                            + " z=" + Json.of(p.get("z")));
                }
                GuiResult r = bridge.useOn(xv.doubleValue(), yv.doubleValue(), zv.doubleValue());
                if (!r.ok) {
                    Map<String, Object> extra = new LinkedHashMap<String, Object>();
                    extra.put("x", xv);
                    extra.put("y", yv);
                    extra.put("z", zv);
                    return guiFail("use_on", r, extra);
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>(r.data);
                data.put("x", xv);
                data.put("y", yv);
                data.put("z", zv);
                evidence.log("[QA] use_on: (" + xv + "," + yv + "," + zv + ") result=" + data.get("result")
                        + " screen=" + data.get("screen"));
                return ok(data);
            }
            case "place_block": {
                if (!bridge.guiActionCapable()) {
                    return error(GuiResult.UNSUPPORTED, "本档未实现 place_block（GameBridge#guiActionCapable=false）");
                }
                if (!has(p, "x") || !has(p, "y") || !has(p, "z")) {
                    return error("MISSING_REQUIRED_PARAM", "需要 x/y/z（整数方块坐标）");
                }
                Long xv = longOrNull(p, "x"), yv = longOrNull(p, "y"), zv = longOrNull(p, "z");
                if (xv == null || yv == null || zv == null) {
                    return error("BAD_REQUEST", "x/y/z 必须是**整值**（8 / 8.0 / \"8\" 都行；8.7 一律拒，"
                            + "不静默 floor）收到 x=" + Json.of(p.get("x")) + " y=" + Json.of(p.get("y"))
                            + " z=" + Json.of(p.get("z")));
                }
                GuiResult r = bridge.placeBlock(xv.doubleValue(), yv.doubleValue(), zv.doubleValue());
                if (!r.ok) {
                    Map<String, Object> extra = new LinkedHashMap<String, Object>();
                    extra.put("x", xv);
                    extra.put("y", yv);
                    extra.put("z", zv);
                    return guiFail("place_block", r, extra);
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>(r.data);
                data.put("x", xv);
                data.put("y", yv);
                data.put("z", zv);
                evidence.log("[QA] place_block: (" + xv + "," + yv + "," + zv + ") placed=" + data.get("placed")
                        + " held=" + data.get("held") + " support=" + data.get("support"));
                return ok(data);
            }
            // ================= [T22] select_slot / drop_item（与上面一族**同一面**）=================
            // 为什么进 DRIVER：两条都是**玩家级**动作（切本档的选中槽 / 走客户端交互管理器丢格子）——
            // 与 click_slot 同一面。core 只做「参数解析 + 越界 / 缺省 的 fail-loud + 如实透出」，
            // 真正的 MC 调用全在适配层（GameBridge#selectSlot / dropItem）。
            case "select_slot": {
                if (!bridge.guiActionCapable()) {
                    return error(GuiResult.UNSUPPORTED,
                            "本档未实现 select_slot（GameBridge#guiActionCapable=false）"
                                    + " ⇒ /status 的 actionsUnavailable 里如实列着它");
                }
                if (!has(p, "slot")) {
                    return error("MISSING_REQUIRED_PARAM", "缺少 slot（整数，快捷栏 0..8）");
                }
                Long sv = longOrNull(p, "slot");
                if (sv == null) {
                    return error("BAD_REQUEST", "slot 必须是**整值**（8 / 8.0 / \"8\" 都行；8.7 一律拒，"
                            + "不静默 floor）收到：" + Json.of(p.get("slot")));
                }
                int slot = sv.intValue();
                if (slot < 0 || slot > 8) {
                    Map<String, Object> e = error(GuiResult.SLOT_OUT_OF_RANGE,
                            "slot=" + slot + " 越界（快捷栏合法区间 0..8）—— 越界**不静默**当成切到 0 号槽");
                    e.put("slot", Integer.valueOf(slot));
                    e.put("slotMin", Integer.valueOf(0));
                    e.put("slotMax", Integer.valueOf(8));
                    evidence.log("[QA] select_slot: " + GuiResult.SLOT_OUT_OF_RANGE + " slot=" + slot);
                    return e;
                }
                // [T39-①] **先发原版包把选中槽同步给服务端，再读回执**。
                // 为什么顺序不能反：旧实现只改客户端字段（Inventory.selected /
                // PlayerInventory.setSelectedSlot），服务端仍认为玩家空手 ⇒ 挖石头走「空手破坏」
                // 分支 ⇒ 石头不掉 cobblestone（requiresCorrectToolForDrops），泥土/原木照掉
                // ⇒ 真机现象「只捡得到泥土与原木」。见 GameBridge#setSelectedSlotSynced 的取证注释。
                //
                // 两条路都试，**按本档自报**：
                //   ① slotSyncCapable()==true ⇒ 走 setSelectedSlotSynced（切字段 + 发原版包）
                //   ② 否则 ⇒ 退回老的 selectSlot（只切字段），回执里 serverSynced=null 如实说"没同步"
                GuiResult r;
                boolean syncPath = bridge.slotSyncCapable();
                if (syncPath) {
                    GuiResult sr = bridge.setSelectedSlotSynced(slot);
                    if (sr == null) {
                        // 自报会、实际回 null ⇒ 这是适配层的 bug，**不静默**，回落老路并如实标注
                        r = bridge.selectSlot(slot);
                        syncPath = false;
                    } else {
                        r = sr;
                    }
                } else {
                    r = bridge.selectSlot(slot);
                }
                if (!r.ok) {
                    Map<String, Object> extra = new LinkedHashMap<String, Object>();
                    extra.put("slot", Integer.valueOf(slot));
                    return guiFail("select_slot", r, extra);
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>(r.data);
                data.put("slot", Integer.valueOf(slot));

                // ---- 服务端同步的**三态诚实字段**（true / false / null，绝不假装）----
                Boolean serverSynced = null;
                Object packetSent = data.get("packetSent");
                if (syncPath && packetSent instanceof Boolean) {
                    serverSynced = (Boolean) packetSent;
                    data.put("packetSent", packetSent);
                    if (data.get("packetClass") != null) data.put("packetClass", data.get("packetClass"));
                    data.put("syncNote", Boolean.TRUE.equals(packetSent)
                            ? "已按原版那条路把新槽位发进连接（" + data.get("packetClass")
                                    + "）⇒ **服务端收到了这个包**。注意：客户端**看不见**服务端随后怎么用它，"
                                    + "真正的端到端判据是「挖一个需要正确工具的方块能否掉落」（serverConfirmed）"
                            : "槽位改了但**没有连接可发**（还没进世界 / 单人菜单）⇒ 服务端**不会**知道；"
                                    + "回执里 serverSynced=false，不假装同步了");
                } else {
                    data.put("syncNote", "本档未实现「发原版包同步选中槽」（GameBridge#slotSyncCapable=false）"
                            + " ⇒ 只改了客户端字段，**服务端可能仍认为玩家空手**（真机铁证：石头不掉 cobblestone）。"
                            + "绕过办法：把工具放快捷栏 slot 0 再 select_slot{0}，并用 query_inventory 复核"
                            + " selected===0 && mainHand.itemId===工具");
                }
                data.put("serverSynced", serverSynced);

                // 与 query_inventory 的**交叉验证**：能读背包才给这几项（读不到就**不给**，不编）。
                String invJson = bridge.inventoryJson();
                if (invJson != null) {
                    Map<String, Object> inv = parseInventory(invJson);
                    Object isel = inv.get("selectedSlot");
                    Object asel = data.get("selectedSlot");
                    data.put("inventorySelectedSlot", isel);
                    data.put("inventoryMainHand", inv.get("mainHand"));
                    Boolean clientConsistent = null;
                    if (asel instanceof Number && isel instanceof Number) {
                        clientConsistent = Boolean.valueOf(((Number) asel).intValue() == ((Number) isel).intValue()
                                && ((Number) isel).intValue() == slot);
                    }
                    // [T39-①] **改名 + 诚实披露**：consistent 只比对**客户端两处读数**
                    // （适配层回执的 selectedSlot 与 query_inventory 的 selectedSlot），
                    // 它**证明不了**服务端认了。旧名字有误导性 ⇒ 改叫 clientConsistent；
                    // 旧键 consistent 保留一轮（见下方 compat 注释），值 = clientConsistent，
                    // 不破坏既有断言（T22ActionsTest A4 钉着 Boolean.TRUE.equals(d1.get("consistent"))）。
                    data.put("clientConsistent", clientConsistent);
                    data.put("consistent", clientConsistent);
                    data.put("clientConsistentNote",
                            "clientConsistent 只比对**客户端**两处读数（适配层回执的 selectedSlot 与 "
                                    + "query_inventory 的 selectedSlot）—— 它**证明不了服务端认了**；"
                                    + "旧键名 consistent 仍在（同值，兼容既有断言），但语义就是这一个");
                    // 服务端到底认没认：客户端看不见 ⇒ 只有间接判据（挖方块能否掉落）。
                    // 这里**不给** true/false，只如实说明"需要真机判据"，绝不假装已确认。
                    data.put("serverConfirmed", null);
                    data.put("serverConfirmedNote",
                            "serverConfirmed **一律 null**：客户端看不到服务端的选中槽状态，"
                                    + "无法在离线/客户端侧下这个结论。**唯一的端到端判据是真机**："
                                    + "让玩家挖一个 requiresCorrectToolForDrops 的方块（如 stone），"
                                    + "看它掉不掉 cobblestone —— 掉 ⇒ 服务端认了；不掉 ⇒ 服务端仍认为空手。"
                                    + "本字段永远不会被本模组写成 true（那会是编造）");
                }
                evidence.log("[QA] select_slot: slot=" + slot + " previous=" + data.get("previousSlot")
                        + " selected=" + data.get("selectedSlot") + " mainHand=" + data.get("mainHand")
                        + " inventorySelected=" + data.get("inventorySelectedSlot")
                        + " serverSynced=" + data.get("serverSynced")
                        + " packet=" + data.get("packetClass"));
                return ok(data);
            }
            // ================= [T39-③ / T41] walk_to（安全移动 + A* 真寻路）=================
            // 语义：把玩家**走到**目标点附近（**不是瞬移**）。三层分工，各管一件事：
            //   ① {@link Pathfinder}：路怎么走（A*；避开岩浆/水/火/仙人掌/甜浆果/粉雪/悬崖/窒息位）
            //   ② {@link WalkTo}：这一 tick 该给什么输入 + 全账（血 / 危险 tick / 搭桥 / 撤回 / 真实位移）
            //   ③ 适配层 {@link GameBridge#walkDrive}：驱动**游戏自己的**移动按键状态
            //      （neo: KeyMapping#setDown；fabric: KeyBinding#setPressed），并由 core 同步给 Arbitration
            //      —— **绝不许**宿主级置前 / 键鼠注入。
            //
            // "能走"与"敢走"分开：不给许可时危险格不可通行，回执给 stopReason=DANGER +
            // dangerAt/dangerKind/detourAvailable + 安全路线长度与危险计数；plan_only:true
            // 则只算路不动人（回路线长度 / 危险清单 / 按原版公式估的伤害 / 有没有更安全的备选）。
            case "walk_to": {
                if (!bridge.walkCapable()) {
                    return error(WalkTo.UNSUPPORTED,
                            "本档未实现移动面（GameBridge#walkCapable=false）⇒ 不假装会走；"
                                    + "/status 的 actionsUnavailable 里如实列着 walk_to");
                }
                WalkTo.Params wp = WalkTo.parse(p);
                if (wp.error != null) {
                    Map<String, Object> e = error(wp.error, wp.errorMessage);
                    if (WalkTo.MISSING_REQUIRED_PARAM.equals(wp.error) || WalkTo.BAD_REQUEST.equals(wp.error)) {
                        e.put("paramNote", "x/y/z 必填；tolerance=1.0；maxTicks=600；allowJump=false；"
                                + "allow=[\"water\"]（默认只许水）；minHp=10；plan_only=false");
                    }
                    evidence.log("[QA] walk_to: " + wp.error + " -- " + wp.errorMessage);
                    return e;
                }
                // 读玩家当前位置（读不到就如实拒，不猜）
                Map<String, Object> st = Json.parseObject(bridge.playerStateJson());
                if (!Boolean.TRUE.equals(st.get("present"))) {
                    return error(WalkTo.NOT_IN_WORLD, "读不到玩家（playerStateJson.present != true）⇒ 不猜位置");
                }
                double px = numOf(st.get("x"), Double.NaN);
                double py = numOf(st.get("y"), Double.NaN);
                double pz = numOf(st.get("z"), Double.NaN);
                if (Double.isNaN(px) || Double.isNaN(py) || Double.isNaN(pz)) {
                    return error(WalkTo.NOT_IN_WORLD, "玩家坐标读不出来（x/y/z 有 NaN）⇒ 不猜位置");
                }
                int sx = (int) Math.floor(px);
                int sy = (int) Math.floor(py + 0.001);   // 站在 y 上时 py 往往是 64.0，floor 就是 64
                int sz = (int) Math.floor(pz);

                // 目标格的安全前置（**不移动先判**）：目标那格站得住吗
                Pathfinder.World world = new Pathfinder.World(bridge);
                int tgtFeet = world.kind(wp.x, wp.y, wp.z);
                int tgtHead = world.kind(wp.x, wp.y + 1, wp.z);
                int tgtFloor = world.kind(wp.x, wp.y - 1, wp.z);
                if (!Pathfinder.standable(world, wp.x, wp.y, wp.z)) {
                    Map<String, Object> e = error(WalkTo.WALK_BLOCKED,
                            "目标格 (" + wp.x + "," + wp.y + "," + wp.z + ") **站不住** ⇒ 不移动（这是防窒息/防摔的"
                                    + "第一道闸）。判据：脚下必须是实心（当前 " + DangerTable.kindName(tgtFloor)
                                    + "）、脚那格与头那格必须是空气（当前 脚=" + DangerTable.kindName(tgtFeet)
                                    + " 头=" + DangerTable.kindName(tgtHead) + "）");
                    e.put("target", WalkTo.xyzMap(wp.x, wp.y, wp.z));
                    e.put("targetFeet", DangerTable.kindName(tgtFeet));
                    e.put("targetHead", DangerTable.kindName(tgtHead));
                    e.put("targetFloor", DangerTable.kindName(tgtFloor));
                    e.put("moved", Boolean.FALSE);
                    evidence.log("[QA] walk_to: WALK_BLOCKED target=(" + wp.x + "," + wp.y + "," + wp.z + ")"
                            + " feet=" + DangerTable.kindName(tgtFeet) + " head=" + DangerTable.kindName(tgtHead)
                            + " floor=" + DangerTable.kindName(tgtFloor));
                    return e;
                }

                Pathfinder.Result plan = Pathfinder.plan(world, wp.cfg, sx, sy, sz, wp.x, wp.y, wp.z);
                String planNote = plan.note;

                // ---- plan_only：只算路，**一步都不走** ----
                if (wp.planOnly) {
                    Map<String, Object> d = new LinkedHashMap<String, Object>();
                    d.put("from", WalkTo.xyzMap(sx, sy, sz));
                    d.put("to", WalkTo.xyzMap(wp.x, wp.y, wp.z));
                    d.put("reached", Boolean.FALSE);      // plan_only **永远不是到达**
                    d.put("ticks", Integer.valueOf(0));
                    d.put("moved", Boolean.FALSE);
                    d.put("planOnly", Boolean.TRUE);
                    d.put("stopReason", Pathfinder.PLANNED);
                    d.put("planFound", Boolean.valueOf(plan.found));
                    d.put("planStopReason", plan.stopReason);
                    d.put("distance", Double.valueOf(round3(Math.sqrt(
                            sq(px - (wp.x + 0.5)) + sq(py - wp.y) + sq(pz - (wp.z + 0.5))))));
                    d.put("tolerance", Double.valueOf(wp.tolerance));
                    d.put("routeLength", Double.valueOf(Math.round(plan.length * 100.0) / 100.0));
                    d.put("waypointCount", Integer.valueOf(plan.path.size()));
                    d.put("nodesExpanded", Integer.valueOf(plan.nodesExpanded));
                    d.put("planMillis", Long.valueOf(plan.elapsedMs));
                    d.put("budgetHit", Boolean.valueOf(plan.budgetHit));
                    List<Object> dangerList = new ArrayList<Object>();
                    for (Pathfinder.Cell c : plan.dangers) {
                        Map<String, Object> m = WalkTo.xyzMap(c);
                        m.put("block", c.block);
                        m.put("dangerKind", c.kindName());
                        m.put("estimatedDamage", Double.valueOf(DangerTable.hazardDamagePerStep(c.kind)));
                        dangerList.add(m);
                    }
                    d.put("dangers", dangerList);
                    d.put("dangerCount", Integer.valueOf(plan.dangers.size()));
                    d.put("dangerKinds", kindsOf(plan.dangers));
                    d.put("estimatedDamage", Double.valueOf(Math.round(plan.estimatedDamage * 100.0) / 100.0));
                    d.put("estimated", Boolean.TRUE);
                    d.put("estimatedNote", "estimatedDamage 按**原版公式**估（摔落 ceil((h-3)*m)；"
                            + "火/仙人掌/甜浆果/粉雪/岩浆块按每格固定值）—— 是估算，不是承诺");
                    d.put("swimSteps", Integer.valueOf(plan.swimSteps));
                    d.put("swimTicks", Integer.valueOf(plan.swimSteps * 2));
                    d.put("detourAvailable", Boolean.valueOf(plan.detourAvailable));
                    d.put("safeRouteLength", plan.safeRouteLen);
                    d.put("safeRouteDangerCount", plan.safeRouteDangerCount);
                    d.put("riskRouteLength", plan.riskRouteLen);
                    d.put("riskRouteDangerCount", plan.riskRouteDangerCount);
                    d.put("riskRouteDamage", plan.riskRouteDamage);
                    d.put("needAllow", new ArrayList<Object>(plan.needAllow));
                    d.put("allow", new ArrayList<Object>(wp.cfg.allow));
                    d.put("note", planNote);
                    d.put("hpBefore", numOf(st.get("health"), Double.NaN));
                    d.put("hpAfter", numOf(st.get("health"), Double.NaN));
                    d.put("damageTaken", Double.valueOf(0));
                    d.put("ticksInDanger", Integer.valueOf(0));
                    d.put("usedBridges", Integer.valueOf(plan.usedBridges));
                    d.put("dugBlocks", Integer.valueOf(plan.dugBlocks));
                    d.put("accountingNote", "plan_only **没有移动任何人** ⇒ damageTaken 恒 0、ticks 恒 0；"
                            + "线路本身的代价看 estimatedDamage / riskRouteDamage");
                    evidence.log("[QA] walk_to: plan_only from=(" + sx + "," + sy + "," + sz + ") to=("
                            + wp.x + "," + wp.y + "," + wp.z + ") found=" + plan.found
                            + " len=" + d.get("routeLength") + " dangers=" + d.get("dangerCount")
                            + " stop=" + plan.stopReason);
                    return ok(d);
                }

                // ---- 仲裁门控（只挡实际移动；plan_only 不碰按键，上面已返回）----
                if (arb.mode() == Arbitration.Mode.DUAL) {
                    Map<String, Object> e = error("DRIVER_DISABLED",
                            "仲裁模式 DUAL：AI 不碰按键，禁止 walk_to（只规划路线请传 plan_only:true）");
                    e.put("moved", Boolean.FALSE);
                    return e;
                }
                if (!arb.aiOwns()) {
                    Map<String, Object> e = error("NOT_OWNING",
                            "当前持权方是真人（" + arb.lastReason()
                                    + "），禁止 walk_to（先 take_over，或传 plan_only:true 只规划）");
                    e.put("moved", Boolean.FALSE);
                    return e;
                }

                // ---- 路线不可行：停下来把代价说清楚（**不移动**）----
                if (!plan.found) {
                    if (Pathfinder.DANGER.equals(plan.stopReason)) {
                        Map<String, Object> e = error(WalkTo.WALK_BLOCKED,
                                "按当前 allow 走不过去，**没有移动**。" + planNote);
                        e.put("stopReason", Pathfinder.DANGER);
                        e.put("dangerKind", plan.dangerKind);
                        e.put("dangerAt", plan.dangerAt == null ? null : WalkTo.xyzMap(plan.dangerAt));
                        e.put("dangerBlock", plan.dangerAt == null ? null : plan.dangerAt.block);
                        e.put("detourAvailable", Boolean.valueOf(plan.detourAvailable));
                        e.put("safeRouteLength", plan.safeRouteLen);
                        e.put("safeRouteDangerCount", plan.safeRouteDangerCount);
                        e.put("riskRouteLength", plan.riskRouteLen);
                        e.put("riskRouteDangerCount", plan.riskRouteDangerCount);
                        e.put("riskRouteDamage", plan.riskRouteDamage);
                        e.put("needAllow", new ArrayList<Object>(plan.needAllow));
                        e.put("moved", Boolean.FALSE);
                        evidence.log("[QA] walk_to: DANGER at " + e.get("dangerAt") + " kind=" + plan.dangerKind
                                + " detour=" + plan.detourAvailable + " needAllow=" + plan.needAllow);
                        return e;
                    }
                    Map<String, Object> e = error(
                            Pathfinder.BUDGET.equals(plan.stopReason) ? WalkTo.WALK_TIMEOUT : WalkTo.WALK_BLOCKED,
                            planNote);
                    e.put("stopReason", plan.stopReason);
                    e.put("nodesExpanded", Integer.valueOf(plan.nodesExpanded));
                    e.put("planMillis", Long.valueOf(plan.elapsedMs));
                    e.put("moved", Boolean.FALSE);
                    e.put("budgetNote", Pathfinder.BUDGET.equals(plan.stopReason)
                            ? "这是**没搜完**，不是「到不了」；调大 maxNodes/maxMillis 再试" : null);
                    evidence.log("[QA] walk_to: " + plan.stopReason + " nodes=" + plan.nodesExpanded
                            + " millis=" + plan.elapsedMs);
                    return e;
                }

                // ---- 真的要走：建会话并登记为跨 tick 待办 ----
                WalkTo.Session s = new WalkTo.Session(wp, plan, world);
                s.hpBefore = numOf(st.get("health"), -1);
                s.hpAfter = s.hpBefore;
                s.minHpSeen = s.hpBefore;
                s.startX = px;
                s.startY = py;
                s.startZ = pz;
                s.lastX = px;
                s.lastY = py;
                s.lastZ = pz;
                s.trail.add("start " + WalkTo.xyzMap(sx, sy, sz) + " hp=" + s.hpBefore
                        + " route=" + plan.path.size() + " dangers=" + plan.dangers.size());
                s.registeredTick = tickCount;
                walkSessions.add(new PendingWalk(currentJob, s));
                evidence.log("[QA] walk_to: start from=(" + sx + "," + sy + "," + sz + ") to=("
                        + wp.x + "," + wp.y + "," + wp.z + ") route=" + plan.path.size()
                        + " dangers=" + plan.dangers.size() + " allow=" + wp.cfg.allow
                        + " maxTicks=" + wp.maxTicks + " minHp=" + wp.minHp);
                // 计划里已经算出来的搭桥 / 挖道次数先记上（执行期按路点去重后**不重复加**）
        s.usedBridges = 0;
        s.dugBlocks = 0;
        Map<String, Object> first = new LinkedHashMap<String, Object>();
                // 跨 tick：本 tick 只登记，不下结论。
                // **必须是 Boolean.TRUE** —— isDeferred() 用的是 Boolean.TRUE.equals(...)，
                // 写 Integer 1 会被静默判成"不是跨 tick"，job 立刻带着空回执完成（真机上就是"回 ok 但人没动"）。
                first.put(DEFER_KEY, Boolean.TRUE);
                return first;
            }
            case "drop_item": {
                if (!bridge.guiActionCapable()) {
                    return error(GuiResult.UNSUPPORTED,
                            "本档未实现 drop_item（GameBridge#guiActionCapable=false）"
                                    + " ⇒ /status 的 actionsUnavailable 里如实列着它");
                }
                int slot = -1;                     // -1 = 未给 ⇒ 用当前选中槽
                if (has(p, "slot")) {
                    Long sv = longOrNull(p, "slot");
                    if (sv == null) {
                        return error("BAD_REQUEST", "slot 必须是**整值**，收到：" + Json.of(p.get("slot")));
                    }
                    slot = sv.intValue();
                }
                boolean all = Json.bool(p, "all", false);
                int count = -1;                    // -1 = 未给 ⇒ 整叠
                boolean countGiven = false;
                if (has(p, "count")) {
                    Long cv = longOrNull(p, "count");
                    if (cv == null) {
                        return error("BAD_REQUEST", "count 必须是**整值**，收到：" + Json.of(p.get("count")));
                    }
                    if (cv.intValue() <= 0) {
                        return error("BAD_REQUEST",
                                "count 必须 ≥ 1（要丢整叠请用 all=true 或省略 count）；收到 " + cv);
                    }
                    count = cv.intValue();
                    countGiven = true;
                    all = false;                   // 显式 count 优先于 all（回执里 all/requestedCount 写清）
                }
                // 缺省槽与上界：能读背包就先拦一道（读不到就让适配层拦，**绝不编** size/selectedSlot）。
                String invJson = bridge.inventoryJson();
                Map<String, Object> inv = invJson == null ? null : parseInventory(invJson);
                if (slot < 0 && inv != null) {
                    Object sel = inv.get("selectedSlot");
                    if (sel instanceof Number) slot = ((Number) sel).intValue();
                }
                if (inv != null && slot >= 0) {
                    Object sz = inv.get("size");
                    int size = sz instanceof Number ? ((Number) sz).intValue() : -1;
                    if (size >= 0 && slot >= size) {
                        Map<String, Object> e = error(GuiResult.SLOT_OUT_OF_RANGE,
                                "slot=" + slot + " 越界（本档物品栏 size=" + size + "；合法区间 0.." + (size - 1) + "）");
                        e.put("slot", Integer.valueOf(slot));
                        e.put("size", Integer.valueOf(size));
                        evidence.log("[QA] drop_item: " + GuiResult.SLOT_OUT_OF_RANGE
                                + " slot=" + slot + " size=" + size);
                        return e;
                    }
                }
                GuiResult r = bridge.dropItem(slot, count, all);
                if (!r.ok) {
                    Map<String, Object> extra = new LinkedHashMap<String, Object>();
                    extra.put("slot", slot < 0 ? null : Integer.valueOf(slot));
                    extra.put("requestedCount", countGiven ? Integer.valueOf(count) : null);
                    extra.put("all", Boolean.valueOf(all));
                    return guiFail("drop_item", r, extra);
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>(r.data);
                if (!data.containsKey("slot")) {
                    data.put("slot", slot < 0 ? null : Integer.valueOf(slot));
                }
                data.put("requestedCount", countGiven ? Integer.valueOf(count) : null);
                data.put("all", Boolean.valueOf(all));
                // [T35] **落地校验**：这一发的回执**不许**宣称「已经丢了」—— 点击是否落地，要看
                // ≥DROP_VERIFY_MIN_TICKS 个客户端 tick 后**复读该格**。这里只记下点击前的快照与期待值；
                // 排队路径（HTTP / 驱动）会自动跨 tick 等这个结论再回执。
                // 为什么必须这样：真机 L4（2026-11-12）实测 —— 菜单 containerId 与客户端当前菜单不一致时，
                // 原版 handleInventoryMouseClick / clickSlot **只记一条 WARN 就丢掉这一击**；旧实现
                // **同一 tick** 读回执读到的还是点击前的数，形状与「真成功」一模一样 ⇒ 静默无效。
                boolean canVerify = bridge.guiActionCapable() && bridge.inventoryCapable()
                        && inv != null && slot >= 0 && data.get("count") instanceof Number;
                if (canVerify) {
                    Map<String, Object> beforeHit = findSlot(inv, slot);
                    int beforeCount = beforeHit == null || !(beforeHit.get("count") instanceof Number)
                            ? 0 : ((Number) beforeHit.get("count")).intValue();
                    int want = ((Number) data.get("count")).intValue();
                    int expectedRemaining = Math.max(0, beforeCount - want);
                    data.put("beforeCount", Integer.valueOf(beforeCount));
                    data.put("expectedRemaining", Integer.valueOf(expectedRemaining));
                    data.put("verified", Boolean.FALSE);
                    data.put("verifyAfterTicks", Integer.valueOf(DROP_VERIFY_MIN_TICKS));
                    data.put("readTiming", "same-tick（本地预测读数，**未落地校验**）");
                    data.put("verifyNote", "本回执此刻**只证明「点击已发出」**：真正的落地判据是 ≥"
                            + DROP_VERIFY_MIN_TICKS + " 个客户端 tick 后复读该格。"
                            + "排队路径（HTTP / 驱动）会自动等这一结论；直接 dispatch 的调用方"
                            + "请自行 query_inventory_slot 复核。");
                    Map<String, Object> out = ok(data);
                    if (currentJob != null) {
                        pendingDrops.add(new PendingDrop(currentJob, slot, beforeCount, want,
                                expectedRemaining, tickCount, tickCount + DROP_VERIFY_MIN_TICKS, data));
                        out.put(DEFER_KEY, Boolean.TRUE);
                    }
                    evidence.log("[QA] drop_item: slot=" + data.get("slot") + " dropped=" + data.get("count")
                            + " remaining=" + data.get("remaining") + " empty=" + data.get("empty")
                            + " id=" + data.get("id") + " before=" + beforeCount
                            + " -- 未落地校验（等 " + DROP_VERIFY_MIN_TICKS + " tick 复读）");
                    return out;
                }
                evidence.log("[QA] drop_item: slot=" + data.get("slot") + " dropped=" + data.get("count")
                        + " remaining=" + data.get("remaining") + " empty=" + data.get("empty")
                        + " id=" + data.get("id"));
                return ok(data);
            }
            case "screenshot": {
                String path = bridge.screenshotPath();
                evidence.log("[QA] screenshot -> " + path);
                return path == null ? error("SCREENSHOT_FAILED", "适配层返回 null") : ok(single("path", path));
            }
            case "chat_command": {
                String cmd = Json.str(p, "command", "");
                if (cmd.isEmpty()) return error("MISSING_REQUIRED_PARAM", "缺少 command");
                String head = cmd.startsWith("/") ? cmd.substring(1) : cmd;
                // 禁列（kill/tnt/fill）默认全禁；**唯一例外**是本模组自己化身的收回，
                // 且要求**逐字精确匹配**（不是前缀放宽）—— 见 bot_despawn。
                // **过滤逻辑不许放松**：被过滤的命令仍回 COMMAND_FORBIDDEN，另加 parsed:false 明说没解析。
                if (!BOT_KILL.equals(head)) {
                    for (String bad : FORBIDDEN_PREFIX) {
                        if (head.startsWith(bad)) {
                            // 禁列仍在**本地解析之前**拦截 ⇒ 未下发（sent:false 如实报）。
                            Map<String, Object> e = error("COMMAND_FORBIDDEN", "禁列命令：" + bad);
                            e.put("parsed", Boolean.FALSE);
                            e.put("sent", Boolean.FALSE);   // 未下发（禁列在本地解析之前拦截）
                            return e;
                        }
                    }
                }
                // **诚实回执 + 有界回落**（[T16]）：
                //   适配层走客户端命令派发器 parse/execute 拿 parsed/result/error/cursor。
                //   **别名（/tp）是在服务端注册的**，本地客户端命令树里没有它 ⇒ 本地解析失败。
                //   旧行为是「本地解析失败就不发」，别名命令**根本没出去**（真机：tp 玩家纹丝不动）。
                //   新行为：本地解析失败时**仍然把命令原样发给服务端**（走与成功路径相同的下发通道
                //   = GameBridge#chatCommand），并如实把三件事分开报：
                //     sent       本次**有没有真的下发**（bool；与旧实现的同名串字段**语义已改**，见回执说明）
                //     localParse 本地是否解析成功（本档没有本地派发器 ⇒ null，**不编**）
                //     localError 本地解析错误原文（没有错 / 没有派发器 ⇒ null）
                //   此情形下 parsed 保持 false、result 保持 null（**不许编本地结果**）。
                CommandResult cr = bridge.runCommand(cmd);
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("sentCommand", cmd);   // 回显原命令（旧 sent 串字段的落点，改名以腾出 sent 给 bool）
                if (cr == null) {
                    // 本档没有本地派发器（老档）：只能原样下发，本地解析结果**如实留 null**。
                    bridge.chatCommand(cmd);
                    data.put("sent", Boolean.TRUE);
                    data.put("localParse", null);
                    data.put("localError", null);
                } else if (cr.parsed) {
                    // 本地解析成功：走既有成功路径（适配层已执行 / 已下发）⇒ result 照旧给。
                    data.put("sent", Boolean.TRUE);
                    data.put("parsed", Boolean.TRUE);
                    data.put("result", cr.result);
                    data.put("error", cr.error);
                    data.put("cursor", cr.cursor);
                    data.put("localParse", Boolean.TRUE);
                    data.put("localError", null);
                } else {
                    // **回落**：本地不认（多半是服务端别名）⇒ 原样下发；parsed=false、result=null（不编）。
                    bridge.chatCommand(cmd);
                    data.put("sent", Boolean.TRUE);
                    data.put("parsed", Boolean.FALSE);
                    data.put("result", null);
                    data.put("error", cr.error);
                    data.put("cursor", cr.cursor);
                    data.put("localParse", Boolean.FALSE);
                    data.put("localError", cr.error);
                    data.put("fallback", Boolean.TRUE);
                    data.put("fallbackNote", "本地命令树没有这条命令（别名多在**服务端**注册）⇒ "
                            + "已按**原命令**下发到服务端；parsed=false / result=null 是**本地**读数，"
                            + "命令到底成没成要看服务端效果（位置 / 物品 / 聊天栏），别只看 parsed");
                }
                evidence.log("[QA] chat_command: " + cmd + " sent=" + data.get("sent")
                        + " localParse=" + data.get("localParse")
                        + (data.get("localError") == null ? "" : " localError=" + data.get("localError")));
                return ok(data);
            }
            case "query_chat": {
                List<String> fresh = bridge.drainChat();
                chatHistory.addAll(fresh);
                while (chatHistory.size() > 200) chatHistory.remove(0);
                return ok(single("messages", fresh));
            }
            case "chat_say": {
                String text = Json.str(p, "text", "");
                if (text.isEmpty()) return error("MISSING_REQUIRED_PARAM", "缺少 text");
                // 用 tellraw 让回复带 [AI] 前缀与颜色（不冒充玩家发言）
                bridge.chatCommand("tellraw @a {\"text\":\"[AI] " + escJson(text) + "\",\"color\":\"aqua\"}");
                // 真机发现（2026-11-01）：ClientChatReceivedEvent **只对玩家聊天触发**，tellraw 走系统消息
                // ⇒ 自己的回话不会回灌进收件箱。这里本地记账，保证对话记录两半边都全（且不产生回声循环）。
                chatHistory.add("ai: " + text);
                while (chatHistory.size() > 200) chatHistory.remove(0);
                evidence.log("[QA] chat_say: " + text);
                return ok(single("said", text));
            }
            case "press": {
                String key = Json.str(p, "key", "");
                boolean down = Json.bool(p, "down", true);
                if (!bridge.supportedKeys().contains(key)) {
                    return error("KEY_NOT_SUPPORTED", "本档不支持该键：" + key);
                }
                if (arb.mode() == Arbitration.Mode.DUAL) {
                    return error("DRIVER_DISABLED", "仲裁模式 DUAL：AI 不碰按键");
                }
                if (down && !arb.aiOwns()) {
                    return error("NOT_OWNING", "当前持权方是真人（" + arb.lastReason() + "）");
                }
                bridge.setPressed(key, down);
                arb.noteOwned(key, down);
                Map<String, Object> data = new LinkedHashMap<String, Object>();
                data.put("key", key + (down ? " down" : " up"));
                // [T20-③] 诚实回执：窗口失焦时 **MC 不处理输入**（单人世界 pauseOnLostFocus 默认 true
                //   还会弹暂停屏）⇒ 真机实测 attack / use 不生效，而旧回执照样只报 "down"（假回执）。
                //   这里如实带上窗口聚焦位 + 「本次按键是否真的可能生效」；拿不到就留 null（未知），不假装。
                Boolean focused = bridge.windowFocused();
                data.put("windowFocused", focused);
                if (!down) {
                    data.put("mayTakeEffect", Boolean.TRUE);
                    data.put("mayTakeEffectNote", "这是**释放**（down=false）：只是把键位复位，失焦时也照做。");
                } else if (Boolean.TRUE.equals(focused)) {
                    data.put("mayTakeEffect", Boolean.TRUE);
                } else if (Boolean.FALSE.equals(focused)) {
                    data.put("mayTakeEffect", Boolean.FALSE);
                    data.put("pressNote", "窗口**失焦**（windowFocused=false）⇒ MC 不处理按键输入"
                            + "（单人世界里 pauseOnLostFocus 默认 true，还会自己弹暂停屏）"
                            + " ⇒ **本次 press 不会生效**（回执不再假装已按下）。"
                            + "处置：把该客户端窗口置前/聚焦后重发；或先 close_screen。"
                            + "**本模组不做任何宿主级窗口置前 / 鼠标键盘注入**（那会抢用户焦点）。");
                } else {
                    data.put("mayTakeEffect", null);
                    data.put("pressNote", "本档不报窗口聚焦位（windowFocused=null）⇒ 本次按键**是否真的生效未知**"
                            + "（不假装已生效）。判据请用后续动作 / 读数，或让适配层实现 GameBridge#windowFocused。");
                }
                evidence.log("[QA] press: " + key + " down=" + down + " windowFocused=" + focused
                        + " mayTakeEffect=" + data.get("mayTakeEffect"));
                return ok(data);
            }
            case "open_world": {
                String world = Json.str(p, "world", "");
                if (world.isEmpty()) return error("MISSING_REQUIRED_PARAM", "缺少 world（存档名）");
                bridge.openWorld(world);
                // 换世界 ⇒ 会话码表必须换世代（**同一维度名下的另一个存档也是另一个世界**，
                // 维度判据抓不到 ⇒ 这里显式重置）。见 GameStateService 类注释的「重置边界」。
                state.resetPalette("open_world:" + world);
                evidence.log("[QA] open_world: " + world);
                return ok(single("world", world));
            }
            case "spawn_bot": {
                String name = Json.str(p, "name", "AI");
                double dist = 3.0;
                try { dist = Double.parseDouble(Json.num(p, "distance", "3")); } catch (NumberFormatException ignored) { }
                String kind = bridge.spawnBot(name, dist);
                if (kind == null) return error("BOT_UNSUPPORTED", "本档或当前环境不支持召唤化身");
                botSpawned = true;
                botName = name;
                botKind = kind;
                evidence.log("[QA] spawn_bot: " + name + " @ " + kind + "（前方 " + dist + " 格）");
                return ok(single("bot", name + " @ " + kind));
            }
            case "bot_move": {
                if (!botSpawned) return error("NO_BOT", "还没有化身，先 spawn_bot");
                String mode = Json.str(p, "mode", "absolute");
                if ("front".equals(mode)) {
                    // core 拿不到玩家朝向 ⇒ 只能"放到玩家旁"（近似）；要真正"正前方"用 spawn_bot。
                    Map<String, Object> st = Json.parseObject(bridge.playerStateJson());
                    Object px = st.get("x"), py = st.get("y"), pz = st.get("z");
                    if (!(px instanceof Number) || !(py instanceof Number) || !(pz instanceof Number)) {
                        return error("NO_PLAYER", "读不到玩家坐标");
                    }
                    bridge.moveBotTo(((Number) px).doubleValue() + 1.5, ((Number) py).doubleValue(),
                            ((Number) pz).doubleValue() + 1.5);
                } else {
                    String x = Json.num(p, "x", ""), y = Json.num(p, "y", ""), z = Json.num(p, "z", "");
                    if (x.isEmpty() || y.isEmpty() || z.isEmpty()) {
                        return error("MISSING_REQUIRED_PARAM", "需要 x/y/z，或用 mode=front");
                    }
                    try {
                        bridge.moveBotTo(Double.parseDouble(x), Double.parseDouble(y), Double.parseDouble(z));
                    } catch (NumberFormatException e) {
                        return error("BAD_REQUEST", "x/y/z 必须是数字");
                    }
                }
                evidence.log("[QA] bot_move: " + mode);
                return ok(single("moved", mode));
            }
            case "bot_follow": {
                if (!botSpawned) return error("NO_BOT", "还没有化身，先 spawn_bot");
                botFollow = Json.bool(p, "on", true);
                evidence.log("[QA] bot_follow: " + botFollow);
                return ok(single("follow", botFollow));
            }
            case "bot_give": {
                if (!botSpawned) return error("NO_BOT", "还没有化身，先 spawn_bot");
                String item = Json.str(p, "item", "");
                if (item.isEmpty()) return error("MISSING_REQUIRED_PARAM", "缺少 item（如 minecraft:diamond）");
                int count = 1;
                try { count = Integer.parseInt(Json.num(p, "count", "1")); } catch (NumberFormatException ignored) { }
                String r = bridge.giveBot(item, count);
                if (r == null) return error("GIVE_FAILED", "物品 id 不存在或载体不支持：" + item);
                evidence.log("[QA] bot_give: " + r);
                return ok(single("gave", r));
            }
            case "look": {
                // 本机玩家转视角（bot_look 是给化身的；真客户端的身体 = mc.player 自己）
                double ly, lp;
                try {
                    ly = Double.parseDouble(Json.num(p, "yaw", "0"));
                    lp = Double.parseDouble(Json.num(p, "pitch", "0"));
                } catch (NumberFormatException e) {
                    return error("BAD_REQUEST", "yaw/pitch 必须是数字");
                }
                if (lp > 90) lp = 90;
                if (lp < -90) lp = -90;
                if (!bridge.look(ly, lp)) return error("LOOK_UNSUPPORTED", "本档未实现本机玩家转视角");
                return ok(single("look", ly + "/" + lp));
            }
            case "mine": {
                // 破坏准星所指方块（先用 look 瞄准）。
                // **跨 tick**：本发只 START（走正常破坏进度），实际挖穿在后续 client tick 里完成；
                // 适配层还把「破坏进度」自报回来（[T20-①]），这里如实合并进回执 —— mine 不再是个黑盒。
                String hit = bridge.mineLookingAt();
                Map<String, Object> progress = bridge.mineStatus();
                if (hit == null) {
                    Map<String, Object> e = error("MINE_FAILED", "准星没落在可破坏方块上（先用 look 瞄准）；"
                            + "或游戏不受理这次破坏（适配层已收工）—— 见 progress 的 lastStopReason / "
                            + "continueReturnedTrueCount");
                    e.put("progress", progress);
                    e.put("progressNote", "progress 为 null = 本档不报破坏进度（不编）。");
                    evidence.log("[QA] mine: MINE_FAILED progress=" + (progress == null ? "null" : progress.get("lastStopReason")));
                    return e;
                }
                Map<String, Object> data = new LinkedHashMap<String, Object>();
                data.put("mined", hit);          // 兼容旧字段：语义 = 「目标已锁定并开始破坏」（不是「已挖穿」）
                data.put("target", hit);
                data.put("started", Boolean.TRUE);
                data.put("progress", progress);
                data.put("progressNote", progress == null
                        ? "本档不报破坏进度（GameBridge#mineStatus 回 null）⇒ progress 留 null（**不编**）。"
                                + "注意 mine 是**跨 tick** 的：" + hit + " 只代表「已锁定并开始破坏」，"
                                + "不代表已经挖穿 —— 真值请用 query_column / query_blocks 读该格。"
                        : "mine 是**跨 tick** 的：本发只代表「已锁定并开始破坏」，**不代表已经挖穿**。"
                                + "是否真挖穿看 progress.targetStillThere（false = 已不在）/ "
                                + "progress.lastStopReason（" + com.bandd.playtest.core.MiningTracker.STOP_BROKEN
                                + " = 挖穿，" + com.bandd.playtest.core.MiningTracker.STOP_TIMEOUT
                                + " = 超时收工、没挖穿）/ progress.minedCount（本会话挖穿计数）；"
                                + "progress.miningTicks = 该目标已累计的 tick 数。"
                                + "continueReturnedTrueCount > 0 且 targetStillThere 仍为 true 是**正常的**："
                                + "vanilla 在延迟 / 冷却未到的分支里也回 true。");
                evidence.log("[QA] mine: " + hit
                        + (progress == null ? "" : " ticks=" + progress.get("miningTicks")
                                + " minedCount=" + progress.get("minedCount")
                                + " stillThere=" + progress.get("targetStillThere")
                                + " lastStop=" + progress.get("lastStopReason")
                                + " continueTrue=" + progress.get("continueReturnedTrueCount")));
                return ok(data);
            }
            case "close_screen": {
                // 界面开着时 MC 不处理输入（press 静默失效）⇒ 驱动前先关掉
                if (!bridge.closeScreen()) return error("CLOSE_UNSUPPORTED", "本档未实现关界面");
                return ok(single("closed", Boolean.TRUE));
            }
            case "bot_look": {
                if (!botSpawned) return error("NO_BOT", "还没有化身，先 spawn_bot");
                double yaw, pitch;
                try {
                    yaw = Double.parseDouble(Json.num(p, "yaw", "0"));
                    pitch = Double.parseDouble(Json.num(p, "pitch", "0"));
                } catch (NumberFormatException e) {
                    return error("BAD_REQUEST", "yaw/pitch 必须是数字");
                }
                if (!bridge.lookBot(yaw, pitch)) return error("BOT_UNSUPPORTED", "载体不支持转向");
                return ok(single("look", yaw + "/" + pitch));
            }
            case "bot_break": {
                if (!botSpawned) return error("NO_BOT", "还没有化身，先 spawn_bot");
                double[] c = xyz(p);
                if (c == null) return error("MISSING_REQUIRED_PARAM", "需要 x/y/z");
                String r = bridge.breakBotBlock(c[0], c[1], c[2]);
                if (r == null) return error("BREAK_FAILED", "没挖动（方块不可破坏 / 距离太远 / 载体不支持）");
                evidence.log("[QA] bot_break: " + r);
                return ok(single("broke", r));
            }
            case "bot_place": {
                if (!botSpawned) return error("NO_BOT", "还没有化身，先 spawn_bot");
                double[] c = xyz(p);
                if (c == null) return error("MISSING_REQUIRED_PARAM", "需要 x/y/z");
                String r = bridge.placeBotBlock(c[0], c[1], c[2]);
                if (r == null) return error("PLACE_FAILED", "没放上（手上没有方块 / 目标不可放置 / 载体不支持）");
                evidence.log("[QA] bot_place: " + r);
                return ok(single("placed", r));
            }
            case "set_auth": {
                boolean online = Json.bool(p, "online", false);
                if (!bridge.setServerAuth(online)) return error("NO_SERVER", "本机没有服务端（不在单人/局域网世界里？）");
                evidence.log("[QA] set_auth: online=" + online);
                return ok(single("usesAuthentication", online));
            }
            case "join_server": {
                String addr = Json.str(p, "address", "");
                if (addr.isEmpty()) return error("MISSING_REQUIRED_PARAM", "缺少 address（如 127.0.0.1:54321）");
                bridge.joinServer(addr);
                // 连别人的服务器 = 换世界 ⇒ 同上，会话码表换世代（否则旧世界的码张冠李戴）。
                state.resetPalette("join_server:" + addr);
                evidence.log("[QA] join_server: " + addr);
                return ok(single("connecting", addr));
            }
            case "open_bot_inventory": {
                String how = bridge.openBotInventory();
                if (how == null) return error("BOT_UNSUPPORTED", "本档/当前载体不支持把物品栏开到真人屏幕");
                evidence.log("[QA] open_bot_inventory: " + how);
                return ok(single("opened", how));
            }
            case "bot_despawn": {
                bridge.despawnBot();
                botSpawned = false;
                botFollow = false;
                evidence.log("[QA] bot_despawn（收回化身）");
                return ok(single("despawned", Boolean.TRUE));
            }
            case "release_all":
                abortActiveWalks("RELEASED", "收到 release_all，已停走并释放 AI 移动键");
                arb.releaseOwned(bridge);
                return ok(single("released", Boolean.TRUE));
            case "take_over":
                arb.takeOver();
                return ok(single("aiOwns", Boolean.TRUE));
            case "set_arbitration": {
                String mode = Json.str(p, "mode", "").toUpperCase();
                try {
                    arb.setMode(Arbitration.Mode.valueOf(mode));
                } catch (IllegalArgumentException e) {
                    return error("INVALID_MODE", "mode 必须是 AUTO | HOTKEY | DUAL");
                }
                if (arb.mode() == Arbitration.Mode.DUAL) {
                    abortActiveWalks("DRIVER_DISABLED", "仲裁模式切为 DUAL，已停走并释放 AI 移动键");
                    arb.releaseOwned(bridge);
                }
                return ok(single("mode", arb.mode().name()));
            }
            default:
                return error("UNKNOWN_ACTION", "未知动作：" + action);
        }
    }

    // ---- 小工具（core 内部） ----

    /**
     * 把适配层的背包 JSON 规范化成回执形状。
     *
     * <p>为什么必须**过一道规范化**而不是原样透出：{@link Json#parseObject} 把 JSON 数字一律读成
     * {@code Double} ⇒ 原样透出会让 {@code count:64} 变成 {@code 64.0}（调用方按整数比对就"对不上"）。
     * 这里把 size/slot/count/selectedSlot 统一成整型；缺字段**如实留 null**，不编 0。
     */
    @SuppressWarnings("unchecked")
    static Map<String, Object> parseInventory(String json) {
        Map<String, Object> src;
        try {
            src = Json.parseObject(json);
        } catch (RuntimeException e) {
            src = new LinkedHashMap<String, Object>();
        }
        Map<String, Object> out = new LinkedHashMap<String, Object>();
        Object size = src.get("size");
        out.put("size", size instanceof Number ? (Object) Integer.valueOf(((Number) size).intValue()) : null);
        List<Object> slots = new ArrayList<Object>();
        Object sl = src.get("slots");
        if (sl instanceof List) {
            for (Object o : (List<?>) sl) {
                if (!(o instanceof Map)) continue;
                Map<String, Object> s = stackJson((Map<String, Object>) o, -1);
                if (s.get("slot") == null) continue;     // 没有槽位的条目无法定位 ⇒ 不收（不编槽号）
                slots.add(s);
            }
        }
        out.put("slots", slots);
        out.put("slotCount", Integer.valueOf(slots.size()));
        Object sel = src.get("selectedSlot");
        out.put("selectedSlot", sel instanceof Number ? (Object) Integer.valueOf(((Number) sel).intValue()) : null);
        Object mh = src.get("mainHand");
        out.put("mainHand", (mh instanceof Map) ? stackJson((Map<String, Object>) mh, -1) : null);
        List<Object> hotbar = new ArrayList<Object>();
        Object hb = src.get("hotbar");
        if (hb instanceof List) {
            for (Object o : (List<?>) hb) {
                if (o instanceof Map) hotbar.add(stackJson((Map<String, Object>) o, -1));
            }
        }
        if (hotbar.isEmpty()) {
            out.put("hotbar", null);
            out.put("hotbarNote", "适配层没给 hotbar 摘要 ⇒ 如实留 null（不编 9 格）");
        } else {
            out.put("hotbar", hotbar);
            out.put("hotbarCount", Integer.valueOf(hotbar.size()));
        }
        Object ik = src.get("idKind");
        if (ik != null) out.put("adapterIdKind", String.valueOf(ik));
        return out;
    }

    // ================= [T13] query_column / query_blocks 的参数小工具 =================

    private static boolean has(Map<String, Object> p, String k) {
        return p != null && p.containsKey(k) && p.get(k) != null;
    }

    /** 整值解析：Number 必须**整值**（8 / 8.0 行；8.7 拒）、字符串必须能整解析。取不到 ⇒ null。 */
    private static Long longOrNull(Map<String, Object> p, String k) {
        if (!has(p, k)) return null;
        Object v = p.get(k);
        if (v instanceof Number) {
            double d = ((Number) v).doubleValue();
            if (Double.isNaN(d) || Double.isInfinite(d)) return null;
            if (d != Math.rint(d)) return null;
            return Long.valueOf((long) d);
        }
        if (v instanceof String) {
            String s = ((String) v).trim();
            if (s.isEmpty()) return null;
            try {
                return Long.valueOf(Long.parseLong(s));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    /** filter 的**形状**解析：数组（或单个字符串）⇒ 列表；形状不对回 null（调用方回 BAD_REQUEST）。 */
    private static List<String> filterList(Map<String, Object> p) {
        if (!has(p, "filter")) return null;
        Object v = p.get("filter");
        List<String> out = new ArrayList<String>();
        if (v instanceof List) {
            for (Object o : (List<?>) v) {
                if (!(o instanceof String)) return null;   // 形状不对 ⇒ 不猜、不 toString
                out.add((String) o);
            }
            return out;
        }
        if (v instanceof String) {
            out.add((String) v);
            return out;
        }
        return null;
    }

    /** 玩家脚所在方块 Y；读不到 ⇒ null（**不编 0**）。 */
    private Double playerBlockY() {
        Map<String, Object> st;
        try {
            st = Json.parseObject(bridge.playerStateJson());
        } catch (RuntimeException e) {
            return null;
        }
        Object v = st.get("y");
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

    /** y 窗口的解析结果（三种情形 + 补法说明一次算清）。 */
    private static final class YRange {
        int y1;
        int y2;
        boolean usedDefault;
        boolean partial;
        boolean noteIsDefault;
        String note;
    }

    /**
     * 解析 y1/y2（可选）：
     * <ul>
     *   <li>都没给 ⇒ 有界默认窗口 [floor(玩家Y) - down, floor(玩家Y) + up]；</li>
     *   <li>只给一个 ⇒ 另一个按默认窗口**补**，并回 {@code yPartial:true} + 人话（不静默、也不编中点）；</li>
     *   <li>都给了 ⇒ 原样用（顺序错由下游按 [yLow..yHigh] 规范化并说明）。</li>
     * </ul>
     * 需要玩家 Y 却读不到 ⇒ 回 {@code null}（调用方回 {@code NO_PLAYER}，**不猜世界高度**）。
     */
    private YRange resolveY(Map<String, Object> p, int up, int down) {
        Long a = has(p, "y1") ? longOrNull(p, "y1") : null;
        Long b = has(p, "y2") ? longOrNull(p, "y2") : null;
        YRange r = new YRange();
        if (a != null && b != null) {
            r.y1 = a.intValue();
            r.y2 = b.intValue();
            return r;
        }
        Double py = playerBlockY();
        if (py == null) return null;
        int d2 = (int) Math.floor(py.doubleValue()) + up;
        int d1 = d2 - up - down;
        if (a == null && b == null) {
            r.y1 = d1;
            r.y2 = d2;
            r.usedDefault = true;
            r.noteIsDefault = true;
            r.note = "未给 y1/y2 ⇒ 用**有界**默认窗口 [floor(玩家Y) - " + down + ", floor(玩家Y) + " + up
                    + "]（玩家 Y=" + py + " ⇒ [" + d1 + ", " + d2 + "]）";
            return r;
        }
        r.y1 = a == null ? d1 : a.intValue();
        r.y2 = b == null ? d2 : b.intValue();
        r.partial = true;
        r.note = "只给了 y1/y2 中的一个 ⇒ 另一个按**默认窗口**补（默认 = [floor(玩家Y) - " + down
                + ", floor(玩家Y) + " + up + "]，玩家 Y=" + py + "）—— **不**编中点、不静默";
        return r;
    }

    /** 从回执里取一个子对象（取不到回空表）。 */
    @SuppressWarnings("unchecked")
    private static Map<String, Object> mapAtOf(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof Map) ? (Map<String, Object>) v : new LinkedHashMap<String, Object>();
    }

    // ================= [T19] 界面动作的小工具 =================

    /**
     * 从适配层给的槽位 JSON 里取 {@code slotCount}（= slots 列表长度）；取不到 / 解析失败回 -1。
     *
     * <p>为什么 core 要自己数一遍：{@code click_slot} 的**越界判据**必须落在 core ——
     * 这样它才**能被纯 JDK 单测钉死**（适配层那半边要真机）。适配层仍会**再拦一道**
     * （它知道本档 slotCount），两道都在 ⇒ 越界不可能静默落成「点了 0 号格」。
     */
    static int slotCountOf(String json) {
        if (json == null) return -1;
        try {
            Map<String, Object> m = Json.parseObject(json);
            Object sl = m.get("slots");
            return (sl instanceof List) ? ((List<?>) sl).size() : -1;
        } catch (RuntimeException e) {
            return -1;
        }
    }

    /** 把适配层的失败 {@link GuiResult} 转成 core 的失败回执（码 + 人话 + 诊断读数），并写 [QA] 行。 */
    private Map<String, Object> guiFail(String action, GuiResult r, Map<String, Object> extra) {
        Map<String, Object> e = error(r.code == null ? "GUI_ACTION_FAILED" : r.code,
                r.message == null ? "适配层未给失败说明" : r.message);
        e.putAll(r.data);
        if (extra != null) e.putAll(extra);
        evidence.log("[QA] " + action + ": " + e.get("code") + " -- " + e.get("message"));
        return e;
    }

    /** 单格规范化：{@code {slot, empty, itemId?, idKind?, count?}}。**空格子也要有 empty:true**。 */
    static Map<String, Object> stackJson(Map<String, Object> src, int dfltSlot) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        Object slot = src.get("slot");
        if (slot instanceof Number) m.put("slot", Integer.valueOf(((Number) slot).intValue()));
        else if (dfltSlot >= 0) m.put("slot", Integer.valueOf(dfltSlot));
        else m.put("slot", null);
        boolean empty = Boolean.TRUE.equals(src.get("empty")) || src.get("itemId") == null;
        m.put("empty", Boolean.valueOf(empty));
        if (!empty) {
            m.put("itemId", String.valueOf(src.get("itemId")));
            Object kind = src.get("idKind");
            m.put("idKind", kind == null ? "registryName" : String.valueOf(kind));
            Object c = src.get("count");
            m.put("count", c instanceof Number ? (Object) Integer.valueOf(((Number) c).intValue()) : null);
        }
        return m;
    }

    /** 在规范化后的 slots 里找某槽位；没有（空格 / 越界）回 null。 */
    static Map<String, Object> findSlot(Map<String, Object> inv, int slot) {
        Object sl = inv.get("slots");
        if (!(sl instanceof List)) return null;
        for (Object o : (List<?>) sl) {
            if (!(o instanceof Map)) continue;
            Map<?, ?> e = (Map<?, ?>) o;
            Object s = e.get("slot");
            if (s instanceof Number && ((Number) s).intValue() == slot) {
                @SuppressWarnings("unchecked")
                Map<String, Object> me = (Map<String, Object>) e;
                return me;
            }
        }
        return null;
    }

    public static Map<String, Object> ok(Map<String, Object> data) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("status", "ok");
        m.put("data", data);
        return m;
    }

    public static Map<String, Object> error(String code, String message) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("status", "failed");
        m.put("code", code);
        m.put("message", message);
        return m;
    }

    public static Map<String, Object> single(String k, Object v) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put(k, v);
        return m;
    }

    public static List<String> listOf(String... v) {
        return new ArrayList<>(Arrays.asList(v));
    }
}
