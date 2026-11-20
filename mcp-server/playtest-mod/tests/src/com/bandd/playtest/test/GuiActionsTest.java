package com.bandd.playtest.test;

import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.GuiResult;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.core.SlotRoles;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **[T19] 「点屏幕 / 操作容器」五条动作的真测试**（与既有十套**分开报数**，既有断言一条不改）：
 * <ol>
 *   <li>{@code query_slots} —— 槽位清单 / menuType / containerId / 每格 role / playerRange；</li>
 *   <li>{@code click_slot} —— 参数面、原版点击语义映射（button/shift ⇒ 点击类型）、**越界 fail-loud**；</li>
 *   <li>{@code click_widget} —— 下标对应 query_widgets 清单、**越界 / 没界面 fail-loud**；</li>
 *   <li>{@code use_on} / {@code place_block} —— 参数面与失败码透传；</li>
 *   <li>能力自报：{@code GUI_ACTIONS} 进 DRIVER、{@code /status} 按能力如实过滤。</li>
 * </ol>
 *
 * <p>跑法（工作目录任意；**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/t19/testwork -cp out com.bandd.playtest.test.GuiActionsTest
 * </pre>
 *
 * <p><b>两个负控</b>（都在 core，见交付报告的「负控两次读数」）：
 * <ul>
 *   <li><b>①</b> 去掉 {@code click_slot} 的越界检查（PlaytestCore 里那一个 if）⇒
 *       {@code C6/C7/C8/C14} 必红；</li>
 *   <li><b>②</b> 把 {@code query_slots} 的「没开界面」改成回**空列表** ⇒
 *       {@code C12/F2} 一类「如实 fail-loud」断言必红。</li>
 * </ul>
 */
public final class GuiActionsTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t19/testwork");
        base = Paths.get(dir, "run-" + System.nanoTime());
        Files.createDirectories(base);

        // ================= A. query_slots：形状 + 精确角色表 =================
        GuiBridge g = new GuiBridge();
        g.slots = mkSlots("CraftingScreen", "minecraft:crafting", 7, 46, 2, "minecraft:oak_planks", 3);
        PlaytestCore core = new PlaytestCore(g, evDir("a"), "tok");
        Map<String, Object> q = core.dispatch("query_slots", params());
        Map<String, Object> qd = data(q);

        check("A1 query_slots 成功（status=ok）", "ok".equals(q.get("status")));
        check("A2 回执带 screen/menuType/containerId/slotCount",
                "CraftingScreen".equals(qd.get("screen"))
                        && "minecraft:crafting".equals(qd.get("menuType"))
                        && intAt(qd, "containerId") == 7 && intAt(qd, "slotCount") == 46);
        List<?> slots = (List<?>) qd.get("slots");
        check("A3 slots 逐格给全（46 条）", slots != null && slots.size() == 46);
        check("A4 0 号格 = craft_result（合成结果格）", "craft_result".equals(roleAt(slots, 0)));
        boolean allInput = true;
        for (int i = 1; i <= 9; i++) if (!"craft_input".equals(roleAt(slots, i))) allInput = false;
        check("A5 1..9 号格 = craft_input（工作台 3x3 合成输入）", allInput);
        check("A6 10..36 = player_main、37..45 = player_hotbar（玩家主背包 27 + 快捷栏 9）",
                "player_main".equals(roleAt(slots, 10)) && "player_main".equals(roleAt(slots, 36))
                        && "player_hotbar".equals(roleAt(slots, 37)) && "player_hotbar".equals(roleAt(slots, 45)));
        Map<String, Object> pr = mapAt(qd, "playerRange");
        check("A7 playerRange = 10..45（工作台）", intAt(pr, "from") == 10 && intAt(pr, "to") == 45);
        check("A8 roleKnown=true（命中精确表）+ roleNote 写明出处是 javap 实证", 
                Boolean.TRUE.equals(qd.get("roleKnown")) && String.valueOf(qd.get("roleNote")).contains("javap"));
        Map<String, Object> s0 = asMap(slots.get(0));   // 非空（mkSlots 前 2 格给料）
        Map<String, Object> s1 = asMap(slots.get(1));   // 非空
        Map<String, Object> sE = asMap(slots.get(2));   // 空
        check("A9 非空格的 itemId/count/empty/idKind 如实（count 是整数 3，不是 3.0）",
                Boolean.FALSE.equals(s1.get("empty")) && "minecraft:oak_planks".equals(s1.get("itemId"))
                        && (s1.get("count") instanceof Integer) && intAt(s1, "count") == 3
                        && "registryName".equals(s1.get("idKind")));
        check("A10 空格如实 empty:true + itemId:null + count:0（不编物品）",
                Boolean.TRUE.equals(sE.get("empty")) && sE.get("itemId") == null && intAt(sE, "count") == 0);
        check("A11 每格带 Slot 自己的坐标 x/y（整数）",
                (s0.get("x") instanceof Integer) && intAt(s0, "x") == 8 && intAt(s0, "y") == 18);
        check("A12 playerSlot 标记与 role 对账（0 号 false、10 号 true）",
                Boolean.FALSE.equals(s0.get("playerSlot")) && Boolean.TRUE.equals(asMap(slots.get(10)).get("playerSlot")));
        Map<String, Object> rc = mapAt(qd, "roles");
        check("A13 角色计数对账（result 1 / craft_input 9 / main 27 / hotbar 9）",
                intAt(rc, "craft_result") == 1 && intAt(rc, "craft_input") == 9
                        && intAt(rc, "player_main") == 27 && intAt(rc, "player_hotbar") == 9);
        check("A14 idKindNote 当面说清与桥路线的口径差异", qd.get("idKindNote") != null
                && String.valueOf(qd.get("idKindNote")).contains("unlocalizedName"));

        // 玩家自己的背包屏（规范里点的那个例子：playerRange = 9..44）
        GuiBridge gi = new GuiBridge();
        gi.slots = mkSlots("InventoryScreen", "minecraft:inventory", 0, 46, 0, "minecraft:air", 0);
        PlaytestCore coreI = new PlaytestCore(gi, evDir("a2"), "tok");
        Map<String, Object> qI = data(coreI.dispatch("query_slots", params()));
        List<?> sI = (List<?>) qI.get("slots");
        Map<String, Object> prI = mapAt(qI, "playerRange");
        check("A15 玩家背包屏：playerRange = 9..44（与需求给的例子逐字一致）",
                intAt(prI, "from") == 9 && intAt(prI, "to") == 44);
        check("A16 玩家背包屏：0 结果 / 1-4 合成输入 / 5-8 护甲 / 45 副手",
                "craft_result".equals(roleAt(sI, 0))
                        && "craft_input".equals(roleAt(sI, 1)) && "craft_input".equals(roleAt(sI, 4))
                        && "armor".equals(roleAt(sI, 5)) && "armor".equals(roleAt(sI, 8))
                        && "offhand".equals(roleAt(sI, 45)));

        // 熔炉（燃料格 / 输入格 / 输出格）
        GuiBridge gf = new GuiBridge();
        gf.slots = mkSlots("FurnaceScreen", "minecraft:furnace", 0, 39, 3, "minecraft:iron_ore", 1);
        PlaytestCore coreF = new PlaytestCore(gf, evDir("a3"), "tok");
        Map<String, Object> qF = data(coreF.dispatch("query_slots", params()));
        List<?> sF = (List<?>) qF.get("slots");
        Map<String, Object> prF = mapAt(qF, "playerRange");
        check("A17 熔炉：0 输入 / 1 燃料 / 2 输出 / playerRange 3..38",
                "input".equals(roleAt(sF, 0)) && "fuel".equals(roleAt(sF, 1)) && "output".equals(roleAt(sF, 2))
                        && intAt(prF, "from") == 3 && intAt(prF, "to") == 38);

        // 箱子（generic_9x3）
        GuiBridge gc = new GuiBridge();
        gc.slots = mkSlots("GenericContainerScreen", "minecraft:generic_9x3", 3, 63, 1, "minecraft:stone", 64);
        PlaytestCore coreC = new PlaytestCore(gc, evDir("a4"), "tok");
        Map<String, Object> qC = data(coreC.dispatch("query_slots", params()));
        List<?> sC = (List<?>) qC.get("slots");
        Map<String, Object> prC = mapAt(qC, "playerRange");
        check("A18 箱子 9x3：0..26 = container、playerRange 27..62",
                "container".equals(roleAt(sC, 0)) && "container".equals(roleAt(sC, 26))
                        && intAt(prC, "from") == 27 && intAt(prC, "to") == 62);

        GuiBridge g1 = new GuiBridge();
        g1.slots = mkSlots("Screen", "minecraft:generic_9x1", 0, 45, 0, "x", 1);
        Map<String, Object> q1 = data(new PlaytestCore(g1, evDir("a5"), "tok").dispatch("query_slots", params()));
        check("A19 箱子 9x1：playerRange 9..44（同类菜单按行数推容器格数）",
                intAt(mapAt(q1, "playerRange"), "from") == 9 && intAt(mapAt(q1, "playerRange"), "to") == 44);

        GuiBridge gcr = new GuiBridge();
        gcr.slots = mkSlots("CrafterScreen", "minecraft:crafter_3x3", 0, 46, 0, "x", 1);
        Map<String, Object> qCr = data(new PlaytestCore(gcr, evDir("a6"), "tok").dispatch("query_slots", params()));
        List<?> sCr = (List<?>) qCr.get("slots");
        check("A20 合成器：0..8 craft_input、9..44 玩家、45 craft_result（版式已核实）",
                "craft_input".equals(roleAt(sCr, 8)) && "player_main".equals(roleAt(sCr, 9))
                        && "player_hotbar".equals(roleAt(sCr, 44)) && "craft_result".equals(roleAt(sCr, 45)));

        // 没开界面 ⇒ **fail-loud**（明确错误码，绝不假装空列表）
        GuiBridge gns = new GuiBridge();
        gns.slots = null;
        Map<String, Object> qNs = new PlaytestCore(gns, evDir("a7"), "tok").dispatch("query_slots", params());
        check("A21 没开界面 ⇒ query_slots 回 NO_SCREEN_OPEN（**不假装空列表**，也不给 data）",
                "NO_SCREEN_OPEN".equals(qNs.get("code")) && qNs.get("data") == null
                        && String.valueOf(qNs.get("message")).contains("容器"));
        // 界面开着但**容器是空的** ⇒ 成功 + 一格一格的 empty:true（与「没界面」是两件事）
        GuiBridge gEmpty = new GuiBridge();
        gEmpty.slots = mkSlots("GenericContainerScreen", "minecraft:generic_9x3", 1, 63, 0, "x", 1);
        Map<String, Object> qEmpty = data(new PlaytestCore(gEmpty, evDir("a8"), "tok")
                .dispatch("query_slots", params()));
        check("A22 箱子空 ⇒ 成功（slotCount=63、全格 empty:true）—— 空 ≠ 没界面",
                intAt(qEmpty, "slotCount") == 63
                        && Boolean.TRUE.equals(asMap(((List<?>) qEmpty.get("slots")).get(0)).get("empty")));

        // ================= B. 表外菜单：兜底 + 如实标注 =================
        GuiBridge gu = new GuiBridge();
        gu.slots = mkSlots("WeirdScreen", "minecraft:nope_menu", 0, 45, 0, "x", 1);
        Map<String, Object> qU = data(new PlaytestCore(gu, evDir("b"), "tok").dispatch("query_slots", params()));
        check("B1 表外 menuType：roleKnown=false + roleNote 写明走兜底（不假装认得版式）",
                Boolean.FALSE.equals(qU.get("roleKnown"))
                        && String.valueOf(qU.get("roleNote")).contains("兜底"));
        List<?> sU = (List<?>) qU.get("slots");
        check("B2 兜底：末 36 格当玩家（0..8 container、playerRange 9..44）",
                "container".equals(roleAt(sU, 0)) && "player_main".equals(roleAt(sU, 9))
                        && "player_hotbar".equals(roleAt(sU, 44))
                        && intAt(mapAt(qU, "playerRange"), "from") == 9);
        check("B3 SlotRoles.knownMenu 对已知/未知菜单如实",
                SlotRoles.knownMenu("minecraft:crafting") && !SlotRoles.knownMenu("minecraft:nope_menu")
                        && !SlotRoles.knownMenu(null));
        GuiBridge gn = new GuiBridge();
        gn.slots = "{\"screen\":\"S\",\"containerId\":0,\"slots\":[{\"index\":0,\"x\":1,\"y\":2,\"empty\":true}]}";
        Map<String, Object> qN = data(new PlaytestCore(gn, evDir("b2"), "tok").dispatch("query_slots", params()));
        check("B4 menuType 缺字段也不炸：roleKnown=false + 如实留 null（不编）",
                qN.get("menuType") == null && Boolean.FALSE.equals(qN.get("roleKnown")));

        // ================= C. click_slot =================
        GuiBridge c1 = new GuiBridge();
        c1.slots = mkSlots("CraftingScreen", "minecraft:crafting", 5, 46, 0, "x", 1);
        PlaytestCore cc1 = new PlaytestCore(c1, evDir("c"), "tok");
        Map<String, Object> r1 = cc1.dispatch("click_slot", params("slot", Integer.valueOf(1)));
        Map<String, Object> d1 = data(r1);
        check("C1 click_slot 成功（status=ok）", "ok".equals(r1.get("status")));
        check("C2 回执回显 slot/button/shift/actionType=PICKUP/slotCount",
                intAt(d1, "slot") == 1 && intAt(d1, "button") == 0 && Boolean.FALSE.equals(d1.get("shift"))
                        && "PICKUP".equals(d1.get("actionType")) && intAt(d1, "slotCount") == 46);
        check("C3 真实调用落到适配层（slot=1 / button=0 / shift=false）",
                c1.lastSlot == 1 && c1.lastButton == 0 && !c1.lastShift);
        Map<String, Object> r2 = cc1.dispatch("click_slot", params("slot", Integer.valueOf(2), "shift", Boolean.TRUE));
        check("C4 shift=true ⇒ 原版 QUICK_MOVE（回执逐字写清映射）",
                "QUICK_MOVE".equals(data(r2).get("actionType")) && c1.lastShift);
        Map<String, Object> r3 = cc1.dispatch("click_slot", params("slot", Integer.valueOf(3), "button", Integer.valueOf(1)));
        Map<String, Object> d3 = data(r3);
        check("C5 button=1 ⇒ 仍是 PICKUP（原版右键语义）且说明提到右键",
                "PICKUP".equals(d3.get("actionType")) && String.valueOf(d3.get("actionTypeNote")).contains("右键"));

        int callsBefore = c1.guiCalls.size();
        Map<String, Object> r99 = cc1.dispatch("click_slot", params("slot", Integer.valueOf(99)));
        check("C6 slot=99（>= slotCount）⇒ SLOT_OUT_OF_RANGE（**负控①**的判据）",
                "SLOT_OUT_OF_RANGE".equals(r99.get("code")) && intAt(r99, "slotCount") == 46);
        check("C7 slot=-1 ⇒ SLOT_OUT_OF_RANGE", "SLOT_OUT_OF_RANGE".equals(
                cc1.dispatch("click_slot", params("slot", Integer.valueOf(-1))).get("code")));
        check("C8 slot=46（正好等于 slotCount 也是越界）⇒ SLOT_OUT_OF_RANGE", "SLOT_OUT_OF_RANGE".equals(
                cc1.dispatch("click_slot", params("slot", Integer.valueOf(46))).get("code")));
        check("C9 缺 slot ⇒ MISSING_REQUIRED_PARAM", "MISSING_REQUIRED_PARAM".equals(
                cc1.dispatch("click_slot", params()).get("code")));
        check("C10 slot=8.7 ⇒ BAD_REQUEST（不静默 floor）", "BAD_REQUEST".equals(
                cc1.dispatch("click_slot", params("slot", Double.valueOf(8.7))).get("code")));
        check("C11 button=2 ⇒ BAD_REQUEST（只支持原版左/右键）", "BAD_REQUEST".equals(
                cc1.dispatch("click_slot", params("slot", Integer.valueOf(1), "button", Integer.valueOf(2))).get("code")));
        check("C12 越界/非法参数的调用**一次都没落到适配层**（不空转、不静默点 0 号格）",
                c1.guiCalls.size() == callsBefore);

        GuiBridge c2 = new GuiBridge();
        c2.slots = null;                       // 没开界面
        PlaytestCore cc2 = new PlaytestCore(c2, evDir("c2"), "tok");
        Map<String, Object> rNs = cc2.dispatch("click_slot", params("slot", Integer.valueOf(0)));
        check("C13 没开界面 ⇒ NO_SCREEN_OPEN（**负控②**的判据，绝不点）",
                "NO_SCREEN_OPEN".equals(rNs.get("code")) && c2.guiCalls.isEmpty());

        GuiBridge c3 = new GuiBridge();
        c3.slots = mkSlots("CraftingScreen", "minecraft:crafting", 0, 46, 0, "x", 1);
        c3.slotResult = GuiResult.fail(GuiResult.NO_SCREEN_OPEN, "适配层说没界面");
        Map<String, Object> rPt = new PlaytestCore(c3, evDir("c3"), "tok")
                .dispatch("click_slot", params("slot", Integer.valueOf(1)));
        check("C14 适配层失败码**原样透传**（core 不把它改成 ok）",
                "NO_SCREEN_OPEN".equals(rPt.get("code")) && intAt(rPt, "slot") == 1);
        check("C15 click_slot 支持 \"8\" 这种**字符串整值**（与 query_column 同口径）",
                "ok".equals(new PlaytestCore(c1, evDir("c4"), "tok")
                        .dispatch("click_slot", params("slot", "2")).get("status")));

        // ================= D. click_widget =================
        GuiBridge w = new GuiBridge();
        w.screen = "PauseScreen";
        w.widgets = "[{\"type\":\"ButtonWidget\",\"x\":0,\"y\":0},{\"type\":\"ButtonWidget\",\"x\":10,\"y\":10}]";
        PlaytestCore cw = new PlaytestCore(w, evDir("d"), "tok");
        Map<String, Object> wr = cw.dispatch("click_widget", params("index", Integer.valueOf(1)));
        Map<String, Object> wd = data(wr);
        check("D1 click_widget 成功且回显 index/screen/widgetCount",
                "ok".equals(wr.get("status")) && intAt(wd, "index") == 1
                        && "PauseScreen".equals(wd.get("screen")) && intAt(wd, "widgetCount") == 2);
        check("D2 真实调用落到适配层（index=1）", w.lastIndex == 1);
        check("D3 回执写明走的是界面鼠标点击入口（不是 OS 注入）",
                String.valueOf(wd.get("clickPath")).contains("mouseClicked")
                        && String.valueOf(wd.get("clickPath")).contains("不是"));
        check("D4 index=9 越界 ⇒ WIDGET_OUT_OF_RANGE（含 widgetCount）",
                "WIDGET_OUT_OF_RANGE".equals(cw.dispatch("click_widget", params("index", Integer.valueOf(9))).get("code"))
                        && intAt(cw.dispatch("click_widget", params("index", Integer.valueOf(9))), "widgetCount") == 2);
        check("D5 缺 index ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(cw.dispatch("click_widget", params()).get("code")));
        check("D6 index=1.5 ⇒ BAD_REQUEST",
                "BAD_REQUEST".equals(cw.dispatch("click_widget", params("index", Double.valueOf(1.5))).get("code")));
        int wBefore = w.guiCalls.size();
        GuiBridge w2 = new GuiBridge();
        w2.screen = null;
        Map<String, Object> wns = new PlaytestCore(w2, evDir("d2"), "tok")
                .dispatch("click_widget", params("index", Integer.valueOf(0)));
        check("D7 没界面 ⇒ NO_SCREEN_OPEN（不假装点了）", "NO_SCREEN_OPEN".equals(wns.get("code")));
        GuiBridge w3 = new GuiBridge();
        w3.screen = "S";
        w3.widgets = "[{\"type\":\"X\"}]";
        w3.widgetResult = GuiResult.fail(GuiResult.WIDGET_NOT_CLICKABLE, "不是可点控件");
        Map<String, Object> wr2 = new PlaytestCore(w3, evDir("d3"), "tok")
                .dispatch("click_widget", params("index", Integer.valueOf(0)));
        check("D8 适配层 WIDGET_NOT_CLICKABLE 透传 + 诊断读数合并（index/screen）",
                "WIDGET_NOT_CLICKABLE".equals(wr2.get("code")) && intAt(wr2, "index") == 0
                        && "S".equals(wr2.get("screen")));
        check("D9 越界的调用不落到适配层", w.guiCalls.size() == wBefore);

        // ================= E. use_on / place_block =================
        GuiBridge u = new GuiBridge();
        PlaytestCore cu = new PlaytestCore(u, evDir("e"), "tok");
        Map<String, Object> ur = cu.dispatch("use_on", params("x", Integer.valueOf(1), "y", Integer.valueOf(64), "z", Integer.valueOf(2)));
        Map<String, Object> ud = data(ur);
        check("E1 use_on 成功且回显整型坐标 x/y/z",
                "ok".equals(ur.get("status")) && intAt(ud, "x") == 1 && intAt(ud, "y") == 64 && intAt(ud, "z") == 2);
        check("E2 真实调用落到适配层（1.0/64.0/2.0）",
                u.lastX == 1.0 && u.lastY == 64.0 && u.lastZ == 2.0);
        check("E3 use_on 缺 z ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(cu.dispatch("use_on", params("x", 1, "y", 2)).get("code")));
        check("E4 use_on x=1.5 ⇒ BAD_REQUEST（不静默 floor）",
                "BAD_REQUEST".equals(cu.dispatch("use_on", params("x", Double.valueOf(1.5), "y", 2, "z", 3)).get("code")));
        u.useResult = GuiResult.fail(GuiResult.TARGET_TOO_FAR, "够不着");
        check("E5 use_on 的 TARGET_TOO_FAR 透传", "TARGET_TOO_FAR".equals(
                cu.dispatch("use_on", params("x", 1, "y", 2, "z", 3)).get("code")));

        GuiBridge p = new GuiBridge();
        p.placeResult = GuiResult.ok(mapOf("placed", "1,64,2", "support", "1,63,2", "held", "minecraft:stone"));
        PlaytestCore cp = new PlaytestCore(p, evDir("e2"), "tok");
        Map<String, Object> prr = cp.dispatch("place_block", params("x", 1, "y", 64, "z", 2));
        Map<String, Object> pd = data(prr);
        check("E6 place_block 成功：回执带 placed/support/held + 坐标",
                "ok".equals(prr.get("status")) && "1,64,2".equals(pd.get("placed"))
                        && "1,63,2".equals(pd.get("support")) && intAt(pd, "y") == 64);
        check("E7 place_block 落到适配层（1.0/64.0/2.0）",
                p.lastX == 1.0 && p.lastY == 64.0 && p.lastZ == 2.0);
        p.placeResult = GuiResult.fail(GuiResult.NO_ITEM_IN_HAND, "手上没东西");
        check("E8 手上没东西 ⇒ NO_ITEM_IN_HAND 透传（明确错误码）", "NO_ITEM_IN_HAND".equals(
                cp.dispatch("place_block", params("x", 1, "y", 2, "z", 3)).get("code")));
        p.placeResult = GuiResult.fail(GuiResult.TARGET_NOT_PLACEABLE, "占住了");
        check("E9 目标不可放置 ⇒ TARGET_NOT_PLACEABLE 透传", "TARGET_NOT_PLACEABLE".equals(
                cp.dispatch("place_block", params("x", 1, "y", 2, "z", 3)).get("code")));
        check("E10 place_block 缺 x ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(cp.dispatch("place_block", params("y", 2, "z", 3)).get("code")));
        int pBefore = p.guiCalls.size();
        cp.dispatch("place_block", params());
        check("E11 参数不全时**不落到适配层**（不空转）", p.guiCalls.size() == pBefore);

        // ================= F. 能力自报 / /status 如实过滤 =================
        FakeBridge plain = new FakeBridge();
        PlaytestCore cp2 = new PlaytestCore(plain, evDir("f"), "tok");
        boolean allUnsupported = true;
        for (String a : new String[] {"query_slots", "click_slot", "click_widget", "use_on", "place_block"}) {
            Map<String, Object> rr = cp2.dispatch(a, params("slot", 0, "index", 0, "x", 0, "y", 0, "z", 0));
            if (!GuiResult.UNSUPPORTED.equals(rr.get("code"))) allUnsupported = false;
        }
        check("F1 未实现的档：五条**全部**回 GUI_ACTIONS_UNSUPPORTED（不假装会点）", allUnsupported);
        List<String> unPlain = strList(cp2.status().get("actionsUnavailable"));
        boolean fiveThere = true;
        for (String a : Capabilities.GUI_ACTIONS) if (!unPlain.contains(a)) fiveThere = false;
        check("F2 未实现的档：/status 把五条如实列进 actionsUnavailable（**负控②**的判据之一）", fiveThere);
        List<String> unGui = strList(core.status().get("actionsUnavailable"));
        boolean fiveAbsent = true;
        for (String a : Capabilities.GUI_ACTIONS) if (unGui.contains(a)) fiveAbsent = false;
        check("F3 实现的档：/status 里五条**不**在 actionsUnavailable（也不在 actions 之外）", fiveAbsent);
        List<String> actsGui = strList(core.status().get("actions"));
        boolean fiveInActions = true;
        for (String a : Capabilities.GUI_ACTIONS) if (!actsGui.contains(a)) fiveInActions = false;
        check("F4 实现的档：五条出现在 actions 里", fiveInActions);
        check("F5 GUI_ACTIONS 是 DRIVER 的子集（不是第 3 张表）",
                Capabilities.DRIVER.containsAll(Capabilities.GUI_ACTIONS));
        check("F6 all() 仍是 BRIDGE ∪ DRIVER 两表并集",
                Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());
        check("F7 capabilities.guiActions 单列一份且与 GUI_ACTIONS 逐字相同",
                new ArrayList<Object>(Capabilities.GUI_ACTIONS)
                        .equals(listAt(mapAt(core.status(), "capabilities"), "guiActions")));
        Map<String, Object> capsGui = mapAt(core.status(), "capabilities");
        Map<String, Object> capsPlain = mapAt(cp2.status(), "capabilities");
        check("F8 driverAvailable 语义：有界面能力的档=true、没有的档=false",
                Boolean.TRUE.equals(capsGui.get("driverAvailable"))
                        && Boolean.FALSE.equals(capsPlain.get("driverAvailable")));

        // ================= G. SlotRoles 直接单测 =================
        check("G1 ALL_ROLES 覆盖需求点名的七种角色",
                SlotRoles.ALL_ROLES.containsAll(java.util.Arrays.asList("craft_input", "craft_result",
                        "fuel", "input", "output", "player_main", "player_hotbar")));
        check("G2 roleOf 逐条：熔炉 1 = fuel、工作台 0 = craft_result、合成器 45 = craft_result",
                "fuel".equals(SlotRoles.roleOf("minecraft:furnace", 1, 39))
                        && "craft_result".equals(SlotRoles.roleOf("minecraft:crafting", 0, 46))
                        && "craft_result".equals(SlotRoles.roleOf("minecraft:crafter_3x3", 45, 46)));
        check("G3 roleOf 越界 / 负下标 ⇒ unknown（不抛、不编）",
                "unknown".equals(SlotRoles.roleOf("minecraft:crafting", 99, 46))
                        && "unknown".equals(SlotRoles.roleOf("minecraft:crafting", -1, 46)));
        check("G4 空桥/空 JSON 也不炸（decorate 回空表）",
                intAt(SlotRoles.decorate(new LinkedHashMap<String, Object>()), "slotCount") == 0);

        // ================= H. [QA] 审计行 =================
        String qa = new String(Files.readAllBytes(evDir("a").resolve("qa.log")), StandardCharsets.UTF_8);
        boolean audit = qa.contains("[QA] query_slots") && qa.contains("slotCount=46");
        String qaC = new String(Files.readAllBytes(evDir("c").resolve("qa.log")), StandardCharsets.UTF_8);
        boolean auditC = qaC.contains("[QA] click_slot") && qaC.contains("SLOT_OUT_OF_RANGE");
        String qaD = new String(Files.readAllBytes(evDir("d").resolve("qa.log")), StandardCharsets.UTF_8);
        String qaE = new String(Files.readAllBytes(evDir("e2").resolve("qa.log")), StandardCharsets.UTF_8);
        check("H1 每发一条动作都写 [QA] 审计行（query_slots/click_slot/click_widget/place_block 都在 qa.log 里）",
                audit && auditC && qaD.contains("[QA] click_widget") && qaE.contains("[QA] place_block"));
        check("H2 失败也写 [QA] 行（越界那次留痕）", auditC);

        System.out.println();
        System.out.println("=== gui-actions tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- helpers ----------------

    private static Path evDir(String tag) {
        return base.resolve("ev-" + tag);
    }

    private static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        for (int i = 0; i < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }

    private static Map<String, Object> mapOf(Object... kv) {
        return params(kv);
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> data(Map<String, Object> res) {
        Object d = res == null ? null : res.get("data");
        return (d instanceof Map) ? (Map<String, Object>) d : new LinkedHashMap<String, Object>();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> mapAt(Map<String, Object> m, String k) {
        Object v = (m == null) ? null : m.get(k);
        return (v instanceof Map) ? (Map<String, Object>) v : new LinkedHashMap<String, Object>();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object o) {
        return (o instanceof Map) ? (Map<String, Object>) o : new LinkedHashMap<String, Object>();
    }

    private static int intAt(Map<String, Object> m, String k) {
        Object v = (m == null) ? null : m.get(k);
        return (v instanceof Number) ? ((Number) v).intValue() : Integer.MIN_VALUE;
    }

    private static String roleAt(List<?> slots, int i) {
        if (slots == null || i < 0 || i >= slots.size()) return null;
        Object r = asMap(slots.get(i)).get("role");
        return r == null ? null : String.valueOf(r);
    }

    @SuppressWarnings("unchecked")
    private static List<Object> listAt(Map<String, Object> m, String k) {
        Object v = (m == null) ? null : m.get(k);
        return (v instanceof List) ? new ArrayList<Object>((List<Object>) v) : new ArrayList<Object>();
    }

    @SuppressWarnings("unchecked")
    private static List<String> strList(Object o) {
        List<String> out = new ArrayList<String>();
        if (o instanceof List) for (Object x : (List<Object>) o) out.add(String.valueOf(x));
        return out;
    }

    /** 造「count 个槽位」的槽位 JSON（前 nonEmpty 个非空）；坐标按 i 造（x=8+col*18, y=18+row*18）。 */
    private static String mkSlots(String screen, String menuType, int containerId, int count,
                                  int nonEmpty, String item, int itemCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"screen\":\"").append(screen).append("\",\"menuType\":\"").append(menuType)
                .append("\",\"containerId\":").append(containerId).append(",\"slots\":[");
        for (int i = 0; i < count; i++) {
            if (i > 0) sb.append(',');
            sb.append("{\"index\":").append(i)
                    .append(",\"x\":").append(8 + (i % 9) * 18)
                    .append(",\"y\":").append(18 + (i / 9) * 18);
            if (i < nonEmpty) {
                sb.append(",\"empty\":false,\"itemId\":\"").append(item).append("\",\"count\":").append(itemCount);
            } else {
                sb.append(",\"empty\":true");
            }
            sb.append('}');
        }
        sb.append("]}");
        return sb.toString();
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

    // ---------------- 合成桥：带界面能力的档 ----------------

    /** GUI 能力可配置的假桥；默认「会」+ 空界面。 */
    static class GuiBridge extends FakeBridge {
        String slots = null;
        String widgets = "[]";
        GuiResult slotResult = GuiResult.ok();
        GuiResult widgetResult = GuiResult.ok();
        GuiResult useResult = GuiResult.ok();
        GuiResult placeResult = GuiResult.ok();
        final List<String> guiCalls = new ArrayList<String>();
        int lastSlot = -999, lastButton = -999, lastIndex = -999;
        boolean lastShift = false;
        double lastX = Double.NaN, lastY = Double.NaN, lastZ = Double.NaN;

        @Override public boolean guiActionCapable() { return true; }
        @Override public boolean configGuiAvailable() { return true; }
        @Override public String slotsJson() { return slots; }
        @Override public String widgetsJson() { return widgets; }

        @Override public GuiResult clickSlot(int slot, int button, boolean shift) {
            guiCalls.add("clickSlot:" + slot + "/" + button + "/" + shift);
            lastSlot = slot; lastButton = button; lastShift = shift;
            Map<String, Object> d = new LinkedHashMap<String, Object>(slotResult.data);
            d.put("screen", "CraftingScreen");
            d.put("containerId", Integer.valueOf(5));
            return slotResult.ok ? GuiResult.ok(d) : slotResult;
        }

        @Override public GuiResult clickWidget(int index) {
            guiCalls.add("clickWidget:" + index);
            lastIndex = index;
            Map<String, Object> d = new LinkedHashMap<String, Object>(widgetResult.data);
            d.put("accepted", Boolean.TRUE);
            d.put("type", "ButtonWidget");
            d.put("x", Integer.valueOf(0));
            d.put("y", Integer.valueOf(0));
            return widgetResult.ok ? GuiResult.ok(d) : widgetResult;
        }

        @Override public GuiResult useOn(double x, double y, double z) {
            guiCalls.add("useOn:" + x + "/" + y + "/" + z);
            lastX = x; lastY = y; lastZ = z;
            Map<String, Object> d = new LinkedHashMap<String, Object>(useResult.data);
            d.put("result", "SUCCESS");
            d.put("screen", "CraftingScreen");
            return useResult.ok ? GuiResult.ok(d) : useResult;
        }

        @Override public GuiResult placeBlock(double x, double y, double z) {
            guiCalls.add("placeBlock:" + x + "/" + y + "/" + z);
            lastX = x; lastY = y; lastZ = z;
            Map<String, Object> d = new LinkedHashMap<String, Object>(placeResult.data);
            return placeResult.ok ? GuiResult.ok(d) : placeResult;
        }
    }
}
