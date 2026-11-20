package com.bandd.playtest.test;

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
 * [T16-①] **void_air 坑**的真测试（合成世界，不需要 Minecraft）：
 * 客户端在**未加载区块**回的不是 null，而是 {@code minecraft:void_air} 且 {@code topSolidY=-65}
 * ⇒ core 必须把该格判**未知**（unknownCode + 高度 '?'），**不进 legend**，也不当地表方块画。
 *
 * <p>与既有七套**分开报数**；本类只加新判据。
 *
 * <p>负控：把 {@code GameStateService#scanSlice} 里的 void_air / 建高下限判据去掉 ⇒ 本类 V1/V2
 * 必须真红（见交付报告的两次负控读数）。
 */
public final class T16VoidAirTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t16/testwork");
        base = Paths.get(dir, "voidair-" + System.nanoTime());
        Files.createDirectories(base);

        // ================= V. void_air（未加载区）⇒ 未知格、不进 legend =================
        VoidAirBridge b = new VoidAirBridge();
        // chunkRadius=0 ⇒ 图 = 玩家所在区块 16×16，origin.x = floor(8/16)*16 = 0
        // ⇒ 第 0..7 列（x=0..7）是 void_air，第 8..15 列已加载（玩家在 col 8）
        b.voidBelowX = 8;
        PlaytestCore core = fast(b);
        data(core.dispatch("query_state", params()));
        runTicks(core, 3);
        Map<String, Object> m = mapAt(data(core.dispatch("query_state", params())), "map");
        int cw = intAt(m, "cellWidth");
        String[] lines = String.valueOf(m.get("grid")).split("\n", -1);

        check("V1 void_air 列（x=-16）画**未知码 '?'**（不是某个方块码）",
                lines[0].substring(0, cw).equals("?" + repeat('?', cw - 1)));
        check("V2 void_air 列的高度字段也如实是 '?'（topSolidY=-65 本身不许当地表）",
                lines[0].charAt(1) == '?');
        Map<String, Object> legend = mapAt(m, "legend");
        check("V3 **legend 不含 minecraft:void_air**（未加载区不许进图例）",
                !legend.containsValue("minecraft:void_air"));
        check("V4 有未知格 ⇒ legend 如实列未知码 '?'（另一方向）", legend.containsKey("?"));
        check("V5 地图头如实自证：voidAirUnknownBlocks>0 + voidAirUnknownNote 人话",
                intAt(m, "voidAirUnknownBlocks") > 0 && m.get("voidAirUnknownNote") != null
                        && String.valueOf(m.get("voidAirUnknownNote")).contains("void_air"));
        check("V6 已加载列**不受影响**：第 9 列（x=9）仍画正常方块码，legend 仍有地表方块",
                lines[0].charAt(9 * cw) != '?' && legend.size() > 1
                        && (legend.containsValue("minecraft:stone") || legend.containsValue("minecraft:grass_block")));

        // 全加载的默认图：一个 '?' 都没有、也没有 voidAirUnknownBlocks 键（逐字不变的旁证）
        SyntheticWorldBridge clean = new SyntheticWorldBridge();
        PlaytestCore cleanCore = fast(clean);
        data(cleanCore.dispatch("query_state", params()));
        runTicks(cleanCore, 3);
        Map<String, Object> mc = mapAt(data(cleanCore.dispatch("query_state", params())), "map");
        check("V7 全加载的默认图：无 '?'、无 voidAirUnknownBlocks 键（改动只影响未加载区）",
                !mapAt(mc, "legend").containsKey("?") && !mc.containsKey("voidAirUnknownBlocks"));

        // ================= V8. 纵层里同样：void_air ⇒ '?'、不进 layerLegend =================
        PlaytestCore core2 = fast(b);
        data(core2.dispatch("query_state", params()));
        runTicks(core2, 3);
        Map<String, Object> lyr = mapAt(data(core2.dispatch("query_map",
                params("yMode", "absolute", "yRange", java.util.Arrays.asList(Integer.valueOf(64), Integer.valueOf(66))))), "map");
        runTicks(core2, 3);
        lyr = mapAt(data(core2.dispatch("query_map",
                params("yMode", "absolute", "yRange", java.util.Arrays.asList(Integer.valueOf(64), Integer.valueOf(66))))), "map");
        List<Map<String, Object>> layers = upperList(lyr, "layers");
        Map<String, Object> llegend = mapAt(lyr, "layerLegend");
        boolean anyUnknown = false;
        for (Map<String, Object> one : layers) {
            if (String.valueOf(one.get("grid")).indexOf('?') >= 0) anyUnknown = true;
        }
        check("V8 纵层快照里 void_air 区同样画 '?'（层数=" + layers.size() + "）",
                !layers.isEmpty() && anyUnknown && !llegend.containsValue("minecraft:void_air"));

        System.out.println();
        System.out.println("=== t16 void_air tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- 合成桥：未加载区回 void_air / topSolidY=-65（真机形状） ----------------

    private static final class VoidAirBridge extends SyntheticWorldBridge {
        /** x < 此值的列：topSolidY=-65、blockAt=minecraft:void_air（**不是 null**，真机形状）。 */
        public int voidBelowX = Integer.MIN_VALUE;

        @Override
        public int topSolidY(int x, int z) {
            if (x < voidBelowX) return -65;
            return super.topSolidY(x, z);
        }

        @Override
        public String blockAt(int x, int y, int z) {
            if (x < voidBelowX) return "minecraft:void_air";
            return super.blockAt(x, y, z);
        }
    }

    // ---------------- helpers ----------------

    private static PlaytestCore fast(SyntheticWorldBridge b) throws Exception {
        PlaytestCore core = new PlaytestCore(b, evDir("va-" + System.nanoTime()), "tok");
        core.state().config().chunkRadius = 0;
        core.state().config().columnsPerTick = 4096;
        return core;
    }

    private static void runTicks(PlaytestCore core, int n) {
        for (int i = 0; i < n; i++) core.onTick();
    }

    private static Path evDir(String tag) throws Exception {
        Path p = base.resolve("ev-" + tag);
        Files.createDirectories(p);
        return p;
    }

    private static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        for (int i = 0; i + 1 < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
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
        return v instanceof Map ? (Map<String, Object>) v : new LinkedHashMap<String, Object>();
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> upperList(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        List<Map<String, Object>> out = new ArrayList<Map<String, Object>>();
        if (v instanceof List) for (Object o : (List<?>) v) if (o instanceof Map) out.add((Map<String, Object>) o);
        return out;
    }

    private static int intAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return v instanceof Number ? ((Number) v).intValue() : Integer.MIN_VALUE;
    }

    private static String repeat(char c, int n) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < n; i++) b.append(c);
        return b.toString();
    }

    private static void check(String name, boolean ok) {
        if (ok) { pass++; System.out.println("[PASS] " + name); }
        else { fail++; System.out.println("[FAIL] " + name); }
    }
}
