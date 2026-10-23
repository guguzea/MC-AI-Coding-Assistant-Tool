#!/usr/bin/env node
/**
 * playtest-paper-server.mjs —— **服务端面（Paper）真机探针**：起一次真服务端，验证插件被加载、
 * listener/调度器被回调、控制台命令被派发。**默认 dry-run**，`--run` 才下载与起进程。
 *
 * ## 为什么要有它
 * `paper/<ver>/rules/00-applicability.md` 里给的是**签名面机核**（类/成员在不在）。机核回答不了
 * 「插件真的会被加载吗、回调真的会发生吗」—— 那必须起真服务端。2026-10-23 用本脚本在
 * 1.21.4 / 1.21.1 / 1.20.1 / 1.16.5 / 1.12.2 五版上跑过，读数已写进各档 `rules.meta.json` 的
 * `runtimeProbe`。
 *
 * ## 用法
 *   node scripts/playtest-paper-server.mjs --version 1.21.4                  # dry-run：只打印计划
 *   node scripts/playtest-paper-server.mjs --version 1.21.4 --run            # 真跑（下服务端 + 起进程）
 *   node scripts/playtest-paper-server.mjs --version 1.21.4 --run --accept-eula
 *
 * ## 三条纪律（都写死在代码里）
 *   ① **EULA 不代接受**：`eula.txt` 只在你显式给 `--accept-eula` 时才写 `true`；否则脚本停下并告诉你
 *      自己去改。接受 EULA 是服主对 Mojang 的法律表态，不该由工具默默代劳。
 *   ② **只写 `--root` 指定的沙箱**（默认 `F:/MC_GAME`），不碰正式实例；落盘走 write-guard。
 *   ③ **服务端件存 `*.bin`**：本机实测安全软件会把 `*.jar` 清空成 0 字节（同内容 `.bin` 稳定），
 *      而 `java -jar` 只看内容是不是 zip、不看扩展名。
 */

import { execFileSync, spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { emit, wantWrite } from "../../scripts/_lib/write-guard.mjs";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const opt = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

/** 五个已验证版本的服务端读数（`fill.papermc.io/v3` 的 artifact + size + sha256，逐字核过）。 */
const SERVERS = {
  "1.21.4": { url: "https://fill-data.papermc.io/v1/objects/5ee4f542f628a14c644410b08c94ea42e772ef4d29fe92973636b6813d4eaffc/paper-1.21.4-232.jar", size: 51437498, sha256: "5ee4f542f628a14c644410b08c94ea42e772ef4d29fe92973636b6813d4eaffc", jdk: "21", guiArg: "--nogui", apiVersion: "1.21" },
  "1.21.1": { url: "https://fill-data.papermc.io/v1/objects/39bd8c00b9e18de91dcabd3cc3dcfa5328685a53b7187a2f63280c22e2d287b9/paper-1.21.1-133.jar", size: 49394394, sha256: "39bd8c00b9e18de91dcabd3cc3dcfa5328685a53b7187a2f63280c22e2d287b9", jdk: "21", guiArg: "--nogui", apiVersion: "1.21" },
  "1.20.1": { url: "https://fill-data.papermc.io/v1/objects/234a9b32098100c6fc116664d64e36ccdb58b5b649af0f80bcccb08b0255eaea/paper-1.20.1-196.jar", size: 43230582, sha256: "234a9b32098100c6fc116664d64e36ccdb58b5b649af0f80bcccb08b0255eaea", jdk: "17", guiArg: "--nogui", apiVersion: "1.20" },
  "1.16.5": { url: "https://fill-data.papermc.io/v1/objects/e67da4851d08cde378ab2b89be58849238c303351ed2482181a99c2c2b489276/paper-1.16.5-794.jar", size: 53944842, sha256: "e67da4851d08cde378ab2b89be58849238c303351ed2482181a99c2c2b489276", jdk: "8", guiArg: "--nogui", apiVersion: "1.16" },
  // 1.12.2：**不认 `--nogui`**（打印参数帮助后退出）⇒ 只能 `--noconsole`；而 `--noconsole` 关掉控制台，
  // 于是「控制台命令派发」这条判据对它不适用（实测如此）。它那时代也没有 api-version 字段。
  "1.12.2": { url: "https://fill-data.papermc.io/v1/objects/3a2041807f492dcdc34ebb324a287414946e3e05ec3df6fd03f5b5f7d9afc210/paper-1.12.2-1620.jar", size: 40979699, sha256: "3a2041807f492dcdc34ebb324a287414946e3e05ec3df6fd03f5b5f7d9afc210", jdk: "8", guiArg: "--noconsole", apiVersion: null, pdc: false },
};

const VER = opt("--version");
const ROOT = path.resolve(opt("--root") || "F:/MC_GAME");
const RUN = has("--run");
const ACCEPT_EULA = has("--accept-eula");
const JDKROOT = {
  "21": process.env.JDK21 || "C:/Users/zzrCN/.gradle/jdks/eclipse_adoptium-21-amd64-windows.2/bin",
  "17": process.env.JDK17 || "C:/Users/zzrCN/.gradle/jdks/eclipse_adoptium-17-amd64-windows/jdk-17.0.18+8/bin",
  "8": process.env.JDK8 || "G:/mc-skill-playtest/jdk8/jdk8u504-b01/bin",
};

if (!VER) {
  console.error("用法: node scripts/playtest-paper-server.mjs --version <ver> [--run] [--accept-eula] [--root F:/MC_GAME]");
  console.error(`可选版本: ${Object.keys(SERVERS).join(" / ")}`);
  process.exit(2);
}
const S = SERVERS[VER];
if (!S) {
  console.error(`未登记 ${VER}（可选：${Object.keys(SERVERS).join(" / ")}）`);
  process.exit(2);
}
const SRV = path.join(ROOT, `paper-${VER}`);
const BIN = path.join(SRV, "versions", VER, "paper.bin");
const java = path.join(JDKROOT[S.jdk], "java.exe");
const jarExe = path.join(JDKROOT["21"], "jar.exe");

console.log(`Paper ${VER} 真机探针`);
console.log(`  落点    : ${SRV}`);
console.log(`  服务端  : ${path.basename(S.url)} · ${(S.size / 1048576).toFixed(1)} MB · sha256 ${S.sha256.slice(0, 16)}…`);
console.log(`  JDK     : ${S.jdk}（${java}）`);
console.log(`  起法    : java -jar paper.bin ${S.guiArg}`);
console.log(`  EULA    : ${ACCEPT_EULA ? "将写 eula=true（你已显式授权）" : "**不代接受** —— 缺 --accept-eula 时脚本会停下"}`);

if (!RUN) {
  console.log("\n（dry-run：未下载、未起进程；加 --run 才真跑）");
  process.exit(0);
}
if (!existsSync(java)) {
  console.error(`\n缺 JDK ${S.jdk}：${java}\n可用环境变量 JDK${S.jdk} 指定其 bin 目录。`);
  process.exit(2);
}

// 1) 服务端（.bin）
for (const d of ["plugins", "logs", "plugin-src/qa", "build-stage/qa"]) mkdirSync(path.join(SRV, d), { recursive: true });
if (!existsSync(BIN) || readFileSync(BIN).length !== S.size) {
  console.log(`\n下载 ${(S.size / 1048576).toFixed(1)} MB…`);
  const r = await fetch(S.url, { redirect: "follow", signal: AbortSignal.timeout(900000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const b = Buffer.from(await r.arrayBuffer());
  if (b.length !== S.size) throw new Error(`大小不符：${b.length} ≠ ${S.size}`);
  writeFileSync(BIN, b);
}
console.log(`服务端件 ${readFileSync(BIN).length} B（= 官方 size ✓）`);

// 2) 探针源码（1.12.2 裁掉 PDC —— 那是 1.14+ 才有的 API）
const SRC = `package qa;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.permissions.Permission;
import org.bukkit.permissions.PermissionDefault;
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
        getLogger().info("[QA] join " + event.getPlayer().getName());
    }
}
`;
const srcDir = path.join(SRV, "plugin-src", "qa");
writeFileSync(path.join(srcDir, "QaPlugin.java"), SRC);
writeFileSync(
  path.join(SRV, "plugin-src", "plugin.yml"),
  `name: QaPlugin\nversion: 1.0.0\nmain: qa.QaPlugin\n${S.apiVersion ? `api-version: '${S.apiVersion}'\n` : ""}commands:\n  qa:\n    description: QA probe\n`,
);

// 3) 编译：优先用 paper-api（若给了 --api-jar），否则用服务端解出的 patched jar
const apiJar = opt("--api-jar") ? path.resolve(opt("--api-jar")) : path.join(SRV, "cache", `patched_${VER}.jar`);
if (!existsSync(apiJar)) {
  console.error(`\n缺 classpath jar：${apiJar}\n  · 1.16.5+ 可给 --api-jar <paper-api-…jar>（repo.papermc.io）\n  · 1.12.2 需先跑一次让它 patch 出 cache/patched_1.12.2.jar`);
  process.exit(2);
}
const classesDir = path.join(SRV, "build-stage");
try {
  execFileSync(path.join(JDKROOT[S.jdk], "javac.exe"), ["-encoding", "UTF-8", "-cp", apiJar, "-d", classesDir, path.join(srcDir, "QaPlugin.java")], { encoding: "utf8", stdio: "pipe" });
  console.log(`编译通过（classpath = ${path.basename(apiJar)}）`);
} catch (e) {
  console.error("编译失败：\n" + String(e.stderr || e.message).slice(0, 800));
  process.exit(1);
}
const classes = readdirSync(path.join(classesDir, "qa"));
const pluginJar = path.join(SRV, "plugins", "QaPlugin.jar");
execFileSync(jarExe, ["cf", pluginJar, "-C", classesDir, "."], { encoding: "utf8" });
console.log(`插件 jar ${readFileSync(pluginJar).length} B（${classes.length} class: ${classes.join(", ")}）`);

// 4) EULA + server.properties
if (ACCEPT_EULA) writeFileSync(path.join(SRV, "eula.txt"), "eula=true\n");
else if (!existsSync(path.join(SRV, "eula.txt"))) writeFileSync(path.join(SRV, "eula.txt"), "eula=false\n");
writeFileSync(path.join(SRV, "server.properties"), "server-port=25604\nonline-mode=false\nlevel-type=flat\nspawn-protection=0\nmax-players=2\nview-distance=4\n");
if (!ACCEPT_EULA) {
  const t = readFileSync(path.join(SRV, "eula.txt"), "utf8");
  if (!/^\s*eula\s*=\s*true\s*$/m.test(t)) {
    console.log(`\n⛔ ${path.join(SRV, "eula.txt")} 不是 true ⇒ 停止。`);
    console.log("   接受 EULA 是服主对 Mojang 的法律表态，本脚本不代劳。改好后重跑，或显式加 --accept-eula。");
    process.exit(0);
  }
}

// 5) 起服务端 + 控制台命令
const out = [];
const child = spawn(java, ["-Xms512M", "-Xmx1G", "-jar", BIN, S.guiArg], { cwd: SRV });
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
const done = await waitFor((t) => /Done \([\d.]+s\)!/.test(t), 200000);
if (done && exited === null && S.guiArg === "--nogui") {
  child.stdin.write("plugins\n");
  await new Promise((r) => setTimeout(r, 2000));
  child.stdin.write("qa\n");
  await new Promise((r) => setTimeout(r, 2500));
}
const text = out.join("");
const logPath = path.join(SRV, "logs", "qa-run.log");
if (wantWrite()) emit(logPath, text);
else writeFileSync(logPath, text);

const checks = [
  ["插件被加载", /Loading server plugin QaPlugin|Enabling QaPlugin/, true],
  ["[QA] onEnable", /\[QA\] onEnable/, true],
  ["[QA] scheduler tick", /\[QA\] scheduler tick/, true],
  ["[QA] command from CONSOLE", /\[QA\] command from CONSOLE/, S.guiArg === "--nogui"],
  ["服务端就绪 Done", /Done \([\d.]+s\)!/, true],
  ["无 NoClassDefFoundError", /NoClassDefFoundError/, false],
  ["无插件启用异常", /Error occurred while enabling/, false],
];
console.log(`\n=== Paper ${VER} 判据 ===`);
let ok = 0;
let applicable = 0;
for (const [name, re, want] of checks) {
  if (want === "skip") {
    console.log(`—  ${name}（不适用）`);
    continue;
  }
  applicable++;
  const hit = re.test(text);
  const good = want ? hit : !hit;
  if (good) ok++;
  console.log(`${good ? "✅" : "❌"} ${name}`);
}
console.log(`${ok}/${applicable} 通过 · 日志 ${logPath}`);
for (const l of text.split(/\r?\n/)) if (/\[QA\]|Loading server plugin|Enabling QaPlugin|Done \(|Bukkit plugins/.test(l)) console.log("   " + l.slice(0, 170));

if (exited === null) {
  try {
    execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { encoding: "utf8" });
    console.log(`\n已终止 PID ${child.pid}`);
  } catch {
    /* 进程可能已自行退出 */
  }
}
