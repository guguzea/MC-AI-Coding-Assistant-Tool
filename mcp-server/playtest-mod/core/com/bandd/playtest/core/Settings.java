package com.bandd.playtest.core;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **那一个可手改的配置文件**（全 56 档统一 {@code <gameDir>/config/bandd_playtest.json}）。
 *
 * <h3>为什么单独一个类</h3>
 * 设置页面（Cloth Config）只负责画控件；**读写文件**这件事与任何一个加载器无关，所以放在 core：
 *
 * <ul>
 *   <li>**读-改-写**：{@link #save()} 只覆盖自己认识的两块（顶层 {@code token/port/arbitration/evidenceDir}
 *       与 {@code state} 里的 {@link StateConfig} 旋钮），**其余键一个不动** ——
 *       尤其 <b>绝不覆盖 {@code port} 与 {@code token}</b>（它们是本模组与外部驱动的握手凭据，
 *       设置页面没有、也不该有它们的控件）。</li>
 *   <li>**未知键保住两层**：顶层未知键（如别人手加的 {@code "future":{...}}）与
 *       {@code state} 内的未知键（如手加的 {@code "myKnob":7}）都原样留在文件里。</li>
 *   <li>{@link StateConfig#toJson()} 里的派生键 {@code mapSideBlocks}（= (2×chunkRadius+1)×16）
 *       **不落盘** —— {@link StateConfig#applyJson} 不认它，写进去只会让人以为可改。</li>
 *   <li>数值规范化：{@link Json#parseObject} 把裸数字读成 {@code Double} ⇒ 直接回写会出现
 *       {@code "port":38081.0}。{@link #save()} 在写之前把**整数值的 Double 收成 Long**
 *       （{@code 38081.0 → 38081}），非整数值与字符串原样保留。</li>
 * </ul>
 *
 * <h3>谁在用它</h3>
 * fabric-1.21.11 / neoforge-1.20.1 的入口构造一个本类实例并交给 {@link PlaytestCore}；
 * 其余档（含 11 个 Cloth 不可能有件的档）**不改一行**，{@code /status} 里如实报
 * {@code settings.guiAvailable=false} + 文件绝对路径 + 全部键名与默认值 + 「请手改该文件」。
 *
 * <p>Java 8 兼容（core 与 54 个老档共用同一份源码）。
 */
public final class Settings {

    /** 派生键：只出现在 {@link StateConfig#toJson()}，{@link StateConfig#applyJson} 不认它 ⇒ 永不落盘。 */
    public static final String DERIVED_KEY = "mapSideBlocks";

    /** 配置文件名（各档同值；路径 = {@code <gameDir>/config/<本值>}）。 */
    public static final String FILE_NAME = "bandd_playtest.json";

    private final Path file;
    /** 整份配置的**原始** JSON（含未知键）；读写都围着它做读-改-写。 */
    private final Map<String, Object> raw;
    private final StateConfig state;
    private boolean writable = true;
    private String lastError;

    private Settings(Path file, Map<String, Object> raw, StateConfig state) {
        this.file = file;
        this.raw = raw;
        this.state = state;
    }

    // ==================================================================
    // 构造
    // ==================================================================

    /**
     * 读一个配置文件；**文件不存在或读不动也返回实例**（用默认值），只是 {@link #writable()} 为 false
     * 或文件不存在 —— 调用方照常能读旋钮，{@link #save()} 会尝试创建它。
     */
    public static Settings load(Path file) {
        Map<String, Object> raw = new LinkedHashMap<String, Object>();
        String err = null;
        try {
            if (file != null && Files.exists(file)) {
                String text = new String(Files.readAllBytes(file), StandardCharsets.UTF_8);
                raw = Json.parseObject(text);
            }
        } catch (IOException e) {
            err = "读失败：" + e;
        } catch (RuntimeException e) {
            err = "解析失败（JSON 坏了？）：" + e;
        }
        Settings s = of(file, raw);
        if (err != null) { s.writable = false; s.lastError = err; }
        return s;
    }

    /**
     * 用**已经读出来的**整份配置构造（入口里的 {@code loadOrCreateConfig} 就是这条路）。
     * {@code raw} 被本实例接管：{@link #save()} 会就地改它再整份写回。
     */
    public static Settings of(Path file, Map<String, Object> raw) {
        Map<String, Object> m = raw == null ? new LinkedHashMap<String, Object>() : raw;
        StateConfig cfg = new StateConfig();
        Object s = m.get("state");
        if (s instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> sm = (Map<String, Object>) s;
            cfg.applyJson(sm);      // applyJson 末尾自己 sanitize（缺键保持默认）
        }
        return new Settings(file, m, cfg);
    }

    // ==================================================================
    // 读
    // ==================================================================

    /** 设置的**唯一**读写口（设置页面直接改这个对象；{@link GameStateService} 也持有同一个引用）。 */
    public StateConfig config() { return state; }

    /** 配置文件绝对路径；构造时给了 null 就回 null。 */
    public Path file() { return file; }

    /** 文件此刻在不在。 */
    public boolean exists() { return file != null && Files.exists(file); }

    /** 上一次读/写是否成功（false ⇒ {@link #lastError()} 有原因）。 */
    public boolean writable() { return writable; }

    /**
     * 当前**内存里的旋钮** 与 **文件里现存的 {@code state} 段** 逐键比较
     * ⇒ 这次 {@link #save()} 真正会改动的键（顺序 = {@link SettingsEdit#KEYS}）。
     *
     * <p>为什么需要它：{@code settings_save} 的回执要求 {@code changedKeys} **如实**
     * （用户拍板）。文件里**缺**这个键 = 保存会**新增**它 ⇒ 也算 changed；
     * 两边值等价（{@code 38081.0 ≡ 38081}，见 {@link SettingsEdit#same}）⇒ 不算。
     *
     * <p>幂等的判据就落在它上面：连存两次，第二次必须回**空表**（而且文件字节也不变）。
     */
    public List<String> changedKeysVsFile() {
        Map<String, Object> mem = SettingsEdit.snapshot(state);
        Map<String, Object> cur = new LinkedHashMap<String, Object>();
        Object s = raw.get("state");
        if (s instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> sm = (Map<String, Object>) s;
            cur.putAll(sm);
        }
        List<String> out = new java.util.ArrayList<String>();
        for (String k : SettingsEdit.KEYS) {
            if (!cur.containsKey(k)) { out.add(k); continue; }
            if (!SettingsEdit.same(mem.get(k), cur.get(k))) out.add(k);
        }
        return out;
    }

    /** 文件当前字节数；文件不在 / 读不到回 -1（{@code settings_save} 的回执用）。 */
    public long sizeBytes() {
        try {
            return file != null && Files.exists(file) ? Files.size(file) : -1L;
        } catch (IOException e) {
            return -1L;
        }
    }

    /**
     * 文件当前的 sha256（小写十六进制）；失败回 {@code null}。
     * 为什么放这里：幂等判据「连存两次 sha256 一样」最省事的取证口就在文件自己身上，
     * 免得调用方还要去 shell 里再算一次（core 只用 JDK 自带的 {@link java.security.MessageDigest}）。
     */
    public String sha256() {
        if (file == null) return null;
        try {
            byte[] bytes = Files.readAllBytes(file);
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] d = md.digest(bytes);
            StringBuilder b = new StringBuilder();
            for (byte x : d) b.append(String.format("%02x", Integer.valueOf(x & 0xff)));
            return b.toString();
        } catch (IOException e) {
            return null;
        } catch (java.security.NoSuchAlgorithmException e) {
            return null;
        }
    }

    public String lastError() { return lastError; }

    // ==================================================================
    // 写（读-改-写）
    // ==================================================================

    /**
     * 本次要落盘的 {@code state} 段：
     * **先拿文件里原有的那段**（保住未知键与键序），再只用 {@link StateConfig#toJson()} 的
     * **已知键**覆盖之，最后剔掉派生键 {@link #DERIVED_KEY}。
     */
    public Map<String, Object> stateMapForFile() {
        Map<String, Object> out = new LinkedHashMap<String, Object>();
        Object cur = raw.get("state");
        if (cur instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> cm = (Map<String, Object>) cur;
            out.putAll(cm);
        }
        for (Map.Entry<String, Object> e : state.toJson().entrySet()) {
            if (!DERIVED_KEY.equals(e.getKey())) out.put(e.getKey(), e.getValue());
        }
        return out;
    }

    /**
     * 写回**同一个文件**：{@code state} 段用当前旋钮覆盖，其余顶层键（含 {@code token} / {@code port} /
     * {@code arbitration} / {@code evidenceDir} / {@code _comment} 与一切未知键）**原样保留**。
     * 写失败不抛（返回 false 并记 {@link #lastError()}）—— 设置页面按钮不该因为盘满而崩。
     */
    public boolean save() {
        if (file == null) { writable = false; lastError = "没有配置文件路径"; return false; }
        try {
            state.sanitize();
            raw.put("state", stateMapForFile());
            normalizeNumbersInPlace(raw);
            writeAtomic(pretty(raw));
            writable = true;
            lastError = null;
            return true;
        } catch (IOException e) {
            writable = false;
            lastError = "写失败：" + e;
            return false;
        } catch (RuntimeException e) {
            writable = false;
            lastError = "写失败：" + e;
            return false;
        }
    }

    private void writeAtomic(String text) throws IOException {
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        Path parent = file.toAbsolutePath().getParent();
        if (parent != null) Files.createDirectories(parent);
        Path tmp = file.resolveSibling(file.getFileName().toString() + ".tmp");
        Files.write(tmp, bytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING,
                StandardOpenOption.WRITE);
        try {
            Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (AtomicMoveNotSupportedException e) {
            Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    // ==================================================================
    // /status 用：文件路径 + 全部键名与默认值 + 「本档能不能图形化」的文案
    // ==================================================================

    /**
     * **全部键名与默认值**（给 {@code /status} 与日志；值与 {@link StateConfig} 源码默认一一对应）。
     * 形状：{@code {top:{...}, state:{...}, stateDerived:"..."}}。
     */
    public static Map<String, Object> defaultsDoc() {
        Map<String, Object> top = new LinkedHashMap<String, Object>();
        top.put("token", "<首次启动随机生成的 32 位十六进制串；外部驱动请求要带上>");
        top.put("port", Integer.valueOf(38081));
        top.put("arbitration", "AUTO");
        top.put("evidenceDir", "<gameDir>/bandd-playtest-evidence");
        top.put("_comment", "自由文本，本模组不读；写什么都没关系");
        Map<String, Object> st = new LinkedHashMap<String, Object>(new StateConfig().toJson());
        st.remove(DERIVED_KEY);
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("top", top);
        m.put("state", st);
        m.put("stateDerived", DERIVED_KEY + " 是派生值（(2×chunkRadius+1)×16），不可改 ⇒ 不落盘");
        return m;
    }

    /**
     * 本档**上游有没有 Cloth Config 件**。
     *
     * <p>数据出处 = {@code F:\B AND D MOD\artifacts\cloth-config-调研.md}（2026-11-10，Modrinth +
     * maven 双源）：Cloth 的 loader 面只有 fabric / forge / neoforge；liteloader / rift / modloader
     * 三族**不可能有**，forge 1.12.2 / 1.13.2 也是 0 条。共 11 档。
     *
     * <p>返回 true **只表示上游没有件**（这类档永远只能手改文件）；返回 false 不等于本档已经接线，
     * 那只由适配层自报的 {@link GameBridge#configGuiAvailable()} 决定。
     */
    public static boolean clothUpstreamMissing(String platform, String mcVersion) {
        String p = platform == null ? "" : platform.toLowerCase(java.util.Locale.ROOT);
        String v = mcVersion == null ? "" : mcVersion;
        if ("liteloader".equals(p) || "rift".equals(p) || "modloader".equals(p)) return true;
        if ("forge".equals(p) && ("1.12.2".equals(v) || "1.13.2".equals(v))) return true;
        return false;
    }

    /** 上面那张表的人话版本（写进 {@code /status} 的 {@code note}）。 */
    public static String clothUpstreamNote() {
        return "Cloth Config 上游只有 fabric/forge/neoforge 三个 loader 面；"
                + "liteloader / rift / modloader 三族与 forge 1.12.2 / 1.13.2 共 11 档没有件 "
                + "⇒ 这些档没有图形设置，只能手改本文件（出处 artifacts/cloth-config-调研.md）";
    }

    // ==================================================================
    // 小工具
    // ==================================================================

    /**
     * 把「整数值的 Double」就地收成 Long（{@code 38081.0 → 38081}），Map/List 递归。
     * 为什么必须：{@link Json#parseObject} 用 {@code Double} 存裸数字，回写会变 {@code 38081.0}。
     */
    static void normalizeNumbersInPlace(Object o) {
        if (o instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> m = (Map<String, Object>) o;
            for (Map.Entry<String, Object> e : m.entrySet()) {
                Object nv = normalizeValue(e.getValue());
                e.setValue(nv);
                normalizeNumbersInPlace(nv);
            }
        } else if (o instanceof List) {
            List<?> l = (List<?>) o;
            for (int i = 0; i < l.size(); i++) {
                @SuppressWarnings("unchecked")
                List<Object> ml = (List<Object>) l;
                Object nv = normalizeValue(ml.get(i));
                ml.set(i, nv);
                normalizeNumbersInPlace(nv);
            }
        }
    }

    private static Object normalizeValue(Object v) {
        if (v instanceof Double) {
            double d = ((Double) v).doubleValue();
            if (!Double.isNaN(d) && !Double.isInfinite(d) && d == Math.rint(d)
                    && Math.abs(d) < 9007199254740992.0) {
                return Long.valueOf((long) d);
            }
        }
        return v;
    }

    /** 两空格缩进的 JSON（手改友好；{@link Json#of} 只有紧凑形）。 */
    static String pretty(Object o) {
        StringBuilder b = new StringBuilder();
        prettyWrite(b, o, 0);
        b.append('\n');
        return b.toString();
    }

    private static void prettyWrite(StringBuilder b, Object o, int ind) {
        if (o == null) { b.append("null"); return; }
        if (o instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> m = (Map<String, Object>) o;
            if (m.isEmpty()) { b.append("{}"); return; }
            b.append("{\n");
            int i = 0;
            for (Map.Entry<String, Object> e : m.entrySet()) {
                indent(b, ind + 1);
                b.append('"').append(Json.esc(e.getKey())).append("\": ");
                prettyWrite(b, e.getValue(), ind + 1);
                if (++i < m.size()) b.append(',');
                b.append('\n');
            }
            indent(b, ind);
            b.append('}');
            return;
        }
        if (o instanceof List) {
            List<?> l = (List<?>) o;
            if (l.isEmpty()) { b.append("[]"); return; }
            b.append("[\n");
            for (int i = 0; i < l.size(); i++) {
                indent(b, ind + 1);
                prettyWrite(b, l.get(i), ind + 1);
                if (i + 1 < l.size()) b.append(',');
                b.append('\n');
            }
            indent(b, ind);
            b.append(']');
            return;
        }
        b.append(Json.of(o));
    }

    private static void indent(StringBuilder b, int n) {
        for (int i = 0; i < n; i++) b.append("  ");
    }
}
