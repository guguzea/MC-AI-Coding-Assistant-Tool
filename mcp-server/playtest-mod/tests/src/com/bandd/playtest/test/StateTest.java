package com.bandd.playtest.test;

import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.core.StateConfig;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 状态器（{@code query_state} / {@code query_map}）的真测试：**合成世界** + 假桥，不需要 Minecraft。
 *
 * <p>跑法（工作目录任意；**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/state/testwork -cp out com.bandd.playtest.test.StateTest
 * </pre>
 * 与既有 {@code CoreTest} 分开报数（本类只加新判据，不改 CoreTest 一条）。
 */
public final class StateTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/state/testwork");
        base = Paths.get(dir, "run-" + System.nanoTime());
        Files.createDirectories(base);

        // ================= A. 默认配置：48×48 / step=1 / 头字段齐全 / 玩家标记 =================
        SyntheticWorldBridge b = new SyntheticWorldBridge();
        PlaytestCore core = new PlaytestCore(b, evDir("a"), "tok");

        Map<String, Object> cold = data(core.dispatch("query_state", params()));
        check("A1 冷启动：mapReady=false 且 map=null",
                Boolean.FALSE.equals(cold.get("mapReady")) && cold.get("map") == null);
        check("A2 冷启动：scan.total = 48*48 = 2304（默认半径 1 区块）", intAt(mapAt(cold, "scan"), "total") == 2304);
        check("A3 冷启动如实给 mapNote（不假装有图）", cold.get("mapNote") != null);

        runTicks(core, 18);
        Map<String, Object> d = data(core.dispatch("query_state", params()));
        Map<String, Object> map = mapAt(d, "map");
        check("A4 扫完整张后 mapReady=true 且 map 非空",
                Boolean.TRUE.equals(d.get("mapReady")) && map != null);

        String[] need = {"schema", "stateVersion", "tick", "builtTick", "dimension", "origin", "axis",
                "step", "cols", "rows", "cellWidth", "heightWidth", "includeHeight", "heightMode",
                "yMin", "yMax", "player", "playerMark", "playerCell", "playerCellOutside",
                "unknownCode", "overflowCode", "legend", "entitiesIncluded",
                "truncated", "shownRows", "shownChars", "totalChars", "maxChars", "maxAutoStep", "grid"};
        StringBuilder missing = new StringBuilder();
        for (String k : need) if (!map.containsKey(k)) missing.append(k).append(' ');
        check("A5 地图头字段齐全（" + need.length + " 项，缺：" + (missing.length() == 0 ? "无" : missing) + "）",
                missing.length() == 0);

        check("A6 schema", "bandd-state-map/1".equals(map.get("schema")));
        check("A7 dimension", "minecraft:overworld".equals(map.get("dimension")));
        check("A8 origin = 玩家区块 ±1 ⇒ (-16,-32)",
                intAt(mapAt(map, "origin"), "x") == -16 && intAt(mapAt(map, "origin"), "z") == -32);
        check("A9 step=1（默认不降采样）", intAt(map, "step") == 1);
        check("A10 cols/rows = 48", intAt(map, "cols") == 48 && intAt(map, "rows") == 48);
        check("A11 cellWidth = 1 + heightWidth", intAt(map, "cellWidth") == 1 + intAt(map, "heightWidth"));
        Map<String, Object> axis = mapAt(map, "axis");
        check("A12 轴向写死（右=+x 东 / 下=+z 南 / 有 note）",
                "+x（东）".equals(axis.get("right")) && "+z（南）".equals(axis.get("down"))
                        && axis.get("note") != null);
        check("A13 高度口径写明（h 到底是什么）",
                String.valueOf(map.get("heightMode")).contains("最高非空气方块"));
        check("A14 yMin/yMax = 64/70", intAt(map, "yMin") == 64 && intAt(map, "yMax") == 70);

        int cellW = intAt(map, "cellWidth");
        int cols = intAt(map, "cols");
        int rows = intAt(map, "rows");
        String grid = String.valueOf(map.get("grid"));
        String[] lines = grid.split("\n", -1);
        check("A15 行数 == rows", lines.length == rows);
        int bad = 0;
        for (String L : lines) if (L.length() != cols * cellW) bad++;
        check("A16 每行定宽 == cols*cellWidth（" + (cols * cellW) + "）中途无粘连", bad == 0);
        check("A17 totalChars 如实 = rows*rowLen + rows-1",
                intAt(map, "totalChars") == rows * cols * cellW + rows - 1);
        check("A18 默认 3×3 区块一上来不爆：truncated=false 且 shownChars==totalChars",
                Boolean.FALSE.equals(map.get("truncated"))
                        && intAt(map, "shownChars") == intAt(map, "totalChars"));

        Map<String, Object> pcell = mapAt(map, "playerCell");
        check("A19 玩家格 = (24,24)（x=8,z=-8；origin=(-16,-32)，step=1）",
                intAt(pcell, "col") == 24 && intAt(pcell, "row") == 24);
        String cell = lines[24].substring(24 * cellW, 24 * cellW + cellW);
        check("A20 玩家那格画了 +（且保留定宽高度字段）",
                cell.equals("+" + SyntheticWorldBridge.surfaceY(8, -8)));
        check("A21 全图只有一个 +", countChar(grid, '+') == 1);
        check("A22 playerCellOutside=false", Boolean.FALSE.equals(map.get("playerCellOutside")));
        check("A23 playerMark 写在头里", "+".equals(map.get("playerMark")));

        Map<String, Object> legend = mapAt(map, "legend");
        // [契约变更 2026-11-10 · bug①] 旧断言是 legend.containsKey("?")：它编码了「legend 永远广告未知码」
        // 这一缺陷（本图全加载、grid 里根本没有 '?'）。新契约 = legend 只列本图 grid 里真实出现的码。
        java.util.Set<Character> aGc = gridCodeChars(grid, cellW);
        aGc.remove(Character.valueOf('+'));
        java.util.Set<Character> aLc = legendCodeChars(legend);
        check("A24 legend 只列 grid 里真出现的码（全加载 ⇒ 不含未知码 '?'）",
                !legend.containsKey("?") && aGc.containsAll(aLc) && aLc.containsAll(aGc));
        check("A25 legend 覆盖三种地表方块", new HashSet<Object>(legend.values()).containsAll(
                Arrays.asList("minecraft:stone", "minecraft:grass_block", "minecraft:snow_block")));
        check("A26 legend 的码全是 1 字符（固定宽度前提）", allOneChar(legend.keySet()));

        check("A27 时间取自适配层（timeOfDay=6000）", intAt(mapAt(d, "time"), "timeOfDay") == 6000);
        check("A28 天气取自适配层（thundering=true）",
                Boolean.TRUE.equals(mapAt(d, "weather").get("thundering")));
        check("A29 玩家格坐标（整数格）写在快照里",
                intAt(mapAt(map, "player"), "x") == 8 && intAt(mapAt(map, "player"), "z") == -8
                        && mapAt(map, "player").get("yaw") != null);

        System.out.println("  [sample] 合成世界真实渲染（默认配置，前 6 行，每格 " + cellW + " 字符）：");
        for (int i = 0; i < 6 && i < lines.length; i++) System.out.println("      " + lines[i]);

        // ================= B. 版本语义（半实时） =================
        int v = intAt(map, "stateVersion");
        Map<String, Object> same = data(core.dispatch("query_state", params("sinceVersion", v)));
        check("B1 sinceVersion 未变 ⇒ unchanged:true", Boolean.TRUE.equals(same.get("unchanged")));
        check("B2 unchanged 不回整张图（无 map 键）", !same.containsKey("map"));
        check("B3 unchanged 带 stateVersion + tick",
                intAt(same, "stateVersion") == v && same.get("tick") != null);

        data(core.dispatch("query_state", params("refresh", Boolean.TRUE)));
        runTicks(core, 18);
        Map<String, Object> again = data(core.dispatch("query_state", params()));
        check("B4 refresh 重采后内容一模一样 ⇒ stateVersion 不动（否则 sinceVersion 永远失效）",
                intAt(mapAt(again, "map"), "stateVersion") == v);

        b.px = 100.0;
        b.pz = 100.0;
        data(core.dispatch("query_state", params("refresh", Boolean.TRUE)));
        runTicks(core, 18);
        Map<String, Object> moved = data(core.dispatch("query_state", params()));
        Map<String, Object> mm = mapAt(moved, "map");
        check("B5 世界真的变了（换区块）⇒ stateVersion 自增", intAt(mm, "stateVersion") > v);
        check("B6 新原点 = 新玩家区块 ±1（80）", intAt(mapAt(mm, "origin"), "x") == 80);
        check("B7 refresh 期间不阻塞：那一次回的是上一张已完成的图",
                moved.get("map") != null);

        // ================= C. 分帧（绝不一次全扫） =================
        SyntheticWorldBridge b2 = new SyntheticWorldBridge();
        PlaytestCore core2 = new PlaytestCore(b2, evDir("c"), "tok");
        data(core2.dispatch("query_state", params()));
        core2.onTick();
        Map<String, Object> scan = mapAt(data(core2.dispatch("query_state", params())), "scan");
        int done = intAt(scan, "done");
        check("C1 一 tick 只走一帧预算（done>0 且 <= columnsPerTick=128）", done > 0 && done <= 128);
        check("C2 查询不现场全扫（blockAt 调用数 == 已扫格数，不是 2304）", b2.blockAtCalls == done);
        check("C3 扫完一整张才启用：没扫完 mapReady=false",
                Boolean.FALSE.equals(data(core2.dispatch("query_state", params())).get("mapReady")));
        check("C4 scan 里带 active/done/total/step/origin", intAt(scan, "total") == 2304
                && Boolean.TRUE.equals(scan.get("active")) && intAt(scan, "step") == 1
                && scan.get("origin") != null);

        // ================= D. 未知格（blockAt 回 null 不崩） =================
        SyntheticWorldBridge b3 = new SyntheticWorldBridge();
        b3.unloadedBelowX = -8;      // origin.x = -16 ⇒ 第 0..7 列（x=-16..-9）未加载
        PlaytestCore core3 = new PlaytestCore(b3, evDir("d"), "tok");
        data(core3.dispatch("query_state", params()));
        runTicks(core3, 18);
        Map<String, Object> d3 = data(core3.dispatch("query_state", params()));
        Map<String, Object> m3 = mapAt(d3, "map");
        String[] l3 = String.valueOf(m3.get("grid")).split("\n", -1);
        int cw3 = intAt(m3, "cellWidth");
        check("D1 未加载格 ⇒ 未知码（且不崩）",
                l3[0].substring(0, cw3).equals("?" + repeat('?', cw3 - 1)));
        check("D2 未知格的高度字段也如实是 '?'（不是 0 / 64）", l3[0].charAt(1) == '?');
        check("D3 扫描没抛异常（scan.errors=0）", intAt(mapAt(d3, "scan"), "errors") == 0);
        check("D4 已知列照常有码（第 24 列 = 玩家那一列附近）", l3[0].charAt(24 * cw3) != '?');
        check("D5 有未知格 ⇒ legend 如实列出未知码（另一方向：不是永远不列）",
                mapAt(m3, "legend").containsKey("?"));

        // ================= E. maxChars：降采样 / 截断（fail-loud） =================
        Map<String, Object> e1 = data(core3.dispatch("query_map", params("step", 4, "maxChars", 300)));
        Map<String, Object> me1 = mapAt(e1, "map");
        int rowLen = intAt(me1, "cols") * intAt(me1, "cellWidth");
        int total = intAt(me1, "totalChars");
        check("E1 显式 step=4 生效（step 写进头）", intAt(me1, "step") == 4);
        check("E2 maxChars 超限 ⇒ truncated=true（不静默丢格）", Boolean.TRUE.equals(me1.get("truncated")));
        check("E3 totalChars 如实 = 整张（不是截断后）",
                total == intAt(me1, "rows") * rowLen + intAt(me1, "rows") - 1);
        check("E4 shownChars 如实（= 实际回的行数）",
                intAt(me1, "shownChars") == intAt(me1, "shownRows") * rowLen + intAt(me1, "shownRows") - 1);
        check("E5 shownChars <= maxChars < totalChars",
                intAt(me1, "shownChars") <= 300 && total > 300);
        check("E6 grid 真只有 shownRows 行，且 shownRows < rows",
                String.valueOf(me1.get("grid")).split("\n", -1).length == intAt(me1, "shownRows")
                        && intAt(me1, "shownRows") < intAt(me1, "rows"));
        check("E7 truncatedNote 写明原因（步长与上限）", me1.get("truncatedNote") != null);

        Map<String, Object> e2 = data(core3.dispatch("query_map", params("maxChars", 900)));
        Map<String, Object> me2 = mapAt(e2, "map");
        check("E8 不指定 step ⇒ 自动降采样到装得下（step=4, truncated=false）",
                intAt(me2, "step") == 4 && Boolean.FALSE.equals(me2.get("truncated")));
        check("E9 自动降采样后 totalChars <= maxChars 且如实",
                intAt(me2, "totalChars") <= 900 && intAt(me2, "totalChars") == intAt(me2, "shownChars"));

        // ================= F. query_map 切片 + 不支持档如实拒绝 =================
        Map<String, Object> slice = data(core3.dispatch("query_map", params()));
        check("F1 query_map = query_state 的切片（有 map/scan，无 player/time）",
                slice.containsKey("map") && slice.containsKey("scan")
                        && !slice.containsKey("player") && !slice.containsKey("time"));

        FakeBridge fb = new FakeBridge();
        PlaytestCore core5 = new PlaytestCore(fb, evDir("f"), "tok");
        Map<String, Object> r5 = core5.dispatch("query_state", params());
        check("F2 未实现取值面的档 ⇒ STATE_MAP_UNSUPPORTED（不假装会画地图）",
                "STATE_MAP_UNSUPPORTED".equals(r5.get("code")));
        check("F3 query_map 同样如实拒绝", "STATE_MAP_UNSUPPORTED".equals(
                core5.dispatch("query_map", params()).get("code")));
        @SuppressWarnings("unchecked")
        List<String> un = (List<String>) core5.status().get("actionsUnavailable");
        check("F4 /status 把两条列进 actionsUnavailable",
                un.contains("query_state") && un.contains("query_map"));
        check("F5 能力自报：STATE_MAP 是 BRIDGE 的子集（不是第 3 张表）",
                Capabilities.BRIDGE.containsAll(Capabilities.STATE_MAP)
                        && Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());
        core5.onTick();
        check("F6 老档零开销：tick 不触发任何扫描",
                Boolean.FALSE.equals(core5.state().status().get("scanInProgress"))
                        && intAt(core5.state().status(), "scansCompleted") == 0);

        // ================= G. StateConfig：T3 的唯一接口 =================
        StateConfig cfg = new StateConfig();
        check("G1 默认半径 1 区块 ⇒ 48×48 格", cfg.chunkRadius == 1 && cfg.mapSideBlocks() == 48);
        check("G2 默认 step=1 / maxChars=12000（3×3 一上来不爆）",
                cfg.step == 1 && cfg.maxChars == 12000);
        Map<String, Object> j = cfg.toJson();
        j.put("chunkRadius", 4);
        j.put("maxChars", 500);
        j.put("includeHeight", Boolean.FALSE);
        j.put("playerMark", "@");
        StateConfig cfg2 = new StateConfig();
        cfg2.applyJson(j);
        check("G3 applyJson 回写旋钮（半径/上限/高度/玩家标记）",
                cfg2.chunkRadius == 4 && cfg2.maxChars == 500
                        && !cfg2.includeHeight && cfg2.playerMark == '@');
        check("G4 applyJson 后 side = (2*4+1)*16 = 144", cfg2.mapSideBlocks() == 144);
        StateConfig cfg3 = new StateConfig();
        cfg3.applyJson(Json.parseObject("{\"chunkRadius\":-3,\"step\":0,\"columnsPerTick\":0,\"maxChars\":1}"));
        check("G5 非法值被 sanitize（0/负数不许把扫描卡死）",
                cfg3.chunkRadius == 0 && cfg3.step == 1 && cfg3.columnsPerTick == 1 && cfg3.maxChars == 64);

        StateConfig cfg4 = new StateConfig();
        Map<String, Object> j4 = cfg4.toJson();
        j4.put("includeHeight", Boolean.FALSE);
        SyntheticWorldBridge b4 = new SyntheticWorldBridge();
        PlaytestCore core6 = new PlaytestCore(b4, evDir("g"), "tok");
        core6.state().config().applyJson(j4);
        data(core6.dispatch("query_state", params()));
        runTicks(core6, 18);
        Map<String, Object> m6 = mapAt(data(core6.dispatch("query_map", params())), "map");
        check("G6 includeHeight=false ⇒ cellWidth=1、每行 48 字（只有方块码）",
                intAt(m6, "cellWidth") == 1 && intAt(m6, "heightWidth") < 0
                        && String.valueOf(m6.get("grid")).split("\n", -1)[0].length() == 48);

        // ================= H. 回执契约：query_map / query_state 未变都带 schema（bug②） =================
        SyntheticWorldBridge b8 = new SyntheticWorldBridge();
        PlaytestCore core8 = new PlaytestCore(b8, evDir("h"), "tok");
        data(core8.dispatch("query_state", params()));
        runTicks(core8, 18);
        int v8 = intAt(mapAt(data(core8.dispatch("query_state", params())), "map"), "stateVersion");
        Map<String, Object> qmUnchanged = data(core8.dispatch("query_map", params("sinceVersion", v8)));
        Map<String, Object> qsUnchanged = data(core8.dispatch("query_state", params("sinceVersion", v8)));
        check("H1 query_map 未变回执带 schema（不再只是 unchanged/stateVersion/tick）",
                "bandd-state/1".equals(qmUnchanged.get("schema"))
                        && Boolean.TRUE.equals(qmUnchanged.get("unchanged")));
        check("H2 query_state 未变回执带同一个 schema（两边统一）",
                qmUnchanged.get("schema") != null && qmUnchanged.get("schema").equals(qsUnchanged.get("schema"))
                        && "bandd-state/1".equals(qsUnchanged.get("schema")));
        Map<String, Object> qmChanged = data(core8.dispatch("query_map", params()));
        check("H3 query_map 变成整张的那个分支也带 schema（两分支同契约）",
                "bandd-state/1".equals(qmChanged.get("schema")) && qmChanged.get("map") != null);

        // ================= I. legend 只广告本图真有的码（bug①） =================
        RareBlockBridge rb = new RareBlockBridge();
        PlaytestCore coreR = new PlaytestCore(rb, evDir("i"), "tok");
        data(coreR.dispatch("query_state", params()));
        runTicks(coreR, 18);
        Map<String, Object> ri = data(coreR.dispatch("query_map", params("step", 4)));
        Map<String, Object> rmap = mapAt(ri, "map");
        Map<String, Object> rlegend = mapAt(rmap, "legend");
        String rgrid = String.valueOf(rmap.get("grid"));
        java.util.Set<Character> rgc = gridCodeChars(rgrid, intAt(rmap, "cellWidth"));
        rgc.remove(Character.valueOf('+'));
        Object rareCode = legendUnusedCode(rmap, RareBlockBridge.RARE_ID);
        check("I1 整张快照里确实分配了 oak_fence 的码（这条才测得到点上）", rareCode != null);
        check("I2 降采样没采到它 ⇒ legend 不广告这个码（旧代码会广告）",
                !rlegend.containsValue(RareBlockBridge.RARE_ID));
        check("I3 它如实进 legendUnused（不等同于 grid 里的码）",
                rareCode != null && !rgc.contains(Character.valueOf(String.valueOf(rareCode).charAt(0))));
        check("I4 legend 与 grid 码集合互相闭合（legend 只含图里真出现的码）",
                rgc.containsAll(legendCodeChars(rlegend)) && legendCodeChars(rlegend).containsAll(rgc));
        check("I5 本图没有未知格 ⇒ legend 不含 '?'", !rlegend.containsKey("?"));
        System.out.println("  [sample] bug① 合成世界（x=-15 只放 oak_fence；step=4 采样列 = -16+4i，采不到它）：");
        System.out.println("      legend       = " + Json.of(rlegend));
        System.out.println("      legendUnused = " + Json.of(rmap.get("legendUnused")));

        // ================= J. step 边界：不静默（bug③） =================
        Map<String, Object> j0 = data(core8.dispatch("query_map", params("step", 0)));
        Map<String, Object> j0m = mapAt(j0, "map");
        check("J1 step=0 ⇒ 视为未指定并按自动规则，且如实回 stepNote/stepClampedTo（不再静默变 1）",
                intAt(j0m, "step") == 1 && j0.get("stepNote") != null && intAt(j0, "stepClampedTo") == 1);
        check("J2 step 诊断两处同值（地图头 == 回执顶层）",
                j0m.get("stepNote") != null && j0m.get("stepNote").equals(j0.get("stepNote")));
        Map<String, Object> jn = data(core8.dispatch("query_map", params("step", -2)));
        check("J3 step=-2 同样按未指定处理且不静默",
                intAt(mapAt(jn, "map"), "step") == 1 && jn.get("stepNote") != null
                        && intAt(jn, "stepClampedTo") == 1);
        Map<String, Object> j99 = data(core8.dispatch("query_map", params("step", 99)));
        Map<String, Object> j99m = mapAt(j99, "map");
        check("J4 step=99 被 maxAutoStep=4 夹住并如实回 stepClampedTo（不再出 1×1 退化图）",
                intAt(j99m, "step") == 4 && intAt(j99, "stepClampedTo") == 4
                        && intAt(j99m, "cols") == 12 && intAt(j99m, "rows") == 12);
        check("J5 step=99 的 stepNote 说明原因（写进头）",
                j99.get("stepNote") != null && String.valueOf(j99.get("stepNote")).contains("maxAutoStep"));
        Map<String, Object> jstep4 = data(core8.dispatch("query_map", params("step", 4)));
        check("J6 合法 step=4 逐字采纳（stepRequested=4），不谎报夹取",
                intAt(mapAt(jstep4, "map"), "step") == 4 && intAt(jstep4, "stepRequested") == 4
                        && jstep4.get("stepClampedTo") == null && jstep4.get("stepNote") == null);

        // ================= K. 会话码表「只追加」：换一格引入新 id ⇒ 其余格码一律不变（本轮 bug 的判据） =================
        PaletteShiftBridge pb = new PaletteShiftBridge();
        PlaytestCore coreK = new PlaytestCore(pb, evDir("k"), "tok");
        data(coreK.dispatch("query_state", params()));
        runTicks(coreK, 18);
        Map<String, Object> kA = mapAt(data(coreK.dispatch("query_map", params())), "map");
        int kEpochA = intAt(kA, "paletteEpoch");
        int kSizeA = intAt(kA, "paletteSize");

        pb.overrideX = 0;                                  // 把方块 (0,0) 那格换成「字典序更靠前」的新 id
        pb.overrideZ = 0;
        data(coreK.dispatch("query_map", params("refresh", Boolean.TRUE)));
        runTicks(coreK, 18);
        Map<String, Object> kB = mapAt(data(coreK.dispatch("query_map", params())), "map");

        List<String> kDiff = diffCodeCells(kA, kB);
        System.out.println("  [sample] bug：改 1 格引入新 id 后逐格对比 —— 变化格数 = " + kDiff.size() + " " + kDiff);
        System.out.println("  [sample] A legend = " + Json.of(mapAt(kA, "legend")));
        System.out.println("  [sample] B legend = " + Json.of(mapAt(kB, "legend")));
        check("K1 负控前提：新 id " + PaletteShiftBridge.NEW_ID + " 字典序**先于**旧 id ⇒ 旧实现必然整体位移",
                PaletteShiftBridge.NEW_ID.compareTo("minecraft:grass_block") < 0);
        check("K2 引入新 id 后，全图**只有被改那 1 格**的码变了（逐格对比，其余格一个都不许变）",
                kDiff.size() == 1);
        check("K3 变的那格正是被改的格 (col=16,row=32)（= 方块 (0,0)）",
                kDiff.size() == 1 && "(16,32)".equals(kDiff.get(0)));
        check("K4 paletteEpoch 不变（同一世代 ⇒ 码必须稳定）", intAt(kB, "paletteEpoch") == kEpochA);
        check("K5 两张图共同 id 的码逐字不变（legend + legendUnused 全查）", codesStable(kA, kB));
        String kNewCode = legendCodeForId(mapAt(kB, "legend"), PaletteShiftBridge.NEW_ID);
        check("K6 新 id 拿的是**本世代未用过**的新码，且 paletteSize 恰好 +1",
                kNewCode != null && !idToCodeOf(kA).containsValue(kNewCode)
                        && intAt(kB, "paletteSize") == kSizeA + 1);
        check("K7 头里的 paletteNote 自证「同一 epoch 内码不变」",
                String.valueOf(kB.get("paletteNote")).contains("同一 paletteEpoch 内"));

        // ================= L. 码位（52）用尽：新 id ⇒ legendOverflow + overflowCode，已有码不变 =================
        ManyIdsBridge mb2 = new ManyIdsBridge();
        PlaytestCore coreL = new PlaytestCore(mb2, evDir("l"), "tok");
        data(coreL.dispatch("query_state", params()));
        runTicks(coreL, 18);
        Map<String, Object> lA = mapAt(data(coreL.dispatch("query_map", params())), "map");
        check("L1 48×48 上恰好 52 种 id ⇒ 正好占满 52 个码位（paletteSize=52、capacity=52、无 overflow）",
                intAt(lA, "paletteSize") == 52 && intAt(lA, "paletteCapacity") == 52
                        && !lA.containsKey("legendOverflow"));
        mb2.overrideX = 0;
        mb2.overrideZ = 0;                                 // 第 53 种 id（字典序最靠前）
        data(coreL.dispatch("query_map", params("refresh", Boolean.TRUE)));
        runTicks(coreL, 18);
        Map<String, Object> lB = mapAt(data(coreL.dispatch("query_map", params())), "map");
        List<String> lDiff = diffCodeCells(lA, lB);
        System.out.println("  [sample] 码位用尽后引入新 id —— 变化格数 = " + lDiff.size() + " " + lDiff);
        System.out.println("  [sample] legendOverflow = " + Json.of(lB.get("legendOverflow")));
        check("L2 码位用尽后引入新 id：除被改那格外，其余格码一律不变（不回收、不重排）",
                lDiff.size() == 1 && "(16,32)".equals(lDiff.get(0)));
        check("L3 新 id 进 legendOverflow（如实点名）",
                legendOverflowIds(lB).contains(ManyIdsBridge.NEW_ID));
        check("L4 被改那格真的画的是 overflowCode '#'", "#".equals(gridCodeAt(lB, 16, 32)));
        check("L5 码位用尽后 paletteSize 不再增长、paletteEpoch 也不变（新 id 只溢出，不抢码）",
                intAt(lB, "paletteSize") == 52 && intAt(lB, "paletteEpoch") == intAt(lA, "paletteEpoch"));

        // ================= M. 重置边界：换维度 / open_world / join_server ⇒ 换世代；普通重扫不换 =================
        SyntheticWorldBridge bm = new SyntheticWorldBridge();
        PlaytestCore coreM = new PlaytestCore(bm, evDir("m"), "tok");
        data(coreM.dispatch("query_state", params()));
        runTicks(coreM, 18);
        Map<String, Object> mA = mapAt(data(coreM.dispatch("query_map", params())), "map");
        int mEpoch = intAt(mA, "paletteEpoch");
        check("M1 地图头带 paletteEpoch/paletteSize/paletteCapacity/paletteNote（可自证）",
                mEpoch >= 1 && intAt(mA, "paletteSize") > 0 && intAt(mA, "paletteCapacity") == 52
                        && mA.get("paletteNote") != null);
        data(coreM.dispatch("query_map", params("refresh", Boolean.TRUE)));
        runTicks(coreM, 18);
        check("M2 同一会话内 refresh 重扫**不换世代**（码稳定是常态）",
                intAt(mapAt(data(coreM.dispatch("query_map", params())), "map"), "paletteEpoch") == mEpoch);
        bm.dimension = "minecraft:the_nether";
        data(coreM.dispatch("query_map", params("refresh", Boolean.TRUE)));
        runTicks(coreM, 18);
        Map<String, Object> mM = mapAt(data(coreM.dispatch("query_map", params())), "map");
        check("M3 换维度 ⇒ paletteEpoch 自增（跨世界码不许张冠李戴）",
                intAt(mM, "paletteEpoch") > mEpoch && "minecraft:the_nether".equals(mM.get("dimension")));
        int mEpoch2 = intAt(mM, "paletteEpoch");
        Map<String, Object> owRaw = coreM.dispatch("open_world", params("world", "WorldB"));   // dispatch 顶层带 status
        check("M4 open_world ⇒ 立刻换世代 + 旧图作废（ready=false）",
                "ok".equals(owRaw.get("status")) && intAt(coreM.state().status(), "paletteEpoch") == mEpoch2 + 1
                        && Boolean.FALSE.equals(coreM.state().status().get("ready")));
        check("M5 open_world 后查询如实回 mapReady=false（不拿旧世界的图充数）",
                Boolean.FALSE.equals(data(coreM.dispatch("query_state", params())).get("mapReady")));
        int mEpoch3 = intAt(coreM.state().status(), "paletteEpoch");
        coreM.dispatch("join_server", params("address", "127.0.0.1:25565"));
        check("M6 join_server 也换世代（连别人的服务器 = 换世界）",
                intAt(coreM.state().status(), "paletteEpoch") == mEpoch3 + 1);

        // ================= N. 不回收：某 id 从图里消失再回来 ⇒ 还是原码，别的格也不动 =================
        PaletteShiftBridge nb = new PaletteShiftBridge();
        PlaytestCore coreN = new PlaytestCore(nb, evDir("n"), "tok");
        data(coreN.dispatch("query_state", params()));
        runTicks(coreN, 18);
        nb.overrideX = 0;
        nb.overrideZ = 0;
        data(coreN.dispatch("query_map", params("refresh", Boolean.TRUE)));
        runTicks(coreN, 18);
        Map<String, Object> nA = mapAt(data(coreN.dispatch("query_map", params())), "map");
        String nCodeA = legendCodeForId(mapAt(nA, "legend"), PaletteShiftBridge.NEW_ID);
        int nSizeA = intAt(nA, "paletteSize");
        nb.overrideX = Integer.MIN_VALUE;                  // 撤掉这一格 ⇒ 该 id 从本图消失
        nb.overrideZ = Integer.MIN_VALUE;
        data(coreN.dispatch("query_map", params("refresh", Boolean.TRUE)));
        runTicks(coreN, 18);
        Map<String, Object> nB = mapAt(data(coreN.dispatch("query_map", params())), "map");
        nb.overrideX = 0;                                  // 再放回去
        nb.overrideZ = 0;
        data(coreN.dispatch("query_map", params("refresh", Boolean.TRUE)));
        runTicks(coreN, 18);
        Map<String, Object> nC = mapAt(data(coreN.dispatch("query_map", params())), "map");
        String nCodeC = legendCodeForId(mapAt(nC, "legend"), PaletteShiftBridge.NEW_ID);
        check("N1 撤掉唯一的那格 ⇒ 只有那 1 格的码变，别的格一个不动", diffCodeCells(nA, nB).size() == 1);
        check("N2 该 id 从本图消失后不进 legend，但仍在 paletteSize 里（会话码表只追加）",
                legendCodeForId(mapAt(nB, "legend"), PaletteShiftBridge.NEW_ID) == null
                        && intAt(nB, "paletteSize") == nSizeA);
        check("N3 该 id 重新出现 ⇒ 拿回**原来那个码**（不回收、不重排）",
                nCodeA != null && nCodeA.equals(nCodeC));
        check("N4 A→C 全图码逐格完全一致（0 格变化）", diffCodeCells(nA, nC).isEmpty());

        System.out.println();
        System.out.println("=== state tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- helpers ----------------

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

    private static int intAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof Number) ? ((Number) v).intValue() : -1;
    }

    private static boolean allOneChar(Collection<String> keys) {
        for (String k : keys) if (k == null || k.length() != 1) return false;
        return true;
    }

    private static int countChar(String s, char c) {
        int n = 0;
        for (int i = 0; i < s.length(); i++) if (s.charAt(i) == c) n++;
        return n;
    }

    private static String repeat(char c, int n) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < n; i++) b.append(c);
        return b.toString();
    }

    /** 网格正文里处于「码位」（每格第 1 个字符）的字符集合。 */
    private static java.util.Set<Character> gridCodeChars(String grid, int cellW) {
        java.util.Set<Character> s = new HashSet<Character>();
        if (grid == null || cellW <= 0) return s;
        for (String line : grid.split("\n", -1)) {
            for (int i = 0; i + cellW <= line.length(); i += cellW) s.add(Character.valueOf(line.charAt(i)));
        }
        return s;
    }

    /** legend 的键（码）集合。 */
    private static java.util.Set<Character> legendCodeChars(Map<String, Object> legend) {
        java.util.Set<Character> s = new HashSet<Character>();
        for (Object k : legend.keySet()) {
            String ks = String.valueOf(k);
            if (ks.length() == 1) s.add(Character.valueOf(ks.charAt(0)));
        }
        return s;
    }

    /** legendUnused 里某 id 对应的码（没有 ⇒ null）。 */
    private static Object legendUnusedCode(Map<String, Object> map, String id) {
        Object v = map.get("legendUnused");
        if (!(v instanceof List)) return null;
        for (Object o : (List<?>) v) {
            if (o instanceof Map) {
                Map<?, ?> e = (Map<?, ?>) o;
                if (id.equals(String.valueOf(e.get("id")))) return e.get("code");
            }
        }
        return null;
    }

    /**
     * bug① 的取证世界：在**一条 step=4 渲染绝不会采到的列**上放一种只此一处的方块
     * （originX=-16，采样列 = -16+4i ⇒ x=-15 永远不被采）。整张快照会为它分配码，
     * 但渲染出来的 grid 里永远不出现它 —— 正是真机 fabric 图里 'P'(oak_fence) 的情形。
     */
    /**
     * 本轮 bug（**方块码跨扫描不稳定**）的取证世界：地形与 {@link SyntheticWorldBridge} 相同，
     * 但可以把**某一格**的地表方块换成 {@link #NEW_ID} —— 一个字典序**先于** grass/stone/snow 的新 id。
     * 旧实现（每次重扫按 id 升序重建码表）会因此把后面所有码整体 +1（真机 fabric 图 2248/2304 同形）。
     */
    static final class PaletteShiftBridge extends SyntheticWorldBridge {
        static final String NEW_ID = "minecraft:aaa_bedrock";
        public int overrideX = Integer.MIN_VALUE;
        public int overrideZ = Integer.MIN_VALUE;

        @Override public String blockAt(int x, int y, int z) {
            if (loadedAt(x, z) && x == overrideX && z == overrideZ && y == surfaceY(x, z)) {
                blockAtCalls++;
                return NEW_ID;
            }
            return super.blockAt(x, y, z);
        }
    }

    /**
     * **码位用尽**取证世界：48×48 格上给出**恰好 52 种** id（t00..t51，正好占满 A-Z a-z），
     * 并允许把方块 (0,0) 换成第 53 种 id（{@link #NEW_ID}，字典序最靠前 ⇒ 旧实现会整体重排）。
     *
     * <p>为什么 52 种：{@code idx = floorMod(x,48)*48 + floorMod(z,48)} 在 x∈[-16,31]、z∈[-32,15]
     * 上是一一映射（0..2303 各一次），{@code idx % 52} 恰好覆盖全部 52 个余数。
     */
    static final class ManyIdsBridge extends SyntheticWorldBridge {
        static final String NEW_ID = "minecraft:aaa53";
        public int overrideX = Integer.MIN_VALUE;
        public int overrideZ = Integer.MIN_VALUE;

        @Override public String blockAt(int x, int y, int z) {
            if (loadedAt(x, z) && y == surfaceY(x, z)) {
                blockAtCalls++;
                if (x == overrideX && z == overrideZ) return NEW_ID;
                int idx = Math.floorMod(x, 48) * 48 + Math.floorMod(z, 48);
                int n = idx % 52;
                return "minecraft:t" + (n < 10 ? "0" : "") + n;
            }
            return super.blockAt(x, y, z);
        }
    }

    static final class RareBlockBridge extends SyntheticWorldBridge {
        static final String RARE_ID = "minecraft:oak_fence";
        static final int RARE_X = -15;
        @Override public String blockAt(int x, int y, int z) {
            if (loadedAt(x, z) && x == RARE_X && y == surfaceY(x, z)) {
                blockAtCalls++;
                return RARE_ID;
            }
            return super.blockAt(x, y, z);
        }
    }

    /** 逐格对比两张图的**码位字符**（不比高度字段）：返回码不同的格 "(col,row)" 列表。 */
    private static List<String> diffCodeCells(Map<String, Object> a, Map<String, Object> b) {
        List<String> out = new ArrayList<String>();
        int cwA = intAt(a, "cellWidth");
        int cwB = intAt(b, "cellWidth");
        String[] la = String.valueOf(a.get("grid")).split("\n", -1);
        String[] lb = String.valueOf(b.get("grid")).split("\n", -1);
        if (cwA != cwB || cwA <= 0 || intAt(a, "cols") != intAt(b, "cols") || la.length != lb.length) {
            out.add("<shape-mismatch>");
            return out;
        }
        for (int j = 0; j < la.length; j++) {
            for (int i = 0; i < intAt(a, "cols"); i++) {
                int at = i * cwA;
                if (at >= la[j].length() || at >= lb[j].length()) { out.add("<short-row>"); continue; }
                if (la[j].charAt(at) != lb[j].charAt(at)) out.add("(" + i + "," + j + ")");
            }
        }
        return out;
    }

    /** 某张图 (col,row) 那格的码字符；取不到 ⇒ null。 */
    private static String gridCodeAt(Map<String, Object> map, int col, int row) {
        int cw = intAt(map, "cellWidth");
        String[] lines = String.valueOf(map.get("grid")).split("\n", -1);
        if (cw <= 0 || row < 0 || row >= lines.length) return null;
        int at = col * cw;
        if (at < 0 || at >= lines[row].length()) return null;
        return String.valueOf(lines[row].charAt(at));
    }

    /** legend（码→id）里某个 id 的码；没有 ⇒ null。 */
    private static String legendCodeForId(Map<String, Object> legend, String id) {
        for (Object k : legend.keySet()) {
            Object v = legend.get(k);
            if (v != null && id.equals(String.valueOf(v))) return String.valueOf(k);
        }
        return null;
    }

    /** 把 legend（码→id）与 legendUnused（[{code,id}]）合并成 id→码。 */
    private static Map<String, String> idToCodeOf(Map<String, Object> map) {
        Map<String, String> out = new LinkedHashMap<String, String>();
        Map<String, Object> lg = mapAt(map, "legend");
        for (Object k : lg.keySet()) {
            String code = String.valueOf(k);
            if (code.length() == 1) out.put(String.valueOf(lg.get(k)), code);
        }
        Object un = map.get("legendUnused");
        if (un instanceof List) {
            for (Object o : (List<?>) un) {
                if (o instanceof Map) {
                    Map<?, ?> e = (Map<?, ?>) o;
                    out.put(String.valueOf(e.get("id")), String.valueOf(e.get("code")));
                }
            }
        }
        return out;
    }

    /** 两张快照里**共同 id** 的码是否完全一致（码稳定性判据）。 */
    private static boolean codesStable(Map<String, Object> a, Map<String, Object> b) {
        Map<String, String> ia = idToCodeOf(a);
        Map<String, String> ib = idToCodeOf(b);
        for (Map.Entry<String, String> e : ia.entrySet()) {
            String other = ib.get(e.getKey());
            if (other != null && !other.equals(e.getValue())) return false;
        }
        return true;
    }

    /** 地图头 legendOverflow 里的 id 列表。 */
    private static List<String> legendOverflowIds(Map<String, Object> map) {
        List<String> out = new ArrayList<String>();
        Object v = map.get("legendOverflow");
        if (v instanceof List) {
            for (Object o : (List<?>) v) out.add(String.valueOf(o));
        }
        return out;
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
