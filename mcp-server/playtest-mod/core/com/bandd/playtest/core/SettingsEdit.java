package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **桥面（settings_set）能改哪些键、每个键接受什么值** —— 唯一白名单与取值规则。
 *
 * <h3>为什么单独一个类</h3>
 * 白名单是这条动作的**安全边界**（用户拍板：禁止任意 JSON 写入）。边界必须是一处
 * 可读、可测、可被负控实验整体拆掉的实体；散在 {@link PlaytestCore#dispatch} 的 switch 里
 * 既读不全也测不到。见 {@code tests/.../SettingsActionsTest.java} 的负控实验。
 *
 * <h3>白名单 = {@link StateConfig} 的 17 个旋钮</h3>
 * 派生键 {@code mapSideBlocks} **不是旋钮**；顶层 {@code token} / {@code port} /
 * {@code arbitration} / {@code evidenceDir} / {@code _comment} 更不在内。
 * 不在白名单里的一律 **fail-loud**，且三类各有自己的错误码：
 * <pre>
 *   SETTINGS_PROTECTED_KEY  顶层握手/装配键（port/token 就在这——绝不允许被这条动作碰）
 *   SETTINGS_DERIVED_KEY    mapSideBlocks（派生值，(2×chunkRadius+1)×16）
 *   SETTINGS_UNKNOWN_KEY    其余任何键
 *   SETTINGS_BAD_VALUE      键对了但值不对（类型不符 / 越界 / 空串）
 *   SETTINGS_UNSUPPORTED    本档压根没接管配置文件（settings == null）
 *   SETTINGS_SAVE_FAILED    落盘失败
 *   SETTINGS_GUI_UNSUPPORTED 本档没有图形设置页（open_settings）
 * </pre>
 *
 * <h3>值也**不静默**</h3>
 * 类型不符 / 越界 / 空串 ⇒ {@link #BAD_VALUE}，并把**人话区间**写进回执。
 * 这里**故意比文件那条路更严**：手改文件时 {@link StateConfig#sanitize()} 会把越界值**夹回去**
 * （有出处、有单测）；桥面是**程序调用**，夹回去等于把调用方的错误咽掉 ⇒ 直接拒。
 * 唯一的例外是 {@code palette}（写完后 sanitize 会剔除与三个标记码重复的字符 / 去重），
 * 那种连带调整由 {@link PlaytestCore} 用 {@code adjusted} 与 {@code changedKeys} **如实报出**。
 *
 * <p>Java 8 兼容（core 与 54 个老档共用同一份源码）。
 */
public final class SettingsEdit {

    // ==================================================================
    // 错误码（回执里的 code，一字不改）
    // ==================================================================
    public static final String BAD_VALUE = "SETTINGS_BAD_VALUE";
    public static final String UNKNOWN_KEY = "SETTINGS_UNKNOWN_KEY";
    public static final String PROTECTED_KEY = "SETTINGS_PROTECTED_KEY";
    public static final String DERIVED_KEY_CODE = "SETTINGS_DERIVED_KEY";
    public static final String UNSUPPORTED = "SETTINGS_UNSUPPORTED";
    public static final String SAVE_FAILED = "SETTINGS_SAVE_FAILED";
    public static final String GUI_UNSUPPORTED = "SETTINGS_GUI_UNSUPPORTED";

    /**
     * 顶层**握手/装配**键：永远不在白名单里。
     * 为什么单独列：{@code port}/{@code token} 是本模组与外部驱动的握手凭据
     * （HTTP 端口与鉴权），{@code arbitration}/{@code evidenceDir} 是启动装配；
     * 给它们一个**独立错误码**，调用方一眼能看出「不是拼错了键名，是这条动作不许碰」。
     */
    public static final List<String> PROTECTED_TOP = Arrays.asList(
            "port", "token", "arbitration", "evidenceDir", "_comment");

    /** 白名单：顺序 = 设置页面上的顺序；17 个 = {@link StateConfig} 的全部旋钮。 */
    public static final List<String> KEYS = Arrays.asList(
            "refreshIntervalTicks", "chunkRadius", "step", "columnsPerTick", "maxChars",
            "maxAutoStep", "includeHeight", "includeEntities", "playerMark", "unknownCode",
            "overflowCode", "palette", "minHeightWidth",
            // [T16] 纵层四个旋钮（设置页「纵层（yMode）」分组；yLayerMax 硬上限 16）
            "yModeAuto", "yModeAutoDepth", "yLayerMax", "yAutoRange");

    private SettingsEdit() {
    }

    /** 白名单判定（**负控实验拆的就是这一行**：改成 return true 必须让新单测真红）。 */
    public static boolean known(String key) {
        return key != null && KEYS.contains(key);
    }

    public static boolean protectedTop(String key) {
        return key != null && PROTECTED_TOP.contains(key);
    }

    // ==================================================================
    // 规格说明（进回执的人话）
    // ==================================================================

    /** 该键接受什么（类型 + 区间）。回执里的 {@code spec} 与错误 message 都用它。 */
    public static String specOf(String key) {
        long[] r = intRange(key);
        if (r != null) return "整数 " + r[0] + ".." + r[1];
        if (isBoolKey(key)) return "布尔 true|false";
        if (isCharKey(key)) return "恰 1 个字符的字符串";
        if ("palette".equals(key)) return "非空字符串（每个码恰 1 字符；与三个标记码重复的字符会被 sanitize 剔除）";
        return "（未知键）";
    }

    public static String keysLine() {
        return join(KEYS, ",");
    }

    private static String join(List<String> l, String sep) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < l.size(); i++) {
            if (i > 0) b.append(sep);
            b.append(l.get(i));
        }
        return b.toString();
    }

    private static long[] intRange(String key) {
        if ("refreshIntervalTicks".equals(key)) return new long[] { 1, 1200 };
        if ("chunkRadius".equals(key)) return new long[] { 0, 8 };
        if ("step".equals(key)) return new long[] { 1, 16 };
        if ("columnsPerTick".equals(key)) return new long[] { 1, 4096 };
        if ("maxChars".equals(key)) return new long[] { 64, 200000 };
        if ("maxAutoStep".equals(key)) return new long[] { 1, 64 };
        if ("minHeightWidth".equals(key)) return new long[] { 1, 4 };
        // [T16] 纵层四旋钮的**设置面**区间（越界一律拒，人话见 specOf）。
        if ("yModeAutoDepth".equals(key)) return new long[] { 1, 256 };
        if ("yLayerMax".equals(key)) return new long[] { 1, 16 };     // 硬上限 16（GameStateService.Y_LAYER_HARD_MAX）
        if ("yAutoRange".equals(key)) return new long[] { 0, 64 };
        return null;
    }

    private static boolean isIntKey(String key) {
        return intRange(key) != null;
    }

    private static boolean isBoolKey(String key) {
        return "includeHeight".equals(key) || "includeEntities".equals(key)
                || "yModeAuto".equals(key);
    }

    private static boolean isCharKey(String key) {
        return "playerMark".equals(key) || "unknownCode".equals(key) || "overflowCode".equals(key);
    }

    // ==================================================================
    // 校验 + 规范化
    // ==================================================================

    /** 校验结果：ok=false ⇒ {@link #message} 是人话原因，调用方据此回 {@link #BAD_VALUE}。 */
    public static final class Verdict {
        public final boolean ok;
        public final Object value;
        public final String message;

        private Verdict(boolean ok, Object value, String message) {
            this.ok = ok;
            this.value = value;
            this.message = message;
        }

        static Verdict good(Object v) {
            return new Verdict(true, v, null);
        }

        static Verdict bad(String m) {
            return new Verdict(false, null, m);
        }
    }

    /**
     * 把一个 JSON 值（{@code Json.parseObject} 会给 Double / Boolean / String / List / Map / null）
     * 规范化成该键的**存储形状**（Integer / Boolean / String）。不合法回 {@code Verdict.bad}。
     */
    public static Verdict coerce(String key, Object raw) {
        if (!known(key)) return Verdict.bad("不是可改的键");
        if (raw == null) return Verdict.bad("value 不能是 null；本键接受：" + specOf(key));
        if (isIntKey(key)) {
            Long l = longOf(raw);
            if (l == null) {
                return Verdict.bad("本键要整数（" + specOf(key) + "），收到 " + kindOf(raw) + "：" + show(raw));
            }
            long[] r = intRange(key);
            if (l.longValue() < r[0] || l.longValue() > r[1]) {
                return Verdict.bad("越界：本键范围 " + specOf(key) + "，收到 " + l);
            }
            return Verdict.good(Integer.valueOf(l.intValue()));
        }
        if (isBoolKey(key)) {
            Boolean b = boolOf(raw);
            if (b == null) {
                return Verdict.bad("本键要布尔（" + specOf(key) + "），收到 " + kindOf(raw) + "：" + show(raw));
            }
            return Verdict.good(b);
        }
        if (isCharKey(key)) {
            if (!(raw instanceof String)) {
                return Verdict.bad("本键要" + specOf(key) + "，收到 " + kindOf(raw) + "：" + show(raw));
            }
            String s = (String) raw;
            if (s.length() != 1) {
                return Verdict.bad("本键要恰 1 个字符，收到长度 " + s.length() + " 的字符串：" + show(raw));
            }
            return Verdict.good(s);
        }
        if ("palette".equals(key)) {
            if (!(raw instanceof String)) {
                return Verdict.bad("本键要" + specOf(key) + "，收到 " + kindOf(raw) + "：" + show(raw));
            }
            String s = (String) raw;
            if (s.isEmpty()) return Verdict.bad("palette 不能是空串（空 palette 没有方块码可用）");
            return Verdict.good(s);
        }
        return Verdict.bad("不是可改的键");
    }

    /** 整数：Number 必须**整值**；字符串必须能整解析（"8" 可以，"8.5" 不行）。 */
    private static Long longOf(Object v) {
        if (v instanceof Number) {
            double d = ((Number) v).doubleValue();
            if (Double.isNaN(d) || Double.isInfinite(d)) return null;
            if (d != Math.rint(d)) return null;
            if (d < -9007199254740992.0 || d > 9007199254740992.0) return null;
            return Long.valueOf((long) d);
        }
        if (v instanceof String) {
            String s = ((String) v).trim();
            if (s.isEmpty()) return null;
            try {
                return Long.valueOf(Long.parseLong(s));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private static Boolean boolOf(Object v) {
        if (v instanceof Boolean) return (Boolean) v;
        if (v instanceof String) {
            String s = ((String) v).trim();
            if ("true".equalsIgnoreCase(s)) return Boolean.TRUE;
            if ("false".equalsIgnoreCase(s)) return Boolean.FALSE;
        }
        return null;
    }

    private static String kindOf(Object v) {
        if (v == null) return "null";
        if (v instanceof Number) return "number";
        if (v instanceof Boolean) return "boolean";
        if (v instanceof String) return "string";
        if (v instanceof Map) return "object";
        if (v instanceof List) return "array";
        return v.getClass().getSimpleName();
    }

    private static String show(Object v) {
        String s = Json.of(v);
        return s.length() > 80 ? s.substring(0, 80) + "..." : s;
    }

    // ==================================================================
    // 写入内存中的配置 + 前后对比
    // ==================================================================

    /**
     * 当前旋钮的快照（与落盘形状一致：int / bool / String；**不含派生键**）。
     * 用它做前后对比与「将要落盘的键」比较 —— 与 {@link StateConfig#toJson()} 同源，不另编口径。
     */
    public static Map<String, Object> snapshot(StateConfig cfg) {
        Map<String, Object> m = new LinkedHashMap<String, Object>(cfg.toJson());
        m.remove(Settings.DERIVED_KEY);
        return m;
    }

    /** 把规范化后的值写进**内存中的**配置（调用方已过白名单 + {@link #coerce}）。 */
    public static void apply(StateConfig cfg, String key, Object v) {
        switch (key) {
            case "refreshIntervalTicks": cfg.refreshIntervalTicks = ((Number) v).intValue(); break;
            case "chunkRadius":          cfg.chunkRadius = ((Number) v).intValue(); break;
            case "step":                 cfg.step = ((Number) v).intValue(); break;
            case "columnsPerTick":       cfg.columnsPerTick = ((Number) v).intValue(); break;
            case "maxChars":             cfg.maxChars = ((Number) v).intValue(); break;
            case "maxAutoStep":          cfg.maxAutoStep = ((Number) v).intValue(); break;
            case "minHeightWidth":       cfg.minHeightWidth = ((Number) v).intValue(); break;
            case "yModeAutoDepth":       cfg.yModeAutoDepth = ((Number) v).intValue(); break;
            case "yLayerMax":            cfg.yLayerMax = ((Number) v).intValue(); break;
            case "yAutoRange":           cfg.yAutoRange = ((Number) v).intValue(); break;
            case "includeHeight":        cfg.includeHeight = ((Boolean) v).booleanValue(); break;
            case "includeEntities":      cfg.includeEntities = ((Boolean) v).booleanValue(); break;
            case "yModeAuto":            cfg.yModeAuto = ((Boolean) v).booleanValue(); break;
            case "playerMark":           cfg.playerMark = ((String) v).charAt(0); break;
            case "unknownCode":          cfg.unknownCode = ((String) v).charAt(0); break;
            case "overflowCode":         cfg.overflowCode = ((String) v).charAt(0); break;
            case "palette":              cfg.palette = (String) v; break;
            default: break;
        }
    }

    /** 两快照的**差异键**（保白名单顺序；只报真变了的）。 */
    public static List<String> diff(Map<String, Object> before, Map<String, Object> after) {
        List<String> out = new ArrayList<String>();
        for (String k : KEYS) {
            if (!same(before.get(k), after.get(k))) out.add(k);
        }
        return out;
    }

    /**
     * 值等价（跨形状）：{@code 38081.0 ≡ 38081}（{@link Json#parseObject} 存 Double、
     * 回写存 Integer），字符与字符串同形（shot 存 String），其余按字符串比。
     */
    public static boolean same(Object a, Object b) {
        if (a == null || b == null) return a == b;
        if (a instanceof Number && b instanceof Number) {
            return ((Number) a).doubleValue() == ((Number) b).doubleValue();
        }
        return String.valueOf(a).equals(String.valueOf(b));
    }
}
