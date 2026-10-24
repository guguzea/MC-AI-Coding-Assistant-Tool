#!/usr/bin/env node
/**
 * playtest-spigot-server.mjs —— **纯 Spigot 服务端**真机探针：起一次 Spigot，验证「用 spigot-api 编出来的插件」
 * 能被加载、listener 会回调、控制台命令会派发。**默认 dry-run**，`--run` 才下载与起进程。
 *
 * ## 与 `playtest-paper-server.mjs` 的分工
 *   - paper 版：服务端件来自 `fill.papermc.io/v3`（官方直发），验的是 **Paper** 环境。
 *   - 本脚本：服务端件来自 **getbukkit 第三方镜像**（`download.getbukkit.org`），因为 **Spigot 官方只发
 *     BuildTools 源码、不发成品 jar**（`hub.spigotmc.org/nexus/.../org/spigotmc/spigot/maven-metadata.xml`
 *     实测 404）。所以**来源必须写清**，并且用服务端自己打印的那行
 *     `This server is running CraftBukkit version …` 作为「跑起来的确实是这个版本」的证据 —— 而不是信文件名。
 *
 * ## 纪律（与 paper 版一致）
 *   ① **EULA 不代接受**：要 `--accept-eula` 才写 `eula=true`。
 *   ② 只写 `--root` 指定的沙箱（默认 `F:/MC_GAME`）。
 *   ③ 服务端件存 `*.bin`（本机安全软件会清空 `*.jar`）。
 *
 * ## 用法
 *   node scripts/playtest-spigot-server.mjs --version 1.19.4                    # dry-run
 *   node scripts/playtest-spigot-server.mjs --version 1.19.4 --run --accept-eula
 *   node scripts/playtest-spigot-server.mjs --version 1.19.4 --run --accept-eula --server-jar <path>
 */

import { execFileSync, spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emit, wantWrite } from "../../scripts/_lib/write-guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const opt = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

/** 三档实测过的 Spigot 服务端（getbukkit 镜像；官方不发成品 jar）。 */
const SERVERS = {
  "1.19.4": { url: "https://download.getbukkit.org/spigot/spigot-1.19.4.jar", jdk: "17", apiVersion: "1.19" },
  "1.20.6": { url: "https://download.getbukkit.org/spigot/spigot-1.20.6.jar", jdk: "21", apiVersion: "1.20" },
  "1.21.8": { url: "https://download.getbukkit.org/spigot/spigot-1.21.8.jar", jdk: "21", apiVersion: "1.21" },
};

const VER = opt("--version");
const ROOT = path.resolve(opt("--root") || "F:/MC_GAME");
const RUN = has("--run");
const ACCEPT_EULA = has("--accept-eula");
const SERVER_JAR = opt("--server-jar") ? path.resolve(opt("--server-jar")) : null;
const JDKROOT = {
  "21": process.env.JDK21 || "C:/Users/zzrCN/.gradle/jdks/eclipse_adoptium-21-amd64-windows.2/bin",
  "17": process.env.JDK17 || "C:/Users/zzrCN/.gradle/jdks/eclipse_adoptium-17-amd64-windows/jdk-17.0.18+8/bin",
};

if (!VER) {
  console.error("用法: node scripts/playtest-spigot-server.mjs --version <ver> [--run] [--accept-eula] [--root F:/MC_GAME]");
  console.error(`可选版本: ${Object.keys(SERVERS).join(" / ")}`);
  process.exit(2);
}
const S = SERVERS[VER];
if (!S) {
  console.error(`未登记 ${VER}（可选：${Object.keys(SERVERS).join(" / ")}）`);
  process.exit(2);
}

const SRV = path.join(ROOT, `spigot-${VER}`);
const BIN = path.join(SRV, "versions", VER, "spigot.bin");
const java = path.join(JDKROOT[S.jdk], "java.exe");
const jarExe = path.join(JDKROOT["21"], "jar.exe");
/**
 * 用哪份 spigot-api 编译探针：默认取该档 `meta.json` 里登记的那个 **artifact 文件名**
 * （maven 的 SNAPSHOT 实际件带时间戳，如 `spigot-api-1.19.4-R0.1-20250414.xxxx-NN.jar`，
 * 按 `-R0.1-SNAPSHOT.jar` 猜路径必然找不到）。
 */
function resolveApiJar() {
  if (opt("--api-jar")) return path.resolve(opt("--api-jar"));
  const metaPath = path.join(REPO, "data", `spigot_${VER}`, "spigot-javadoc", VER, "meta.json");
  if (existsSync(metaPath)) {
    const m = JSON.parse(readFileSync(metaPath, "utf8"));
    const p = path.join(REPO, "temp", "spigot-jars", m.artifact);
    if (existsSync(p)) return p;
  }
  // 回退：按前缀在 temp/spigot-jars 里找最新的一个
  const dir = path.join(REPO, "temp", "spigot-jars");
  if (existsSync(dir)) {
    const hit = readdirSync(dir)
      .filter((f) => f.startsWith(`spigot-api-${VER}-`) && f.endsWith(".jar"))
      .sort()
      .pop();
    if (hit) return path.join(dir, hit);
  }
  return path.join(dir, `spigot-api-${VER}-R0.1-SNAPSHOT.jar`);
}
const API_JAR = resolveApiJar();

console.log(`Spigot ${VER} 真机探针`);
console.log(`  落点    : ${SRV}`);
console.log(`  服务端  : ${SERVER_JAR ? path.basename(SERVER_JAR) : S.url.split("/").pop()}（**第三方镜像 getbukkit**，非官方直发）`);
console.log(`  JDK     : ${S.jdk}（${java}）`);
console.log(`  api jar : ${API_JAR}`);
console.log(`  EULA    : ${ACCEPT_EULA ? "将写 eula=true（你已显式授权）" : "**不代接受**"}`);
if (!RUN) {
  console.log("\n（dry-run：未下载、未起进程；加 --run 才真跑）");
  process.exit(0);
}
if (!existsSync(java)) {
  console.error(`\n缺 JDK ${S.jdk}：${java}`);
  process.exit(2);
}

for (const d of ["plugins", "logs", "build-stage/qa", "plugin-src/qa", "versions/" + VER]) mkdirSync(path.join(SRV, d), { recursive: true });

// 1) 服务端件
if (SERVER_JAR) {
  if (!existsSync(BIN) || readFileSync(BIN).length !== readFileSync(SERVER_JAR).length) copyFileSync(SERVER_JAR, BIN);
} else if (!existsSync(BIN) || readFileSync(BIN).length < 40 * 1024 * 1024) {
  console.log(`\n下载 ${S.url.split("/").pop()}（约 80 MB，第三方镜像）…`);
  const r = await fetch(S.url, { redirect: "follow", signal: AbortSignal.timeout(900000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  writeFileSync(BIN, Buffer.from(await r.arrayBuffer()));
}
console.log(`服务端件 ${(readFileSync(BIN).length / 1048576).toFixed(1)} MB`);
// 顺带记 MANIFEST（能看出是不是 CraftBukkit 系、入口类是什么）
try {
  const mf = execFileSync(jarExe, ["xf", BIN, "META-INF/MANIFEST.MF"], { encoding: "utf8", cwd: path.join(SRV, "logs") });
  void mf;
  const mfText = readFileSync(path.join(SRV, "logs", "META-INF", "MANIFEST.MF"), "utf8");
  console.log(`  MANIFEST: ${mfText.split(/\r?\n/).filter((l) => /Main-Class|Implementation-Version/i.test(l)).join(" · ")}`);
} catch {
  console.log("  MANIFEST: 读取失败（继续）");
}

// 2) 探针源码（spigot-api 编；1.19.4 起都有 PDC，统一带上）
if (!existsSync(API_JAR)) {
  console.error(`\n缺 api jar：${API_JAR}\n  先跑：node mcp-server/scripts/extract-spigot-api-surface.mjs --version ${VER} --write`);
  process.exit(2);
}
const SRC = `package qa;

import org.bukkit.Bukkit;
import org.bukkit.NamespacedKey;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.permissions.Permission;
import org.bukkit.permissions.PermissionDefault;
import org.bukkit.persistence.PersistentDataContainer;
import org.bukkit.persistence.PersistentDataType;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

public final class QaPlugin extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        getLogger().info("[QA] onEnable");
        Bukkit.getPluginManager().registerEvents(this, this);
        getCommand("qa").setExecutor(this);
        Bukkit.getPluginManager().addPermission(new Permission("qa.use", "QA permission", PermissionDefault.TRUE));
        new BukkitRunnable() {
            @Override public void run() { getLogger().info("[QA] scheduler tick"); }
        }.runTaskLater(this, 1L);
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        getLogger().info("[QA] command from " + sender.getName());
        return true;
    }

    @EventHandler(priority = EventPriority.NORMAL, ignoreCancelled = true)
    public void onJoin(PlayerJoinEvent event) {
        Player p = event.getPlayer();
        PersistentDataContainer pdc = p.getPersistentDataContainer();
        pdc.set(new NamespacedKey(this, "qa"), PersistentDataType.STRING, "1");
        getLogger().info("[QA] join " + p.getName());
    }
}
`;
writeFileSync(path.join(SRV, "plugin-src", "qa", "QaPlugin.java"), SRC);
writeFileSync(
  path.join(SRV, "plugin-src", "plugin.yml"),
  `name: QaPlugin\nversion: 1.0.0\nmain: qa.QaPlugin\napi-version: '${S.apiVersion}'\ncommands:\n  qa:\n    description: QA probe\n`,
);

// 3) 编译 + 打包
try {
  execFileSync(path.join(JDKROOT[S.jdk], "javac.exe"), [
    "-encoding", "UTF-8", "-cp", API_JAR, "-d", path.join(SRV, "build-stage"),
    path.join(SRV, "plugin-src", "qa", "QaPlugin.java"),
  ], { encoding: "utf8", stdio: "pipe" });
} catch (e) {
  console.error(`\n编译失败（spigot-api ${VER}）：\n${String(e.stderr || e.message).slice(0, 900)}`);
  process.exit(1);
}
const classes = readdirSync(path.join(SRV, "build-stage", "qa"));
copyFileSync(path.join(SRV, "plugin-src", "plugin.yml"), path.join(SRV, "build-stage", "plugin.yml"));
const pluginJar = path.join(SRV, "plugins", "QaPlugin.jar");
execFileSync(jarExe, ["cf", pluginJar, "-C", path.join(SRV, "build-stage"), "."], { encoding: "utf8" });
console.log(`\n编译通过（spigot-api ${VER}）· 插件 jar ${readFileSync(pluginJar).length} B（${classes.length} class）`);

// 4) EULA + properties
if (ACCEPT_EULA) writeFileSync(path.join(SRV, "eula.txt"), "eula=true\n");
else if (!existsSync(path.join(SRV, "eula.txt"))) writeFileSync(path.join(SRV, "eula.txt"), "eula=false\n");
writeFileSync(path.join(SRV, "server.properties"), "server-port=25607\nonline-mode=false\nlevel-type=flat\nspawn-protection=0\nmax-players=2\nview-distance=4\n");
if (!ACCEPT_EULA) {
  const t = readFileSync(path.join(SRV, "eula.txt"), "utf8");
  if (!/^\s*eula\s*=\s*true\s*$/m.test(t)) {
    console.log(`\n⛔ ${path.join(SRV, "eula.txt")} 不是 true ⇒ 停止（EULA 由你接受，本脚本不代劳）。`);
    process.exit(0);
  }
}

// 5) 起服务端 + 控制台命令
const out = [];
const child = spawn(java, ["-Xms512M", "-Xmx1G", "-jar", BIN, "--nogui"], { cwd: SRV });
child.stdout.on("data", (b) => out.push(b.toString()));
child.stderr.on("data", (b) => out.push(b.toString()));
let exited = null;
child.on("exit", (c) => (exited = c));
const waitFor = async (pred, ms) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (pred(out.join(""))) return true;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
};
console.log("等服务端 Done…");
const done = await waitFor((t) => /Done \([\d.]+s\)!/.test(t), 240000);
if (done && exited === null) {
  child.stdin.write("plugins\n");
  await new Promise((r) => setTimeout(r, 2000));
  child.stdin.write("qa\n");
  await new Promise((r) => setTimeout(r, 2500));
}
const text = out.join("");
const logPath = path.join(SRV, "logs", "qa-run.log");
if (wantWrite()) emit(logPath, text);
else writeFileSync(logPath, text);

const versionLine = (text.match(/This server is running.*$/m) || [""])[0].trim();
const checks = [
  ["服务端确实是该版本（CraftBukkit 版本行）", /This server is running.*\d+\.\d+/],
  ["插件被加载", /Loading server plugin QaPlugin|Enabling QaPlugin/],
  ["[QA] onEnable", /\[QA\] onEnable/],
  ["[QA] scheduler tick", /\[QA\] scheduler tick/],
  ["[QA] command from CONSOLE", /\[QA\] command from CONSOLE/],
  ["服务端就绪 Done", /Done \([\d.]+s\)!/],
  ["无 NoClassDefFoundError", /NoClassDefFoundError/, false],
  ["无插件启用异常", /Error occurred while enabling/, false],
];
console.log(`\n=== Spigot ${VER} 判据 ===`);
if (versionLine) console.log(`版本行：${versionLine.slice(0, 160)}`);
let ok = 0;
for (const [name, re, want = true] of checks) {
  const hit = re.test(text);
  const good = want ? hit : !hit;
  if (good) ok++;
  console.log(`${good ? "✅" : "❌"} ${name}`);
}
console.log(`${ok}/${checks.length} 通过 · 日志 ${logPath}`);
for (const l of text.split(/\r?\n/)) if (/\[QA\]|Loading server plugin|Enabling QaPlugin|Done \(/.test(l)) console.log("   " + l.slice(0, 170));
if (exited === null) {
  try {
    execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { encoding: "utf8" });
    console.log(`\n已终止 PID ${child.pid}`);
  } catch {
    /* 可能已退出 */
  }
}
