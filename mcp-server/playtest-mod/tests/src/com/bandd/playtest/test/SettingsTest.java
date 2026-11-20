package com.bandd.playtest.test;

import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.core.Settings;
import com.bandd.playtest.core.StateConfig;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 设置文件（{@link Settings}）的真测试：**读-改-写不丢 port/token 与未知键** + 默认值 / sanitize
 * + {@code /status} 的 {@code settings} 段。
 *
 * <p>与 {@code CoreTest} / {@code StateTest} **分开报数**（本类只加新判据，不改它们一条）。
 *
 * <p>跑法（**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/state/testwork -cp out com.bandd.playtest.test.SettingsTest
 * </pre>
 */
public final class SettingsTest {

    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/state/testwork");
        base = Paths.get(dir, "settings-" + System.nanoTime());
        Files.createDirectories(base);

        // ==============================================================
        // A. 读-改-写往返：port / token / 未知键（顶层与 state 内两层）一个都不许丢
        // ==============================================================
        Path fileA = base.resolve("bandd_playtest.json");
        String token = "deadbeefcafe0123456789abcdef0123";
        String original = "{"
                + "\"token\":\"" + token + "\","
                + "\"port\":38081,"
                + "\"arbitration\":\"HOTKEY\","
                + "\"evidenceDir\":\"D:/ev\","
                + "\"_comment\":\"keep me\","
                + "\"future\":{\"nested\":[1,2,3],\"flag\":true},"
                + "\"state\":{\"chunkRadius\":2,\"maxChars\":4000,\"playerMark\":\"@\","
                + "\"myOwnKnob\":7,\"futureState\":{\"a\":\"b\"}},"
                + "\"myTop\":\"unchanged\"}";
        Files.write(fileA, original.getBytes(StandardCharsets.UTF_8));

        Settings s = Settings.load(fileA);
        check("A1 已知键读回来（chunkRadius/maxChars/playerMark），缺键回默认（step/refreshIntervalTicks）",
                s.config().chunkRadius == 2 && s.config().maxChars == 4000 && s.config().playerMark == '@'
                        && s.config().step == 1 && s.config().refreshIntervalTicks == 40);

        s.config().chunkRadius = 3;
        s.config().maxChars = 9000;
        s.config().includeHeight = false;
        s.config().palette = "XYZ";
        boolean saved = s.save();
        check("A2 save() 返回 true（写回同一个文件）", saved);

        String after = new String(Files.readAllBytes(fileA), StandardCharsets.UTF_8);
        Map<String, Object> re = Json.parseObject(after);
        check("A3 token 逐字不变（绝不被覆盖）", token.equals(String.valueOf(re.get("token"))));
        Number port = (Number) re.get("port");
        check("A4 port 值不变且落盘为整数（38081，不是 38081.0）",
                port != null && port.longValue() == 38081L && after.contains("\"port\": 38081"));
        check("A5 arbitration / evidenceDir / _comment 原样保留",
                "HOTKEY".equals(String.valueOf(re.get("arbitration")))
                        && "D:/ev".equals(String.valueOf(re.get("evidenceDir")))
                        && "keep me".equals(String.valueOf(re.get("_comment"))));
        check("A6 顶层未知键原样保留（字符串 + 嵌套对象/数组/布尔）",
                "unchanged".equals(String.valueOf(re.get("myTop")))
                        && re.get("future") instanceof Map
                        && Boolean.TRUE.equals(((Map<?, ?>) re.get("future")).get("flag"))
                        && ((Map<?, ?>) re.get("future")).get("nested") instanceof List
                        && ((List<?>) ((Map<?, ?>) re.get("future")).get("nested")).size() == 3);
        Object stA = re.get("state");
        Map<?, ?> stateMap = stA instanceof Map ? (Map<?, ?>) stA : new LinkedHashMap<Object, Object>();
        check("A7 state 段内未知键原样保留（标量 + 嵌套对象）",
                numberEquals(stateMap.get("myOwnKnob"), 7)
                        && stateMap.get("futureState") instanceof Map
                        && "b".equals(String.valueOf(((Map<?, ?>) stateMap.get("futureState")).get("a"))));
        check("A8 state 已知键按新值落盘",
                numberEquals(stateMap.get("chunkRadius"), 3) && numberEquals(stateMap.get("maxChars"), 9000)
                        && Boolean.FALSE.equals(stateMap.get("includeHeight"))
                        && "XYZ".equals(String.valueOf(stateMap.get("palette"))));
        check("A9 派生键 mapSideBlocks 不落盘（applyJson 不认它）", !stateMap.containsKey("mapSideBlocks"));

        Settings s2 = Settings.load(fileA);
        check("A10 重新 load 后新值仍在（真往返，非内存假象）",
                s2.config().chunkRadius == 3 && s2.config().maxChars == 9000
                        && !s2.config().includeHeight && "XYZ".equals(s2.config().palette));
        check("A11 写后文件仍是合法 JSON（Json.parseObject 能解析出非空表）", !re.isEmpty());
        Set<String> beforeKeys = new HashSet<String>(Arrays.asList(
                "token", "port", "arbitration", "evidenceDir", "_comment", "future", "state", "myTop"));
        check("A12 顶层键集合只增不减（未知键没被吞、也没有多出别的东西）",
                new HashSet<String>(re.keySet()).equals(beforeKeys));

        // ==============================================================
        // B. 默认值 / sanitize
        // ==============================================================
        Settings fresh = Settings.of(base.resolve("none.json"), new LinkedHashMap<String, Object>());
        StateConfig d = new StateConfig();
        StateConfig f = fresh.config();
        check("B1 空配置 ⇒ 逐键等于 new StateConfig() 默认",
                f.refreshIntervalTicks == d.refreshIntervalTicks && f.chunkRadius == d.chunkRadius
                        && f.step == d.step && f.columnsPerTick == d.columnsPerTick
                        && f.maxChars == d.maxChars && f.maxAutoStep == d.maxAutoStep
                        && f.includeHeight == d.includeHeight && f.includeEntities == d.includeEntities
                        && f.playerMark == d.playerMark && f.unknownCode == d.unknownCode
                        && f.overflowCode == d.overflowCode && d.palette.equals(f.palette)
                        && f.minHeightWidth == d.minHeightWidth
                        // [T16] 纵层四旋钮的默认值也逐键相等（本次被授权的设置类断言改动）
                        && f.yModeAuto == d.yModeAuto && f.yModeAutoDepth == d.yModeAutoDepth
                        && f.yLayerMax == d.yLayerMax && f.yAutoRange == d.yAutoRange);

        Settings bad = Settings.of(base.resolve("bad.json"), Json.parseObject(
                "{\"state\":{\"chunkRadius\":-3,\"step\":0,\"columnsPerTick\":0,\"maxChars\":1,"
                        + "\"minHeightWidth\":99,\"palette\":\"\",\"refreshIntervalTicks\":-5}}"));
        StateConfig bc = bad.config();
        check("B2 非法值被 sanitize（半径/步长/预算/上限/高度宽/重采间隔）",
                bc.chunkRadius == 0 && bc.step == 1 && bc.columnsPerTick == 1 && bc.maxChars == 64
                        && bc.minHeightWidth == 4 && bc.refreshIntervalTicks == 1);
        check("B3 空 palette 被补回默认、且不含三个标记码",
                bc.palette != null && !bc.palette.isEmpty()
                        && bc.palette.indexOf(bc.playerMark) < 0
                        && bc.palette.indexOf(bc.unknownCode) < 0
                        && bc.palette.indexOf(bc.overflowCode) < 0);

        Settings auto = Settings.of(base.resolve("auto.json"), Json.parseObject(
                "{\"state\":{\"step\":8,\"maxAutoStep\":2}}"));
        check("B4 maxAutoStep 被夹到不小于 step（2 抬到 8）", auto.config().maxAutoStep == 8);

        Map<String, Object> doc = Settings.defaultsDoc();
        Object docTop = doc.get("top");
        Object docState = doc.get("state");
        // [T16 契约变更] state 块从 13 键增到 17 键（新增 yModeAuto / yModeAutoDepth / yLayerMax / yAutoRange）
        check("B5 defaultsDoc：top 5 键 / state 17 键 / 无派生键",
                docTop instanceof Map && ((Map<?, ?>) docTop).size() == 5
                        && docState instanceof Map && ((Map<?, ?>) docState).size() == 17
                        && !((Map<?, ?>) docState).containsKey("mapSideBlocks"));

        String[][] noBuild = {
                {"liteloader", "1.12.2"}, {"rift", "1.13"}, {"rift", "1.13.2"},
                {"modloader", "1.2.5"}, {"modloader", "1.2.5-lb"}, {"modloader", "1.5.2"},
                {"modloader", "1.5.2-lb"}, {"modloader", "1.6.2"}, {"modloader", "1.6.4"},
                {"forge", "1.12.2"}, {"forge", "1.13.2"}};
        int missing = 0;
        for (String[] pv : noBuild) {
            if (Settings.clothUpstreamMissing(pv[0], pv[1])) missing++;
        }
        String[][] hasBuild = {
                {"fabric", "1.21.11"}, {"forge", "1.20.1"}, {"neoforge", "1.20.1"},
                {"quilt", "1.21.11"}, {"fabric", "1.14.4"}};
        int wronglyMissing = 0;
        for (String[] pv : hasBuild) {
            if (Settings.clothUpstreamMissing(pv[0], pv[1])) wronglyMissing++;
        }
        check("B6 clothUpstreamMissing：11 个无件档全 true、5 个有件档全 false",
                missing == 11 && wronglyMissing == 0);

        // ==============================================================
        // C. /status 的 settings 段（56 档共用这条路）
        // ==============================================================
        Path fileC = base.resolve("c").resolve("bandd_playtest.json");
        Files.createDirectories(fileC.getParent());
        Files.write(fileC, ("{\"token\":\"tok-c\",\"port\":38081}").getBytes(StandardCharsets.UTF_8));
        Settings sC = Settings.load(fileC);

        // C1/C2：**没有自报 GUI** 的档（适配层一分不改 ⇒ 默认 false）
        PlainBridge plain = new PlainBridge();
        plain.gameDir = base.toString();
        PlaytestCore corePlain = new PlaytestCore(plain, evDir("c1"), "tok", sC);
        Map<String, Object> setPlain = settingsOf(corePlain);
        check("C1 /status.settings.file = 配置文件绝对路径",
                fileC.toString().equals(String.valueOf(setPlain.get("file"))));
        check("C2 未自报 GUI ⇒ guiAvailable=false 且 hint 是「本档不支持图形设置，请手改该文件」",
                Boolean.FALSE.equals(setPlain.get("guiAvailable"))
                        && String.valueOf(setPlain.get("hint")).contains("本档不支持图形设置")
                        && String.valueOf(setPlain.get("hint")).contains("手改该文件"));
        Object keysObj = setPlain.get("keys");
        check("C3 settings.keys 给全：top 与 state 两块都在（键名 + 默认值）",
                keysObj instanceof Map && ((Map<?, ?>) keysObj).get("top") instanceof Map
                        && ((Map<?, ?>) keysObj).get("state") instanceof Map);

        // C4/C5：**上游根本没有 Cloth 件**的 11 档（举 modloader 1.6.4）
        PlainBridge legacy = new PlainBridge();
        legacy.plat = "modloader";
        legacy.ver = "1.6.4";
        legacy.gameDir = base.toString();
        PlaytestCore coreLegacy = new PlaytestCore(legacy, evDir("c2"), "tok",
                Settings.of(base.resolve("none2.json"), new LinkedHashMap<String, Object>()));
        Map<String, Object> setLegacy = settingsOf(coreLegacy);
        check("C4 modloader 1.6.4 ⇒ clothUpstreamMissing=true",
                Boolean.TRUE.equals(setLegacy.get("clothUpstreamMissing")));
        check("C5 缺件档的 guiUnavailableReason 点名「Cloth Config 上游没有 modloader 1.6.4 的件」",
                String.valueOf(setLegacy.get("guiUnavailableReason"))
                        .contains("上游没有 modloader 1.6.4 的件"));

        // C6/C7：**接了 GUI** 的档（适配层自报 true）
        PlainBridge gui = new PlainBridge();
        gui.gui = true;
        gui.gameDir = base.toString();
        PlaytestCore coreGui = new PlaytestCore(gui, evDir("c3"), "tok", sC);
        Map<String, Object> setGui = settingsOf(coreGui);
        check("C6 自报 GUI ⇒ guiAvailable=true、guiProvider/guiOpen 都有值",
                Boolean.TRUE.equals(setGui.get("guiAvailable")) && setGui.get("guiProvider") != null
                        && setGui.get("guiOpen") != null);
        check("C7 有 GUI 档的 hint 给的是「游戏内改」+ 文件也可手改",
                String.valueOf(setGui.get("hint")).contains("游戏内改")
                        && String.valueOf(setGui.get("hint")).contains("直接编辑"));

        // C8：**老构造器（3 参）**的 54 档：settings 段照样在，file 由 gameDirectory 推出
        PlainBridge old = new PlainBridge();
        old.gameDir = base.toString();
        PlaytestCore coreOld = new PlaytestCore(old, evDir("c4"), "tok");
        Map<String, Object> setOld = settingsOf(coreOld);
        check("C8 老构造器（不接管文件）⇒ settings.file 仍由 gameDirectory 推出、guiAvailable=false",
                String.valueOf(setOld.get("file"))
                        .endsWith("config" + java.io.File.separator + "bandd_playtest.json")
                        && Boolean.FALSE.equals(setOld.get("guiAvailable")));

        // C9：状态器与设置页面**同一个 StateConfig 实例**（改了立刻生效的结构事实）
        PlaytestCore coreSame = new PlaytestCore(plain, evDir("c5"), "tok", sC);
        coreSame.settings().config().chunkRadius = 5;
        check("C9 settings().config() 与 state().config() 是同一个对象（改完下一轮就用新值）",
                coreSame.state().config() == coreSame.settings().config()
                        && coreSame.state().config().chunkRadius == 5);

        System.out.println("=== settings tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- 测试用假桥 ----------------

    /** 最小假桥：可调 platform / mcVersion / gameDirectory / GUI 自报（其余走 GameBridge 默认）。 */
    private static final class PlainBridge extends SyntheticWorldBridge {
        String plat = "fabric";
        String ver = "1.21.11";
        String gameDir = null;
        boolean gui = false;

        @Override public String platform() { return plat; }
        @Override public String mcVersion() { return ver; }
        @Override public String gameDirectory() { return gameDir; }
        @Override public boolean configGuiAvailable() { return gui; }
        @Override public String configGuiProvider() { return gui ? "cloth-config test" : null; }
        @Override public String configGuiOpenHint() { return gui ? "Mods 列表 → Config；或按 O 键" : null; }
    }

    // ---------------- 小工具 ----------------

    private static Path evDir(String tag) throws Exception {
        Path p = base.resolve("ev-" + tag);
        Files.createDirectories(p);
        return p;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> settingsOf(PlaytestCore core) {
        Object v = core.status().get("settings");
        return v instanceof Map ? (Map<String, Object>) v : new LinkedHashMap<String, Object>();
    }

    private static boolean numberEquals(Object o, long want) {
        return o instanceof Number && ((Number) o).longValue() == want;
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
