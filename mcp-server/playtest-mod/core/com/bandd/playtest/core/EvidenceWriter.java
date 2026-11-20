package com.bandd.playtest.core;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;

/**
 * 证据三件：state.json / exit-code.txt / qa.log。
 * 口径与仓库一致：**缺件读作 absent，不得读成"没有失败"**（fail-closed）。
 */
public final class EvidenceWriter {
    private final Path dir;

    public EvidenceWriter(Path dir) { this.dir = dir; }

    public Path dir() { return dir; }

    public void log(String line) {
        append("qa.log", "[" + Instant.now() + "] " + line + "\n");
    }

    public void state(String json) {
        write("state.json", json);
    }

    public void exitCode(int code) {
        write("exit-code.txt", code + "\n");
    }

    /** 铁律 2：qa.log 只含本轮 => 轮首截断。 */
    public void truncateQaLog() {
        write("qa.log", "");
    }

    /** 每轮一行（含 ok）。 */
    public void appendRounds(String jsonLine) {
        append("rounds.jsonl", jsonLine + "\n");
    }

    private void append(String name, String text) {
        try {
            Files.createDirectories(dir);
            Files.write(dir.resolve(name), text.getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            // 证据写不进去不静默：打到 stdout 让日志面看得见
            System.err.println("[bandd-playtest] evidence append failed: " + e);
        }
    }

    private void write(String name, String text) {
        try {
            Files.createDirectories(dir);
            Files.write(dir.resolve(name), text.getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            System.err.println("[bandd-playtest] evidence write failed: " + e);
        }
    }
}
