/**
 * `generate_playtest_server_driver` —— **服务端面**的游玩自测驱动生成器（Paper/Bukkit）。
 *
 * ## 与客户端 driver 的关系：**证据契约逐字复用，执行面另造**
 * 客户端 driver（`playtest-driver.ts`）靠 `runClient` 的 `ClientTickEvents` 注入；
 * 服务端**没有客户端** ⇒ 玩家级原语（真按键 / 走位 / 跳跃 / 挖掘 / GUI 点击 / 截图）**一个都跑不了**，
 * 那些 verb **不生成**（生成了就是死代码）。取代它们的是**服务端观测面**。
 *
 * **逐字复用**的是判读侧契约（⇒ `inspect_playtest_evidence` / `inspect_playtest_multi` **零改动**）：
 * | 契约 | 值 | 出处（本仓实现） |
 * |---|---|---|
 * | 证据文件名与目录 | `state.json` / `exit-code.txt` / `qa.log` / `rounds.jsonl` / `plan.txt` | `playtest-driver.ts` 的 `writeState()` |
 * | `exit-code.txt` 取值 | **只有** `"0"`（绿）/ `"1"`（红） | 同上 D:4462；判读侧同语义 |
 * | QA 日志 | **必须 `.log` 后缀** + 打 `[QA] DONE` / `[QA] ERROR` | `playtest-evidence/index.ts:155,163-166` |
 * | 世界无关步骤可先跑 | `wait` / `mark` / `stop` / `touch` / `waitfile`（`cmd` 服务端更自然） | `playtest-driver.ts:3103-3105` |
 *
 * ## 注入点（本仓此前零实现，故必须新造）
 * 客户端 = `PlaytestQaDriver.register()` 挂 `ClientTickEvents`；
 * 服务端 = **`JavaPlugin#onEnable` + `Bukkit.getScheduler().runTaskTimer(...)`**（同步调度，主线程，
 * 才能在回调里直接调 Bukkit API）。
 *
 * ## 每个 Bukkit API 名都对着本仓**签名语料**核过（红线：禁止凭训练记忆补 API 名）
 * 出处 = `data/spigot_stable/spigot-javadoc/stable/processed/*.md`（2026-10-15 实读）：
 *   `org_bukkit_Bukkit.md:63`            `@NotNull public static BukkitScheduler getScheduler()`
 *   `org_bukkit_Bukkit.md:18`            `@NotNull public static Collection<? extends Player> getOnlinePlayers()`
 *   `org_bukkit_Bukkit.md:121`           `@NotNull public static ConsoleCommandSender getConsoleSender()`
 *   `org_bukkit_Bukkit.md:81`            `public static boolean dispatchCommand(@NotNull CommandSender, @NotNull String) throws CommandException`
 *   `org_bukkit_Bukkit.md:65`            `@NotNull public static List<World> getWorlds()`
 *   `org_bukkit_scheduler_BukkitScheduler.md:41`  `@NotNull BukkitTask runTaskTimer(@NotNull Plugin, @NotNull Runnable, long delay, long period)`
 *   `org_bukkit_scheduler_BukkitTask.md:13,17`    `int getTaskId()` / `void cancel()`
 *   `org_bukkit_plugin_java_JavaPlugin.md:40`     `@NotNull public Logger getLogger()`
 * ⚠ `dispatchCommand` **throws CommandException** ⇒ 生成物里必须捕获，不能裸调。
 *
 * ## 刻意不生成的（生成了就是死代码）
 * `move` / `goto` / `break` / `gui` / `jump` / `sneak` / `look` / `shot` / `scan`（客户端侧原语）、
 * `fly` / `land` / `newworld` / `intent` / `waitintent`（依赖客户端 tick 与屏幕态）。
 *
 * ## 证据等级
 * 生成物 = **结构壳**（未在真服务端上编译/运行过）。抬到「真构件编译验证」需一次真 `javac`，
 * 前置是同版本 `paper-api` 构件件 —— 本生成器**不代下构件**。
 */

import type { GeneratorResult } from "./common.js";

/** 服务端侧**可实现**的 verb（每个都只依赖上面核过的 API）。 */
export const SERVER_PLAN_VERBS = [
  "wait",
  "mark",
  "stop",
  "touch",
  "waitfile",
  "cmd",
  "assert",
] as const;

/** 服务端侧 `assert` 可判的条件（都由核过的 API 直接算出，不含猜测）。 */
export const SERVER_ASSERT_KINDS = ["player_count", "world_count", "marker"] as const;

export interface PlaytestServerDriverOptions {
  /** 证据目录（**绝对路径**，须在授权根内）。与客户端 driver 同语义。 */
  evidenceDir: string;
  /** 包名，默认 `playtest`（与客户端 driver 一致，便于判读器无感）。 */
  packageName?: string;
}

const PKG_RE = /^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*)*$/;

/** 生成 Java 源。**注意**：本函数内不出现反引号与反斜杠字面量（模板字面量里那是雷区）。 */
function driverJava(pkg: string, evidenceDir: string): string {
  // 说明：Java 侧一律用 `nl()`（System.lineSeparator()）拼行、用 (char) 92 / (char) 34 表示
  // 反斜杠与双引号 —— 这样 TS 模板字面量里**不需要任何转义**，避免「转义写错但编译通过」的静默坑。
  return `package ${pkg};

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.bukkit.Bukkit;
import org.bukkit.command.CommandException;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitTask;

/**
 * 服务端游玩自测驱动（Paper/Bukkit）—— 由 generate_playtest_server_driver 生成。
 *
 * <p><b>证据契约与客户端 driver 逐字相同</b>（state.json / exit-code.txt / qa.log / rounds.jsonl /
 * plan.txt，目录同名）⇒ 判读侧 inspect_playtest_evidence 与 inspect_playtest_multi <b>零改动</b>。
 *
 * <p><b>注入</b>：在你插件的 onEnable 里加一行
 * <pre>${pkg}.PlaytestQaServerDriver.register(this);</pre>
 * 它会用 Bukkit.getScheduler().runTaskTimer 起一个**同步**tick（主线程 ⇒ 回调里可直接调 Bukkit API）。
 *
 * <p><b>没有客户端原语</b>：move / goto / break / gui / jump / look / shot 等一概不支持（服务端无客户端），
 * 传了会**判红**而不是静默跳过。
 */
public final class PlaytestQaServerDriver {

    /** 证据目录：生成时钉死（绝对路径，须在授权根内）。 */
    private static final Path EVIDENCE_DIR = Paths.get(${JSON.stringify(evidenceDir)});
    private static final String PLAN_FILE = "plan.txt";
    private static final String QA_LOG = "qa.log";
    private static final String EXIT_CODE = "exit-code.txt";
    private static final String STATE = "state.json";
    private static final String ROUNDS = "rounds.jsonl";

    private static final char BS = (char) 92;
    private static final char QT = (char) 34;

    private static JavaPlugin plugin;
    private static BukkitTask task;
    private static List<String> plan = new ArrayList<String>();
    private static int stepIdx = 0;
    private static int stepTicks = 0;
    private static int roundNo = 1;
    private static String lastStep = "";

    private PlaytestQaServerDriver() {
    }

    /** 入口：在 JavaPlugin#onEnable 里调它。 */
    public static void register(JavaPlugin host) {
        plugin = host;
        try {
            Files.createDirectories(EVIDENCE_DIR);
        } catch (IOException e) {
            log("[QA] ERROR 证据目录建不出来: " + e);
            return;
        }
        log("[QA] ROUND " + roundNo + " START (server driver)");
        // 同步调度（主线程）：runTaskTimer(Plugin, Runnable, long delay, long period)
        task = Bukkit.getScheduler().runTaskTimer(host, new Runnable() {
            @Override
            public void run() {
                tick();
            }
        }, 1L, 1L);
    }

    private static void tick() {
        try {
            if (plan.isEmpty()) {
                Path p = EVIDENCE_DIR.resolve(PLAN_FILE);
                if (!Files.exists(p)) {
                    finish(false, "缺 plan.txt（fail-closed：没有剧本不当作通过）");
                    return;
                }
                plan = Files.readAllLines(p, StandardCharsets.UTF_8);
            }
            if (stepIdx >= plan.size()) {
                finish(true, "plan 执行完毕");
                return;
            }
            String line = plan.get(stepIdx) == null ? "" : plan.get(stepIdx).trim();
            if (line.isEmpty() || line.startsWith("#")) {
                stepIdx++;
                stepTicks = 0;
                return;
            }
            runStep(line);
        } catch (Throwable t) {
            writeState();
            finish(false, "driver 异常: " + t);
        }
    }

    private static void runStep(String line) throws IOException {
        String verb = line;
        String rest = "";
        int sp = line.indexOf(' ');
        if (sp > 0) {
            verb = line.substring(0, sp);
            rest = line.substring(sp + 1).trim();
        }
        lastStep = line;
        stepTicks++;

        if (verb.equals("wait")) {
            int n = optI(rest, "ticks", 20);
            if (stepTicks >= n) {
                next();
            }
            return;
        }
        if (verb.equals("mark")) {
            log("[QA] mark: " + rest);
            next();
            return;
        }
        if (verb.equals("touch")) {
            Path mp = syncPath(rest);
            Path parent = mp.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }
            Files.write(mp, ("round=" + roundNo + " at=" + Instant.now()).getBytes(StandardCharsets.UTF_8));
            log("[QA] touch " + mp);
            next();
            return;
        }
        if (verb.equals("waitfile")) {
            String fpath = rest;
            String fopts = "";
            int fs = rest.indexOf(' ');
            if (fs > 0) {
                fpath = rest.substring(0, fs);
                fopts = rest.substring(fs + 1);
            }
            int fmax = optI(fopts, "max", 1200);
            Path mp = syncPath(fpath);
            if (Files.exists(mp)) {
                log("[QA] waitfile " + mp + " -> OK after " + stepTicks + " tick");
                next();
                return;
            }
            if (stepTicks > fmax) {
                writeState();
                finish(false, "waitfile_timeout: " + mp);
                return;
            }
            return;
        }
        if (verb.equals("cmd")) {
            if (rest.isEmpty()) {
                finish(false, "cmd 缺命令文本");
                return;
            }
            try {
                // 已核：public static boolean dispatchCommand(CommandSender, String) throws CommandException
                boolean ok = Bukkit.dispatchCommand(Bukkit.getConsoleSender(), rest);
                log("[QA] cmd " + rest + " -> " + ok);
            } catch (CommandException ce) {
                writeState();
                finish(false, "cmd 抛 CommandException: " + ce.getMessage());
                return;
            }
            next();
            return;
        }
        if (verb.equals("stop")) {
            finish(true, "stop");
            // 「stop」的语义 = **收工并停服**（服务端的"收工"就是载体生命周期结束）。
            // ⚠ 本行原来写成反引号包裹 —— 反引号会**终止 TS 模板字面量**，整个生成器模块语法崩
            //    （实测 tsc TS1005 + 连带 javac reached end of file）。本文件内一律不出现反引号。
            // 其余终止（plan 跑完 / 判红）**刻意不停服** —— 留现场供人查看，见 plan.example.txt 的注释。
            stopServer("plan 的 stop 步骤");
            return;
        }
        if (verb.equals("assert")) {
            String kind = rest;
            String opts = "";
            int as = rest.indexOf(' ');
            if (as > 0) {
                kind = rest.substring(0, as);
                opts = rest.substring(as + 1);
            }
            String detail;
            boolean ok;
            if (kind.equals("player_count")) {
                int n = Bukkit.getOnlinePlayers().size();
                int min = optI(opts, "min", 0);
                ok = n >= min;
                detail = "onlinePlayers=" + n + " min=" + min;
            } else if (kind.equals("world_count")) {
                int n = Bukkit.getWorlds().size();
                int min = optI(opts, "min", 1);
                ok = n >= min;
                detail = "worlds=" + n + " min=" + min;
            } else if (kind.equals("marker")) {
                Path mp = syncPath(optS(opts, "path", ""));
                ok = mp.toString().length() > 0 && Files.exists(mp);
                detail = "marker=" + mp + " exists=" + ok;
            } else {
                finish(false, "未知 assert 类型（服务端侧只支持 player_count / world_count / marker）: " + kind);
                return;
            }
            log("[QA] assert " + kind + " -> " + (ok ? "PASS" : "FAIL") + " :: " + detail);
            if (!ok) {
                writeState();
                finish(false, "断言失败 " + kind + " :: " + detail);
                return;
            }
            next();
            return;
        }
        // 未识别 / 客户端专属 verb ⇒ **判红**，不静默跳过
        writeState();
        finish(false, "服务端不支持的步骤（无客户端原语，或拼写错误）: " + verb);
    }

    private static void next() {
        stepIdx++;
        stepTicks = 0;
    }

    private static Path syncPath(String p) {
        String t = p == null ? "" : p.trim();
        // 绝对路径判定：含盘符冒号 或 以 / 开头（不引入反斜杠字面量）
        if (t.indexOf(':') > 0 || t.startsWith("/")) {
            return Paths.get(t);
        }
        return EVIDENCE_DIR.resolve(t);
    }

    private static int optI(String opts, String key, int dflt) {
        String v = optS(opts, key, "");
        if (v.isEmpty()) {
            return dflt;
        }
        try {
            return Integer.parseInt(v);
        } catch (NumberFormatException e) {
            return dflt;
        }
    }

    private static String optS(String opts, String key, String dflt) {
        if (opts == null || opts.isEmpty()) {
            return dflt;
        }
        String[] parts = opts.split(" ");
        for (int i = 0; i < parts.length; i++) {
            String need = key + "=";
            if (parts[i].startsWith(need)) {
                return parts[i].substring(need.length());
            }
        }
        return dflt;
    }

    private static void writeState() {
        StringBuilder b = new StringBuilder();
        String q = String.valueOf(QT);
        b.append("{").append(nl());
        b.append("  ").append(q).append("at").append(q).append(": ").append(q).append(Instant.now()).append(q).append(",").append(nl());
        b.append("  ").append(q).append("driverKind").append(q).append(": ").append(q).append("server").append(q).append(",").append(nl());
        b.append("  ").append(q).append("round").append(q).append(": ").append(roundNo).append(",").append(nl());
        b.append("  ").append(q).append("plan").append(q).append(": {").append(q).append("steps").append(q).append(": ").append(plan.size())
                .append(", ").append(q).append("done").append(q).append(": ").append(stepIdx).append("},").append(nl());
        b.append("  ").append(q).append("lastStep").append(q).append(": ").append(q).append(jsonEsc(lastStep)).append(q).append(",").append(nl());
        // 服务端观测面（取代客户端的 gui / move / scan）
        b.append("  ").append(q).append("server").append(q).append(": {")
                .append(q).append("onlinePlayers").append(q).append(": ").append(Bukkit.getOnlinePlayers().size())
                .append(", ").append(q).append("worlds").append(q).append(": ").append(Bukkit.getWorlds().size())
                .append("}").append(nl());
        b.append("}").append(nl());
        try {
            Files.write(EVIDENCE_DIR.resolve(STATE), b.toString().getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            log("[QA] ERROR 写 state.json 失败: " + e);
        }
    }

    /**
     * 收工后**停服**（只有 plan 的「stop」步骤会调它）。
     *
     * <p><b>为什么必须停</b>：driver 不停服的话，每轮真机跑都得靠外部杀进程 ——
     * 2026-10-15 首轮真机跑实测踩到：runner 用 300 秒超时把服务端强杀（证据是完整的，因为收工早于超时，
     * 但"跑完还挂着"不是能用的语义）。
     *
     * <p><b>为什么不立刻停</b>：延迟 20 tick（约 1 秒）执行，让 exit-code.txt / qa.log / rounds.jsonl
     * 先落盘。用 {@code Bukkit.shutdown()} —— 已对本仓签名语料核过：
     * {@code data/spigot_stable/spigot-javadoc/stable/processed/org_bukkit_Bukkit.md:104}
     * {@code public static void shutdown()}；调度用 {@code runTaskLater(Plugin, Runnable, long)}
     * （{@code org_bukkit_scheduler_BukkitScheduler.md:35}）。
     */
    private static void stopServer(String why) {
        if (plugin == null) {
            return;
        }
        plugin.getLogger().info("[QA] 收工即停服（" + why + "）：20 tick 后 Bukkit.shutdown()");
        Bukkit.getScheduler().runTaskLater(plugin, new Runnable() {
            @Override
            public void run() {
                Bukkit.shutdown();
            }
        }, 20L);
    }

    private static void finish(boolean ok, String detail) {
        writeState();
        String code = ok ? "0" : "1";
        try {
            Files.write(EVIDENCE_DIR.resolve(EXIT_CODE), code.getBytes(StandardCharsets.UTF_8));
            StringBuilder rb = new StringBuilder();
            rb.append("{").append(String.valueOf(QT)).append("round").append(String.valueOf(QT)).append(": ").append(roundNo)
                    .append(", ").append(String.valueOf(QT)).append("ok").append(String.valueOf(QT)).append(": ").append(ok)
                    .append(", ").append(String.valueOf(QT)).append("steps").append(String.valueOf(QT)).append(": ").append(plan.size())
                    .append(", ").append(String.valueOf(QT)).append("done").append(String.valueOf(QT)).append(": ").append(stepIdx)
                    .append(", ").append(String.valueOf(QT)).append("detail").append(String.valueOf(QT)).append(": ")
                    .append(String.valueOf(QT)).append(jsonEsc(detail)).append(String.valueOf(QT)).append("}").append(nl());
            Files.write(EVIDENCE_DIR.resolve(ROUNDS), rb.toString().getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            log("[QA] ERROR 写证据文件失败: " + e);
        }
        // 判读器按 (char) 总统计这两个标记 ⇒ 必须打，且 qa.log 必须是 .log 后缀
        log(ok ? "[QA] DONE " + detail : "[QA] ERROR " + detail);
        if (task != null) {
            task.cancel();
            task = null;
        }
    }

    private static String nl() {
        return System.lineSeparator();
    }

    private static String jsonEsc(String s) {
        if (s == null) {
            return "";
        }
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == QT) {
                b.append(BS).append(QT);
            } else if (c == BS) {
                b.append(BS).append(BS);
            } else if (c < 32) {
                b.append(' ');
            } else {
                b.append(c);
            }
        }
        return b.toString();
    }

    private static void log(String s) {
        if (plugin != null) {
            plugin.getLogger().info(s);
        }
        try {
            Files.createDirectories(EVIDENCE_DIR);
            Path p = EVIDENCE_DIR.resolve(QA_LOG);
            String prev = Files.exists(p) ? new String(Files.readAllBytes(p), StandardCharsets.UTF_8) : "";
            Files.write(p, (prev + s + nl()).getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            if (plugin != null) {
                plugin.getLogger().warning("qa.log 写失败: " + e);
            }
        }
    }
}
`;
}

export function generatePlaytestServerDriver(opts: PlaytestServerDriverOptions): GeneratorResult {
  const evidenceDir = String(opts.evidenceDir ?? "").trim();
  const pkg = String(opts.packageName ?? "playtest").trim();
  if (!evidenceDir) {
    return { code: "EVIDENCE_DIR_REQUIRED", files: {}, errors: ["evidenceDir 必填（绝对路径，须在授权根内）"] };
  }
  if (!PKG_RE.test(pkg)) {
    return { code: "BAD_PACKAGE", files: {}, errors: [`packageName 不是合法 Java 包名：${JSON.stringify(opts.packageName)}`] };
  }

  const files: Record<string, string> = {};
  files[`${pkg}/PlaytestQaServerDriver.java`] = driverJava(pkg, evidenceDir);
  files["playtest/plan.example.txt"] = [
    "# 服务端侧 plan —— 只支持以下 verb（其余一律判红，不静默跳过）",
    ...SERVER_PLAN_VERBS.map((v) => `#   ${v}`),
    "",
    "mark server-run-start",
    "wait ticks=20",
    "assert world_count min=1",
    "cmd say hello-from-server-driver",
    "touch start.done",
    "waitfile start.done max=1200",
    "stop",
    "",
  ].join("\n");

  const warnings = [
    "服务端侧**没有客户端原语**：move / goto / break / gui / jump / look / shot / scan / fly / land / newworld / intent / waitintent **不生成**（生成了就是死代码）。传这些 verb 会**判红**，不静默跳过。",
    `服务端侧 assert 只支持 ${SERVER_ASSERT_KINDS.join(" / ")}（都由核过的 API 直接算出）。未知 kind 判红。`,
    "证据契约与客户端 driver 同名同目录（state.json / exit-code.txt / qa.log / rounds.jsonl / plan.txt）⇒ 判读侧零改动；exit-code 仍只有 0 / 1。",
    "qa.log 必须是 .log 后缀且打 [QA] DONE / [QA] ERROR —— 判读器只收 /\\.log$/i 并统计这两个标记，缺则读成 absent。",
    "注入点须**新造**：JavaPlugin#onEnable + Bukkit.getScheduler().runTaskTimer（同步调度，主线程）。客户端那套 ClientTickEvents 在服务端不存在。",
    `每个 Bukkit API 名都对着本仓签名语料核过（data/spigot_stable/spigot-javadoc/stable/processed/*.md，2026-10-15 实读）；其中 dispatchCommand **throws CommandException**，生成物里已捕获。`,
    "证据等级 = **结构壳**：未在真服务端上编译/运行（需要同版本 paper-api 构件件，本生成器不代下）。",
    "**未声称**进入 PLAYTEST_VERIFIED_TIER：那张表的条目带 mappings 字段，服务端面无 mappings ⇒ 不硬塞。",
  ];

  return { code: null, files, warnings };
}
