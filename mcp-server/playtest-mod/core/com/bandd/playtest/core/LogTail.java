package com.bandd.playtest.core;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * 日志文件的**游标增量读 + 有界等待**。
 *
 * 设计照仓库 MCP 工具 {@code inspect_runtime}：{@code sinceOffset} → {@code nextOffset}
 * ＋ 可选 {@code waitForPattern} ＋ {@code waitMs}（**封顶 60 秒**）。
 *
 * 三条纪律：
 * <ol>
 *   <li>**缺口明说**：文件被截断/轮换（{@code size < sinceOffset}）⇒ {@code rotated:true}
 *       ＋ {@code missed:true} ＋ {@code reason}（绝不静默）；</li>
 *   <li>**超时明说**：等到 {@code waitMs} 还没命中 ⇒ {@code matched:false} ＋ {@code timedOut:true}；</li>
 *   <li>**只回完整行**：末尾半行不返回、{@code nextOffset} 也不越过它（下次续读）。</li>
 * </ol>
 *
 * 纯 Java（core 不碰 MC）：日志路径由适配层给出的游戏目录推。
 * 返回值形状：{@code {lines, nextOffset, rotated, missed, matched, timedOut, reason?}}。
 */
public final class LogTail {
    /** waitMs 的硬封顶（与仓库 inspect_runtime 一致）。 */
    public static final long MAX_WAIT_MS = 60000L;
    /** 单次最多读多少字节（防止一次把整份日志吞进内存）。 */
    private static final int MAX_CHUNK = 8 * 1024 * 1024;

    private LogTail() {}

    /**
     * 从 {@code sinceOffset} 起读**新增的完整行**；给了 {@code waitForPattern} 就在
     * {@code waitMs} 内轮询等待命中（封顶 {@link #MAX_WAIT_MS}）。
     *
     * @throws IOException 文件读失败（由 core 翻成 LOG_READ_FAILED）
     * @throws java.util.regex.PatternSyntaxException waitForPattern 不是合法正则（core 翻成 BAD_PATTERN）
     */
    public static Map<String, Object> read(Path logFile, long sinceOffset, String waitForPattern, long waitMs)
            throws IOException {
        Pattern pat = null;
        if (waitForPattern != null && !waitForPattern.isEmpty()) {
            pat = Pattern.compile(waitForPattern);
        }
        List<String> lines = new ArrayList<>();
        boolean rotated = false;
        boolean missed = false;
        String reason = null;
        long offset = Math.max(0L, sinceOffset);
        long waitBudget = Math.max(0L, Math.min(waitMs, MAX_WAIT_MS));
        long deadline = System.currentTimeMillis() + waitBudget;
        boolean matched = false;
        boolean timedOut = false;

        while (true) {
            long size = Files.exists(logFile) ? Files.size(logFile) : 0L;
            if (size < offset) {
                // 截断/轮换：缺口明说，从头再读
                rotated = true;
                missed = true;
                reason = "日志被截断或轮换（size=" + size + " < sinceOffset=" + offset + "）⇒ 已从 0 重读，中间段缺失";
                offset = 0L;
            }
            offset = readCompleteLines(logFile, offset, lines);
            if (pat != null) {
                for (String l : lines) {
                    if (pat.matcher(l).find()) { matched = true; break; }
                }
            }
            if (pat == null || matched) break;
            long remain = deadline - System.currentTimeMillis();
            if (remain <= 0) { timedOut = true; break; }
            try {
                Thread.sleep(Math.min(200L, remain));
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                timedOut = true;
                break;
            }
        }
        return result(lines, offset, rotated, missed, matched, timedOut, reason);
    }

    /**
     * 读 {@code [offset, EOF)} 里的**完整行**并追加进 {@code sink}；
     * 返回新的游标（末尾半行之前的位置）。没有完整行时游标不动。
     */
    private static long readCompleteLines(Path f, long offset, List<String> sink) throws IOException {
        if (!Files.exists(f)) return offset;
        long size = Files.size(f);
        if (size <= offset) return offset;
        int want = (int) Math.min(size - offset, (long) MAX_CHUNK);
        byte[] buf = new byte[want];
        int n;
        try (RandomAccessFile raf = new RandomAccessFile(f.toFile(), "r")) {
            raf.seek(offset);
            n = raf.read(buf);
        }
        if (n <= 0) return offset;
        int lastNl = -1;
        for (int i = n - 1; i >= 0; i--) {
            if (buf[i] == '\n') { lastNl = i; break; }
        }
        if (lastNl < 0) return offset;   // 没有完整行：半行留给下次
        String text = new String(buf, 0, lastNl + 1, StandardCharsets.UTF_8);
        String[] parts = text.split("\n", -1);
        for (int i = 0; i < parts.length - 1; i++) {   // 末尾那个空串是最后一个 '\n' 造成的
            String line = parts[i];
            if (line.endsWith("\r")) line = line.substring(0, line.length() - 1);
            sink.add(line);
        }
        return offset + lastNl + 1;
    }

    private static Map<String, Object> result(List<String> lines, long nextOffset, boolean rotated, boolean missed,
                                              boolean matched, boolean timedOut, String reason) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("lines", lines);
        m.put("nextOffset", nextOffset);
        m.put("rotated", rotated);
        m.put("missed", missed);
        m.put("matched", matched);
        m.put("timedOut", timedOut);
        if (reason != null) m.put("reason", reason);
        return m;
    }
}
