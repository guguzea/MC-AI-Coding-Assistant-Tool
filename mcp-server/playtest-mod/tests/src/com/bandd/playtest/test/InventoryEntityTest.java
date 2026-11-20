package com.bandd.playtest.test;

import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * **本轮新增**两件玩家级信息能力的真测试（与既有四套**分开报数**，既有断言一条不改）：
 * <ol>
 *   <li><b>实体扫描叠加层</b>（{@code query_map}/{@code query_state} 的 {@code entities=true}）——
 *       平行网格 {@code entityGrid} + 独立 {@code entityLegend} + {@code entities[]} 明细；</li>
 *   <li><b>读背包内容</b>（{@code query_inventory} / {@code query_inventory_slot}）—— 形状与桥路线对齐。</li>
 * </ol>
 *
 * <p>跑法（工作目录任意；**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/t12/testwork -cp out com.bandd.playtest.test.InventoryEntityTest
 * </pre>
 *
 * <p>两个**负控**（必须在别处手工做过、且真红）：
 * <ul>
 *   <li>把实体层写成**覆盖方块层**（{@code putEntityLayer} 里往 {@code grid} 写实体文本）⇒
 *       B1/B2（grid 逐字不变）必红；</li>
 *   <li>去掉 {@code entityLegend} 的写入 ⇒ A7/B3（独立图例存在且只列真用到的标记）必红。</li>
 * </ul>
 */
public final class InventoryEntityTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t12/testwork");
        base = Paths.get(dir, "run-" + System.nanoTime());
        Files.createDirectories(base);

        // ================= A. 实体叠加层：几何 / 标记 / 独立图例 / 明细 =================
        EntityWorldBridge eb = new EntityWorldBridge();
        // 正好落在**玩家那一格**（x∈[8,9)、z∈[-8,-7) ⇒ cell(24,24)）⇒ 验「实体标记优先于 playerMark」
        eb.entities.add(new Ent("minecraft:zombie", "ZombieEntity", 8.5, 65.0, -7.5));
        eb.entities.add(new Ent("minecraft:item", "ItemEntity", 10.5, 65.0, -7.5));      // cell(26,24)
        eb.entities.add(new Ent("minecraft:experience_orb", "ExperienceOrbEntity", 11.5, 65.0, -7.5)); // (27,24)
        eb.entities.add(new Ent("minecraft:oak_boat", "BoatEntity", 12.5, 65.0, -7.5));  // (28,24)
        eb.entities.add(new Ent("minecraft:arrow", "Arrow", 13.5, 65.0, -7.5));          // (29,24)
        eb.entities.add(new Ent("minecraft:cow", "CowEntity", 14.5, 65.0, -7.5));        // (30,24)
        eb.entities.add(new Ent("minecraft:armor_stand", "ArmorStandEntity", 16.5, 65.0, -7.5)); // (32,24)
        PlaytestCore coreE = new PlaytestCore(eb, evDir("a"), "tok");
        data(coreE.dispatch("query_state", params()));
        runTicks(coreE, 18);

        Map<String, Object> dE = data(coreE.dispatch("query_map", params("entities", Boolean.TRUE)));
        Map<String, Object> mE = mapAt(dE, "map");
        check("A1 entities=true ⇒ 地图头自证 entitiesIncluded=true + entityScanSupported=true",
                Boolean.TRUE.equals(mE.get("entitiesIncluded")) && Boolean.TRUE.equals(mE.get("entityScanSupported")));
        check("A2 entityCount = 7（半径内 7 个；玩家自己不算）", intAt(mE, "entityCount") == 7);
        check("A3 entityRadiusBlocks 如实 = ceil(48*0.7072)+1 = 35",
                intAt(mE, "entityRadiusBlocks") == 35);
        check("A4 实体扫描半径真的传下去了（适配层收到的 radius = 35）",
                Math.abs(eb.lastRadius - 35.0) < 1e-9 && eb.entityCalls >= 18);

        // ---- 几何：与 grid 同 cols/rows/step/origin/cellWidth ----
        check("A5 entityGrid 与 grid 同几何（cols/rows/cellWidth/step 逐项相同）",
                intAt(mE, "entityGridCols") == intAt(mE, "cols")
                        && intAt(mE, "entityGridRows") == intAt(mE, "rows")
                        && intAt(mE, "entityGridCellWidth") == intAt(mE, "cellWidth")
                        && intAt(mE, "entityGridRows") == intAt(mE, "rows"));
        int cwE = intAt(mE, "cellWidth");
        int colsE = intAt(mE, "cols");
        String[] egrid = String.valueOf(mE.get("entityGrid")).split("\n", -1);
        check("A6 entityGrid 行数 == entityGridRows", egrid.length == intAt(mE, "entityGridRows"));
        int badRowE = 0;
        for (String L : egrid) if (L.length() != colsE * cwE) badRowE++;
        check("A7 entityGrid 每行定宽 == cols*cellWidth（" + (colsE * cwE) + "）",
                badRowE == 0 && cwE == intAt(mE, "entityGridCellWidth"));

        // ---- 独立图例：7 个类别标记，且只列本图真用到的 ----
        Map<String, Object> elegend = mapAt(mE, "entityLegend");
        Set<String> want = new TreeSet<String>(Arrays.asList("a", "e", "i", "m", "r", "v", "x"));
        check("A8 entityLegend 独立且只列本图真用到的 7 个类别标记（a/e/i/m/r/v/x）",
                new TreeSet<String>(elegend.keySet()).equals(want));
        check("A9 entityLegendNote 写明与方块 legend 不是同一命名空间", mE.get("entityLegendNote") != null
                && String.valueOf(mE.get("entityLegendNote")).contains("独立"));
        Map<String, Object> blegendE = mapAt(mE, "legend");
        boolean disjoint = true;
        for (Object k : elegend.keySet()) if (blegendE.containsKey(String.valueOf(k))) disjoint = false;
        check("A10 实体标记与方块码**不相交**（实体层绝不进 legend）", disjoint);
        check("A11 entityGridFill 写进头且 = \".\"", ".".equals(mE.get("entityGridFill")));

        // ---- 标记位置：逐条对 cells 验字符 ----
        check("A12 敌对僵尸那格画 'm'（cell(24,24) —— 玩家格被实体标记**优先**覆盖）",
                egrid[24].charAt(24 * cwE) == 'm');
        check("A13 玩家格 '+' 在本层被实体标记顶掉 ⇒ entityGrid 里一个 '+' 都没有",
                countChar(String.valueOf(mE.get("entityGrid")), '+') == 0);
        check("A14 掉落物 cell(26,24)='i'", egrid[24].charAt(26 * cwE) == 'i');
        check("A15 经验球 cell(27,24)='x'", egrid[24].charAt(27 * cwE) == 'x');
        check("A16 船 cell(28,24)='v'", egrid[24].charAt(28 * cwE) == 'v');
        check("A17 箭 cell(29,24)='r'", egrid[24].charAt(29 * cwE) == 'r');
        check("A18 牛 cell(30,24)='a'", egrid[24].charAt(30 * cwE) == 'a');
        check("A19 盔甲架 cell(32,24)='e'（未归类）", egrid[24].charAt(32 * cwE) == 'e');

        // ---- entities[] 明细：按距离升序 + 字段齐全 + cell ----
        List<?> det = (List<?>) mE.get("entities");
        check("A20 entities[] 7 条", det != null && det.size() == 7);
        Map<String, Object> first = asMap(det.get(0));
        check("A21 entities[] 按与玩家距离**由近到远**排序（第一条 = 距离 0.707 的僵尸）",
                "minecraft:zombie".equals(first.get("type"))
                        && Math.abs((((Number) first.get("dist")).doubleValue()) - 0.707) < 0.01);
        double prev = -1;
        boolean sorted = true;
        for (Object o : det) {
            double dd = ((Number) asMap(o).get("dist")).doubleValue();
            if (dd < prev) sorted = false;
            prev = dd;
        }
        check("A22 距离单调不减（真排序，不是原顺序）", sorted);
        check("A23 明细字段齐全（type/cls/category/mark/x/y/z/dist/inGrid/cell）",
                first.containsKey("type") && first.containsKey("cls") && first.containsKey("category")
                        && first.containsKey("mark") && first.containsKey("x") && first.containsKey("y")
                        && first.containsKey("z") && first.containsKey("dist") && first.containsKey("inGrid")
                        && first.containsKey("cell"));
        Map<String, Object> fcell = mapAt(first, "cell");
        check("A24 僵尸的 cell = (24,24) 且 inGrid=true",
                Boolean.TRUE.equals(first.get("inGrid")) && intAt(fcell, "col") == 24 && intAt(fcell, "row") == 24);
        check("A25 entitiesOnGridCount = 7（全在图内）", intAt(mE, "entitiesOnGridCount") == 7);

        // ================= B. 关键不变量：实体层**绝不覆盖**方块层 =================
        Map<String, Object> mOff = mapAt(data(coreE.dispatch("query_map", params("entities", Boolean.FALSE))), "map");
        check("B1 entities=false ⇒ 同样的方块 grid 逐字不变（叠加层不动方块层）",
                String.valueOf(mOff.get("grid")).equals(String.valueOf(mE.get("grid"))));
        check("B2 entities=false ⇒ legend / legendUnused 逐字不变",
                Json.of(mapAt(mOff, "legend")).equals(Json.of(blegendE))
                        && Json.of(mOff.get("legendUnused")).equals(Json.of(mE.get("legendUnused"))));
        check("B3 entities=false ⇒ 头里没有 entityGrid/entityLegend/entities（如实不含）",
                !mOff.containsKey("entityGrid") && !mOff.containsKey("entityLegend") && !mOff.containsKey("entities"));
        check("B4 entities=false 时 entitiesNote 如实说明「本次未请求」",
                Boolean.FALSE.equals(mOff.get("entitiesIncluded")) && mOff.get("entitiesNote") != null);
        check("B5 方块层里根本没有实体标记（grid 里不出现 'm'/'i' 这些**本图方块码之外**的码）",
                !blegendE.containsKey("m") && !blegendE.containsKey("i") && !blegendE.containsKey("e"));

        // ================= C. 半径内没实体 ⇒ 如实给**空层** =================
        EntityWorldBridge emptyB = new EntityWorldBridge();
        PlaytestCore coreC = new PlaytestCore(emptyB, evDir("c"), "tok");
        data(coreC.dispatch("query_state", params()));
        runTicks(coreC, 18);
        Map<String, Object> mC = mapAt(data(coreC.dispatch("query_map", params("entities", Boolean.TRUE))), "map");
        check("C1 没实体时 entitiesIncluded=true（能力在）+ entityCount=0 + entities=[]（如实空层）",
                Boolean.TRUE.equals(mC.get("entitiesIncluded")) && intAt(mC, "entityCount") == 0
                        && ((List<?>) mC.get("entities")).isEmpty() && mapAt(mC, "entityLegend").isEmpty());
        String egC = String.valueOf(mC.get("entityGrid"));
        check("C2 空层：只有填充符 '.' + 唯一的玩家标记 '+'（不是错误、也没编实体）",
                countChar(egC, '+') == 1
                        && countChar(egC, '.') == intAt(mC, "entityGridRows") * intAt(mC, "entityGridCols")
                                * intAt(mC, "entityGridCellWidth") - 1
                        && egC.replace(".", "").replace("+", "").replace("\n", "").isEmpty());
        check("C3 空层如实写 entityNote（不静默、更不编一个实体）", mC.get("entityNote") != null
                && String.valueOf(mC.get("entityNote")).contains("没有"));

        // ================= D. 本档不支持 ⇒ 如实说明，不许假装有 =================
        // 会画地图（stateMapCapable=true）但**不实现**实体扫描面 / 背包面 ⇒ 走 GameBridge 的 default
        // （false / null）⇒ 专门验「如实说明，不假装有」
        SyntheticWorldBridge noEnt = new SyntheticWorldBridge();
        PlaytestCore coreD = new PlaytestCore(noEnt, evDir("d"), "tok");
        runTicks(coreD, 18);
        Map<String, Object> mD = mapAt(data(coreD.dispatch("query_map", params("entities", Boolean.TRUE))), "map");
        check("D1 不支持实体扫描的档：entitiesIncluded=false + entityScanSupported=false",
                Boolean.FALSE.equals(mD.get("entitiesIncluded")) && Boolean.FALSE.equals(mD.get("entityScanSupported")));
        check("D2 不支持时 entitiesNote 写明原因（不假装有实体层）",
                mD.get("entitiesNote") != null && String.valueOf(mD.get("entitiesNote")).contains("不假装"));
        check("D3 不支持时一个实体层字段都不给（没有 entityGrid/entityLegend/entities）",
                !mD.containsKey("entityGrid") && !mD.containsKey("entityLegend") && !mD.containsKey("entities"));

        // ================= E. 配置旋钮 includeEntities（每个调用可覆盖） =================
        EntityWorldBridge cfgB = new EntityWorldBridge();
        cfgB.entities.add(new Ent("minecraft:zombie", "ZombieEntity", 9.5, 65.0, -7.5));
        PlaytestCore coreF = new PlaytestCore(cfgB, evDir("e"), "tok");
        coreF.state().config().includeEntities = true;        // 配置打开
        data(coreF.dispatch("query_state", params()));
        runTicks(coreF, 18);
        Map<String, Object> mF1 = mapAt(data(coreF.dispatch("query_map", params())), "map");
        check("E1 includeEntities=true（配置口径）⇒ 不传参数也有实体层",
                Boolean.TRUE.equals(mF1.get("entitiesIncluded")) && intAt(mF1, "entityCount") == 1);
        Map<String, Object> mF2 = mapAt(data(coreF.dispatch("query_map", params("entities", Boolean.FALSE))), "map");
        check("E2 参数 entities=false **只覆盖本次**（配置仍 true）",
                Boolean.FALSE.equals(mF2.get("entitiesIncluded")) && !mF2.containsKey("entityGrid")
                        && coreF.state().config().includeEntities);
        Map<String, Object> mF3 = mapAt(data(coreF.dispatch("query_map", params("entities", Boolean.TRUE))), "map");
        check("E3 再关掉配置后，参数 entities=true 仍能要到实体层",
                Boolean.TRUE.equals(mF3.get("entitiesIncluded")));
        coreF.state().config().includeEntities = false;
        Map<String, Object> mF4 = mapAt(data(coreF.dispatch("query_map", params())), "map");
        check("E4 配置关掉 ⇒ 默认不带实体层（默认沿用配置）",
                Boolean.FALSE.equals(mF4.get("entitiesIncluded")));

        // ================= F. 图外 / 截断：如实 inGrid=false，不硬塞 =================
        EntityWorldBridge fB = new EntityWorldBridge();
        fB.entities.add(new Ent("minecraft:zombie", "ZombieEntity", 33.5, 65.0, -8.5));   // 半径内(25.5)但 col=49 ≥ 48
        fB.entities.add(new Ent("minecraft:cow", "CowEntity", 8.5, 65.0, 8.5));           // z=8.5 ⇒ row=40（截断掉）
        PlaytestCore coreG = new PlaytestCore(fB, evDir("f"), "tok");
        data(coreG.dispatch("query_state", params()));
        runTicks(coreG, 18);
        Map<String, Object> mG = mapAt(data(coreG.dispatch("query_map", params("step", 4, "maxChars", 300,
                "entities", Boolean.TRUE))), "map");
        check("F1 显式 step=4 + maxChars=300 ⇒ 方块层被整行截断（前提成立）",
                Boolean.TRUE.equals(mG.get("truncated")) && intAt(mG, "shownRows") < intAt(mG, "rows"));
        check("F2 实体层与方块层**同几何一并截断**（entityGridRows == shownRows，且有截断说明）",
                intAt(mG, "entityGridRows") == intAt(mG, "shownRows") && mG.get("entityGridTruncatedNote") != null);
        check("F3 entityGrid 真只有 shownRows 行",
                String.valueOf(mG.get("entityGrid")).split("\n", -1).length == intAt(mG, "shownRows"));
        List<?> detG = (List<?>) mG.get("entities");
        Map<String, Object> outOfMap = detailByType(detG, "minecraft:zombie");   // (33.5,-8.5) ⇒ col=49 ≥ 48
        Map<String, Object> inCutRow = detailByType(detG, "minecraft:cow");     // (8.5,8.5) ⇒ row=10 落在被截断行里
        check("F4 图外实体（col 越界）如实进 entities[] 且 inGrid=false + cell=null（不硬塞进网格）",
                detG.size() == 2 && Boolean.FALSE.equals(outOfMap.get("inGrid")) && outOfMap.get("cell") == null);
        check("F5 被截断行里的实体也如实 inGrid=false（有截断说明，不假装它在图上）",
                Boolean.FALSE.equals(inCutRow.get("inGrid")) && mG.get("entityGridTruncatedNote") != null);

        // ================= G. /status 的实体段自报（HTTP 线程可读，不碰 MC） =================
        Map<String, Object> st = coreE.state().status();
        Map<String, Object> stEnt = mapAt(st, "entityScan");
        check("G1 /status.stateMap.entityScan 段存在且自报 capable/supported/radius/cached",
                Boolean.TRUE.equals(stEnt.get("capable")) && Boolean.TRUE.equals(stEnt.get("supported"))
                        && intAt(stEnt, "radiusBlocks") == 35 && intAt(stEnt, "cached") == 7);
        check("G2 entityScan.fill 与 configIncludeEntities 如实",
                ".".equals(stEnt.get("fill")) && Boolean.FALSE.equals(stEnt.get("configIncludeEntities")));
        Map<String, Object> stD = coreD.state().status();
        check("G3 不支持的档 /status 里 capable=false（不谎报）",
                Boolean.FALSE.equals(mapAt(stD, "entityScan").get("capable")));

        // ================= H. 读背包（query_inventory / query_inventory_slot） =================
        InventoryWorldBridge ib = new InventoryWorldBridge();
        PlaytestCore coreI = new PlaytestCore(ib, evDir("h"), "tok");
        Map<String, Object> inv = data(coreI.dispatch("query_inventory", params()));
        check("H1 query_inventory：size = 41（36 主 + 4 甲 + 1 副手）", intAt(inv, "size") == 41);
        check("H2 query_inventory：**跳过空格子**（只回 2 格）+ slotCount 如实",
                intAt(inv, "slotCount") == 2 && ((List<?>) inv.get("slots")).size() == 2);
        Map<String, Object> s0 = asMap(((List<?>) inv.get("slots")).get(0));
        check("H3 该物品 count **整数 64**（不是 64.0）+ empty:false + itemId/idKind 如实",
                (s0.get("count") instanceof Integer) && intAt(s0, "count") == 64
                        && Boolean.FALSE.equals(s0.get("empty"))
                        && "minecraft:stone".equals(s0.get("itemId"))
                        && "registryName".equals(s0.get("idKind")));
        check("H4 回执 JSON 里 count 逐字是 64 而不是 64.0",
                Json.of(inv).contains("\"count\":64") && !Json.of(inv).contains("\"count\":64.0"));
        check("H5 额外三项：selectedSlot / mainHand / hotbar(9 格) 都在",
                intAt(inv, "selectedSlot") == 0
                        && "minecraft:stone".equals(mapAt(inv, "mainHand").get("itemId"))
                        && intAt(mapAt(inv, "mainHand"), "count") == 64
                        && ((List<?>) inv.get("hotbar")).size() == 9);
        check("H6 hotbar 第 1 格如实 empty:true（空格子也在摘要里，带 empty 标记）",
                Boolean.TRUE.equals(asMap(((List<?>) inv.get("hotbar")).get(1)).get("empty")));
        check("H7 idKindNote 当面说清「本档 registryName vs 桥 unlocalizedName」的口径差异",
                inv.get("idKindNote") != null && String.valueOf(inv.get("idKindNote")).contains("unlocalizedName"));
        check("H8 emptySkipped 如实自报（与桥路线一致）",
                Boolean.TRUE.equals(inv.get("emptySkipped")) && inv.get("emptySkippedNote") != null);

        Map<String, Object> s9 = data(coreI.dispatch("query_inventory_slot", params("slot", 9)));
        check("H9 query_inventory_slot 命中非空格：empty:false + count=3 + isSelectedSlot=false",
                Boolean.FALSE.equals(s9.get("empty")) && intAt(s9, "count") == 3
                        && "minecraft:diamond".equals(s9.get("itemId"))
                        && Boolean.FALSE.equals(s9.get("isSelectedSlot")));
        Map<String, Object> s5 = data(coreI.dispatch("query_inventory_slot", params("slot", 5)));
        check("H10 指一个**空槽** ⇒ 如实 empty:true + count=0（不编物品）",
                Boolean.TRUE.equals(s5.get("empty")) && intAt(s5, "count") == 0 && s5.get("itemId") == null
                        && s5.get("slotNote") != null);
        Map<String, Object> s0s = data(coreI.dispatch("query_inventory_slot", params("slot", 0)));
        check("H11 指选中槽 ⇒ isSelectedSlot=true（与 selectedSlot 对得上）",
                Boolean.TRUE.equals(s0s.get("isSelectedSlot")) && intAt(s0s, "count") == 64);
        Map<String, Object> s99 = data(coreI.dispatch("query_inventory_slot", params("slot", 99)));
        check("H12 越界槽 ⇒ 如实 empty:true + slotNote 说明越界（不假装读到）",
                Boolean.TRUE.equals(s99.get("empty")) && String.valueOf(s99.get("slotNote")).contains("越界"));
        check("H13 缺 slot ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(coreI.dispatch("query_inventory_slot", params()).get("code")));

        // ================= I. 能力自报 / 不支持档如实拒绝 =================
        check("I1 不实现背包面的档：两条都回 INVENTORY_UNSUPPORTED（不假装能读）",
                "INVENTORY_UNSUPPORTED".equals(coreD.dispatch("query_inventory", params()).get("code"))
                        && "INVENTORY_UNSUPPORTED".equals(
                                coreD.dispatch("query_inventory_slot", params("slot", 0)).get("code")));
        @SuppressWarnings("unchecked")
        List<String> unD = (List<String>) coreD.status().get("actionsUnavailable");
        check("I2 /status 把两条列进 actionsUnavailable（不谎报）",
                unD.contains("query_inventory") && unD.contains("query_inventory_slot"));
        @SuppressWarnings("unchecked")
        List<String> unI = (List<String>) coreI.status().get("actionsUnavailable");
        check("I3 实现了背包面的档：两条**不在** actionsUnavailable 里",
                !unI.contains("query_inventory") && !unI.contains("query_inventory_slot"));
        check("I4 INVENTORY 是 BRIDGE 的子集（不是第 3 张表；all() 仍是 BRIDGE ∪ DRIVER）",
                Capabilities.BRIDGE.containsAll(Capabilities.INVENTORY)
                        && Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());
        @SuppressWarnings("unchecked")
        Map<String, Object> capsI = (Map<String, Object>) coreI.status().get("capabilities");
        check("I5 /status.capabilities.inventory 单列一份（便于调用方直接读）",
                capsI.get("inventory") != null
                        && ((List<?>) capsI.get("inventory")).contains("query_inventory_slot"));
        check("I6 适配层没给 hotbar 摘要 ⇒ 如实留 null + hotbarNote（不编 9 格）",
                noHotbarBridge());
        check("I7 老档零开销：不支持实体层的档 tick 不产生实体扫描（probed 一次即止）",
                Boolean.TRUE.equals(mapAt(coreD.state().status(), "entityScan").get("probed")));

        System.out.println();
        System.out.println("=== inventory/entity tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- helpers ----------------

    /** 适配层不给 hotbar 摘要时，core 必须如实留 null + note（这一条要单独一个桥）。 */
    private static boolean noHotbarBridge() {
        InventoryWorldBridge nb = new InventoryWorldBridge();
        nb.inventory = "{\"size\":41,\"slots\":[{\"slot\":0,\"itemId\":\"minecraft:stone\",\"count\":1}],"
                + "\"selectedSlot\":0}";
        PlaytestCore c = new PlaytestCore(nb, evDir("h2"), "tok");
        Map<String, Object> d = data(c.dispatch("query_inventory", params()));
        return d.get("hotbar") == null && d.get("hotbarNote") != null;
    }

    private static Path evDir(String tag) {
        return base.resolve("ev-" + tag);
    }

    private static void runTicks(PlaytestCore core, int n) {
        for (int i = 0; i < n; i++) core.onTick();
    }

    private static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        for (int i = 0; i < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
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

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object o) {
        return (o instanceof Map) ? (Map<String, Object>) o : new LinkedHashMap<String, Object>();
    }

    private static int intAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof Number) ? ((Number) v).intValue() : -1;
    }

    /** 在 entities[] 明细里按 type 找一条（找不到回空 map）。 */
    private static Map<String, Object> detailByType(List<?> det, String type) {
        if (det != null) {
            for (Object o : det) {
                Map<String, Object> e = asMap(o);
                if (type.equals(String.valueOf(e.get("type")))) return e;
            }
        }
        return new LinkedHashMap<String, Object>();
    }

    private static int countChar(String s, char c) {
        int n = 0;
        for (int i = 0; i < s.length(); i++) if (s.charAt(i) == c) n++;
        return n;
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

    // ---------------- 合成桥：带实体的世界 ----------------

    /** 一条合成实体（type/cls + 世界绝对坐标）。 */
    static final class Ent {
        final String type;
        final String cls;
        final double x, y, z;

        Ent(String type, String cls, double x, double y, double z) {
            this.type = type;
            this.cls = cls;
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    /**
     * 合成世界 + **实体扫描面**（形如两参照档：{@code count}+{@code entities[]}，按半径过滤，
     * 坐标取世界绝对值；玩家自己不入列）。地形/方块面沿用 {@link SyntheticWorldBridge}。
     */
    static class EntityWorldBridge extends SyntheticWorldBridge {
        final List<Ent> entities = new ArrayList<Ent>();
        int entityCalls = 0;
        double lastRadius = -1;

        @Override
        public boolean entityScanCapable() { return true; }

        @Override
        public String nearbyEntitiesJson(double radius) {
            entityCalls++;
            lastRadius = radius;
            double r2 = radius * radius;
            List<Object> out = new ArrayList<Object>();
            for (Ent e : entities) {
                double dx = e.x - px, dy = e.y - py, dz = e.z - pz;
                if (dx * dx + dy * dy + dz * dz > r2) continue;
                Map<String, Object> m = new LinkedHashMap<String, Object>();
                m.put("type", e.type);
                m.put("cls", e.cls);
                m.put("x", e.x);
                m.put("y", e.y);
                m.put("z", e.z);
                out.add(m);
            }
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            m.put("count", out.size());
            m.put("entities", out);
            return Json.of(m);
        }
    }

    /** 合成世界 + **背包面**（形状与桥路线对齐；可替换整段 JSON 验缺字段路径）。 */
    static class InventoryWorldBridge extends SyntheticWorldBridge {
        String inventory = "{\"size\":41,\"slots\":["
                + "{\"slot\":0,\"itemId\":\"minecraft:stone\",\"idKind\":\"registryName\",\"count\":64},"
                + "{\"slot\":9,\"itemId\":\"minecraft:diamond\",\"idKind\":\"registryName\",\"count\":3}],"
                + "\"selectedSlot\":0,"
                + "\"mainHand\":{\"slot\":0,\"itemId\":\"minecraft:stone\",\"idKind\":\"registryName\",\"count\":64},"
                + "\"hotbar\":[{\"slot\":0,\"itemId\":\"minecraft:stone\",\"idKind\":\"registryName\",\"count\":64},"
                + "{\"slot\":1,\"empty\":true},{\"slot\":2,\"empty\":true},{\"slot\":3,\"empty\":true},"
                + "{\"slot\":4,\"empty\":true},{\"slot\":5,\"empty\":true},{\"slot\":6,\"empty\":true},"
                + "{\"slot\":7,\"empty\":true},{\"slot\":8,\"empty\":true}]}";

        @Override
        public boolean inventoryCapable() { return true; }

        @Override
        public String inventoryJson() { return inventory; }
    }
}
