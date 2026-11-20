package com.bandd.playtest.test;

import com.bandd.playtest.core.ActionQueue;
import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.GuiResult;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **[T22] 四条真机实测挖出的改动 + 截断契约的离线回归测试**（合成世界 / 假桥，不需要 Minecraft；
 * 与既有 12 套**分开报数**，既有断言一条不动）：
 * <ol>
 *   <li>{@code select_slot} —— 参数面 / 越界 / 回执的 previousSlot+selectedSlot+mainHand /
 *       与 {@code query_inventory} 的交叉验证 / 未实现档 fail-loud；</li>
 *   <li>{@code drop_item} —— 参数面 / 越界 / 缺省槽 / count vs all / remaining+empty+id / 未实现档；</li>
 *   <li>{@code query_player_state} 的 {@code gameMode/flying/canFly/cheats} —— 拿到就给、拿不到留 null
 *       加 note（**不许编**）、既有字段语义不动；</li>
 *   <li>{@code query_blocks} 的截断契约 —— 顶层 {@code complete} / {@code stoppedBy} /
 *       {@code remainingBlocks}；扫完 / 撞 maxMatches / 还在扫 / 没起 四态；truncated 语义不变；</li>
 *   <li>能力自报：{@code Capabilities.HOTBAR} 进 DRIVER（子表）、{@code /status} 按能力如实过滤。</li>
 * </ol>
 *
 * <p>跑法（**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/t22/testwork -cp out com.bandd.playtest.test.T22ActionsTest
 * </pre>
 *
 * <p><b>两个负控</b>（都在 core，见交付报告的「负控两次读数」）：
 * <ul>
 *   <li><b>①</b> 去掉 {@code PlaytestCore} 里 {@code select_slot} 的 0..8 越界检查 ⇒ A5/A6 必红；</li>
 *   <li><b>②</b> 把 {@code GameStateService#searchComplete()} 改成 {@code !sqActive}（旧误读「active=false
 *       就是扫完了」）⇒ D2 必红。</li>
 * </ul>
 */
public final class T22ActionsTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t22/testwork");
        base = Paths.get(dir, "run-" + System.nanoTime());
        Files.createDirectories(base);

        sectionSelectSlot();
        sectionDropItem();
        sectionDropLanding();
        sectionPlayerMeta();
        sectionSearchContract();
        sectionCapabilities();

        System.out.println();
        System.out.println("=== T22 select_slot/drop_item/gameMode/complete tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ==================================================================
    // A. select_slot
    // ==================================================================

    private static void sectionSelectSlot() {
        HotbarBridge b = new HotbarBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("a"), "tok");

        Map<String, Object> r1 = core.dispatch("select_slot", params("slot", Integer.valueOf(1)));
        Map<String, Object> d1 = data(r1);
        check("A1 select_slot 成功（status=ok）+ 适配层真被调用（slot=1）",
                isOk(r1) && b.lastSelect == 1 && b.hotbarCalls.contains("select:1"));
        check("A2 回执 slot=1 / previousSlot=0 / selectedSlot=1（切换后复读）",
                intAt(d1, "slot") == 1 && intAt(d1, "previousSlot") == 0 && intAt(d1, "selectedSlot") == 1);
        Map<String, Object> mh = mapAt(d1, "mainHand");
        check("A3 mainHand = 切换后主手那格（slot=1 的 beef）",
                intAt(mh, "slot") == 1 && "minecraft:beef".equals(mh.get("itemId")) && intAt(mh, "count") == 2);

        Map<String, Object> inv = data(core.dispatch("query_inventory", params()));
        check("A4 与 query_inventory 交叉验证：selectedSlot=1、mainHand 跟着变、consistent=true",
                intAt(inv, "selectedSlot") == 1 && intAt(d1, "inventorySelectedSlot") == 1
                        && Boolean.TRUE.equals(d1.get("consistent"))
                        && "minecraft:beef".equals(mapAt(inv, "mainHand").get("itemId")));

        Map<String, Object> r2 = core.dispatch("select_slot", params("slot", Integer.valueOf(8)));
        Map<String, Object> d2 = data(r2);
        check("A5 slot=8（空槽）也是合法值：selectedSlot=8 + mainHand=null（不编）",
                isOk(r2) && intAt(d2, "selectedSlot") == 8 && d2.get("mainHand") == null);

        check("A6 缺 slot ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(codeOf(core.dispatch("select_slot", params()))));
        check("A7 slot=1.5（非整）⇒ BAD_REQUEST（不静默 floor）",
                "BAD_REQUEST".equals(codeOf(core.dispatch("select_slot", params("slot", 1.5)))));
        Map<String, Object> r9 = core.dispatch("select_slot", params("slot", Integer.valueOf(9)));
        check("A8 slot=9 ⇒ SLOT_OUT_OF_RANGE + slotMin/slotMax（**负控①** 的判据）",
                "SLOT_OUT_OF_RANGE".equals(r9.get("code")) && intAt(r9, "slotMin") == 0 && intAt(r9, "slotMax") == 8);
        check("A9 slot=-1 ⇒ SLOT_OUT_OF_RANGE（负控①的另一条判据）",
                "SLOT_OUT_OF_RANGE".equals(
                        core.dispatch("select_slot", params("slot", Integer.valueOf(-1))).get("code")));
        check("A10 越界时**适配层一次都没被叫**（越界绝不静默落成「切到 0 号」）",
                b.lastSelect == 8 && !b.hotbarCalls.contains("select:9") && !b.hotbarCalls.contains("select:-1"));

        // 适配层失败要如实透传（不把它吞成 ok）
        HotbarBridge bf = new HotbarBridge();
        bf.selectFail = GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家");
        Map<String, Object> rf = new PlaytestCore(bf, evDir("a2"), "tok")
                .dispatch("select_slot", params("slot", Integer.valueOf(3)));
        check("A11 适配层回 NOT_IN_WORLD ⇒ core 原样透出该码（fail-loud）",
                "NOT_IN_WORLD".equals(rf.get("code")) && intAt(rf, "slot") == 3);

        // 未实现的档
        FakeBridge plain = new FakeBridge();
        Map<String, Object> rp = new PlaytestCore(plain, evDir("a3"), "tok")
                .dispatch("select_slot", params("slot", Integer.valueOf(1)));
        check("A12 未实现的档 ⇒ GUI_ACTIONS_UNSUPPORTED（不假装会切槽）",
                GuiResult.UNSUPPORTED.equals(rp.get("code")));
    }

    // ==================================================================
    // B. drop_item
    // ==================================================================

    private static void sectionDropItem() {
        HotbarBridge b = new HotbarBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("b"), "tok");

        Map<String, Object> r1 = core.dispatch("drop_item", params("slot", Integer.valueOf(0)));
        Map<String, Object> d1 = data(r1);
        check("B1 缺省 count ⇒ 丢整叠：slot=0 / count=7 / empty=true / remaining=0 / id=null / droppedId=diamond",
                isOk(r1) && intAt(d1, "slot") == 0 && intAt(d1, "count") == 7
                        && Boolean.TRUE.equals(d1.get("empty")) && intAt(d1, "remaining") == 0
                        && d1.get("id") == null && "minecraft:diamond".equals(d1.get("droppedId")));
        check("B2 适配层真被调用（slot=0 / count=-1=整叠）且回执 all 段如实",
                b.hotbarCalls.contains("drop:0/-1/false") && Boolean.FALSE.equals(d1.get("all")));
        Map<String, Object> inv1 = data(core.dispatch("query_inventory", params()));
        check("B3 丢后 query_inventory 里 0 号格真的没了（丢的不是假账）",
                findSlot(inv1, 0) == null);

        Map<String, Object> r2 = core.dispatch("drop_item", params("slot", Integer.valueOf(1), "count", Integer.valueOf(1)));
        Map<String, Object> d2 = data(r2);
        check("B4 count=1 ⇒ 只丢一个：count=1 / empty=false / remaining=1 / id=beef / droppedId=beef",
                intAt(d2, "count") == 1 && Boolean.FALSE.equals(d2.get("empty"))
                        && intAt(d2, "remaining") == 1 && "minecraft:beef".equals(d2.get("id"))
                        && "minecraft:beef".equals(d2.get("droppedId")));
        check("B5 count 显式给 ⇒ requestedCount=1 且 all=false（count 优先于 all）",
                intAt(d2, "requestedCount") == 1 && Boolean.FALSE.equals(d2.get("all")));

        // 缺省槽 = 当前选中槽（core 从 inventoryJson.selectedSlot 取）
        HotbarBridge b3 = new HotbarBridge();
        PlaytestCore core3 = new PlaytestCore(b3, evDir("b2"), "tok");
        core3.dispatch("select_slot", params("slot", Integer.valueOf(2)));
        Map<String, Object> d3 = data(core3.dispatch("drop_item", params()));
        check("B6 省略 slot ⇒ 用当前选中槽（先切到 2 ⇒ 丢的是 slot=2 的 birch_log；丢空 ⇒ id=null / droppedId=birch）",
                intAt(d3, "slot") == 2 && "minecraft:birch_log".equals(d3.get("droppedId"))
                        && d3.get("id") == null && intAt(d3, "count") == 1);

        check("B7 slot=99 ⇒ SLOT_OUT_OF_RANGE（core 按 inventory size 先拦一道）",
                "SLOT_OUT_OF_RANGE".equals(
                        core.dispatch("drop_item", params("slot", Integer.valueOf(99))).get("code")));
        check("B8 slot=1.5 ⇒ BAD_REQUEST",
                "BAD_REQUEST".equals(codeOf(core.dispatch("drop_item", params("slot", 1.5)))));
        check("B9 count=0 ⇒ BAD_REQUEST（要整叠请用 all 或省略）",
                "BAD_REQUEST".equals(codeOf(core.dispatch("drop_item",
                        params("slot", Integer.valueOf(1), "count", Integer.valueOf(0))))));
        Map<String, Object> dAll = data(core.dispatch("drop_item",
                params("slot", Integer.valueOf(2), "all", Boolean.TRUE)));
        check("B10 all=true ⇒ 丢整叠（birch_log 1 个 ⇒ count=1 / empty=true / droppedId=birch）",
                intAt(dAll, "count") == 1 && Boolean.TRUE.equals(dAll.get("empty"))
                        && Boolean.TRUE.equals(dAll.get("all"))
                        && "minecraft:birch_log".equals(dAll.get("droppedId")));
        Map<String, Object> dE = data(core.dispatch("drop_item", params("slot", Integer.valueOf(2))));
        check("B11 丢空格 ⇒ 成功 + count=0 + empty=true（空是合法读数，不是错误）",
                isOk(core.dispatch("drop_item", params("slot", Integer.valueOf(2))))
                        && intAt(dE, "count") == 0 && Boolean.TRUE.equals(dE.get("empty")));

        HotbarBridge bf = new HotbarBridge();
        bf.dropFail = GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家");
        check("B12 适配层回 NOT_IN_WORLD ⇒ core 原样透出（fail-loud）",
                "NOT_IN_WORLD".equals(new PlaytestCore(bf, evDir("b3"), "tok")
                        .dispatch("drop_item", params("slot", Integer.valueOf(1))).get("code")));

        FakeBridge plain = new FakeBridge();
        check("B13 未实现的档 ⇒ GUI_ACTIONS_UNSUPPORTED（不假装会丢东西）",
                GuiResult.UNSUPPORTED.equals(new PlaytestCore(plain, evDir("b4"), "tok")
                        .dispatch("drop_item", params("slot", Integer.valueOf(0))).get("code")));
    }

    // ==================================================================
    // C. query_player_state 的 gameMode / flying / canFly / cheats
    // ==================================================================

    private static void sectionPlayerMeta() {
        HotbarBridge b = new HotbarBridge();
        b.meta = Json.of(metaMap("survival", Boolean.FALSE, Boolean.FALSE, Boolean.TRUE, "本档自报（假桥）"));
        PlaytestCore core = new PlaytestCore(b, evDir("c"), "tok");
        Map<String, Object> p = mapAt(data(core.dispatch("query_player_state", params())), "player");
        check("C1 拿到就加：gameMode=survival / flying=false / canFly=false / cheats=true",
                "survival".equals(p.get("gameMode")) && Boolean.FALSE.equals(p.get("flying"))
                        && Boolean.FALSE.equals(p.get("canFly")) && Boolean.TRUE.equals(p.get("cheats")));
        check("C2 playerMetaNote 原样带适配层的 note + gameModeNote 写明口径",
                String.valueOf(p.get("playerMetaNote")).contains("假桥") && p.get("gameModeNote") != null);
        check("C3 **既有字段语义不动**：name/x/y/z 照旧在",
                "Tester".equals(p.get("name")) && p.get("x") != null && p.get("z") != null);

        // 本档不报 ⇒ 四者一律 null + 人话（不编）
        FakeBridge plain = new FakeBridge();
        Map<String, Object> p2 = mapAt(data(new PlaytestCore(plain, evDir("c2"), "tok")
                .dispatch("query_player_state", params())), "player");
        check("C4 本档不报（playerMetaJson=null）⇒ gameMode/flying/canFly/cheats **一律 null**（不编）",
                p2.containsKey("gameMode") && p2.get("gameMode") == null
                        && p2.get("flying") == null && p2.get("canFly") == null && p2.get("cheats") == null);
        check("C5 不报时 playerMetaNote 明写「不报 / 不编」",
                p2.get("playerMetaNote") != null
                        && String.valueOf(p2.get("playerMetaNote")).contains("不编"));

        // 部分可得：只给 gameMode / cheats，其余键缺失 ⇒ 留 null（不编）
        HotbarBridge b3 = new HotbarBridge();
        Map<String, Object> partial = new LinkedHashMap<String, Object>();
        partial.put("gameMode", "creative");
        b3.meta = Json.of(partial);
        Map<String, Object> p3 = mapAt(data(new PlaytestCore(b3, evDir("c3"), "tok")
                .dispatch("query_player_state", params())), "player");
        check("C6 部分可得：gameMode=creative 而 flying/canFly/cheats 缺失 ⇒ null（不编）",
                "creative".equals(p3.get("gameMode")) && p3.get("flying") == null
                        && p3.get("canFly") == null && p3.get("cheats") == null);
    }

    // ==================================================================
    // D. query_blocks 的截断契约（complete / stoppedBy / remainingBlocks）
    // ==================================================================

    private static void sectionSearchContract() {
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("d"), "tok");

        // D1 扫完
        Map<String, Object> done = data(searchPollDone(core, "filter", "minecraft:stone", "radius", 2, "maxMatches", 512));
        check("D1 扫完：complete=true / stoppedBy=null / remainingBlocks=0 / truncated=false / scan.complete=true",
                Boolean.TRUE.equals(done.get("complete")) && done.get("stoppedBy") == null
                        && intAt(done, "remainingBlocks") == 0 && Boolean.FALSE.equals(done.get("truncated"))
                        && Boolean.TRUE.equals(mapAt(done, "scan").get("complete")));
        check("D2 scan.complete 与顶层 complete **逐字一致**（没破坏既有 scan 段契约）",
                done.get("complete").equals(mapAt(done, "scan").get("complete")));

        // D3 撞 maxMatches 提前停（**负控②** 的判据）
        Map<String, Object> trunc = data(searchPollDone(core, "filter", "minecraft:stone", "radius", 2, "maxMatches", 2));
        Map<String, Object> sc = mapAt(trunc, "scan");
        check("D3 撞 maxMatches：complete=false / stoppedBy=maxMatches / truncated=true / "
                        + "remainingBlocks>0 且 = total-done",
                Boolean.FALSE.equals(trunc.get("complete")) && "maxMatches".equals(trunc.get("stoppedBy"))
                        && Boolean.TRUE.equals(trunc.get("truncated"))
                        && intAt(trunc, "remainingBlocks") == intAt(sc, "totalBlocks") - intAt(sc, "doneBlocks")
                        && intAt(trunc, "remainingBlocks") > 0);
        check("D4 complete=false 时**明说剩余未扫**（completeReasonNote 提到 remainingBlocks / 提前停）",
                trunc.get("completeReasonNote") != null
                        && String.valueOf(trunc.get("completeReasonNote")).contains("remainingBlocks=")
                        && String.valueOf(trunc.get("completeReasonNote")).contains("maxMatches"));

        // D5 还在扫（首请求、没 tick）⇒ stoppedBy=scanning，complete=false
        SyntheticWorldBridge b5 = new SyntheticWorldBridge();
        PlaytestCore c5 = new PlaytestCore(b5, evDir("d2"), "tok");
        Map<String, Object> active = data(searchRes(c5, true, "filter", "minecraft:stone", "radius", 2, "maxMatches", 512));
        check("D5 首请求未 tick：scan.active=true ⇒ complete=false / stoppedBy=scanning / "
                        + "remainingBlocks=totalBlocks",
                Boolean.TRUE.equals(mapAt(active, "scan").get("active"))
                        && Boolean.FALSE.equals(active.get("complete")) && "scanning".equals(active.get("stoppedBy"))
                        && intAt(active, "remainingBlocks") == intAt(mapAt(active, "scan"), "totalBlocks"));

        // D6 扫描没起（世界未 ready）⇒ stoppedBy=notStarted，不假装扫完
        SyntheticWorldBridge b6 = new SyntheticWorldBridge();
        b6.ready = false;
        PlaytestCore c6 = new PlaytestCore(b6, evDir("d3"), "tok");
        Map<String, Object> notStarted = data(searchRes(c6, true, "filter", "minecraft:stone", "radius", 2));
        check("D6 扫描没起：complete=false / stoppedBy=notStarted（**不假装扫完了**）",
                Boolean.FALSE.equals(notStarted.get("complete")) && "notStarted".equals(notStarted.get("stoppedBy"))
                        && intAt(notStarted, "remainingBlocks") > 0);
    }

    // ==================================================================
    // E. 能力自报 / /status
    // ==================================================================

    private static void sectionCapabilities() {
        check("E1 HOTBAR 是 DRIVER 的子集（不是第 3 张表）+ 两条在 DRIVER 里",
                Capabilities.DRIVER.containsAll(Capabilities.HOTBAR)
                        && Capabilities.DRIVER.contains("select_slot") && Capabilities.DRIVER.contains("drop_item"));
        check("E2 all() 仍是 BRIDGE ∪ DRIVER 两表并集",
                Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());

        HotbarBridge hb = new HotbarBridge();
        Map<String, Object> caps = mapAt(new PlaytestCore(hb, evDir("e"), "tok").status(), "capabilities");
        check("E3 capabilities.hotbarActions 单列一份且与 HOTBAR 逐字相同",
                new ArrayList<Object>(Capabilities.HOTBAR).equals(strList(caps.get("hotbarActions"))));
        List<String> unHb = strList(new PlaytestCore(hb, evDir("e2"), "tok").status().get("actionsUnavailable"));
        check("E4 实现档：两条**不在** actionsUnavailable 里",
                !unHb.contains("select_slot") && !unHb.contains("drop_item"));

        FakeBridge plain = new FakeBridge();
        Map<String, Object> st = new PlaytestCore(plain, evDir("e3"), "tok").status();
        List<String> unPlain = strList(st.get("actionsUnavailable"));
        check("E5 未实现档：两条**如实**进 actionsUnavailable（不谎报会切槽 / 会丢东西）",
                unPlain.contains("select_slot") && unPlain.contains("drop_item"));
        check("E6 driverAvailable 语义不变：有 GUI 能力的档=true、没有的=false",
                Boolean.TRUE.equals(mapAt(new PlaytestCore(hb, evDir("e4"), "tok").status(), "capabilities")
                        .get("driverAvailable"))
                        && Boolean.FALSE.equals(mapAt(st, "capabilities").get("driverAvailable")));
    }

    // ==================================================================
    // F. [T35] drop_item 的**落地校验**（跨 tick；不许同一 tick 下结论）
    // ==================================================================

    /**
     * 缺陷复现（真机 L4 2026-11-12）：菜单 containerId 与客户端当前菜单不一致时，原版
     * {@code handleInventoryMouseClick} / {@code clickSlot} **只记一条 WARN 就丢掉这一击**，
     * 而**同一 tick** 复读该格读到的还是点击前的数 ⇒ 旧回执形状与「真成功」一模一样（静默无效）。
     * 桩让「点击后该格不变」= 复现这个缺陷；修复后**必须** fail-loud。
     *
     * <p>为什么走**队列 + onTick**：真实的 HTTP 路径就是「入队 → 客户端 tick 跑 → 跨 tick 复读」，
     * 只有这条路径才等得到落地结论（直接 dispatch 是同步路径，只回 phase-1，见 F4）。
     */
    private static void sectionDropLanding() {
        // F1/F2 反例桩：点击**不落地**（该格纹丝不动）⇒ 到点复读必须 fail-loud
        SilentDropBridge b = new SilentDropBridge(false);
        PlaytestCore core = new PlaytestCore(b, evDir("f1"), "tok");
        Map<String, Object> res = runQueuedDrop(core, 0, 1);
        check("F1 点击不落地（桩让该格不变）⇒ 跨 tick 复读后 fail-loud DROP_ITEM_NOT_APPLIED",
                res != null && "failed".equals(res.get("status"))
                        && GuiResult.DROP_ITEM_NOT_APPLIED.equals(codeOf(res)));
        check("F2 失败回执带**可判据的读数**（before/expected/actual/ticks）⇒ 调用方不用猜",
                res != null && intAt(res, "beforeCount") == 3 && intAt(res, "expectedRemaining") == 2
                        && intAt(res, "actualRemaining") == 3 && intAt(res, "ticksElapsed") >= 5);

        // F3 正例桩：点击**真落地** ⇒ 到点复读 applied:true / verified:true
        SilentDropBridge okB = new SilentDropBridge(true);
        PlaytestCore okCore = new PlaytestCore(okB, evDir("f2"), "tok");
        Map<String, Object> okRes = runQueuedDrop(okCore, 0, 1);
        check("F3 点击真落地 ⇒ 跨 tick 复读后 ok + verified:true + applied:true + remaining=C-1",
                okRes != null && isOk(okRes) && Boolean.TRUE.equals(data(okRes).get("verified"))
                        && Boolean.TRUE.equals(data(okRes).get("applied"))
                        && intAt(data(okRes), "remaining") == 2);

        // F4 同一 tick 的 phase-1 回执**不许**宣称已落地（直接 dispatch 只到「点击已发出」）
        SilentDropBridge b4 = new SilentDropBridge(false);
        PlaytestCore core4 = new PlaytestCore(b4, evDir("f3"), "tok");
        Map<String, Object> p1 = core4.dispatch("drop_item",
                params("slot", Integer.valueOf(0), "count", Integer.valueOf(1)));
        check("F4 同一 tick 的 phase-1 回执 verified=false + readTiming 明说「未落地校验」",
                isOk(p1) && Boolean.FALSE.equals(data(p1).get("verified"))
                        && String.valueOf(data(p1).get("readTiming")).contains("未落地校验")
                        && intAt(data(p1), "expectedRemaining") == 2);

        // F5 到点后读不到背包 ⇒ 校验做不了，**不假装丢成功**
        SilentDropBridge b5 = new SilentDropBridge(true);
        PlaytestCore core5 = new PlaytestCore(b5, evDir("f4"), "tok");
        ActionQueue.Job job5 = core5.queue().submit("drop_item",
                params("slot", Integer.valueOf(0), "count", Integer.valueOf(1)));
        core5.onTick();                          // 首发：点击 + 登记待办
        b5.inventoryAvailable = false;           // 到点前把背包读数掐掉
        Map<String, Object> r5 = job5.await(1);
        for (int i = 0; i < 40 && r5 == null; i++) {
            core5.onTick();
            r5 = job5.await(1);
        }
        check("F5 落地校验到点读不到背包 ⇒ DROP_ITEM_VERIFY_UNREADABLE（不假装成功）",
                r5 != null && "failed".equals(r5.get("status"))
                        && GuiResult.DROP_ITEM_VERIFY_UNREADABLE.equals(codeOf(r5)));

        sectionAdapterLandingSource();
    }

    // ==================================================================
    // F'. [T36] 适配层**同 tick** 落地校验的源码级判据（两档）
    // ==================================================================

    /**
     * 为什么要源码级判据：落地校验与本缺陷的根因都在**适配层的行列**里，而 adapter 依赖 MC
     * （离线 core 测试类路径里没有 net.minecraft.*），**跑不起来**。
     * 但「校验还在不在」是**结构事实**，可以逐字钉住 —— 这比"没法测"诚实，也给了可证伪的回归闸门：
     * 谁把那几行删了（正是本次负控干的事），这几条立刻变红。
     */
    private static void sectionAdapterLandingSource() {
        String rootProp = System.getProperty("bandd.mod.root", "F:\\B AND D MOD\\mod");
        Path root = Paths.get(rootProp);
        String[][] targets = {
                {"neoforge-1.20.1", "NeoForgeAdapter.java", "player.containerMenu"},
                {"fabric-1.21.11", "FabricAdapter.java", "player.currentScreenHandler"},
        };
        for (String[] t : targets) {
            Path p = findAdapter(root, t[0], t[1]);
            check("F6-" + t[0] + " 找得到适配层源文件（" + t[1] + "）⇒ 判据有落点", p != null);
            if (p == null) continue;
            String s;
            try {
                s = new String(Files.readAllBytes(p), java.nio.charset.StandardCharsets.UTF_8);
            } catch (Exception e) {
                check("F6-" + t[0] + " 源文件可读", false);
                continue;
            }
            int iDrop = s.indexOf("public GuiResult dropItem(");
            // 只取 dropItem 这一个方法体，避免与别的动作的同名片段混淆
            int iEnd = iDrop < 0 ? -1 : s.indexOf("\n    }\n", iDrop);
            String body = (iDrop < 0 || iEnd < 0) ? "" : s.substring(iDrop, iEnd);
            check("F7-" + t[0] + " dropItem 仍在（有方法体可判）", body.length() > 0);
            check("F8-" + t[0] + " 落地校验仍在：请求>0 且少掉的数量<=0 ⇒ 回 DROP_ITEM_NOT_APPLIED",
                    body.contains("GuiResult.DROP_ITEM_NOT_APPLIED")
                            && body.contains("want > 0 && delta <= 0"));
            check("F9-" + t[0] + " beforeCount 在**点击前**取（同对象被就地 shrink ⇒ 点击后读会假绿）",
                    body.contains("int beforeCount = stackCount;"));
            check("F10-" + t[0] + " 部分落地：delta<want ⇒ partial=true + requestedCount（不写成完全成功）",
                    body.contains("partial") && body.contains("want > 0 && delta < want"));
            check("F11-" + t[0] + " 回执带四个诊断字段：before/after/dropped + menuSource",
                    body.contains("d.put(\"before\"") && body.contains("d.put(\"after\"")
                            && body.contains("d.put(\"dropped\"") && body.contains("menuSource"));
            check("F12-" + t[0] + " 菜单与判据同源（menuSource=" + t[2] + "）",
                    body.contains("menuSource") && s.contains(t[2]));
        }
    }

    /** 在 mod/<档>/src 下按文件名找适配层（不写死完整包路径，包名改版也不脆）。 */
    private static Path findAdapter(Path modRoot, String versionDir, String fileName) {
        Path src = modRoot.resolve(versionDir).resolve("src");
        if (!Files.isDirectory(src)) return null;
        try (java.util.stream.Stream<Path> s = Files.walk(src)) {
            return s.filter(Files::isRegularFile)
                    .filter(p -> p.getFileName().toString().equals(fileName))
                    .findFirst().orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    /** 走**真实排队路径**跑一发 drop_item，tick 到跨 tick 待办出结论为止。 */
    private static Map<String, Object> runQueuedDrop(PlaytestCore core, int slot, int count) {
        ActionQueue.Job job = core.queue().submit("drop_item",
                params("slot", Integer.valueOf(slot), "count", Integer.valueOf(count)));
        Map<String, Object> res = job.await(1);
        for (int i = 0; i < 40 && res == null; i++) {
            core.onTick();
            res = job.await(1);
        }
        return res;
    }

    // ================= helpers =================

    /** 能力可配置的假桥：GUI 能力 = 会（这样 select_slot / drop_item 才在面上）。 */
    static class HotbarBridge extends FakeBridge {
        /** slot -> [itemId, countString]（只放非空格）。 */
        final Map<Integer, String[]> items = new LinkedHashMap<Integer, String[]>();
        int selected = 0;
        String meta = null;
        GuiResult selectFail = null;
        GuiResult dropFail = null;
        final List<String> hotbarCalls = new ArrayList<String>();
        int lastSelect = -999;
        int lastDropSlot = -999, lastDropCount = -999;
        boolean lastDropAll = false;

        HotbarBridge() {
            items.put(Integer.valueOf(0), new String[] { "minecraft:diamond", "7" });
            items.put(Integer.valueOf(1), new String[] { "minecraft:beef", "2" });
            items.put(Integer.valueOf(2), new String[] { "minecraft:birch_log", "1" });
        }

        @Override public boolean guiActionCapable() { return true; }
        @Override public boolean inventoryCapable() { return true; }
        // 与 GuiActionsTest.GuiBridge 同款：声明接了图形设置页 ⇒ DRIVER 里的 open_settings 不算缺口
        // （driverAvailable 才为 true，与既有 F8 的语义一致）。
        @Override public boolean configGuiAvailable() { return true; }

        @Override public String inventoryJson() {
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            m.put("size", Integer.valueOf(41));
            List<Object> slots = new ArrayList<Object>();
            for (Map.Entry<Integer, String[]> e : items.entrySet()) {
                slots.add(stack(e.getKey().intValue(), e.getValue()[0], Integer.parseInt(e.getValue()[1])));
            }
            m.put("slots", slots);
            m.put("selectedSlot", Integer.valueOf(selected));
            m.put("mainHand", mainHand());
            m.put("idKind", "registryName");
            return Json.of(m);
        }

        private Map<String, Object> stack(int slot, String id, int count) {
            Map<String, Object> s = new LinkedHashMap<String, Object>();
            s.put("slot", Integer.valueOf(slot));
            s.put("empty", Boolean.FALSE);
            s.put("itemId", id);
            s.put("idKind", "registryName");
            s.put("count", Integer.valueOf(count));
            return s;
        }

        private Map<String, Object> mainHand() {
            String[] v = items.get(Integer.valueOf(selected));
            return v == null ? null : stack(selected, v[0], Integer.parseInt(v[1]));
        }

        @Override public GuiResult selectSlot(int slot) {
            hotbarCalls.add("select:" + slot);
            lastSelect = slot;
            if (selectFail != null) return selectFail;
            int prev = selected;
            selected = slot;
            Map<String, Object> d = new LinkedHashMap<String, Object>();
            d.put("previousSlot", Integer.valueOf(prev));
            d.put("selectedSlot", Integer.valueOf(selected));
            d.put("mainHand", mainHand());
            return GuiResult.ok(d);
        }

        @Override public GuiResult dropItem(int slot, int count, boolean all) {
            hotbarCalls.add("drop:" + slot + "/" + count + "/" + all);
            lastDropSlot = slot; lastDropCount = count; lastDropAll = all;
            if (dropFail != null) return dropFail;
            int s = slot < 0 ? selected : slot;
            Map<String, Object> d = new LinkedHashMap<String, Object>();
            d.put("slot", Integer.valueOf(s));
            String[] cur = items.get(Integer.valueOf(s));
            if (cur == null) {
                d.put("count", Integer.valueOf(0));
                d.put("empty", Boolean.TRUE);
                d.put("remaining", Integer.valueOf(0));
                d.put("id", null);
                d.put("droppedId", null);
                return GuiResult.ok(d);
            }
            int have = Integer.parseInt(cur[1]);
            int want = (all || count < 0) ? have : Math.min(count, have);
            int rem = have - want;
            String droppedId = cur[0];
            if (rem <= 0) items.remove(Integer.valueOf(s));
            else cur[1] = String.valueOf(rem);
            d.put("count", Integer.valueOf(want));
            d.put("empty", Boolean.valueOf(rem <= 0));
            d.put("remaining", Integer.valueOf(Math.max(0, rem)));
            d.put("id", rem <= 0 ? null : cur[0]);
            d.put("droppedId", droppedId);
            d.put("idKind", "registryName");
            return GuiResult.ok(d);
        }

        @Override public String playerMetaJson() { return meta; }
    }

    /**
     * [T35] 反例 / 正例桩：{@code dropItem} 的**回执形状与真成功时逐字一样**，由 {@code applyOnClick}
     * 决定「点击到底落不落地」。{@code applyOnClick=false} 精确复现真机缺陷 —— 该格纹丝不动，
     * 旧代码却照报 count=1 / droppedId=...（静默无效）。
     */
    static class SilentDropBridge extends FakeBridge {
        final Map<Integer, Integer> counts = new LinkedHashMap<Integer, Integer>();
        final boolean applyOnClick;
        /** false = 落地校验到点后读不到背包（F5 用）。 */
        boolean inventoryAvailable = true;

        SilentDropBridge(boolean applyOnClick) {
            this.applyOnClick = applyOnClick;
            counts.put(Integer.valueOf(0), Integer.valueOf(3));
        }

        @Override public boolean guiActionCapable() { return true; }
        @Override public boolean inventoryCapable() { return true; }

        @Override public String inventoryJson() {
            if (!inventoryAvailable) return null;
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            m.put("size", Integer.valueOf(36));
            List<Object> slots = new ArrayList<Object>();
            for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
                int c = e.getValue().intValue();
                if (c <= 0) continue;
                Map<String, Object> s = new LinkedHashMap<String, Object>();
                s.put("slot", e.getKey());
                s.put("empty", Boolean.FALSE);
                s.put("itemId", "minecraft:diamond");
                s.put("idKind", "registryName");
                s.put("count", Integer.valueOf(c));
                slots.add(s);
            }
            m.put("slots", slots);
            m.put("selectedSlot", Integer.valueOf(0));
            m.put("idKind", "registryName");
            return Json.of(m);
        }

        @Override public GuiResult dropItem(int slot, int count, boolean all) {
            int have = counts.containsKey(Integer.valueOf(slot))
                    ? counts.get(Integer.valueOf(slot)).intValue() : 0;
            int want = (all || count < 0) ? have : Math.min(count, have);
            if (applyOnClick && have > 0) {
                counts.put(Integer.valueOf(slot), Integer.valueOf(Math.max(0, have - want)));
            }
            int shown = applyOnClick ? Math.max(0, have - want) : have;   // 不落地时读数 = 点击前
            Map<String, Object> d = new LinkedHashMap<String, Object>();
            d.put("slot", Integer.valueOf(slot));
            d.put("count", Integer.valueOf(want));
            d.put("empty", Boolean.valueOf(shown <= 0));
            d.put("remaining", Integer.valueOf(shown));
            d.put("id", shown <= 0 ? null : "minecraft:diamond");
            d.put("droppedId", have > 0 ? "minecraft:diamond" : null);
            d.put("idKind", "registryName");
            return GuiResult.ok(d);
        }
    }

    private static Map<String, Object> metaMap(String gm, Boolean flying, Boolean canFly, Boolean cheats, String note) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("gameMode", gm);
        m.put("flying", flying);
        m.put("canFly", canFly);
        m.put("cheats", cheats);
        m.put("note", note);
        return m;
    }

    private static Path evDir(String tag) { return base.resolve("ev-" + tag); }

    private static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        for (int i = 0; i + 1 < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }

    private static Map<String, Object> searchRes(PlaytestCore core, boolean refresh, Object... kv) {
        Map<String, Object> p = params(kv);
        p.put("refresh", Boolean.valueOf(refresh));
        return core.dispatch("query_blocks", p);
    }

    /** 只轮询（不带 refresh）+ tick 到扫完 / 提前收工；返回最后一次回执。 */
    private static Map<String, Object> searchPollDone(PlaytestCore core, Object... kv) {
        Map<String, Object> res = searchRes(core, false, kv);
        for (int i = 0; i < 400; i++) {
            if (!Boolean.TRUE.equals(mapAt(data(res), "scan").get("active"))) break;
            for (int t = 0; t < 5; t++) core.onTick();
            res = searchRes(core, false, kv);
        }
        return res;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> data(Map<String, Object> res) {
        Object d = res.get("data");
        return (d instanceof Map) ? (Map<String, Object>) d : new LinkedHashMap<String, Object>();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> mapAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof Map) ? (Map<String, Object>) v : new LinkedHashMap<String, Object>();
    }

    private static Map<?, ?> findSlot(Map<String, Object> inv, int slot) {
        Object sl = inv.get("slots");
        if (!(sl instanceof List)) return null;
        for (Object o : (List<?>) sl) {
            if (!(o instanceof Map)) continue;
            Map<?, ?> e = (Map<?, ?>) o;
            Object s = e.get("slot");
            if (s instanceof Number && ((Number) s).intValue() == slot) return e;
        }
        return null;
    }

    private static List<String> strList(Object v) {
        List<String> out = new ArrayList<String>();
        if (v instanceof List) for (Object o : (List<?>) v) out.add(String.valueOf(o));
        return out;
    }

    private static int intAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof Number) ? ((Number) v).intValue() : Integer.MIN_VALUE;
    }

    private static boolean isOk(Map<String, Object> res) { return "ok".equals(res.get("status")); }

    private static String codeOf(Map<String, Object> res) {
        Object c = res.get("code");
        return c == null ? null : String.valueOf(c);
    }

    private static void check(String name, boolean ok) {
        if (ok) {
            pass++;
            System.out.println("[PASS] " + name);
        } else {
            fail++;
            System.out.println("[FAIL] " + name);
        }
    }
}
