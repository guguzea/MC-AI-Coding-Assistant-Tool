package com.bandd.playtest.test;

import com.bandd.playtest.core.GameStateService;
import com.bandd.playtest.core.Json;
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
 * [T14] **纵层 yMode**（{@code query_map} / {@code query_state} 的 yMode / yRange / yLayerMax /
 * yModeAuto / layersMaxChars）+ **地下自动切层** 的真测试：**合成世界** + 假桥，不需要 Minecraft。
 *
 * <p>跑法（工作目录任意；**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/state/testwork -cp out com.bandd.playtest.test.YLayerTest
 * </pre>
 * 与既有五套 / ColumnSearchTest **分开报数**（本类只加新判据，既有断言一条不改）。
 *
 * <p>这些判据是**真机判据 B①–⑦ 的合成世界对应物**：几何等式、交叉验证（层 vs query_column）、
 * fail-loud 减层、自动切层自证、以及「既有回执零新键」。
 */
public final class YLayerTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/state/testwork");
        base = Paths.get(dir, "run-yl-" + System.nanoTime());
        Files.createDirectories(base);

        // ================= A. 向后兼容：默认路径**零新键** =================
        SyntheticWorldBridge bA = new SyntheticWorldBridge();
        bA.py = 70.0;                     // 站在地表上（surfaceY(8,-8)=69 ⇒ depth=0）
        PlaytestCore coreA = fast(bA);
        data(coreA.dispatch("query_state", params()));
        runTicks(coreA, 3);
        Map<String, Object> mA = mapAt(data(coreA.dispatch("query_map", params())), "map");
        check("A1 站在地表 + 不给任何纵层参数 ⇒ 回执**一个新键都不加**（零 yMode / 零 layers）",
                mA.get("grid") != null && !mA.containsKey("yMode") && !mA.containsKey("layers")
                        && !mA.containsKey("layersIncluded"));
        Map<String, Object> stA = data(coreA.dispatch("query_state", params()));
        check("A2 站在地表上 ⇒ playerDepthBelowSurface 真的 = 0（自动切层判据不成立，如实读数）",
                stA.get("playerDepthBelowSurface") instanceof Number
                        && ((Number) stA.get("playerDepthBelowSurface")).doubleValue() == 0.0);

        Map<String, Object> mAs = mapAt(data(coreA.dispatch("query_map", params("yMode", "surface"))), "map");
        check("A3 显式 yMode=surface ⇒ 头里自证 surface + 不含层，且 **grid 与不带参数逐字相同**",
                "surface".equals(mAs.get("yMode")) && Boolean.FALSE.equals(mAs.get("layersIncluded"))
                        && !mAs.containsKey("layers")
                        && String.valueOf(mAs.get("grid")).equals(String.valueOf(mA.get("grid"))));
        check("A4 显式 surface 的 yModeReason 是**人话**（不是空串）",
                mAs.get("yModeReason") != null && String.valueOf(mAs.get("yModeReason")).length() > 6
                        && Boolean.FALSE.equals(mAs.get("yModeAutoSwitched")));
        check("A5 query_map 切片照旧（有 map/scan、无 player/time）",
                data(coreA.dispatch("query_map", params("yMode", "surface"))).containsKey("map")
                        && !data(coreA.dispatch("query_map", params())).containsKey("player"));

        // ================= B. player 纵层：几何 / 交叉验证 / 码表共用 =================
        SyntheticWorldBridge b = new SyntheticWorldBridge();     // py=65.0 ⇒ depth=5 ⇒ 地下
        PlaytestCore core = fast(b);
        data(core.dispatch("query_state", params()));
        runTicks(core, 3);
        Map<String, Object> map0 = mapAt(data(core.dispatch("query_map", params())), "map");
        String surfaceGridBefore = String.valueOf(map0.get("grid"));
        int versionBefore = intAt(map0, "stateVersion");

        Map<String, Object> first = mapAt(data(core.dispatch("query_map", yr("player", -2, 2))), "map");
        check("B1 第一次要 player 层 ⇒ 采样还没完 ⇒ layers=[] 且 layerScan.active=true（**不假装有层**）",
                upperList(first, "layers").isEmpty() && Boolean.TRUE.equals(mapAt(first, "layerScan").get("active"))
                        && intAt(first, "layersShown") == 0);
        runTicks(core, 3);
        Map<String, Object> m = mapAt(data(core.dispatch("query_map", yr("player", -2, 2))), "map");

        check("B2 player 模式：mode/baseY/range 自证（baseY = floor(玩家Y) = 65）",
                "player".equals(m.get("yMode")) && intAt(m, "yLayerBaseY") == 65
                        && intAt(mapAt(m, "yLayerRange"), "from") == -2 && intAt(mapAt(m, "yLayerRange"), "to") == 2);
        check("B3 layersRequested = 5 / layersScanned = 5 / layersShown = 5 / dropped=0 / omitted=0",
                intAt(m, "layersRequested") == 5 && intAt(m, "layersScanned") == 5
                        && intAt(m, "layersShown") == 5 && intAt(m, "layersDropped") == 0
                        && intAt(m, "layersOmitted") == 0 && Boolean.FALSE.equals(m.get("layerTruncated")));
        check("B4 层快照与请求对得上（layerSnapshotMatchesRequest=true）",
                Boolean.TRUE.equals(m.get("layerSnapshotMatchesRequest")));
        List<Map<String, Object>> L = upperList(m, "layers");
        check("B5 真有 5 张层网格", L.size() == 5);

        int cols = intAt(m, "cols"), rows = intAt(m, "rows"), cellW = intAt(m, "cellWidth");
        StringBuilder shapeBad = new StringBuilder();
        for (Map<String, Object> one : L) {
            if (intAt(one, "cols") != cols || intAt(one, "rows") != rows || intAt(one, "cellWidth") != cellW) {
                shapeBad.append("头:").append(one.get("y")).append(' ');
            }
            String[] ls = String.valueOf(one.get("grid")).split("\n", -1);
            if (ls.length != rows) { shapeBad.append("行数:").append(one.get("y")).append(' '); continue; }
            for (String line : ls) {
                if (line.length() != cols * cellW) { shapeBad.append("行宽:").append(one.get("y")).append(' '); break; }
            }
        }
        check("B6 **几何与 grid 一致**：每层 cols/rows/cellWidth 相同 + 每行长度 = cols×cellWidth =" + (cols * cellW)
                + "（坏：" + (shapeBad.length() == 0 ? "无" : shapeBad) + "）", shapeBad.length() == 0);
        check("B7 每层**标明绝对 y**，且 y = baseY + dy（63..67 升序）",
                intAt(L.get(0), "y") == 63 && intAt(L.get(4), "y") == 67
                        && intAt(L.get(2), "y") == 65 && intAt(L.get(2), "dy") == 0);
        check("B8 每层 cellWidth 与 grid 相同（同一套定宽口径）",
                intAt(L.get(0), "cellWidth") == cellW && intAt(L.get(0), "rowLength") == cols * cellW);

        // ---- 交叉验证：层里玩家那格的 id == 同一 x/z/y 的 blockAt 读数（= query_column 的读数）----
        int px = (int) Math.floor(b.px), pz = (int) Math.floor(b.pz);
        StringBuilder xBad = new StringBuilder();
        for (Map<String, Object> one : L) {
            int y = intAt(one, "y");
            String want = b.blockAt(px, y, pz);
            String got = one.get("playerCellId") == null ? null : String.valueOf(one.get("playerCellId"));
            if (want == null ? got != null : !want.equals(got)) {
                xBad.append("y=").append(y).append(" want=").append(want).append(" got=").append(got).append(';');
            }
        }
        check("B9 **交叉验证**：每层 playerCellId == blockAt(px,layer.y,pz)（dy=0 那层 = 65 层）"
                + (xBad.length() == 0 ? "" : " 坏：" + xBad), xBad.length() == 0);
        Map<String, Object> col65 = data(core.dispatch("query_column",
                params("x", px, "z", pz, "y1", 65, "y2", 65)));
        String colId = String.valueOf(((Map<?, ?>) ((List<?>) col65.get("blocks")).get(0)).get("id"));
        check("B10 **与 query_column 同源**：query_column(x,z,65..65).blocks[0].id == dy=0 层的 playerCellId",
                colId.equals(String.valueOf(L.get(2).get("playerCellId"))));
        check("B11 层网格**不画玩家标记**（'+' 会盖住玩家脚下那一格的读数）",
                countChar(String.valueOf(L.get(2).get("grid")), '+') == 0
                        && countChar(String.valueOf(L.get(0).get("grid")), '+') == 0);

        // ---- 码表共用 + legend 语义未动 ----
        Map<String, Object> legend = mapAt(m, "legend");
        Map<String, Object> llegend = mapAt(m, "layerLegend");
        check("B12 **既有 legend 语义一字未动**：它仍只列 grid 里真出现的码（不含 air）",
                !legend.containsValue("minecraft:air"));
        check("B13 layerLegend 是各层并集 ⇒ 含 minecraft:air（洞 / 头顶就靠它看）",
                llegend.containsValue("minecraft:air") && llegend.size() > 0);
        check("B14 码表共用：stone 在 legend 与 layerLegend 里是**同一个码**（同一 id ⇒ 同一码）",
                codeOf(legend, "minecraft:stone") != null
                        && codeOf(legend, "minecraft:stone").equals(codeOf(llegend, "minecraft:stone")));
        check("B15 paletteSize 口径未动（仍只数地表图发过的码）而 layerPaletteSize 自报纵层尾巴",
                intAt(m, "paletteSize") > 0 && intAt(m, "paletteSize") == intAt(map0, "paletteSize")
                        && mapAt(core.status(), "yLayer") != null);
        check("B16 纵层**不动 stateVersion**（纵层是另一层读数，不是新版本的图）",
                intAt(m, "stateVersion") == versionBefore);
        check("B17 **纵层打开后 grid 逐字不变**（同一次地图快照）",
                surfaceGridBefore.equals(String.valueOf(m.get("grid"))));
        check("B18 头里带 layerLegendNote / yLayerScanNote / layerNote（口径不靠猜）",
                m.get("layerLegendNote") != null && m.get("yLayerScanNote") != null && m.get("layerNote") != null);

        // ================= C. fail-loud：减层 / 夹上限 / 截断 =================
        Map<String, Object> big = mapAt(data(core.dispatch("query_map", yr("player", -32, 32))), "map");
        runTicks(core, 3);
        big = mapAt(data(core.dispatch("query_map", yr("player", -32, 32))), "map");
        check("C1 要 65 层 ⇒ **明说减层**：layersRequested=65 > layersScanned=" + intAt(big, "layersScanned")
                + "，layersDropped=" + intAt(big, "layersDropped") + " > 0",
                intAt(big, "layersRequested") == 65 && intAt(big, "layersScanned") == GameStateService.Y_LAYER_MAX_DEFAULT
                        && intAt(big, "layersDropped") == 65 - GameStateService.Y_LAYER_MAX_DEFAULT);
        check("C2 减层**有 note 且是人话**（不是静默丢）",
                big.get("layersDroppedNote") != null
                        && String.valueOf(big.get("layersDroppedNote")).contains("没采")
                        && Boolean.TRUE.equals(big.get("layerTruncated")));
        check("C3 减层后仍然「玩家那一层 dy=0」在采样列表里（65）",
                hasLayerY(big, 65));
        Map<String, Object> clamped = mapAt(data(core.dispatch("query_map",
                params("yMode", "player", "yRange", Arrays.asList(Integer.valueOf(-2), Integer.valueOf(2)),
                        "yLayerMax", Integer.valueOf(99)))), "map");
        check("C4 yLayerMax=99 超硬上限 ⇒ 夹到 " + GameStateService.Y_LAYER_HARD_MAX + " 并如实回 yLayerMaxRequested + note",
                intAt(clamped, "yLayerMax") == GameStateService.Y_LAYER_HARD_MAX
                        && intAt(clamped, "yLayerMaxRequested") == 99 && clamped.get("yLayerMaxNote") != null);
        Map<String, Object> tight = mapAt(data(core.dispatch("query_map",
                params("yMode", "player", "yRange", Arrays.asList(Integer.valueOf(-2), Integer.valueOf(2)),
                        "layersMaxChars", Integer.valueOf(1600)))), "map");
        check("C5 渲染字符预算不够 ⇒ layersShown=" + intAt(tight, "layersShown") + " < layersScanned="
                + intAt(tight, "layersScanned") + "，layersOmitted>0 且 note 明说",
                intAt(tight, "layersShown") < intAt(tight, "layersScanned") && intAt(tight, "layersOmitted") > 0
                        && tight.get("layersOmittedNote") != null
                        && Boolean.TRUE.equals(tight.get("layerTruncated")));
        check("C6 预算掐到 0 层 ⇒ layers=[] 但 **layersScanned 仍如实**（不是假装没这回事）",
                intAt(mapAt(data(core.dispatch("query_map",
                        params("yMode", "player", "yRange", Arrays.asList(Integer.valueOf(-2), Integer.valueOf(2)),
                                "layersMaxChars", Integer.valueOf(100)))), "map"), "layersShown") == 0);

        // ---- 参数形状错 ⇒ BAD_REQUEST（不静默）----
        check("C7 yMode 值非法 ⇒ BAD_REQUEST（不静默当 surface）",
                "BAD_REQUEST".equals(core.dispatch("query_map", params("yMode", "sideways")).get("code")));
        check("C8 absolute 不给 yRange / y1+y2 ⇒ BAD_REQUEST（不猜世界高度）",
                "BAD_REQUEST".equals(core.dispatch("query_map", params("yMode", "absolute")).get("code")));
        check("C9 yRange 形状错（abc）⇒ BAD_REQUEST",
                "BAD_REQUEST".equals(core.dispatch("query_map",
                        params("yMode", "player", "yRange", "abc")).get("code")));
        check("C10 yRange 非整值（1.5）⇒ BAD_REQUEST（不静默取整）",
                "BAD_REQUEST".equals(core.dispatch("query_map",
                        params("yMode", "player", "yRange", Arrays.asList(Double.valueOf(-1.5), Double.valueOf(2.0))))
                        .get("code")));
        Map<String, Object> wide = mapAt(data(core.dispatch("query_map", yr("player", -5000, 5000))), "map");
        check("C11 层跨度超硬上限 ⇒ 夹窄到 " + GameStateService.Y_RANGE_HARD_SPAN + " 并回 yRangeClampNote（不静默）",
                intAt(mapAt(wide, "yLayerRange"), "count") == GameStateService.Y_RANGE_HARD_SPAN
                        && wide.get("yRangeClampNote") != null);

        // ================= D. 地下自动切层（**必须自证**） =================
        SyntheticWorldBridge bd = new SyntheticWorldBridge();     // py=65 ⇒ depth=5
        PlaytestCore coreD = fast(bd);
        data(coreD.dispatch("query_state", params()));
        runTicks(coreD, 3);
        Map<String, Object> auto1 = mapAt(data(coreD.dispatch("query_map", params())), "map");
        check("D1 地下 + **不给 yMode** ⇒ 头里 yModeAutoSwitched=true + yMode=player + 人话 reason",
                Boolean.TRUE.equals(auto1.get("yModeAutoSwitched")) && "player".equals(auto1.get("yMode"))
                        && auto1.get("yModeReason") != null
                        && String.valueOf(auto1.get("yModeReason")).contains("playerDepthBelowSurface")
                        && String.valueOf(auto1.get("yModeReason")).contains("自动"));
        check("D2 自动切层**真的换到 player 层**（不是只写个标记）：采完后 layers 非空",
                waitLayers(coreD) && !upperList(mapAt(data(coreD.dispatch("query_map", params())), "map"), "layers").isEmpty());
        Map<String, Object> autoOff = mapAt(data(coreD.dispatch("query_map", params("yModeAuto", Boolean.FALSE))), "map");
        check("D3 yModeAuto=false ⇒ **显式关掉**自动切层：回到 surface、且如实说明",
                "surface".equals(autoOff.get("yMode")) && Boolean.FALSE.equals(autoOff.get("yModeAutoSwitched"))
                        && Boolean.FALSE.equals(autoOff.get("layersIncluded")) && !autoOff.containsKey("layers"));
        check("D4 关掉自动切层时 grid 与自动切层那次**逐字相同**（grid 永远是同一张地表图）",
                String.valueOf(autoOff.get("grid"))
                        .equals(String.valueOf(mapAt(data(coreD.dispatch("query_map", params())), "map").get("grid"))));
        Map<String, Object> exp = mapAt(data(coreD.dispatch("query_map", params("yMode", "player"))), "map");
        check("D5 显式给 yMode 时不谎报自动切层（yModeRequested=player / autoSwitched=false）",
                "player".equals(exp.get("yModeRequested")) && Boolean.FALSE.equals(exp.get("yModeAutoSwitched")));
        SyntheticWorldBridge bs = new SyntheticWorldBridge();
        bs.py = 70.0;                                            // 地表上
        PlaytestCore coreS = fast(bs);
        data(coreS.dispatch("query_state", params()));
        runTicks(coreS, 3);
        Map<String, Object> onSurf = mapAt(data(coreS.dispatch("query_map", params())), "map");
        check("D6 站在地表上 + 不给参数 ⇒ 不切层且**零新键**（默认路径完全不变）",
                !onSurf.containsKey("yMode") && !onSurf.containsKey("layers"));

        // ================= E. absolute 模式 =================
        Map<String, Object> a1 = mapAt(data(core.dispatch("query_map",
                params("yMode", "absolute", "yRange", Arrays.asList(Integer.valueOf(63), Integer.valueOf(67))))), "map");
        runTicks(core, 3);
        a1 = mapAt(data(core.dispatch("query_map",
                params("yMode", "absolute", "yRange", Arrays.asList(Integer.valueOf(63), Integer.valueOf(67))))), "map");
        check("E1 absolute：baseY=0、层 y 就是绝对 Y（63..67），dy 与之相同",
                "absolute".equals(a1.get("yMode")) && intAt(a1, "yLayerBaseY") == 0
                        && hasLayerY(a1, 63) && hasLayerY(a1, 67) && intAt(upperList(a1, "layers").get(0), "dy") == 63);
        StringBuilder eBad = new StringBuilder();
        for (Map<String, Object> one : upperList(a1, "layers")) {
            int y = intAt(one, "y");
            String want = b.blockAt(px, y, pz);
            if (want == null ? one.get("playerCellId") != null : !want.equals(String.valueOf(one.get("playerCellId")))) {
                eBad.append(y).append(' ');
            }
        }
        check("E2 absolute 同样与 blockAt 交叉验证一致" + (eBad.length() == 0 ? "" : " 坏：" + eBad), eBad.length() == 0);
        Map<String, Object> a2 = mapAt(data(core.dispatch("query_map",
                params("yMode", "absolute", "y1", 63, "y2", 67))), "map");
        check("E3 absolute 也吃 y1+y2 别名", intAt(mapAt(a2, "yLayerRange"), "from") == 63
                && intAt(mapAt(a2, "yLayerRange"), "to") == 67);
        Map<String, Object> a3 = mapAt(data(core.dispatch("query_map",
                params("yMode", "absolute", "yRange", "63..67"))), "map");
        check("E4 absolute 也吃 \"a..b\" 字符串形式", intAt(mapAt(a3, "yLayerRange"), "count") == 5);

        // ================= F. 分帧预算 / 不与地图扫描互相干扰 =================
        SyntheticWorldBridge bf = new SyntheticWorldBridge();
        PlaytestCore coreF = new PlaytestCore(bf, evDir("f"), "tok");     // 默认：chunkRadius=1（48×48）、128 格/tick
        data(coreF.dispatch("query_state", params()));
        runTicks(coreF, 20);
        int before = bf.blockAtCalls;
        data(coreF.dispatch("query_map", yr("player", -2, 2)));            // arm：5×2304 = 11520 格
        coreF.onTick();
        Map<String, Object> fs = mapAt(mapAt(data(coreF.dispatch("query_map", yr("player", -2, 2))), "map"), "layerScan");
        check("F1 一 tick 只推进一帧预算：doneCells=" + intAt(fs, "doneCells") + " ≤ columnsPerTick="
                + coreF.state().config().columnsPerTick + "（绝不一 tick 全采）",
                intAt(fs, "doneCells") > 0 && intAt(fs, "doneCells") <= coreF.state().config().columnsPerTick);
        check("F2 纵层采样同样只花分帧预算（这一 tick 的 blockAt 增量 = 层采样格数）",
                bf.blockAtCalls - before <= 2 * coreF.state().config().columnsPerTick);
        runTicks(coreF, 2);
        check("F3 分帧采样期间**不发布半成品**：layerSnapshot 要么没有、要么是采完的整份",
                !Boolean.TRUE.equals(mapAt(data(coreF.dispatch("query_map", yr("player", -2, 2))), "map")
                        .get("layerSnapshotMatchesRequest"))
                        || upperList(mapAt(data(coreF.dispatch("query_map", yr("player", -2, 2))), "map"), "layers").size() == 5);

        System.out.println();
        System.out.println("=== ylayer tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- helpers ----------------

    /** 一份「小地图 + 一帧采完」的核：16×16 / 每 tick 4096 格 ⇒ 测试跑得快。 */
    private static PlaytestCore fast(SyntheticWorldBridge b) throws Exception {
        PlaytestCore core = new PlaytestCore(b, evDir("yl-" + System.nanoTime()), "tok");
        core.state().config().chunkRadius = 0;
        core.state().config().columnsPerTick = 4096;
        return core;
    }

    private static Map<String, Object> yr(String mode, int a, int bb) {
        return params("yMode", mode, "yRange", Arrays.asList(Integer.valueOf(a), Integer.valueOf(bb)));
    }

    /** 反复 tick 直到纵层快照与请求对上（有界：最多 40 tick），回 true 表示等到了。 */
    private static boolean waitLayers(PlaytestCore core) {
        for (int i = 0; i < 40; i++) {
            Map<String, Object> m = mapAt(data(core.dispatch("query_map", params())), "map");
            if (Boolean.TRUE.equals(m.get("layerSnapshotMatchesRequest"))
                    && !upperList(m, "layers").isEmpty()) return true;
            core.onTick();
        }
        return false;
    }

    private static boolean hasLayerY(Map<String, Object> m, int y) {
        for (Map<String, Object> one : upperList(m, "layers")) if (intAt(one, "y") == y) return true;
        return false;
    }

    private static String codeOf(Map<String, Object> legend, String id) {
        for (Map.Entry<String, Object> e : legend.entrySet()) {
            if (id.equals(String.valueOf(e.getValue()))) return e.getKey();
        }
        return null;
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
    private static List<Map<String, Object>> upperList(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        List<Map<String, Object>> out = new ArrayList<Map<String, Object>>();
        if (v instanceof List) {
            for (Object o : (List<?>) v) {
                if (o instanceof Map) out.add((Map<String, Object>) o);
            }
        }
        return out;
    }

    private static int intAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return (v instanceof Number) ? ((Number) v).intValue() : -1;
    }

    private static int countChar(String s, char c) {
        int n = 0;
        for (int i = 0; s != null && i < s.length(); i++) if (s.charAt(i) == c) n++;
        return n;
    }

    private static void check(String name, boolean ok) {
        if (ok) { pass++; System.out.println("  [PASS] " + name); }
        else { fail++; System.out.println("  [FAIL] " + name); }
    }
}
