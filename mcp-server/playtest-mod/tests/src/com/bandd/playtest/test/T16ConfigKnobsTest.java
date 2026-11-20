package com.bandd.playtest.test;

import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.core.Settings;
import com.bandd.playtest.core.SettingsEdit;
import com.bandd.playtest.core.StateConfig;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * [T16-②] **纵层四旋钮**（{@code yModeAuto} / {@code yModeAutoDepth} / {@code yLayerMax} /
 * {@code yAutoRange}）的真测试：默认值 / 越界拒绝 / settings_set 生效 / settings_save 落盘 /
 * **它们真的影响纵层行为**。
 *
 * <p>与既有七套**分开报数**；本类只加新判据。
 */
public final class T16ConfigKnobsTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t16/testwork");
        base = Paths.get(dir, "knobs-" + System.nanoTime());
        Files.createDirectories(base);

        // ================= K. 默认值 / 白名单 / 越界拒绝 =================
        StateConfig d = new StateConfig();
        check("K1 默认值：yModeAuto=true / yModeAutoDepth=3 / yLayerMax=8 / yAutoRange=2",
                d.yModeAuto && d.yModeAutoDepth == 3 && d.yLayerMax == 8 && d.yAutoRange == 2);
        check("K2 四个键都在 SettingsEdit 白名单里（17 键）",
                SettingsEdit.known("yModeAuto") && SettingsEdit.known("yModeAutoDepth")
                        && SettingsEdit.known("yLayerMax") && SettingsEdit.known("yAutoRange")
                        && SettingsEdit.KEYS.size() == 17);

        Path f1 = base.resolve("cfg1").resolve("bandd_playtest.json");
        Files.createDirectories(f1.getParent());
        final String token = "deadbeefcafe0123456789abcdef0123";
        Files.write(f1, ("{\"token\":\"" + token + "\",\"port\":38085,\"state\":{\"chunkRadius\":0}}")
                .getBytes(StandardCharsets.UTF_8));
        Settings s1 = Settings.load(f1);
        KnobBridge b1 = new KnobBridge();
        PlaytestCore core = new PlaytestCore(b1, evDir("k1"), token, s1);
        // 让状态器立刻可用：小图 + 一帧采完
        core.state().config().chunkRadius = 0;
        core.state().config().columnsPerTick = 4096;

        check("K3 settings_set 越界：yLayerMax=17 ⇒ SETTINGS_BAD_VALUE + 人话区间 1..16",
                bad(core, "yLayerMax", Double.valueOf(17), "1..16"));
        check("K4 settings_set 越界：yModeAutoDepth=0 ⇒ BAD_VALUE + 1..256",
                bad(core, "yModeAutoDepth", Double.valueOf(0), "1..256"));
        check("K5 settings_set 越界：yAutoRange=65 ⇒ BAD_VALUE + 0..64",
                bad(core, "yAutoRange", Double.valueOf(65), "0..64"));
        check("K6 布尔键 yModeAuto 收 \"notabool\" ⇒ BAD_VALUE",
                SettingsEdit.BAD_VALUE.equals(core.dispatch("settings_set",
                        params("key", "yModeAuto", "value", "notabool")).get("code")));
        check("K7 越界被拒后内存值没变（yLayerMax 仍 8，不静默夹回）", core.settings().config().yLayerMax == 8);

        Map<String, Object> set1 = core.dispatch("settings_set", params("key", "yLayerMax", "value", Double.valueOf(4)));
        check("K8 settings_set yLayerMax=4 ⇒ ok、applied=true、value=4、changedKeys=[yLayerMax]",
                "ok".equals(set1.get("status")) && Boolean.TRUE.equals(data(set1).get("applied"))
                        && intAt(data(set1), "value") == 4
                        && strList(data(set1).get("changedKeys")).equals(Arrays.asList("yLayerMax")));
        check("K9 /status 的 keys 段含这 4 个键且默认值与源码一致",
                keysState(core).size() == 17 && keysState(core).containsKey("yModeAuto")
                        && keysState(core).containsKey("yModeAutoDepth") && keysState(core).containsKey("yLayerMax")
                        && keysState(core).containsKey("yAutoRange")
                        && Boolean.TRUE.equals(new StateConfig().toJson().get("yModeAuto")));

        // ================= L. 落盘：文件真变、port/token 逐字不变 =================
        core.dispatch("settings_set", params("key", "yModeAuto", "value", Boolean.FALSE));
        Map<String, Object> save = core.dispatch("settings_save", new LinkedHashMap<String, Object>());
        check("L1 settings_save ⇒ saved=true、changedKeys 含 yModeAuto",
                Boolean.TRUE.equals(data(save).get("saved"))
                        && strList(data(save).get("changedKeys")).contains("yModeAuto"));
        Settings back = Settings.load(f1);
        check("L2 重新 load ⇒ yAutoRange=2 / yLayerMax=4 / yModeAuto=false / yModeAutoDepth=3 真往返",
                back.config().yAutoRange == 2 && back.config().yLayerMax == 4
                        && !back.config().yModeAuto && back.config().yModeAutoDepth == 3);
        String after = new String(Files.readAllBytes(f1), StandardCharsets.UTF_8);
        Map<String, Object> re = Json.parseObject(after);
        check("L3 port 与 token 逐字不变（38085 + 原 token）",
                token.equals(String.valueOf(re.get("token")))
                        && re.get("port") instanceof Number && ((Number) re.get("port")).longValue() == 38085L);

        // ================= M. 真的影响纵层行为 =================
        // 用一份干净配置：默认 yModeAuto=true ⇒ 地下自动切层（py=65 ⇒ 地表 69+1=70 ⇒ depth=5）
        Settings cleanS = Settings.of(base.resolve("clean.json"), new LinkedHashMap<String, Object>());
        KnobBridge b3 = new KnobBridge();
        PlaytestCore c3 = fresh(b3, cleanS);
        data(c3.dispatch("query_state", params()));
        runTicks(c3, 3);
        Map<String, Object> on = mapAt(data(c3.dispatch("query_map", params())), "map");
        check("M2 默认 yModeAuto=true + 地下 ⇒ 自动切层：yModeAutoSwitched=true + yMode=player",
                Boolean.TRUE.equals(on.get("yModeAutoSwitched")) && "player".equals(on.get("yMode")));
        c3.dispatch("settings_set", params("key", "yModeAuto", "value", Boolean.FALSE));
        runTicks(c3, 3);
        Map<String, Object> off = mapAt(data(c3.dispatch("query_map", params())), "map");
        check("M3 把 yModeAuto 关掉（settings_set）⇒ 头里 yModeAutoSwitched=false、yMode=surface、不含 layers",
                Boolean.FALSE.equals(off.get("yModeAutoSwitched")) && "surface".equals(off.get("yMode"))
                        && Boolean.FALSE.equals(off.get("layersIncluded")) && !off.containsKey("layers"));
        check("M4 关掉自动切层的 reason 点名「配置 yModeAuto=false」",
                String.valueOf(off.get("yModeReason")).contains("yModeAuto=false"));

        // M5 yModeAutoDepth 真的用配置值：门槛调到 99 ⇒ 不切；调到 1 ⇒ 切
        Settings dS = Settings.of(base.resolve("depth.json"), new LinkedHashMap<String, Object>());
        KnobBridge b4 = new KnobBridge();
        PlaytestCore c4 = fresh(b4, dS);
        c4.dispatch("settings_set", params("key", "yModeAutoDepth", "value", Double.valueOf(99)));
        data(c4.dispatch("query_state", params()));
        runTicks(c4, 3);
        Map<String, Object> noAuto = mapAt(data(c4.dispatch("query_map", params())), "map");
        check("M5 yModeAutoDepth=99（> depth 5）⇒ 不自动切层（无 yMode 块 / 无 layers）",
                !noAuto.containsKey("yMode") && !noAuto.containsKey("layers"));
        c4.dispatch("settings_set", params("key", "yModeAutoDepth", "value", Double.valueOf(1)));
        runTicks(c4, 3);
        Map<String, Object> yesAuto = mapAt(data(c4.dispatch("query_map", params())), "map");
        check("M6 yModeAutoDepth=1（≤ depth 5）⇒ 自动切层（yModeAutoSwitched=true）",
                Boolean.TRUE.equals(yesAuto.get("yModeAutoSwitched")));

        // M7 yAutoRange 真的用配置值：设为 0 ⇒ 默认 dy 区间 = [0,0] ⇒ layersRequested=1
        Settings rS = Settings.of(base.resolve("range.json"), new LinkedHashMap<String, Object>());
        KnobBridge b5 = new KnobBridge();
        PlaytestCore c5 = fresh(b5, rS);
        data(c5.dispatch("query_state", params()));
        runTicks(c5, 3);
        c5.dispatch("settings_set", params("key", "yAutoRange", "value", Double.valueOf(0)));
        runTicks(c5, 3);
        Map<String, Object> r0 = mapAt(data(c5.dispatch("query_map", params("yMode", "player"))), "map");
        runTicks(c5, 3);
        r0 = mapAt(data(c5.dispatch("query_map", params("yMode", "player"))), "map");
        check("M7 yAutoRange=0 ⇒ 默认层区间只 1 层（layersRequested=1、层 y 就是玩家 Y）",
                intAt(r0, "layersRequested") == 1 && intAt(r0, "layersScanned") == 1
                        && hasLayerY(r0, 65));

        // M8 yLayerMax 调小 ⇒ layersShown 跟着变小且 fail-loud note 如实
        Settings mS = Settings.of(base.resolve("layermax.json"), new LinkedHashMap<String, Object>());
        KnobBridge b6 = new KnobBridge();
        PlaytestCore c6 = fresh(b6, mS);
        data(c6.dispatch("query_state", params()));
        runTicks(c6, 3);
        c6.dispatch("settings_set", params("key", "yLayerMax", "value", Double.valueOf(2)));
        runTicks(c6, 3);
        List<Integer> yr = Arrays.asList(Integer.valueOf(-2), Integer.valueOf(2));
        Map<String, Object> big = mapAt(data(c6.dispatch("query_map",
                params("yMode", "player", "yRange", yr))), "map");
        runTicks(c6, 3);
        big = mapAt(data(c6.dispatch("query_map", params("yMode", "player", "yRange", yr))), "map");
        check("M8 yLayerMax=2 + 请求 5 层 ⇒ layersScanned=2、layersDropped=3、yLayerMax=2 且 note 如实（没采）",
                intAt(big, "layersRequested") == 5 && intAt(big, "layersScanned") == 2
                        && intAt(big, "layersDropped") == 3 && intAt(big, "yLayerMax") == 2
                        && big.get("layersDroppedNote") != null
                        && String.valueOf(big.get("layersDroppedNote")).contains("没采"));

        System.out.println();
        System.out.println("=== t16 config knobs tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- 合成桥：地下（py=65 ⇒ depth=5） ----------------

    private static final class KnobBridge extends SyntheticWorldBridge {
        KnobBridge() { py = 65.0; }
    }

    // ---------------- helpers ----------------

    private static PlaytestCore fresh(SyntheticWorldBridge b, Settings s) throws Exception {
        PlaytestCore core = new PlaytestCore(b, evDir("kb-" + System.nanoTime()), "tok", s);
        core.state().config().chunkRadius = 0;
        core.state().config().columnsPerTick = 4096;
        return core;
    }

    private static boolean bad(PlaytestCore core, String key, Object value, String range) {
        Map<String, Object> r = core.dispatch("settings_set", params("key", key, "value", value));
        return SettingsEdit.BAD_VALUE.equals(r.get("code"))
                && String.valueOf(r.get("message")).contains(range);
    }

    private static void runTicks(PlaytestCore core, int n) {
        for (int i = 0; i < n; i++) core.onTick();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> keysState(PlaytestCore core) {
        Object s = core.status().get("settings");
        if (!(s instanceof Map)) return new LinkedHashMap<String, Object>();
        Object k = ((Map<String, Object>) s).get("keys");
        if (!(k instanceof Map)) return new LinkedHashMap<String, Object>();
        Object st = ((Map<String, Object>) k).get("state");
        return st instanceof Map ? (Map<String, Object>) st : new LinkedHashMap<String, Object>();
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

    private static boolean hasLayerY(Map<String, Object> m, int y) {
        for (Map<String, Object> one : upperList(m, "layers")) if (intAt(one, "y") == y) return true;
        return false;
    }

    private static int intAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return v instanceof Number ? ((Number) v).intValue() : Integer.MIN_VALUE;
    }

    private static List<String> strList(Object o) {
        List<String> out = new ArrayList<String>();
        if (o instanceof List) for (Object x : (List<?>) o) out.add(String.valueOf(x));
        return out;
    }

    private static void check(String name, boolean ok) {
        if (ok) { pass++; System.out.println("[PASS] " + name); }
        else { fail++; System.out.println("[FAIL] " + name); }
    }
}
