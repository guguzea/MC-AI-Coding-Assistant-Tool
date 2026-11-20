package com.bandd.playtest.test;

import com.bandd.playtest.core.MiningTracker;
import com.bandd.playtest.core.PlaytestCore;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * [T20] 三条**真机实测挖出的正确性缺陷**的离线回归测试（合成世界 + 假桥，不需要 Minecraft）。
 *
 * <ul>
 *   <li><b>① mine 在 neoforge 上挖不动</b>：{@code continueDestroyBlock} /
 *       {@code updateBlockBreakingProgress} / {@code onPlayerDamageBlock} 在延迟 / 冷却未到的分支里
 *       **也返回 true** ⇒ 旧写法把返回值当「已挖穿」，第一 tick 就清空目标。本类
 *       ①-A/B 用**桩**（前几次 continue 回 true，目标格最后才变空气）验「变空气前不得清空」，
 *       ①-C 验 core 的 mine 回执带破坏进度；①-D 是**全档源码门**（谁改回旧写法就红）。</li>
 *   <li><b>② query_blocks 拿旧结果冒充新条件</b>：换 filter / radius / y1 / y2 却不带 refresh 时，
 *       顶层 filter 回显新条件而 matched / matches 还是上一次的。② 验三态
 *       （条件变不带 refresh ⇒ 自动重扫 + 旧结果清零；条件不变 ⇒ 复用；带 refresh ⇒ 强制重扫），
 *       并复刻真机场景（先扫 air，再点名 iron_ore）。</li>
 *   <li><b>③ press 失焦静默失效却报 down</b>：③ 用桩让 windowFocused 分别为 false / true / 未知，
 *       验回执里的 windowFocused + mayTakeEffect（失焦时必须 false，不再假装已按下）。</li>
 * </ul>
 *
 * <p>跑法（**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/t20/testwork -Dbandd.mod.root="F:\B AND D MOD\mod" \
 *        -cp out com.bandd.playtest.test.T20CorrectnessTest
 * </pre>
 *
 * <p>与既有十套**分开报数**：本类只加新判据，既有断言一条不动。
 */
public final class T20CorrectnessTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t20/testwork");
        base = Paths.get(dir, "t20-" + System.nanoTime());
        Files.createDirectories(base);
        sectionMiningTracker();
        sectionMineReceipt();
        sectionStaleSearch();
        sectionPressFocus();
        sectionAdapterSourceGate();
        System.out.println();
        System.out.println("=== T20 correctness tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ==================================================================
    // ①-A/B MiningTracker：桩让 continue 先回 true（未破），目标格最后才变空气
    // ==================================================================

    /**
     * 桩游戏模式，**逐字照 vanilla 的返回语义**：
     * <ul>
     *   <li>第 1、2 次调用走「destroyDelay / blockBreakingCooldown 未到」分支 ⇒ **回 true**（方块仍在）；</li>
     *   <li>第 3 次走进度累计分支 ⇒ 回 false（方块仍在）；</li>
     *   <li>第 4 次进度满 ⇒ **方块变空气**，回 true（vanilla 挖穿分支也回 true）。</li>
     * </ul>
     */
    private static final class StubGameMode {
        int calls;
        boolean blockIsAir() { return calls >= 4; }
        boolean continueDestroyBlock() {
            calls++;
            return calls <= 2 || calls >= 4;
        }
    }

    private static void sectionMiningTracker() {
        MiningTracker t = new MiningTracker(50);
        boolean fresh = t.aim(10, 64, -3, "minecraft:stone", 1000L);
        check("①-A0 aim 新目标回 true（调用方据此发一次 START）", fresh && t.hasTarget());
        check("①-A0b 同一目标再 aim 回 false（**绝不重发 START**：重发会清零破坏进度）",
                !t.aim(10, 64, -3, "minecraft:stone", 1001L) && t.hasTarget());

        StubGameMode gm = new StubGameMode();
        for (int i = 1; i <= 4; i++) {
            boolean air = gm.blockIsAir();
            String stop = t.beginTick(air, 1000L + i);
            check("①-A" + i + " 第 " + i + " tick：目标格尚未变空气 ⇒ 目标**不得被清空**"
                            + "（continue 回 true 也一样）; hasTarget=" + t.hasTarget(),
                    stop == null && t.hasTarget());
            boolean cont = gm.continueDestroyBlock();
            check("①-A" + i + "b 桩 continueDestroyBlock 本轮返回 " + cont
                            + "（前 2 轮 = vanilla 延迟分支的 true）", cont == (i <= 2 || i == 4));
            t.noteContinueReturned(cont);
        }
        Map<String, Object> mid = t.status();
        check("①-A5 4 个 tick 后仍在挖：miningTicks=" + mid.get("miningTicks")
                        + " / continueReturnedTrueCount=" + mid.get("continueReturnedTrueCount")
                        + " / targetStillThere=" + mid.get("targetStillThere"),
                ((Number) mid.get("miningTicks")).intValue() == 4
                        && ((Number) mid.get("continueReturnedTrueCount")).intValue() == 3
                        && Boolean.TRUE.equals(mid.get("targetStillThere")));

        String stop = t.beginTick(gm.blockIsAir(), 1005L);
        Map<String, Object> done = t.status();
        check("①-B 目标格变空气 ⇒ 收工码 = MINE_BROKEN（这才是唯一完成判据）",
                MiningTracker.STOP_BROKEN.equals(stop));
        check("①-B2 收工后 hasTarget=false / minedCount=1 / lastStopReason=MINE_BROKEN / lastMined 记账",
                !t.hasTarget() && t.minedCount() == 1
                        && MiningTracker.STOP_BROKEN.equals(done.get("lastStopReason"))
                        && "10,64,-3".equals(done.get("lastMined")));

        // ①-B3 超时兜底：永远不变空气 ⇒ MINE_TIMEOUT（fail-loud），绝不无限挂着
        MiningTracker t2 = new MiningTracker(5);
        t2.aim(1, 2, 3, "minecraft:obsidian", 0L);
        String last = null;
        for (int i = 0; i < 12 && t2.hasTarget(); i++) {
            last = t2.beginTick(false, i);
            t2.noteContinueReturned(true);       // 一直回 true（延迟分支），照样不能收工
        }
        check("①-B3 目标 12 tick 不变空气 + 超时 5 ⇒ 收工码 MINE_TIMEOUT（不是 MINE_BROKEN）",
                MiningTracker.STOP_TIMEOUT.equals(last) && !t2.hasTarget());
        check("①-B4 超时不记挖穿计数（minedCount 仍 0）+ status 里明写超时",
                t2.minedCount() == 0
                        && MiningTracker.STOP_TIMEOUT.equals(t2.status().get("lastStopReason")));
    }

    // ==================================================================
    // ①-C mine 回执带破坏进度（合成桥：tick() 走 MiningTracker，桩 continue 前两次回 true）
    // ==================================================================

    /** 合成桥：mine 目标固定为 (8,69,-8)（= 合成世界的地表方块），blockAir 由测试摆。 */
    private static final class MineBridge extends SyntheticWorldBridge {
        final MiningTracker tracker = new MiningTracker(50);
        boolean blockAir = false;
        int continueCalls = 0;
        Boolean focused = null;

        @Override public String mineLookingAt() {
            if (blockAir) return null;
            if (!tracker.hasTarget()) tracker.aim(8, 69, -8, "minecraft:grass_block", 0L);
            return "8,69,-8";
        }

        @Override public Map<String, Object> mineStatus() { return tracker.status(); }

        @Override public Boolean windowFocused() { return focused; }

        /** 记下 press 真的把键位写进了游戏（诚实回执 ≠ 不发按键）。 */
        final Map<String, Boolean> pressed = new LinkedHashMap<String, Boolean>();
        @Override public void setPressed(String key, boolean down) { pressed.put(key, Boolean.valueOf(down)); }
        @Override public boolean isPressed(String key) { return Boolean.TRUE.equals(pressed.get(key)); }

        @Override public void tick() {
            if (!tracker.hasTarget()) return;
            String stop = tracker.beginTick(blockAir, 0L);
            if (stop != null) return;                     // 桩：空气 ⇒ 收工
            continueCalls++;
            // 桩：前两次 continue 回 true（vanilla 延迟 / 冷却分支）——**绝不能**因此清空目标
            tracker.noteContinueReturned(continueCalls <= 2);
        }
    }

    private static void sectionMineReceipt() {
        MineBridge b = new MineBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("mine"), "tok");

        Map<String, Object> r1 = core.dispatch("mine", params());
        Map<String, Object> d1 = data(r1);
        check("①-C1 mine status=ok + mined/target/started 字段", isOk(r1)
                && "8,69,-8".equals(d1.get("mined")) && "8,69,-8".equals(d1.get("target"))
                && Boolean.TRUE.equals(d1.get("started")));
        Map<String, Object> p1 = mapAt(d1, "progress");
        check("①-C2 回执带 progress（不再是黑盒）：target / targetBlock / miningTicks / targetStillThere",
                !p1.isEmpty() && "8,69,-8".equals(p1.get("target"))
                        && "minecraft:grass_block".equals(p1.get("targetBlock"))
                        && intAt(p1, "miningTicks") == 0
                        && Boolean.TRUE.equals(p1.get("targetStillThere")));
        check("①-C3 progressNote 明写「跨 tick / 不代表已挖穿 / 真值看 targetStillThere + lastStopReason」",
                d1.get("progressNote") != null
                        && String.valueOf(d1.get("progressNote")).indexOf("跨 tick") >= 0
                        && String.valueOf(d1.get("progressNote")).indexOf("targetStillThere") >= 0);

        runTicks(core, 3);
        Map<String, Object> d2 = data(core.dispatch("mine", params()));
        Map<String, Object> p2 = mapAt(d2, "progress");
        check("①-C4 3 个 tick 后 miningTicks=3 且目标仍在 / continueReturnedTrueCount=2"
                        + "（continue 两次回 true 没有清空它）",
                intAt(p2, "miningTicks") == 3 && Boolean.TRUE.equals(p2.get("targetStillThere"))
                        && intAt(p2, "continueReturnedTrueCount") == 2 && b.continueCalls == 3);

        b.blockAir = true;
        core.onTick();                       // 目标格变空气 ⇒ 状态机收工（STOP_BROKEN）
        // 目标已挖穿 ⇒ mineLookingAt 回 null ⇒ MINE_FAILED；错误回执是**顶层**（不是 data 段），
        // 也要把进度实情带上（不许把「为什么没挖到」吞掉）。
        Map<String, Object> r3 = core.dispatch("mine", params());
        check("①-C5 挖穿后再 mine ⇒ MINE_FAILED（准星没有可破坏方块），顶层 progress 里"
                        + " lastStopReason=MINE_BROKEN / minedCount=1 / targetStillThere=false",
                "MINE_FAILED".equals(codeOf(r3))
                        && MiningTracker.STOP_BROKEN.equals(mapAt(r3, "progress").get("lastStopReason"))
                        && intAt(mapAt(r3, "progress"), "minedCount") == 1
                        && Boolean.FALSE.equals(mapAt(r3, "progress").get("targetStillThere")));
        check("①-C6 MINE_FAILED 回执也带 progressNote（错也要说清 progress 是什么）",
                r3.get("progressNote") != null);
    }

    // ==================================================================
    // ② query_blocks：换条件 = 自动重扫（绝不用旧结果配新条件的回显）
    // ==================================================================

    private static void sectionStaleSearch() {
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("stale"), "tok");

        // ---- ②-1/2 先真扫一轮 air（真机现场就是「拿回一堆 air」）----
        Map<String, Object> air = data(searchPollDone(core, "filter", "air", "radius", 2, "maxMatches", 512));
        check("②-1 先扫一轮 filter=air（扫完、命中 >0 且**全是 air**）",
                intAt(air, "matched") > 0 && onlyIds(air, "minecraft:air")
                        && Boolean.TRUE.equals(mapAt(air, "scan").get("complete")));

        // ---- ②-2 换 iron_ore 但**不带 refresh**（真机现场：点名矿物却拿回 11 条 air）----
        Map<String, Object> r2 = searchRes(core, false, "filter", "minecraft:iron_ore",
                "radius", 2, "maxMatches", 512);
        Map<String, Object> d2 = data(r2);
        check("②-2 换条件不带 refresh ⇒ restarted:true + restartedReason=condition_changed"
                        + "（restarted=" + d2.get("restarted") + " reason=" + d2.get("restartedReason") + "）",
                Boolean.TRUE.equals(d2.get("restarted"))
                        && "condition_changed".equals(d2.get("restartedReason"))
                        && Boolean.TRUE.equals(d2.get("conditionChanged")));
        check("②-3 **旧结果一条都不许留**：matched=0 / matches=[] / scan.doneBlocks=0（旧结果已被丢掉）",
                intAt(d2, "matched") == 0 && listAt(d2, "matches").isEmpty()
                        && intAt(mapAt(d2, "scan"), "doneBlocks") == 0);
        check("②-4 顶层 filter 回显新条件，且 scan.filterApplied 与它一致"
                        + "（旧实现里 filterApplied 是**唯一**诚实字段，现在不再唯一但也不许不一致）",
                strList(d2.get("filter")).contains("minecraft:iron_ore")
                        && strList(mapAt(d2, "scan").get("filterApplied")).contains("minecraft:iron_ore")
                        && !strList(mapAt(d2, "scan").get("filterApplied")).contains("air"));
        check("②-5 previousCondition 如实给出上一次**实际用的**条件（filter=[air] + 扫描进度）",
                !mapAt(d2, "previousCondition").isEmpty()
                        && strList(mapAt(d2, "previousCondition").get("filter")).contains("air")
                        && intAt(mapAt(d2, "previousCondition"), "scannedBlocks") > 0);
        check("②-6 conditionChanged + 兼容位 filterChanged + 人话（filterChangedNote）",
                Boolean.TRUE.equals(d2.get("filterChanged")) && d2.get("filterChangedNote") != null
                        && String.valueOf(d2.get("filterChangedNote")).indexOf("自动重扫") >= 0);

        // ---- ②-7 只换 radius / y1 也进条件判据（旧实现只比 filter）----
        Map<String, Object> d7 = data(searchRes(core, false, "filter", "minecraft:iron_ore",
                "radius", 3, "maxMatches", 512));
        check("②-7 只换 radius 不带 refresh ⇒ 同样自动重扫 + previousCondition.radius=2 / 本次 radius=3",
                Boolean.TRUE.equals(d7.get("restarted"))
                        && "condition_changed".equals(d7.get("restartedReason"))
                        && intAt(mapAt(d7, "previousCondition"), "radius") == 2
                        && intAt(d7, "radius") == 3);
        Map<String, Object> d8 = data(searchRes(core, false, "filter", "minecraft:iron_ore",
                "radius", 3, "y1", 60, "y2", 70, "maxMatches", 512));
        check("②-8 只换 y1/y2 不带 refresh ⇒ 同样自动重扫 + previousCondition 给出上一次的 y 窗口",
                Boolean.TRUE.equals(d8.get("restarted"))
                        && intAt(mapAt(d8, "previousCondition"), "y1") == 49
                        && intAt(d8, "y1") == 60 && intAt(d8, "y2") == 70);

        // ---- ②-9 三态之「条件相同 ⇒ 复用同一轮」----
        Map<String, Object> d9 = data(searchRes(core, false, "filter", "minecraft:iron_ore",
                "radius", 3, "y1", 60, "y2", 70, "maxMatches", 512));
        check("②-9 条件**逐字相同**且不带 refresh ⇒ restarted:false + reused:true + reusedNote"
                        + "（复用同一轮扫描，不重置进度）",
                Boolean.FALSE.equals(d9.get("restarted")) && Boolean.TRUE.equals(d9.get("reused"))
                        && d9.get("reusedNote") != null
                        && d9.get("restartedReason") == null
                        && d9.get("filterChanged") == null);

        // ---- ②-10 三态之「带 refresh ⇒ 强制重扫」----
        Map<String, Object> raw10 = searchRes(core, true, "filter", "minecraft:iron_ore",
                "radius", 3, "y1", 60, "y2", 70, "maxMatches", 512);
        Map<String, Object> d10 = data(raw10);
        check("②-10 带 refresh=true（条件不变）⇒ restarted:true + refreshRequested:true +"
                        + " restartedReason=refresh_requested",
                Boolean.TRUE.equals(d10.get("restarted")) && Boolean.TRUE.equals(d10.get("refreshRequested"))
                        && "refresh_requested".equals(d10.get("restartedReason"))
                        && intAt(mapAt(d10, "scan"), "doneBlocks") == 0);

        // ---- ②-11 换条件后扫完 ⇒ matches 全来自新条件（真机场景的收口）----
        Map<String, Object> ironDone = data(searchPollDone(core, "filter", "minecraft:iron_ore",
                "radius", 2, "maxMatches", 512));
        check("②-11 新条件扫完后 matches 只可能是新条件的 id（合成世界里没有 iron_ore ⇒ 空是合法读数）",
                intAt(ironDone, "matched") == 0 && listAt(ironDone, "matches").isEmpty()
                        && strList(mapAt(ironDone, "scan").get("filterApplied")).contains("minecraft:iron_ore"));

        Map<String, Object> stoneDone = data(searchPollDone(core, "filter", "minecraft:stone",
                "radius", 2, "maxMatches", 512));
        check("②-12 再换 stone 并扫完 ⇒ 命中全 stone、且没有一条 air 冒充"
                        + "（复用那一发不带 filterChanged 位）",
                intAt(stoneDone, "matched") > 0 && onlyIds(stoneDone, "minecraft:stone")
                        && stoneDone.get("filterChanged") == null);
    }

    // ==================================================================
    // ③ press：失焦时回执必须如实体现「不会生效」
    // ==================================================================

    private static void sectionPressFocus() {
        MineBridge b = new MineBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("press"), "tok");

        b.focused = Boolean.FALSE;
        Map<String, Object> r1 = core.dispatch("press", params("key", "attack", "down", Boolean.TRUE));
        Map<String, Object> d1 = data(r1);
        check("③-1 失焦按 attack：status=ok（键位照样写入）但 windowFocused=false + mayTakeEffect=false"
                        + "（**不再假装已按下**）",
                isOk(r1) && Boolean.FALSE.equals(d1.get("windowFocused"))
                        && Boolean.FALSE.equals(d1.get("mayTakeEffect"))
                        && "attack down".equals(d1.get("key")));
        check("③-2 失焦回执带人话 pressNote（说明 MC 不处理输入 + 本模组不做宿主级注入）",
                d1.get("pressNote") != null
                        && String.valueOf(d1.get("pressNote")).indexOf("失焦") >= 0
                        && String.valueOf(d1.get("pressNote")).indexOf("不会生效") >= 0);
        check("③-3 键位**确实写进了游戏**（诚实回执不等于不发按键）：bridge 收到 attack=true",
                Boolean.TRUE.equals(b.pressed.get("attack")));

        b.focused = Boolean.TRUE;
        Map<String, Object> d4 = data(core.dispatch("press", params("key", "use", "down", Boolean.TRUE)));
        check("③-4 聚焦时 windowFocused=true + mayTakeEffect=true",
                Boolean.TRUE.equals(d4.get("windowFocused")) && Boolean.TRUE.equals(d4.get("mayTakeEffect")));

        Map<String, Object> d5 = data(core.dispatch("press", params("key", "use", "down", Boolean.FALSE)));
        check("③-5 释放（down=false）恒 mayTakeEffect=true（松键不依赖聚焦）",
                Boolean.TRUE.equals(d5.get("mayTakeEffect")) && "use up".equals(d5.get("key")));

        // 未知档：本档不报聚焦位 ⇒ 回 null（未知），**不假装已生效**
        SyntheticWorldBridge plain = new SyntheticWorldBridge();
        PlaytestCore core2 = new PlaytestCore(plain, evDir("press2"), "tok");
        Map<String, Object> d6 = data(core2.dispatch("press", params("key", "forward", "down", Boolean.TRUE)));
        check("③-6 本档不报聚焦位 ⇒ windowFocused=null + mayTakeEffect=null + pressNote 明写「未知」"
                        + "（不假装已生效）",
                d6.containsKey("windowFocused") && d6.get("windowFocused") == null
                        && d6.containsKey("mayTakeEffect") && d6.get("mayTakeEffect") == null
                        && d6.get("pressNote") != null
                        && String.valueOf(d6.get("pressNote")).indexOf("未知") >= 0);

        b.focused = Boolean.FALSE;
        Map<String, Object> r7 = core.dispatch("press", params("key", "attack", "down", Boolean.TRUE));
        Map<String, Object> d7 = data(r7);
        check("③-7 复现真机序列：失焦态 toggle 回 false 后，回执**仍**不得出现裸 down 而无聚焦位",
                Boolean.FALSE.equals(d7.get("windowFocused"))
                        && Boolean.FALSE.equals(d7.get("mayTakeEffect")));
    }

    // ==================================================================
    // ①-D 全档源码门：任何适配层都不许再写「if (continue(...)) this.mining = null;」
    // ==================================================================

    private static final String[] MINING_CALLS = {
        "continueDestroyBlock", "updateBlockBreakingProgress", "onPlayerDamageBlock", "method_2902"
    };

    private static void sectionAdapterSourceGate() {
        String rootProp = System.getProperty("bandd.mod.root", "F:\\B AND D MOD\\mod");
        Path root = Paths.get(rootProp);
        if (!Files.isDirectory(root)) {
            check("①-D0 给了 -Dbandd.mod.root 且目录存在（当前 " + rootProp + "）", false);
            return;
        }
        // 只遍历每个档的 <port>/src（**不跟** .gradle / build / run —— 那几棵树下有几十万文件）
        List<Path> adapters = new ArrayList<Path>();
        try (Stream<Path> top = Files.list(root)) {
            List<Path> ports = new ArrayList<Path>();
            top.forEach(ports::add);
            for (Path port : ports) {
                Path src = port.resolve("src");
                if (!Files.isDirectory(src)) continue;
                try (Stream<Path> s = Files.walk(src)) {
                    s.filter(p -> p.getFileName().toString().endsWith("Adapter.java"))
                     .forEach(adapters::add);
                }
            }
        } catch (Exception e) {
            check("①-D0b 能遍历适配层源码（" + e + "）", false);
            return;
        }
        check("①-D1 扫到 >= 40 个适配层源文件（实际 " + adapters.size() + "）", adapters.size() >= 40);

        List<String> bad = new ArrayList<String>();
        int withTracker = 0;
        for (Path p : adapters) {
            String text;
            try {
                text = new String(Files.readAllBytes(p), StandardCharsets.UTF_8);
            } catch (Exception e) {
                bad.add(p + "（读不了：" + e + "）");
                continue;
            }
            if (text.contains("MiningTracker")) withTracker++;
            String[] lines = text.split("\\r?\\n");
            for (int i = 0; i < lines.length; i++) {
                String ln = lines[i].trim();
                // 只看**代码行**：注释行（// 或 * 开头）不算（文档里会引用旧写法做反面教材）
                if (ln.startsWith("//") || ln.startsWith("*") || ln.startsWith("/*")) continue;
                if (!ln.startsWith("if")) continue;
                boolean hit = false;
                for (String c : MINING_CALLS) if (ln.contains(c)) hit = true;
                if (hit && ln.contains("this.mining") && ln.contains("null")) {
                    bad.add(p.getFileName() + ":" + (i + 1) + " → " + ln);
                }
            }
        }
        check("①-D2 **全档无一处**把挖矿 continue 的返回值当「已挖穿」（旧写法 " 
                        + "if (continueDestroyBlock(...)) this.mining = null; 的残留数 = " + bad.size() + "）"
                        + (bad.isEmpty() ? "" : "；首条：" + bad.get(0)),
                bad.isEmpty());
        check("①-D3 至少两个在编档（neoforge-1.20.1 / fabric-1.21.11）已接 MiningTracker（实际 "
                        + withTracker + " 个）", withTracker >= 2);

        Path nf = root.resolve("neoforge-1.20.1/src/main/java/com/bandd/playtest/neoforge1201/NeoForgeAdapter.java");
        Path fb = root.resolve("fabric-1.21.11/src/main/java/com/bandd/playtest/fabric1211/FabricAdapter.java");
        check("①-D4 neoforge-1.20.1 适配层：用 beginTick + noteContinueReturned（不看返回值）",
                containsAll(nf, "beginTick", "noteContinueReturned", "mineStatus()", "windowFocused()"));
        check("①-D5 fabric-1.21.11 适配层：同款语义（beginTick + noteContinueReturned + 进度自报 + 聚焦自报）",
                containsAll(fb, "beginTick", "noteContinueReturned", "mineStatus()", "windowFocused()"));
    }

    private static boolean containsAll(Path p, String... needles) {
        try {
            String t = new String(Files.readAllBytes(p), StandardCharsets.UTF_8);
            for (String n : needles) if (!t.contains(n)) return false;
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ================= helpers =================

    private static Path evDir(String tag) { return base.resolve("ev-" + tag); }

    private static void runTicks(PlaytestCore core, int n) {
        for (int i = 0; i < n; i++) core.onTick();
    }

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

    /** 只轮询（**不带 refresh**）+ tick 到扫完；返回最后一次回执。 */
    private static Map<String, Object> searchPollDone(PlaytestCore core, Object... kv) {
        Map<String, Object> res = searchRes(core, false, kv);
        for (int i = 0; i < 400; i++) {
            if (!Boolean.TRUE.equals(mapAt(data(res), "scan").get("active"))) break;
            runTicks(core, 5);
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

    private static List<?> listAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof List) ? (List<?>) v : new ArrayList<Object>();
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

    /** matches 里是否**只**出现该 id（且至少一条）。 */
    private static boolean onlyIds(Map<String, Object> d, String id) {
        List<?> ms = listAt(d, "matches");
        if (ms.isEmpty()) return false;
        for (Object o : ms) {
            Object got = ((Map<?, ?>) o).get("id");
            if (!id.equals(String.valueOf(got))) return false;
        }
        return true;
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
