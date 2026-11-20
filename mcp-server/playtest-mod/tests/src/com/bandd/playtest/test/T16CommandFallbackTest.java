package com.bandd.playtest.test;

import com.bandd.playtest.core.CommandResult;
import com.bandd.playtest.core.PlaytestCore;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * [T16-③] **命令回执的有界回落** 的真测试（假桥，不需要 Minecraft）：
 * 本地命令树解析失败（典型：{@code /tp} 这类**别名在服务端注册**）时，core 必须
 * **仍然把原命令下发**，并如实分开报 {@code sent} / {@code localParse} / {@code localError}，
 * 此情形下 {@code parsed=false}、{@code result=null}（不编本地结果）；禁列仍在解析前拦住。
 *
 * <p>与既有七套**分开报数**；本类只加新判据。
 *
 * <p>负控：把回落（{@code bridge.chatCommand(cmd)}）去掉 ⇒ C1/C2/C4 必须真红。
 */
public final class T16CommandFallbackTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t16/testwork");
        base = Paths.get(dir, "cmd-" + System.nanoTime());
        Files.createDirectories(base);

        // ================= C. 本地解析失败 ⇒ 原样下发（有界回落） =================
        CmdBridge b = new CmdBridge();
        Path ev = evDir("c1");
        PlaytestCore core = new PlaytestCore(b, ev, "tok");

        // ① tp 相对坐标：本地解析失败（别名在服务端）⇒ 必须下发
        b.next = new CommandResult(false, null, "没有匹配到可执行命令", Integer.valueOf(2));
        Map<String, Object> r1 = core.dispatch("chat_command", params("command", "/tp @s ~3 ~ ~"));
        Map<String, Object> d1 = data(r1);
        check("C1 tp 本地解析失败 ⇒ status=ok、sent=true、localParse=false、parsed=false、result=null",
                "ok".equals(r1.get("status")) && Boolean.TRUE.equals(d1.get("sent"))
                        && Boolean.FALSE.equals(d1.get("localParse")) && Boolean.FALSE.equals(d1.get("parsed"))
                        && d1.containsKey("result") && d1.get("result") == null);
        check("C2 tp 的 localError 是**本地错误原文**（没有匹配到可执行命令）+ fallback=true + 人话提示",
                "没有匹配到可执行命令".equals(String.valueOf(d1.get("localError")))
                        && Boolean.TRUE.equals(d1.get("fallback"))
                        && String.valueOf(d1.get("fallbackNote")).contains("服务端"));
        check("C3 **命令真的下发了**（走 chatCommand 通道，原串含前导斜杠）",
                b.commands.size() == 1 && "/tp @s ~3 ~ ~".equals(b.commands.get(0)));

        // ② 带选择器的 tp
        b.commands.clear();
        b.next = new CommandResult(false, null, "没有匹配到可执行命令", Integer.valueOf(1));
        Map<String, Object> r2 = core.dispatch("chat_command", params("command", "tp @e[tag=bandd_bot,limit=1] ~ ~ ~"));
        check("C4 tp + 选择器同样成立：sent=true、localParse=false、且已下发",
                Boolean.TRUE.equals(data(r2).get("sent")) && Boolean.FALSE.equals(data(r2).get("localParse"))
                        && b.commands.size() == 1 && "tp @e[tag=bandd_bot,limit=1] ~ ~ ~".equals(b.commands.get(0)));

        // ④ xp add（同类别名）同样下发
        b.commands.clear();
        b.next = new CommandResult(false, null, "没有匹配到可执行命令", Integer.valueOf(1));
        Map<String, Object> r4 = core.dispatch("chat_command", params("command", "xp add @s 1"));
        check("C5 xp add @s 1 本地不认 ⇒ 同样下发（sent=true、localParse=false、已发）",
                Boolean.TRUE.equals(data(r4).get("sent")) && Boolean.FALSE.equals(data(r4).get("localParse"))
                        && b.commands.size() == 1);

        // ⑤ 服务端也不认识的命令：本地解析失败 ⇒ 照发；回执**不假装成功**
        b.commands.clear();
        b.next = new CommandResult(false, null, "没有匹配到可执行命令", Integer.valueOf(0));
        Map<String, Object> r5 = core.dispatch("chat_command", params("command", "definitely_not_a_command_xyz"));
        Map<String, Object> d5 = data(r5);
        check("C6 服务端也不认识的命令 ⇒ sent=true 但 parsed=false / result=null（不许假装成功）+ 提示看服务端效果",
                Boolean.TRUE.equals(d5.get("sent")) && Boolean.FALSE.equals(d5.get("parsed"))
                        && d5.get("result") == null && String.valueOf(d5.get("fallbackNote")).contains("服务端")
                        && b.commands.size() == 1);

        // ⑦ 成功路径不回归：本地解析成功 ⇒ result 照给、**不重复下发**
        b.commands.clear();
        b.next = new CommandResult(true, "1", null, null);
        Map<String, Object> r7 = core.dispatch("chat_command", params("command", "teleport @s 1 2 3"));
        Map<String, Object> d7 = data(r7);
        check("C7 teleport 全名仍正常：parsed=true / result=1 / localParse=true，且**不走回落**（不下发）",
                Boolean.TRUE.equals(d7.get("parsed")) && "1".equals(String.valueOf(d7.get("result")))
                        && Boolean.TRUE.equals(d7.get("localParse")) && b.commands.isEmpty());

        // ⑥ 禁列仍然拦住：拒 + 未下发
        b.commands.clear();
        b.next = new CommandResult(true, "1", null, null);
        Map<String, Object> f1 = core.dispatch("chat_command", params("command", "kill @e"));
        Map<String, Object> f2 = core.dispatch("chat_command", params("command", "/tnt"));
        Map<String, Object> f3 = core.dispatch("chat_command", params("command", "fill 0 0 0 1 1 1 stone"));
        check("C8 禁列 kill / tnt / fill ⇒ COMMAND_FORBIDDEN + parsed=false + **sent=false**",
                "COMMAND_FORBIDDEN".equals(f1.get("code")) && Boolean.FALSE.equals(f1.get("parsed"))
                        && Boolean.FALSE.equals(f1.get("sent"))
                        && "COMMAND_FORBIDDEN".equals(f2.get("code")) && Boolean.FALSE.equals(f2.get("sent"))
                        && "COMMAND_FORBIDDEN".equals(f3.get("code")) && Boolean.FALSE.equals(f3.get("sent")));
        check("C9 禁列命令**一条都没下发**（chatCommand 未被调用）", b.commands.isEmpty());

        // 老档（本档没有本地派发器 ⇒ runCommand 回 null）：只能原样下发，localParse 如实 null
        CmdBridge old = new CmdBridge();
        old.next = null;
        PlaytestCore coreOld = new PlaytestCore(old, evDir("c2"), "tok");
        Map<String, Object> ro = coreOld.dispatch("chat_command", params("command", "time set day"));
        Map<String, Object> dof = data(ro);
        check("C10 老档（无本地派发器）⇒ sent=true、localParse=null、localError=null、已下发、无 parsed 键",
                Boolean.TRUE.equals(dof.get("sent")) && dof.containsKey("localParse") && dof.get("localParse") == null
                        && dof.get("localError") == null && !dof.containsKey("parsed")
                        && old.commands.size() == 1 && "time set day".equals(dof.get("sentCommand")));

        // 回执里**回显原命令**（旧 sent 串字段的落点改名 sentCommand，腾出 sent 给 bool）
        check("C11 sentCommand 回显原命令（含前导斜杠）",
                "/tp @s ~3 ~ ~".equals(String.valueOf(d1.get("sentCommand"))));

        // [QA] 审计日志照写、且带上回落读数
        String qa = new String(Files.readAllBytes(ev.resolve("qa.log")), StandardCharsets.UTF_8);
        check("C12 [QA] 行照写并带 sent/localParse 读数",
                qa.contains("[QA] chat_command: /tp @s ~3 ~ ~")
                        && qa.contains("sent=true") && qa.contains("localParse=false"));

        System.out.println();
        System.out.println("=== t16 command fallback tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ---------------- 假桥：可编程 runCommand + 记录下发 ----------------

    private static final class CmdBridge extends SyntheticWorldBridge {
        public CommandResult next;
        public String lastRun;
        public final List<String> commands = new ArrayList<String>();

        @Override
        public CommandResult runCommand(String command) {
            lastRun = command;
            return next;
        }

        @Override
        public void chatCommand(String command) {
            commands.add(command);   // 只记录：证明 core 真的走了下发通道
        }
    }

    // ---------------- helpers ----------------

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

    private static void check(String name, boolean ok) {
        if (ok) { pass++; System.out.println("[PASS] " + name); }
        else { fail++; System.out.println("[FAIL] " + name); }
    }
}
