package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 极小 JSON：只做本模组需要的形状。手写、零第三方依赖
 * （仓库里的 driver 也是手写 JSON，不引 Gson —— 见 reference/generators/playtest-driver.ts）。
 */
public final class Json {
    private Json() {}

    public static String esc(String s) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"':  b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default:
                    if (c < 0x20) b.append(String.format("\\u%04x", (int) c));
                    else b.append(c);
            }
        }
        return b.toString();
    }

    public static String of(Object o) {
        StringBuilder b = new StringBuilder();
        write(b, o);
        return b.toString();
    }

    @SuppressWarnings("unchecked")
    private static void write(StringBuilder b, Object o) {
        if (o == null) { b.append("null"); return; }
        if (o instanceof String) { b.append('"').append(esc((String) o)).append('"'); return; }
        if (o instanceof Boolean || o instanceof Number) { b.append(o.toString()); return; }
        if (o instanceof Map) {
            b.append('{');
            boolean first = true;
            for (Map.Entry<String, Object> e : ((Map<String, Object>) o).entrySet()) {
                if (!first) b.append(',');
                first = false;
                b.append('"').append(esc(e.getKey())).append("\":");
                write(b, e.getValue());
            }
            b.append('}');
            return;
        }
        if (o instanceof Iterable) {
            b.append('[');
            boolean first = true;
            for (Object v : (Iterable<Object>) o) {
                if (!first) b.append(',');
                first = false;
                write(b, v);
            }
            b.append(']');
            return;
        }
        b.append('"').append(esc(String.valueOf(o))).append('"');
    }

    public static Map<String, Object> parseObject(String s) {
        Object v = parse(s);
        if (v instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> m = (Map<String, Object>) v;
            return m;
        }
        return new LinkedHashMap<>();
    }

    public static Object parse(String s) {
        P p = new P(s);
        Object v = p.value();
        return v;
    }

    public static String str(Map<String, Object> m, String k, String dflt) {
        Object v = m.get(k);
        return v == null ? dflt : String.valueOf(v);
    }

    /**
     * **数值参数**取值：同时吃 JSON 数字与 JSON 字符串。
     *
     * <p>为什么必须有它（真机实证的静默缺陷）：{@code P.num()} 把裸数字解析成 {@code Double}，
     * 而 {@link #str} 对 Double 走 {@code String.valueOf} ⇒ JSON 里的 {@code 1500} 变成
     * {@code "1500.0"}；调用方 {@code Long.parseLong}/{@code Integer.parseInt} 当场
     * NumberFormatException，被 catch 吞掉 ⇒ **静默落回默认值**。真机读数：数值 waitMs 被当成 0，
     * 等待请求 70ms 就回 timedOut=true；写字符串 {@code "1500"} 才真等 ~1506ms。
     *
     * <p>本方法把数字规范成**无科学计数法、无多余 .0** 的十进制串
     * （{@code 1500.0→"1500"}、{@code 1.5→"1.5"}），字符串原样返回。
     * {@link #str} 的语义**不动**（action/command/key/world 这类字符串参数继续用 str）。
     */
    public static String num(Map<String, Object> m, String k, String dflt) {
        Object v = m.get(k);
        if (v == null) return dflt;
        if (v instanceof Float || v instanceof Double) {
            double d = ((Number) v).doubleValue();
            if (Double.isNaN(d) || Double.isInfinite(d)) return String.valueOf(d);
            return java.math.BigDecimal.valueOf(d).stripTrailingZeros().toPlainString();
        }
        if (v instanceof Number) return v.toString();
        return String.valueOf(v);
    }

    public static boolean bool(Map<String, Object> m, String k, boolean dflt) {
        Object v = m.get(k);
        if (v instanceof Boolean) return (Boolean) v;
        if (v instanceof String) return Boolean.parseBoolean((String) v);
        return dflt;
    }

    private static final class P {
        private final String s;
        private int i;

        P(String s) { this.s = s; }

        void ws() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }

        Object value() {
            ws();
            if (i >= s.length()) return null;
            char c = s.charAt(i);
            if (c == '{') return obj();
            if (c == '[') return arr();
            if (c == '"') return str();
            if (s.startsWith("true", i)) { i += 4; return Boolean.TRUE; }
            if (s.startsWith("false", i)) { i += 5; return Boolean.FALSE; }
            if (s.startsWith("null", i)) { i += 4; return null; }
            return num();
        }

        Map<String, Object> obj() {
            Map<String, Object> m = new LinkedHashMap<>();
            i++;
            ws();
            if (i < s.length() && s.charAt(i) == '}') { i++; return m; }
            while (i < s.length()) {
                ws();
                String k = str();
                ws();
                i++; // ':'
                m.put(k, value());
                ws();
                char c = s.charAt(i++);
                if (c == '}') return m;
            }
            return m;
        }

        List<Object> arr() {
            List<Object> l = new ArrayList<>();
            i++;
            ws();
            if (i < s.length() && s.charAt(i) == ']') { i++; return l; }
            while (i < s.length()) {
                l.add(value());
                ws();
                char c = s.charAt(i++);
                if (c == ']') return l;
            }
            return l;
        }

        String str() {
            StringBuilder b = new StringBuilder();
            i++;
            while (i < s.length()) {
                char c = s.charAt(i++);
                if (c == '"') return b.toString();
                if (c == '\\') {
                    char e = s.charAt(i++);
                    switch (e) {
                        case 'n': b.append('\n'); break;
                        case 't': b.append('\t'); break;
                        case 'r': b.append('\r'); break;
                        case 'b': b.append('\b'); break;
                        case 'f': b.append('\f'); break;
                        case 'u':
                            b.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
                            i += 4;
                            break;
                        default: b.append(e);
                    }
                } else {
                    b.append(c);
                }
            }
            return b.toString();
        }

        Double num() {
            int st = i;
            while (i < s.length() && "-+.eE0123456789".indexOf(s.charAt(i)) >= 0) i++;
            try { return Double.valueOf(s.substring(st, i)); } catch (NumberFormatException e) { return Double.valueOf(0); }
        }
    }
}
