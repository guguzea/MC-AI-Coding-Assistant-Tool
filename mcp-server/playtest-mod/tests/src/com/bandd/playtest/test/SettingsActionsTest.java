package com.bandd.playtest.test;

import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.core.Settings;
import com.bandd.playtest.core.SettingsEdit;

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
 * 设置面三条新动作（{@code settings_set} / {@code settings_save} / {@code open_settings}）的真测试。
 *
 * <p>与 {@code CoreTest} / {@code StateTest} / {@code SettingsTest} **分开报数**：
 * 本类只加新判据，那三套一条都不改。
 *
 * <p>覆盖（用户拍板的最小集）：
 * <ul>
 *   <li>**白名单拒绝非法键**（顶层握手键 / 派生键 / 任意键，三种错误码分开）</li>
 *   <li>{@code settings_set} **不碰 port / token**（连拒绝后再 save，文件里也逐字不变）</li>
 *   <li>{@code settings_save} **幂等**（连存两次 changedKeys 空表 + sha256 一致）</li>
 *   <li>{@code changedKeys} **如实**（改一个键就只报那一个键）</li>
 *   <li>值校验 fail-loud（越界 / 非整数 / 类型不符 / 空 palette）</li>
 *   <li>{@code open_settings}：有 GUI ⇒ 真开并回类名；无 GUI ⇒ SETTINGS_GUI_UNSUPPORTED（不假装）</li>
 *   <li>老档（settings == null）⇒ SETTINGS_UNSUPPORTED；/status 如实列 unavailable</li>
 *   <li>{@code [QA]} 审计日志真写了一行</li>
 * </ul>
 *
 * <p>跑法（**显式绝对目录，禁用 os.tmpdir()** —— 本机 TEMP/TMP 为空）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/t10/testwork -cp out com.bandd.playtest.test.SettingsActionsTest
 * </pre>
 */
public final class SettingsActionsTest {

    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t10/testwork");
        base = Paths.get(dir, "settings-actions-" + System.nanoTime());
        Files.createDirectories(base);

        // ==============================================================
        // D. settings_set：白名单 / 值校验 / 不碰 port-token
        // ==============================================================
        Path f1 = base.resolve("cfg1").resolve("bandd_playtest.json");
        Files.createDirectories(f1.getParent());
        final String token = "deadbeefcafe0123456789abcdef0123";
        String original = "{"
                + "\"token\":\"" + token + "\","
                + "\"port\":38085,"
                + "\"arbitration\":\"HOTKEY\","
                + "\"evidenceDir\":\"D:/ev\","
                + "\"_comment\":\"keep me\","
                + "\"future\":{\"nested\":[1,2,3],\"flag\":true},"
                + "\"state\":{\"chunkRadius\":1,\"myOwnKnob\":7},"
                + "\"myTop\":\"unchanged\"}";
        Files.write(f1, original.getBytes(StandardCharsets.UTF_8));
        final String shaBefore = sha256(f1);

        Settings s1 = Settings.load(f1);
        GuiBridge b1 = new GuiBridge();
        b1.gameDir = base.toString();
        Path ev1 = evDir("d");
        PlaytestCore core = new PlaytestCore(b1, ev1, token, s1);

        // ── 合法：chunkRadius=0（数值走 Double，模拟 HTTP 的 Json.parseObject）──
        Map<String, Object> r = core.dispatch("settings_set", params("key", "chunkRadius", "value", Double.valueOf(0)));
        Map<String, Object> d = data(r);
        check("D1 合法键 chunkRadius=0 ⇒ ok 且 applied=true、value=0",
                "ok".equals(r.get("status")) && Boolean.TRUE.equals(d.get("applied"))
                        && numberEquals(d.get("value"), 0));
        check("D2 changedKeys 如实（只含 chunkRadius）",
                strList(d.get("changedKeys")).equals(Arrays.asList("chunkRadius")));
        check("D3 与状态器共用同一个 StateConfig ⇒ 下一轮就用新值",
                core.state().config() == core.settings().config()
                        && core.state().config().chunkRadius == 0
                        && Boolean.TRUE.equals(d.get("sameInstanceAsStateService")));
        check("D4 立刻生效：refreshRequested=true（桥 stateMapCapable + ready）",
                Boolean.TRUE.equals(d.get("refreshRequested")));

        // ── 白名单三种拒绝码（负控实验拆的就是这条路径）──
        check("D5 顶层握手键 port ⇒ SETTINGS_PROTECTED_KEY（不是 UNKNOWN）", codeEquals(
                core.dispatch("settings_set", params("key", "port", "value", Double.valueOf(1234))),
                SettingsEdit.PROTECTED_KEY));
        check("D6 token ⇒ SETTINGS_PROTECTED_KEY",
                codeEquals(core.dispatch("settings_set", params("key", "token", "value", "x")),
                        SettingsEdit.PROTECTED_KEY));
        check("D7 arbitration ⇒ SETTINGS_PROTECTED_KEY",
                codeEquals(core.dispatch("settings_set", params("key", "arbitration", "value", "DUAL")),
                        SettingsEdit.PROTECTED_KEY));
        check("D8 派生键 mapSideBlocks ⇒ SETTINGS_DERIVED_KEY",
                codeEquals(core.dispatch("settings_set", params("key", "mapSideBlocks", "value", Double.valueOf(48))),
                        SettingsEdit.DERIVED_KEY_CODE));
        check("D9 任意键 myKnob ⇒ SETTINGS_UNKNOWN_KEY",
                codeEquals(core.dispatch("settings_set", params("key", "myKnob", "value", Double.valueOf(7))),
                        SettingsEdit.UNKNOWN_KEY));
        // [T16 契约变更] 白名单从 13 键增到 17 键（纵层四旋钮）
        check("D10 拒绝回执带 allowedKeys（17 个白名单键）",
                strList(data2(core.dispatch("settings_set", params("key", "myKnob", "value", Double.valueOf(7))),
                        "allowedKeys")).size() == 17);

        // ── 值校验 fail-loud（不许静默夹回）──
        Map<String, Object> over = core.dispatch("settings_set",
                params("key", "chunkRadius", "value", Double.valueOf(99)));
        check("D11 越界 99 ⇒ SETTINGS_BAD_VALUE 且带人话 spec", codeEquals(over, SettingsEdit.BAD_VALUE)
                && String.valueOf(over.get("message")).contains("0..8"));
        check("D12 越界被拒后内存值没变（还是 0，不夹也不写）", core.settings().config().chunkRadius == 0);
        check("D13 非整数 1.5 ⇒ SETTINGS_BAD_VALUE",
                codeEquals(core.dispatch("settings_set", params("key", "chunkRadius", "value", Double.valueOf(1.5))),
                        SettingsEdit.BAD_VALUE));
        check("D14 布尔键收字符串 \"notabool\" ⇒ SETTINGS_BAD_VALUE",
                codeEquals(core.dispatch("settings_set", params("key", "includeHeight", "value", "notabool")),
                        SettingsEdit.BAD_VALUE));
        check("D15 字符键收 2 字符 \"ab\" ⇒ SETTINGS_BAD_VALUE",
                codeEquals(core.dispatch("settings_set", params("key", "playerMark", "value", "ab")),
                        SettingsEdit.BAD_VALUE));
        check("D16 palette 空串 ⇒ SETTINGS_BAD_VALUE",
                codeEquals(core.dispatch("settings_set", params("key", "palette", "value", "")),
                        SettingsEdit.BAD_VALUE));
        check("D17 缺 value ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(core.dispatch("settings_set", params("key", "maxChars")).get("code")));
        check("D18 缺 key ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(core.dispatch("settings_set", new LinkedHashMap<String, Object>()).get("code")));

        // ── 合法：布尔与字符，并把「连带调整」如实报出 ──
        Map<String, Object> rb = core.dispatch("settings_set", params("key", "includeHeight", "value", "false"));
        check("D19 布尔键收字符串 \"false\" ⇒ ok 且 value=false",
                "ok".equals(rb.get("status")) && Boolean.FALSE.equals(data(rb).get("value")));
        Map<String, Object> rc = core.dispatch("settings_set", params("key", "step", "value", Double.valueOf(8)));
        check("D20 step=8 把 maxAutoStep 从 4 抬到 8（sanitize 连带）⇒ changedKeys 两个都报",
                "ok".equals(rc.get("status"))
                        && strList(data(rc).get("changedKeys")).equals(Arrays.asList("step", "maxAutoStep")));

        // ── 审计日志 ──
        String qa = new String(Files.readAllBytes(ev1.resolve("qa.log")), StandardCharsets.UTF_8);
        check("D21 [QA] 审计日志真写了一行（settings_set 成功与拒绝都留痕）",
                qa.contains("[QA] settings_set: chunkRadius=0") && qa.contains("拒绝 key=port"));

        // ==============================================================
        // E. settings_save：落盘 / 幂等 / changedKeys / port-token 逐字不变
        // ==============================================================
        Map<String, Object> e1 = core.dispatch("settings_save", new LinkedHashMap<String, Object>());
        Map<String, Object> e1d = data(e1);
        // [T16 契约变更] 文件里原只有 chunkRadius 一个白名单键 ⇒ 首次 save 新增其余 16 个 = changedKeys 17 个
        check("E1 第一次 save ⇒ saved=true、file 指同一个文件、changedKeys 17 个（文件里只有 chunkRadius）",
                Boolean.TRUE.equals(e1d.get("saved"))
                        && f1.toString().equals(String.valueOf(e1d.get("file")))
                        && strList(e1d.get("changedKeys")).size() == 17);
        String sha1 = sha256(f1);
        Map<String, Object> e2 = core.dispatch("settings_save", new LinkedHashMap<String, Object>());
        Map<String, Object> e2d = data(e2);
        check("E2 紧接着第二次 save ⇒ changedKeys 空表（幂等的可观测面）",
                strList(e2d.get("changedKeys")).isEmpty());
        check("E3 连存两次文件 sha256 完全一致（幂等）", sha1.equals(sha256(f1)));
        check("E4 回执里的 sha256 与文件实测 sha256 一致（不是编的）",
                sha1.equals(String.valueOf(e1d.get("sha256"))));

        // 改一个键 ⇒ changedKeys 必须**只**报那一个
        core.dispatch("settings_set", params("key", "maxChars", "value", Double.valueOf(9000)));
        Map<String, Object> e5 = core.dispatch("settings_save", new LinkedHashMap<String, Object>());
        check("E5 改 maxChars 后 save ⇒ changedKeys 恰为 [maxChars]",
                strList(data(e5).get("changedKeys")).equals(Arrays.asList("maxChars")));
        String sha5 = sha256(f1);
        Map<String, Object> e6 = core.dispatch("settings_save", new LinkedHashMap<String, Object>());
        check("E6 再存一次 ⇒ changedKeys 空表 且 sha256 不变",
                strList(data(e6).get("changedKeys")).isEmpty() && sha5.equals(sha256(f1)));

        // port / token / 未知键 / state 内未知键：逐字不变
        String after = new String(Files.readAllBytes(f1), StandardCharsets.UTF_8);
        Map<String, Object> re = Json.parseObject(after);
        Map<?, ?> st = re.get("state") instanceof Map ? (Map<?, ?>) re.get("state") : new LinkedHashMap<Object, Object>();
        check("E7 token 逐字不变 + port 值不变且落盘为整数",
                token.equals(String.valueOf(re.get("token"))) && numberEquals(re.get("port"), 38085)
                        && after.contains("\"port\": 38085"));
        check("E8 顶层未知键原样（_comment / future 嵌套 / myTop）",
                "keep me".equals(String.valueOf(re.get("_comment")))
                        && "unchanged".equals(String.valueOf(re.get("myTop")))
                        && re.get("future") instanceof Map
                        && Boolean.TRUE.equals(((Map<?, ?>) re.get("future")).get("flag"))
                        && ((Map<?, ?>) re.get("future")).get("nested") instanceof List
                        && ((List<?>) ((Map<?, ?>) re.get("future")).get("nested")).size() == 3);
        check("E9 state 段内未知键 myOwnKnob 原样 + 已知键按新值落盘",
                numberEquals(st.get("myOwnKnob"), 7) && numberEquals(st.get("chunkRadius"), 0)
                        && numberEquals(st.get("maxChars"), 9000));
        check("E10 派生键 mapSideBlocks 不落盘", !st.containsKey("mapSideBlocks"));
        Settings back = Settings.load(f1);
        check("E11 重新 load ⇒ 值真往返（chunkRadius=0 / maxChars=9000 / includeHeight=false）",
                back.config().chunkRadius == 0 && back.config().maxChars == 9000
                        && !back.config().includeHeight);

        // 非法值/受保护键被拒后，文件**一点没动**
        core.dispatch("settings_set", params("key", "chunkRadius", "value", Double.valueOf(99)));
        core.dispatch("settings_set", params("key", "port", "value", Double.valueOf(9999)));
        core.dispatch("settings_set", params("key", "token", "value", "pwned"));
        core.dispatch("settings_save", new LinkedHashMap<String, Object>());
        String after2 = new String(Files.readAllBytes(f1), StandardCharsets.UTF_8);
        Map<String, Object> re2 = Json.parseObject(after2);
        Map<?, ?> st2 = re2.get("state") instanceof Map ? (Map<?, ?>) re2.get("state") : new LinkedHashMap<Object, Object>();
        check("E12 被拒的 set 不回流：文件里 port 仍 38085、token 仍逐字、chunkRadius 仍 0",
                numberEquals(re2.get("port"), 38085) && token.equals(String.valueOf(re2.get("token")))
                        && numberEquals(st2.get("chunkRadius"), 0));

        // ==============================================================
        // F. open_settings：有 GUI 真开 / 无 GUI 如实拒
        // ==============================================================
        Map<String, Object> fo = core.dispatch("open_settings", new LinkedHashMap<String, Object>());
        Map<String, Object> fod = data(fo);
        check("F1 有 Cloth 的档 ⇒ opened=true 且 screen 是屏的类名",
                "ok".equals(fo.get("status")) && Boolean.TRUE.equals(fod.get("opened"))
                        && "ClothConfigScreen(test)".equals(String.valueOf(fod.get("screen"))));
        check("F2 回执带 provider（件版本）", String.valueOf(fod.get("provider")).startsWith("cloth-config"));

        GuiBridge b2 = new GuiBridge();
        b2.gui = false;
        PlaytestCore noGui = new PlaytestCore(b2, evDir("f2"), token, s1);
        Map<String, Object> f2 = noGui.dispatch("open_settings", new LinkedHashMap<String, Object>());
        check("F3 没接 GUI 的档 ⇒ SETTINGS_GUI_UNSUPPORTED（不假装打开）",
                SettingsEdit.GUI_UNSUPPORTED.equals(f2.get("code"))
                        && Boolean.FALSE.equals(f2.get("guiAvailable")));

        GuiBridge b3 = new GuiBridge();
        b3.plat = "modloader";
        b3.ver = "1.6.4";
        b3.gui = false;
        PlaytestCore legacyGui = new PlaytestCore(b3, evDir("f3"), token, s1);
        Map<String, Object> f3 = legacyGui.dispatch("open_settings", new LinkedHashMap<String, Object>());
        check("F4 Cloth 上游没有件的档 ⇒ clothUpstreamMissing=true 且原因点名",
                Boolean.TRUE.equals(f3.get("clothUpstreamMissing"))
                        && SettingsEdit.GUI_UNSUPPORTED.equals(f3.get("code")));

        BrokenGuiBridge b4 = new BrokenGuiBridge();
        PlaytestCore broken = new PlaytestCore(b4, evDir("f4"), token, s1);
        Map<String, Object> f4 = broken.dispatch("open_settings", new LinkedHashMap<String, Object>());
        check("F5 自报有 GUI 但开不出来 ⇒ 仍回 SETTINGS_GUI_UNSUPPORTED（不假装成功）",
                SettingsEdit.GUI_UNSUPPORTED.equals(f4.get("code"))
                        && Boolean.TRUE.equals(f4.get("guiAvailable")));

        List<String> unGui = strList(core.status().get("actionsUnavailable"));
        check("F6 有 GUI 的档 /status 不把 open_settings 列进 unavailable",
                !unGui.contains("open_settings"));

        // ==============================================================
        // G. 老档（settings == null）：fail-loud + /status 如实
        // ==============================================================
        PlaytestCore old = new PlaytestCore(new FakeBridge(), evDir("g"), "tok");
        check("G1 没接管文件的档 ⇒ settings_set 回 SETTINGS_UNSUPPORTED",
                SettingsEdit.UNSUPPORTED.equals(
                        old.dispatch("settings_set", params("key", "chunkRadius", "value", Double.valueOf(0))).get("code")));
        check("G2 没接管文件的档 ⇒ settings_save 回 SETTINGS_UNSUPPORTED",
                SettingsEdit.UNSUPPORTED.equals(
                        old.dispatch("settings_save", new LinkedHashMap<String, Object>()).get("code")));
        List<String> unOld = strList(old.status().get("actionsUnavailable"));
        check("G3 老档 /status 把三条如实列进 actionsUnavailable",
                unOld.contains("open_settings") && unOld.contains("settings_set")
                        && unOld.contains("settings_save"));
        check("G4 能力自报：SETTINGS 是 BRIDGE 的子集（不是第 3 张表；all() 仍是两表并集）",
                Capabilities.BRIDGE.containsAll(Capabilities.SETTINGS)
                        && Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());
        check("G5 DRIVER 里含 open_settings（客户端界面动作）",
                Capabilities.DRIVER.contains("open_settings"));

        // 进场 pin：原文件 sha 只应因为**我们自己的 save** 而变，E 段里被拒的调用不该动它
        check("G6 备份可回溯：原始文件 sha256 记录到了（shaBefore 非空且与现文件不同）",
                shaBefore != null && shaBefore.length() == 64 && !shaBefore.equals(sha256(f1)));

        System.out.println("=== settings-actions tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- 假桥 ----------------

    /** 有 Cloth 设置页 + 状态器取值面的假桥（开屏 = 改一个假屏名，模拟适配层）。 */
    private static class GuiBridge extends SyntheticWorldBridge {
        String plat = "fabric";
        String ver = "1.21.11";
        boolean gui = true;
        String gameDir = null;

        @Override public String platform() { return plat; }
        @Override public String mcVersion() { return ver; }
        @Override public String gameDirectory() { return gameDir; }
        @Override public boolean configGuiAvailable() { return gui; }
        @Override public String configGuiProvider() { return gui ? "cloth-config test" : null; }
        @Override public String configGuiOpenHint() { return gui ? "Mods 列表 → Config；或按 O" : null; }

        @Override
        public String openSettingsScreen() {
            if (!gui) return null;
            screen = "ClothConfigScreen(test)";
            return screen;
        }
    }

    /** 自报有 GUI 但**开不出来**（未初始化 / 构建失败）的档：必须如实失败。 */
    private static final class BrokenGuiBridge extends GuiBridge {
        @Override public String openSettingsScreen() { return null; }
    }

    // ---------------- 小工具 ----------------

    private static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        for (int i = 0; i + 1 < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> data(Map<String, Object> res) {
        Object d = res.get("data");
        return d instanceof Map ? (Map<String, Object>) d : new LinkedHashMap<String, Object>();
    }

    private static List<String> data2(Map<String, Object> res, String key) {
        return strList(res.get(key));
    }

    private static List<String> strList(Object o) {
        List<String> out = new ArrayList<String>();
        if (o instanceof List) {
            for (Object x : (List<?>) o) out.add(String.valueOf(x));
        }
        return out;
    }

    private static boolean codeEquals(Map<String, Object> res, String code) {
        return code.equals(res.get("code"));
    }

    private static boolean numberEquals(Object o, long want) {
        return o instanceof Number && ((Number) o).longValue() == want;
    }

    private static Path evDir(String tag) throws Exception {
        Path p = base.resolve("ev-" + tag);
        Files.createDirectories(p);
        return p;
    }

    private static String sha256(Path p) throws Exception {
        byte[] d = java.security.MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(p));
        StringBuilder b = new StringBuilder();
        for (byte x : d) b.append(String.format("%02x", Integer.valueOf(x & 0xff)));
        return b.toString();
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

    private SettingsActionsTest() {
    }
}
