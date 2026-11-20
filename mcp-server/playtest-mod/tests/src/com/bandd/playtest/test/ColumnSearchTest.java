package com.bandd.playtest.test;

import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.PlaytestCore;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * [T13] 三个**新增面**的真测试（合成世界 + 假桥，不需要 Minecraft）：
 * <ul>
 *   <li>① {@code query_column} —— 单列纵剖面（高到低逐层 {y,id}；空气如实出现）</li>
 *   <li>② {@code query_blocks} —— 按条件搜方块（只回命中坐标；分帧；进度如实）</li>
 *   <li>③ {@code playerDepthBelowSurface} —— 玩家地表深度（正值 = 在地下）</li>
 * </ul>
 *
 * <p>跑法（**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/state/testwork -cp out com.bandd.playtest.test.ColumnSearchTest
 * </pre>
 *
 * <p>与既有四套（CoreTest / StateTest / SettingsTest / SettingsActionsTest）**分开报数**：
 * 本类只加新判据，既有断言一条不动。
 */
public final class ColumnSearchTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/state/testwork");
        base = Paths.get(dir, "t13-" + System.nanoTime());
        Files.createDirectories(base);
        sectionColumn();
        sectionColumnEdges();
        sectionSearch();
        sectionDepth();
        sectionCapabilities();
        System.out.println();
        System.out.println("=== column-search-depth tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ================= ① query_column 基本盘 =================

    private static void sectionColumn() {
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("a"), "tok");

        Map<String, Object> res = core.dispatch("query_column",
                params("x", 8, "z", -8, "y1", 64, "y2", 72));
        Map<String, Object> col = data(res);
        check("A1 query_column status=ok", isOk(res));

        String[] need = {"schema", "x", "z", "order", "orderNote", "y1", "y2", "count", "truncated",
                "maxBlocks", "maxBlocksDefault", "maxBlocksMax", "blocks", "airCount", "unknownCount",
                "nonAirCount", "firstNonAirY", "firstNonAirId", "topSolidY", "mapHeightAtColumn",
                "unknownNote", "airIdNote", "heightCrossCheckNote", "readFromY", "readToY",
                "droppedFromY", "droppedToY"};
        StringBuilder miss = new StringBuilder();
        for (String k : need) if (!col.containsKey(k)) miss.append(k).append(' ');
        check("A2 回执头字段齐全（" + need.length + " 项，缺：" + (miss.length() == 0 ? "无" : miss) + "）",
                miss.length() == 0);
        check("A3 schema = bandd-state-column/1", "bandd-state-column/1".equals(col.get("schema")));
        check("A4 order=desc 且 orderNote 写明方向",
                "desc".equals(col.get("order")) && col.get("orderNote") != null);
        check("A5 x/z 原样回显", intAt(col, "x") == 8 && intAt(col, "z") == -8);
        check("A6 y1/y2 = 64..72（升序规范化）", intAt(col, "y1") == 64 && intAt(col, "y2") == 72);

        List<?> rows = listAt(col, "blocks");
        check("A7 count == blocks.size() == 9", intAt(col, "count") == 9 && rows.size() == 9);

        int lastY = 73;              // 窗口 64..72 ⇒ 第一行应当是 y=72
        boolean desc = true;
        boolean hasId = true;
        for (Object o : rows) {
            Map<?, ?> r0 = (Map<?, ?>) o;
            int yv = ((Number) r0.get("y")).intValue();
            if (yv != lastY - 1) desc = false;
            lastY = yv;
            if (!(r0.get("id") instanceof String)) hasId = false;
        }
        check("A8 逐行 y 严格递减 1（高→低）", desc);
        check("A9 每一行都带 id（空气也如实出现，不省略）", hasId);
        check("A10 第 0 行 y=72 / 第 8 行 y=64",
                intAtIn(rows, 0, "y") == 72 && intAtIn(rows, 8, "y") == 64);
        check("A11 y=72/71/70 都是 minecraft:air（地表之上的空气如实给）",
                "minecraft:air".equals(idAt(col, "blocks", 0))
                        && "minecraft:air".equals(idAt(col, "blocks", 1))
                        && "minecraft:air".equals(idAt(col, "blocks", 2)));
        check("A12 y=69 是 grass_block（= 合成世界 surfaceBlock(8,-8)）",
                "minecraft:grass_block".equals(idAt(col, "blocks", 3)));
        check("A13 firstNonAirY == topSolidY == surfaceY(8,-8) == 69",
                intAt(col, "firstNonAirY") == 69 && intAt(col, "topSolidY") == 69
                        && SyntheticWorldBridge.surfaceY(8, -8) == 69);
        check("A14 firstNonAirId == surfaceBlock(8,-8)",
                "minecraft:grass_block".equals(col.get("firstNonAirId")));
        check("A15 airCount=3 / nonAirCount=6 / unknownCount=0",
                intAt(col, "airCount") == 3 && intAt(col, "nonAirCount") == 6 && intAt(col, "unknownCount") == 0);
        check("A16 没截断时 truncated=false 且 droppedFromY/droppedToY = null",
                Boolean.FALSE.equals(col.get("truncated")) && col.get("droppedFromY") == null
                        && col.get("droppedToY") == null);
        check("A17 readFromY=72 / readToY=64", intAt(col, "readFromY") == 72 && intAt(col, "readToY") == 64);

        // ---- B① 的合成版：地图高度 h 与纵剖面第一个非空气层必须是**同一个数** ----
        runTicks(core, 20);
        Map<String, Object> st = data(core.dispatch("query_state", params()));
        check("A18 地图扫完（mapReady=true）", Boolean.TRUE.equals(st.get("mapReady")));
        Map<String, Object> map = mapAt(st, "map");
        Map<String, Object> col2 = data(core.dispatch("query_column", params("x", 8, "z", -8, "y1", 60, "y2", 80)));
        int gcol = gridColOf(map, 8);
        int grow = gridRowOf(map, -8);
        int gridH = gridHeightAt(map, gcol, grow);
        check("A19 地图里 (8,-8) 那格的高度字段 == 69", gridH == 69);
        check("A20 等式：纵剖面 firstNonAirY == 地图格高度 h == mapHeightAtColumn == 69"
                        + "（first=" + intAt(col2, "firstNonAirY") + " grid=" + gridH
                        + " mapHeightAtColumn=" + intAt(col2, "mapHeightAtColumn") + "）",
                intAt(col2, "firstNonAirY") == 69 && gridH == 69
                        && intAt(col2, "mapHeightAtColumn") == 69);
    }

    // ================= ① query_column 的边界 =================

    private static void sectionColumnEdges() {
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("b"), "tok");

        // ---- 截断（fail-loud）----
        Map<String, Object> t = data(core.dispatch("query_column",
                params("x", 8, "z", -8, "y1", 64, "y2", 72, "maxBlocks", 3)));
        check("B1 maxBlocks=3 ⇒ 只读 3 层且 truncated=true",
                intAt(t, "count") == 3 && Boolean.TRUE.equals(t.get("truncated")));
        check("B2 截断如实写**丢了哪一段**（droppedFromY=69 / droppedToY=64 + 人话）",
                intAt(t, "droppedFromY") == 69 && intAt(t, "droppedToY") == 64
                        && t.get("truncatedNote") != null);
        check("B3 读到的 3 层是 y=72/71/70（从高往低，不跳层）",
                intAtIn(listAt(t, "blocks"), 0, "y") == 72
                        && intAtIn(listAt(t, "blocks"), 2, "y") == 70);
        Map<String, Object> t2 = data(core.dispatch("query_column",
                params("x", 8, "z", -8, "y1", 60, "y2", 80, "maxBlocks", 600)));
        check("B4 maxBlocks=600 超硬上限 ⇒ 夹到 512 + maxBlocksClampedTo（不静默）",
                intAt(t2, "maxBlocks") == 512 && intAt(t2, "maxBlocksClampedTo") == 512
                        && t2.get("maxBlocksNote") != null);
        Map<String, Object> t3 = data(core.dispatch("query_column", params("x", 8, "z", -8, "y1", 60, "y2", 80)));
        check("B5 不给 maxBlocks ⇒ 用默认 96 + 人话",
                intAt(t3, "maxBlocks") == 96 && t3.get("maxBlocksNote") != null);

        // ---- 参数错误 ----
        check("C1 缺 x ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(codeOf(core.dispatch("query_column", params("z", -8)))));
        check("C2 缺 z ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(codeOf(core.dispatch("query_column", params("x", 8)))));
        check("C3 x 非数字 ⇒ BAD_REQUEST",
                "BAD_REQUEST".equals(codeOf(core.dispatch("query_column", params("x", "abc", "z", -8)))));
        check("C4 x=8.7 ⇒ BAD_REQUEST（不静默 floor）",
                "BAD_REQUEST".equals(codeOf(core.dispatch("query_column", params("x", 8.7, "z", -8)))));
        check("C5 y1 非整 ⇒ BAD_REQUEST",
                "BAD_REQUEST".equals(codeOf(core.dispatch("query_column", params("x", 8, "z", -8, "y1", "5.5")))));

        // ---- y 缺省 / 归一 ----
        Map<String, Object> d1 = data(core.dispatch("query_column", params("x", 8, "z", -8)));
        check("D1 不给 y1/y2 ⇒ 有界默认窗口 [33,81] + yDefaultNote",
                intAt(d1, "y1") == 33 && intAt(d1, "y2") == 81 && d1.get("yDefaultNote") != null);
        Map<String, Object> d2 = data(core.dispatch("query_column", params("x", 8, "z", -8, "y1", 60)));
        check("D2 只给 y1 ⇒ y2 按默认补 + yPartial:true + 人话",
                intAt(d2, "y1") == 60 && intAt(d2, "y2") == 81
                        && Boolean.TRUE.equals(d2.get("yPartial")) && d2.get("yDefaultNote") != null);
        Map<String, Object> d3 = data(core.dispatch("query_column",
                params("x", 8, "z", -8, "y1", 70, "y2", 66)));
        check("D3 y1>y2 ⇒ 规范化成 66..70 + ySwapNote",
                intAt(d3, "y1") == 66 && intAt(d3, "y2") == 70 && d3.get("ySwapNote") != null);

        // ---- 未加载列：id=null（不是 air）----
        SyntheticWorldBridge bu = new SyntheticWorldBridge();
        bu.unloadedBelowX = 9;
        PlaytestCore cu = new PlaytestCore(bu, evDir("b-u"), "tok");
        Map<String, Object> d4 = data(cu.dispatch("query_column",
                params("x", 8, "z", -8, "y1", 64, "y2", 70)));
        boolean allNull = true;
        for (Object o : listAt(d4, "blocks")) if (((Map<?, ?>) o).get("id") != null) allNull = false;
        check("D4 未加载列 ⇒ 每行 id=null + unknownCount==count + firstNonAirY/topSolidY=null + 人话",
                allNull && intAt(d4, "unknownCount") == intAt(d4, "count")
                        && d4.get("firstNonAirY") == null && d4.get("topSolidY") == null
                        && d4.get("unknownRowsNote") != null);

        // ---- 真机上的「未加载」形状：void_air（不是 null）+ topSolidY=-65 ----
        VoidAirBridge vu = new VoidAirBridge();
        vu.unloadedBelowX = 9;
        PlaytestCore cv = new PlaytestCore(vu, evDir("b-v"), "tok");
        Map<String, Object> d7 = data(cv.dispatch("query_column",
                params("x", 8, "z", -8, "y1", 64, "y2", 70)));
        check("D7 未加载列的真机形状（全 minecraft:void_air + topSolidY=-65）⇒ **unloadedSuspect:true** + 人话"
                        + "、voidAirCount==count、且不当非空气",
                Boolean.TRUE.equals(d7.get("unloadedSuspect")) && d7.get("unloadedSuspectNote") != null
                        && intAt(d7, "voidAirCount") == intAt(d7, "count")
                        && intAt(d7, "airCount") == intAt(d7, "count") && d7.get("firstNonAirY") == null);
        Map<String, Object> d8 = data(cv.dispatch("query_column",
                params("x", 10, "z", -8, "y1", 64, "y2", 70)));
        check("D8 同一档的**已加载**列：unloadedSuspect:false（不误报）",
                Boolean.FALSE.equals(d8.get("unloadedSuspect")) && d8.get("firstNonAirY") != null);
        Map<String, Object> e30 = data(searchDone(cv, "filter", "*", "radius", 2));
        boolean noVoidHits = true;
        for (Object o : listAt(e30, "matches")) {
            if (String.valueOf(((Map<?, ?>) o).get("id")).endsWith("void_air")) noVoidHits = false;
        }
        check("E30 void_air 格**不参与**任何 filter 匹配（filter=[*] 也不命中），只进 scan.voidAirBlocks(>0) + note",
                noVoidHits && intAt(mapAt(e30, "scan"), "voidAirBlocks") > 0
                        && mapAt(e30, "scan").get("voidAirNote") != null);

        // ---- 竖井（洞的判据）：y=55..70 全空气，y<=54 是石头 ----
        ShaftBridge sb = new ShaftBridge();
        PlaytestCore cs = new PlaytestCore(sb, evDir("b-s"), "tok");
        Map<String, Object> d5 = data(cs.dispatch("query_column",
                params("x", 0, "z", 0, "y1", 50, "y2", 72)));
        boolean airSeg = true;
        for (int i = 0; i <= 17; i++) {
            if (!"minecraft:air".equals(idAt(d5, "blocks", i))) airSeg = false;
        }
        check("D5 竖井列 y=72..55 共 18 层**如实**是空气（洞的判据），airCount=18",
                airSeg && intAt(d5, "airCount") == 18);
        check("D6 首个非空气层 y=54 是石头，且 == topSolidY == firstNonAirY",
                "minecraft:stone".equals(idAt(d5, "blocks", 18)) && intAt(d5, "firstNonAirY") == 54
                        && intAt(d5, "topSolidY") == 54);
    }

    // ================= ② query_blocks =================

    private static void sectionSearch() {
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("c"), "tok");

        Map<String, Object> res0 = searchRes(core, true, "filter", "minecraft:stone",
                "radius", 2, "maxMatches", 512);
        Map<String, Object> e0 = data(res0);
        check("E1 query_blocks status=ok + schema + filter 回显 + filterNote",
                isOk(res0) && "bandd-state-search/1".equals(e0.get("schema"))
                        && listAt(e0, "filter").size() == 1
                        && "minecraft:stone".equals(listAt(e0, "filter").get(0))
                        && e0.get("filterNote") != null);
        String[] need = {"schema", "filter", "filterNote", "radius", "y1", "y2", "maxMatches", "origin",
                "orderNote", "matches", "matched", "truncated", "scan", "maxMatchesDefault",
                "radiusDefault", "radiusMax", "ySpanMax"};
        StringBuilder miss = new StringBuilder();
        for (String k : need) if (!e0.containsKey(k)) miss.append(k).append(' ');
        check("E2 回执字段齐全（" + need.length + " 项，缺：" + (miss.length() == 0 ? "无" : miss) + "）",
                miss.length() == 0);
        Map<String, Object> sc0 = mapAt(e0, "scan");
        String[] need2 = {"active", "complete", "doneBlocks", "totalBlocks", "doneCols", "totalCols",
                "radius", "cols", "origin", "y1", "y2", "blocksPerTick", "startedTick", "finishedTick",
                "runs", "hits", "errors", "unknownBlocks", "note"};
        StringBuilder miss2 = new StringBuilder();
        for (String k : need2) if (!sc0.containsKey(k)) miss2.append(k).append(' ');
        check("E3 scan 段字段齐全（" + need2.length + " 项，缺：" + (miss2.length() == 0 ? "无" : miss2) + "）",
                miss2.length() == 0);
        check("E4 刚起扫：scan.active=true，doneBlocks=0（dispatch 里**没有**同步全扫）；"
                        + "totalBlocks=(2*2+1)^2*(16+16+1)=825",
                Boolean.TRUE.equals(sc0.get("active")) && intAt(sc0, "doneBlocks") == 0
                        && intAt(sc0, "totalBlocks") == 5 * 5 * 33);
        check("E5 scan.blocksPerTick 写进回执且 <= 256",
                intAt(sc0, "blocksPerTick") > 0 && intAt(sc0, "blocksPerTick") <= 256);
        check("E6 origin = 扫描起点的玩家位置 (8,65,-8)",
                dblAt(mapAt(e0, "origin"), "x") == 8.0 && dblAt(mapAt(e0, "origin"), "y") == 65.0
                        && dblAt(mapAt(e0, "origin"), "z") == -8.0);

        runTicks(core, 1);
        Map<String, Object> e1 = data(searchRes(core, false, "filter", "minecraft:stone",
                "radius", 2, "maxMatches", 512));
        check("E7 一个 tick 之后 doneBlocks == 256（分帧预算逐字生效；实际="
                        + intAt(mapAt(e1, "scan"), "doneBlocks") + " active="
                        + mapAt(e1, "scan").get("active") + " total="
                        + intAt(mapAt(e1, "scan"), "totalBlocks") + "）",
                intAt(mapAt(e1, "scan"), "doneBlocks") == 256);

        Map<String, Object> e2 = data(searchDone(core, "filter", "minecraft:stone",
                "radius", 2, "maxMatches", 512));
        Map<String, Object> sc2 = mapAt(e2, "scan");
        check("E8 扫完：active=false / complete=true / doneBlocks==totalBlocks（实际 active="
                        + sc2.get("active") + " complete=" + sc2.get("complete") + " done="
                        + intAt(sc2, "doneBlocks") + "/" + intAt(sc2, "totalBlocks") + " hits="
                        + intAt(sc2, "hits") + " runs=" + intAt(sc2, "runs") + "）",
                Boolean.FALSE.equals(sc2.get("active")) && Boolean.TRUE.equals(sc2.get("complete"))
                        && intAt(sc2, "doneBlocks") == intAt(sc2, "totalBlocks"));

        List<?> ms = listAt(e2, "matches");
        int rr2 = intAt(e2, "radius");
        check("E9 matched == matches.size() 且 > 0", intAt(e2, "matched") == ms.size() && ms.size() > 0);
        check("E9b maxMatches=512 没被撞到 ⇒ truncated=false（这是**扫完**的那一次）",
                Boolean.FALSE.equals(e2.get("truncated")) && intAt(e2, "maxMatches") == 512);
        boolean allStone = true;
        int badRange = 0;
        double lastD = -1;
        boolean asc = true;
        boolean shape = true;
        for (Object o : ms) {
            Map<?, ?> m = (Map<?, ?>) o;
            if (!"minecraft:stone".equals(String.valueOf(m.get("id")))) allStone = false;
            int x = ((Number) m.get("x")).intValue();
            int y = ((Number) m.get("y")).intValue();
            int z = ((Number) m.get("z")).intValue();
            if (Math.abs(x - 8) > rr2 || Math.abs(z + 8) > rr2 || y < 49 || y > 81) badRange++;
            double dd = ((Number) m.get("dist")).doubleValue();
            if (dd < lastD) asc = false;
            lastD = dd;
            if (m.get("x") == null || m.get("y") == null || m.get("z") == null || m.get("id") == null
                    || m.get("dist") == null) shape = false;
        }
        check("E10 filter=[minecraft:stone] ⇒ **只回石头**（过滤真的生效）", allStone);
        check("E11 命中全落在 radius=" + rr2 + " / y∈[49,81] 窗口内", badRange == 0);
        check("E12 matches 按 dist **由近到远**（单调不减）", asc);
        check("E13 **只回命中坐标**：每条都带 x/y/z/id/dist", ms.size() > 0 && shape);

        Map<String, Object> e3 = data(searchDone(core, "filter", "*_block",
                "radius", 2, "maxMatches", 512));
        boolean onlySurface = true;
        for (Object o : listAt(e3, "matches")) {
            String id = String.valueOf(((Map<?, ?>) o).get("id"));
            if (!"minecraft:grass_block".equals(id) && !"minecraft:snow_block".equals(id)) onlySurface = false;
        }
        check("E14 后缀通配 *_block ⇒ 只命中 grass_block / snow_block",
                onlySurface && intAt(e3, "matched") > 0);

        Map<String, Object> e4 = data(searchDone(core, "filter", "air", "radius", 2, "maxMatches", 512));
        boolean onlyAir = true;
        for (Object o : listAt(e4, "matches")) {
            if (!"minecraft:air".equals(String.valueOf(((Map<?, ?>) o).get("id")))) onlyAir = false;
        }
        check("E15 pattern 不带冒号（air）⇒ 命中 minecraft:air（命名空间省略规则生效）",
                onlyAir && intAt(e4, "matched") > 0);

        Map<String, Object> res5 = searchDone(core, "filter", "minecraft:bedrock", "radius", 2);
        Map<String, Object> e5 = data(res5);
        check("E16 零命中 ⇒ matched:0 + matches:[] + status=ok + matchNote（空结果是合法读数）",
                isOk(res5) && intAt(e5, "matched") == 0 && listAt(e5, "matches").isEmpty()
                        && e5.get("matchNote") != null);

        Map<String, Object> e6 = data(searchDone(core, "filter", "minecraft:stone",
                "radius", 2, "maxMatches", 2));
        check("E17 maxMatches=2 ⇒ matched==2 + truncated=true + truncatedNote + scan.complete=false",
                intAt(e6, "matched") == 2 && Boolean.TRUE.equals(e6.get("truncated"))
                        && e6.get("truncatedNote") != null
                        && Boolean.FALSE.equals(mapAt(e6, "scan").get("complete")));
        check("E18 截断时 doneBlocks < totalBlocks（剩余区域**没扫**，如实）",
                intAt(mapAt(e6, "scan"), "doneBlocks") < intAt(mapAt(e6, "scan"), "totalBlocks"));

        Map<String, Object> e7 = data(searchRes(core, false, "filter", "minecraft:gold_ore",
                "radius", 2, "maxMatches", 512));
        check("E19 换条件却没 refresh ⇒ filterChanged:true + 人话（不拿旧条件结果冒充新条件）",
                Boolean.TRUE.equals(e7.get("filterChanged")) && e7.get("filterChangedNote") != null);

        Map<String, Object> e8 = data(searchRes(core, true, "filter", "minecraft:stone",
                "radius", 99, "y1", -200, "y2", 200, "maxMatches", 9999));
        check("E20 radius=99 ⇒ 夹到 32 + radiusClampedTo + 人话",
                intAt(e8, "radius") == 32 && intAt(e8, "radiusClampedTo") == 32 && e8.get("radiusNote") != null);
        check("E21 y 跨度 > 128 ⇒ yClampedTo + 人话", e8.get("yClampedTo") != null && e8.get("yNote") != null);
        check("E22 maxMatches=9999 ⇒ 夹到 512 + maxMatchesClampedTo + 人话",
                intAt(e8, "maxMatches") == 512 && intAt(e8, "maxMatchesClampedTo") == 512
                        && e8.get("maxMatchesNote") != null);

        // 默认 maxMatches（64）撞上限 ⇒ fail-loud（真机/合成都该这样：不假装扫完）
        Map<String, Object> e29 = data(searchDone(core, "filter", "minecraft:stone", "radius", 2));
        check("E23b 不给 maxMatches ⇒ 默认 64，撞上限就 truncated=true + matched=64 + complete=false",
                intAt(e29, "maxMatches") == 64 && intAt(e29, "matched") == 64
                        && Boolean.TRUE.equals(e29.get("truncated"))
                        && Boolean.FALSE.equals(mapAt(e29, "scan").get("complete")));

        check("E23 缺 filter ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(codeOf(searchRes(core, true))));
        check("E24 filter=[] ⇒ BAD_REQUEST（没有判据不是空结果）",
                "BAD_REQUEST".equals(codeOf(core.dispatch("query_blocks",
                        params("filter", new ArrayList<String>())))));
        List<Object> badF = new ArrayList<Object>();
        badF.add(Integer.valueOf(1));
        check("E25 filter 元素不是字符串 ⇒ MISSING_REQUIRED_PARAM（形状不对不猜）",
                "MISSING_REQUIRED_PARAM".equals(codeOf(core.dispatch("query_blocks", params("filter", badF)))));
        Map<String, Object> e9 = data(searchDone(core, "filter", Arrays.asList("   ", "minecraft:stone"),
                "radius", 2));
        check("E26 filter 里的空白项被剔除（只留有效 pattern）", listAt(e9, "filter").size() == 1);

        SyntheticWorldBridge bu = new SyntheticWorldBridge();
        bu.unloadedBelowX = 9;
        PlaytestCore cu = new PlaytestCore(bu, evDir("c-u"), "tok");
        Map<String, Object> e10 = data(searchDone(cu, "filter", "minecraft:stone", "radius", 2));
        check("E27 未加载格 ⇒ 只记进 scan.unknownBlocks(>0)，**不参与匹配**",
                intAt(mapAt(e10, "scan"), "unknownBlocks") > 0 && intAt(e10, "matched") > 0);
        boolean idNonNull = true;
        for (Object o : listAt(e10, "matches")) if (((Map<?, ?>) o).get("id") == null) idNonNull = false;
        check("E28 命中里没有 id=null（未加载不当成方块）", idNonNull);
    }

    // ================= ③ playerDepthBelowSurface =================

    private static void sectionDepth() {
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("d"), "tok");
        runTicks(core, 20);
        Map<String, Object> st1 = data(core.dispatch("query_state", params()));
        check("F1 地下（py=65 / 地表方块 69 / 地表平面 70）⇒ depth = 70-65 = 5（正值）",
                dblAt(st1, "playerDepthBelowSurface") == 5.0);
        check("F2 playerSurfaceBlockY=69 / playerStandY=70 / playerY=65",
                intAt(st1, "playerSurfaceBlockY") == 69 && intAt(st1, "playerStandY") == 70
                        && dblAt(st1, "playerY") == 65.0);
        check("F3 playerDepthNote 写明符号口径（正值 = 在地下）",
                st1.get("playerDepthNote") != null
                        && String.valueOf(st1.get("playerDepthNote")).indexOf("正值") >= 0);
        check("F4 **地图头**里也有这三个字段（同源同值）",
                dblAt(mapAt(st1, "map"), "playerDepthBelowSurface") == 5.0
                        && intAt(mapAt(st1, "map"), "playerSurfaceBlockY") == 69);

        b.py = 70.0;
        runTicks(core, 2);
        Map<String, Object> st2 = data(core.dispatch("query_state", params()));
        check("F5 站在地表（py=70=standY）⇒ depth = 0", dblAt(st2, "playerDepthBelowSurface") == 0.0);
        b.py = 75.0;
        runTicks(core, 2);
        Map<String, Object> st3 = data(core.dispatch("query_state", params()));
        check("F6 高于地表（py=75）⇒ depth = -5（负值）",
                dblAt(st3, "playerDepthBelowSurface") == -5.0);
        b.py = 40.0;
        runTicks(core, 2);
        Map<String, Object> st4 = data(core.dispatch("query_state", params()));
        check("F7 深挖到 py=40 ⇒ depth = 30（挖下去 ⇒ 正）",
                dblAt(st4, "playerDepthBelowSurface") == 30.0);

        SyntheticWorldBridge bu = new SyntheticWorldBridge();
        bu.unloadedBelowX = 9;
        PlaytestCore cu = new PlaytestCore(bu, evDir("d-u"), "tok");
        runTicks(cu, 5);
        Map<String, Object> st5 = data(cu.dispatch("query_state", params()));
        check("F8 该列取不到 ⇒ depth/地表一律 null（**不填 0 冒充**）+ 人话 + playerY 仍在",
                st5.get("playerDepthBelowSurface") == null && st5.get("playerSurfaceBlockY") == null
                        && st5.get("playerStandY") == null && st5.get("playerY") != null
                        && st5.get("playerDepthNote") != null);

        VoidAirBridge vu2 = new VoidAirBridge();
        vu2.unloadedBelowX = 9;                    // 玩家自己那一列也「未加载」
        PlaytestCore cv2 = new PlaytestCore(vu2, evDir("d-v"), "tok");
        runTicks(cv2, 3);
        Map<String, Object> stv = data(cv2.dispatch("query_state", params()));
        check("F10 玩家列读到 void_air ⇒ 深度如实 null（**不把 -65 当地表**算出一个假数）+ 人话点名 void_air",
                stv.get("playerDepthBelowSurface") == null && stv.get("playerSurfaceBlockY") == null
                        && stv.get("playerDepthNote") != null
                        && String.valueOf(stv.get("playerDepthNote")).indexOf("void_air") >= 0);

        FakeBridge fb = new FakeBridge();
        PlaytestCore cf = new PlaytestCore(fb, evDir("d-f"), "tok");
        runTicks(cf, 2);
        Map<String, Object> pd = mapAt(mapAt(cf.status(), "stateMap"), "playerDepth");
        check("F9 没有取值面的档：/status 里深度如实 null + note",
                pd.get("playerDepthBelowSurface") == null && pd.get("playerDepthNote") != null);
    }

    // ================= 能力自报 / 归表 =================

    private static void sectionCapabilities() {
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("g"), "tok");
        FakeBridge fb = new FakeBridge();
        PlaytestCore cf = new PlaytestCore(fb, evDir("g-f"), "tok");

        check("G1 STATE_QUERY 是 BRIDGE 的子集（不是第 3 张表）",
                Capabilities.BRIDGE.containsAll(Capabilities.STATE_QUERY));
        check("G2 all() 仍是两表并集（BRIDGE ∪ DRIVER）",
                Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());
        Map<String, Object> s1 = core.status();
        List<String> acts = strList(s1.get("actions"));
        List<String> un = strList(s1.get("actionsUnavailable"));
        check("G3 有取值面的档：两条在 actions 里、**不在** actionsUnavailable 里",
                acts.contains("query_column") && acts.contains("query_blocks")
                        && !un.contains("query_column") && !un.contains("query_blocks"));
        check("G4 caps.stateQuery == STATE_QUERY",
                new ArrayList<Object>(Capabilities.STATE_QUERY)
                        .equals(listAt(mapAt(s1, "capabilities"), "stateQuery")));
        Map<String, Object> sf = cf.status();
        List<String> actsF = strList(sf.get("actions"));
        List<String> unF = strList(sf.get("actionsUnavailable"));
        check("G5 无取值面的档：两条**如实**进 actionsUnavailable（不谎报会读方块）",
                unF.contains("query_column") && unF.contains("query_blocks")
                        && !actsF.contains("query_column") && !actsF.contains("query_blocks"));
        check("G6 无取值面的档：两条 fail-loud ⇒ STATE_MAP_UNSUPPORTED",
                "STATE_MAP_UNSUPPORTED".equals(codeOf(cf.dispatch("query_column", params("x", 0, "z", 0))))
                        && "STATE_MAP_UNSUPPORTED".equals(codeOf(cf.dispatch("query_blocks",
                                params("filter", "stone")))));
        Map<String, Object> bs = mapAt(mapAt(s1, "stateMap"), "blockSearch");
        check("G7 /status 里方框搜索段自报 blocksPerTick / 未跑过（everRan=false）",
                intAt(bs, "blocksPerTick") == 256 && Boolean.FALSE.equals(bs.get("everRan")));
    }

    // ================= 合成世界的两个变体 =================

    /**
     * 模拟**真机上的未加载形状**（2026-11-11 真机实证）：客户端在未加载区块上回
     * {@code minecraft:void_air}（**不是** null），{@code topSolidY} 回 -65。
     */
    static final class VoidAirBridge extends SyntheticWorldBridge {
        @Override
        public String blockAt(int x, int y, int z) {
            if (!loadedAt(x, z)) return "minecraft:void_air";
            return super.blockAt(x, y, z);
        }

        @Override
        public int topSolidY(int x, int z) {
            if (!loadedAt(x, z)) return -65;
            return super.topSolidY(x, z);
        }
    }

    /** 在 (0,0) 一列上打一条竖井：y=55..70 全空气（洞），y<=54 石头。 */
    static final class ShaftBridge extends SyntheticWorldBridge {
        @Override
        public String blockAt(int x, int y, int z) {
            if (x == 0 && z == 0) {
                if (y >= 55 && y <= 70) return "minecraft:air";
                if (y < 55) return "minecraft:stone";
                return "minecraft:air";
            }
            return super.blockAt(x, y, z);
        }

        @Override
        public int topSolidY(int x, int z) {
            if (x == 0 && z == 0) return 54;
            return super.topSolidY(x, z);
        }
    }

    // ================= helpers =================

    private static Path evDir(String tag) {
        return base.resolve("ev-" + tag);
    }

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

    /** 起一次（refresh）并 tick 到扫完（或 truncated 提前收工）；返回最后一次回执。 */
    private static Map<String, Object> searchDone(PlaytestCore core, Object... kv) {
        Map<String, Object> res = searchRes(core, true, kv);
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

    private static int intAtIn(List<?> l, int i, String k) {
        if (i < 0 || i >= l.size()) return Integer.MIN_VALUE;
        Object v = ((Map<?, ?>) l.get(i)).get(k);
        return (v instanceof Number) ? ((Number) v).intValue() : Integer.MIN_VALUE;
    }

    private static double dblAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof Number) ? ((Number) v).doubleValue() : Double.NaN;
    }

    private static String idAt(Map<String, Object> m, String k, int i) {
        List<?> l = listAt(m, k);
        if (i < 0 || i >= l.size()) return null;
        Object v = ((Map<?, ?>) l.get(i)).get("id");
        return v == null ? null : String.valueOf(v);
    }

    private static boolean isOk(Map<String, Object> res) {
        return "ok".equals(res.get("status"));
    }

    private static String codeOf(Map<String, Object> res) {
        Object c = res.get("code");
        return c == null ? null : String.valueOf(c);
    }

    /** 地图 grid：(col,row) 那格的高度字段（'?' 填充 / 越界 ⇒ -1）。 */
    private static int gridHeightAt(Map<String, Object> map, int col, int row) {
        int cw = intAt(map, "cellWidth");
        int hw = intAt(map, "heightWidth");
        String[] lines = String.valueOf(map.get("grid")).split("\n", -1);
        if (cw <= 0 || hw <= 0 || row < 0 || row >= lines.length) return -1;
        int at = col * cw + 1;
        if (at < 0 || at + hw > lines[row].length()) return -1;
        try {
            return Integer.parseInt(lines[row].substring(at, at + hw));
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static int gridColOf(Map<String, Object> map, int x) {
        Map<String, Object> o = mapAt(map, "origin");
        int step = intAt(map, "step");
        if (step <= 0) return -1;
        return (x - intAt(o, "x")) / step;
    }

    private static int gridRowOf(Map<String, Object> map, int z) {
        Map<String, Object> o = mapAt(map, "origin");
        int step = intAt(map, "step");
        if (step <= 0) return -1;
        return (z - intAt(o, "z")) / step;
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
