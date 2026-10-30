#!/usr/bin/env node
/**
 * 真构件编译腿 —— 游玩自测 driver 的「验证强度第 ② 等」（真构件编译验证）。
 *
 * 口径（别再外推）：
 *   - **真构件 = Minecraft 侧**：从本机 Gradle 缓存取 **yarn-named** merged jar（loom 产物），
 *     用真 `javac -encoding UTF-8` 把 `generate_playtest_driver` 的产物编一遍。
 *   - **Fabric API 侧 = 替身（stub），不是真件**：loom 缓存里只有 **intermediary 命名** 的 FAPI 模块件
 *     （javap 实测 `ClientTickEvents$EndTick.onEndTick(net.minecraft.class_310)`），拿它对 yarn 名编译必挂。
 *     替身的**形状出处** = 真模块件 javap：
 *       `ClientTickEvents.END_CLIENT_TICK : Event<EndTick>`、`EndTick { void onEndTick(MinecraftClient) }`
 *       `ClientReceiveMessageEvents.GAME : Event<Game>`
 *     ⚠ **「替身只证签名形状，不证类存在」** —— 判某类在该版存不存在必须拿真构件（本仓库口径）。
 *   - **编译验证 ≠ 真机验证**：本脚本只证「生成物能被真 javac 编过」，不证跑得起来。
 *
 * 退出码：0 = 参与档全部编译通过（**或**本机缺件而降级）；1 = 有档编译失败；2 = 缺件且带 `--require`。
 * 缺件一律打 `SKIP(缺件)`，并在末行把「未验证」吼出来 —— 缺件的 **0 不是通过**。
 * 为什么默认降级：本门的依赖是**本机**资产（JDK + `~/.gradle` 缓存），CI 上必然缺；
 * 不降级就没法挂进链（S4 门链普查要求每道门可达），而这正是本门要进的链。
 * `--require` 的消费者（2026-10-30 R2 审计 G-06 后补）：`.github/workflows/release-mcp-server.yml`
 * 的「Playtest compile legs」步骤在**探测到 loom 缓存**时用它强口径；探测不到就只跑默认档并打
 * `::warning::`（把「本轮未验证」写进发布日志，而不是当成通过）。
 *
 * ⚠ **本脚本不进 `npm test`**：它依赖本机 JDK 与 `~/.gradle` 缓存，在无此环境的机器/CI 上必然 exit 2。
 *   按需手动跑（或作为夜间批的一腿）。JDK 定位已与 server 侧共用 `scripts/_lib/find-javac.mjs`
 *   （JAVA_HOME → PATH → 已知安装根），不再只认死写的 Windows `G:\…` 三条路径。
 *
 * 用法：
 *   node scripts/assert-playtest-driver-compiles.mjs                 # 默认档表
 *   node scripts/assert-playtest-driver-compiles.mjs quilt/1.18.2    # 只跑指定档
 */

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findJavacs, pickJavac } from "./_lib/find-javac.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP = path.resolve(HERE, "..");
const REPO = path.resolve(MCP, "..");
const GRADLE = path.join(os.homedir(), ".gradle", "caches");

// 2026-10-30（R2 审计 WP8）：JDK 定位与 `assert-playtest-server-driver-compiles.mjs` 合并到
// `scripts/_lib/find-javac.mjs`（JAVA_HOME → PATH → 已知安装根）。原来的硬写 `G:\…` 三条路径
// 换机器恒 SKIP —— 而 SKIP 的打印长得像「没毛病」。`--require` 已接进 release workflow 兜底。
const JAVACS = findJavacs();

/** 参与编译腿的档。`jdk` = 该档运行期 JVM（与生成器 `applyJava8LibSwaps` 的判据同源）。 */
const TIERS = [
  { platform: "quilt", version: "1.18.2", jdk: 17, release: 17 },
  { platform: "quilt", version: "1.19.4", jdk: 17, release: 17 },
  { platform: "fabric", version: "1.18.2", jdk: 17, release: 17 },
  { platform: "fabric", version: "1.19.4", jdk: 17, release: 17 },
];

// ── 真构件定位 ────────────────────────────────────────────────────────────────

/** 在 loom 缓存里找某 MC 版的 yarn-named jar。返回绝对路径或 null。 */
function findNamedJar(version) {
  const root = path.join(GRADLE, "fabric-loom");
  if (!fs.existsSync(root)) return null;
  const hits = [];
  for (const dir of fs.readdirSync(root)) {
    if (dir !== version && !dir.startsWith(version + "-")) continue;
    const dirPath = path.join(root, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    for (const f of fs.readdirSync(dirPath)) {
      const full = path.join(dirPath, f);
      if (fs.statSync(full).isDirectory()) {
        for (const g of fs.readdirSync(full)) {
          if (g === "minecraft-merged-named.jar" || g === version + "-named.jar") hits.push(path.join(full, g));
        }
      } else if (f.endsWith("-mapped-net.fabricmc.yarn-" + version + "+build.18-v2.jar")) {
        hits.push(full);
      }
    }
  }
  return hits[0] ?? null;
}

/**
 * MC 自身的**库依赖**（loom 把它们与 named jar 分开缓存）：named jar 里没有
 * `com.mojang.brigadier.Message` / `com.mojang.serialization.*` 这类类，
 * 不补 classpath 会报 `cannot access Message — class file for com.mojang.brigadier.Message not found`
 * （实测 2026-10-14）。这里把 `com.mojang` 名下的 jar 全量并进来。
 */
function collectMojangLibJars() {
  const root = path.join(GRADLE, "modules-2", "files-2.1", "com.mojang");
  const out = [];
  if (!fs.existsSync(root)) return out;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".jar") && !e.name.includes("sources")) out.push(full);
    }
  };
  walk(root);
  return out;
}

// ── FAPI 替身（形状出处见文件头 javap 记录） ─────────────────────────────────

const STUB_EVENT = `package net.fabricmc.fabric.api.event;

/**
 * FAPI 事件容器**替身**（不是真件）。形状出处 = 真模块件 javap：
 * ClientTickEvents.END_CLIENT_TICK : Event&lt;EndTick&gt;。
 */
public interface Event<T> {
    void register(T listener);
}
`;

const STUB_TICK = `package net.fabricmc.fabric.api.client.event.lifecycle.v1;

import net.fabricmc.fabric.api.event.Event;
import net.minecraft.client.MinecraftClient;

/**
 * FAPI 替身。形状出处 = 真模块件 fabric-lifecycle-events-v1-*.jar 的 javap：
 * EndTick { public abstract void onEndTick(net.minecraft.class_310); }
 * —— 真件是 intermediary 名（class_310），不能对 yarn 名编译，故用替身。
 * 替身只证签名形状，不证类存在。
 */
public final class ClientTickEvents {
    public static final Event<EndTick> END_CLIENT_TICK = null;

    private ClientTickEvents() {
    }

    public interface EndTick {
        void onEndTick(MinecraftClient client);
    }
}
`;

const STUB_MESSAGE = `package net.fabricmc.fabric.api.client.message.v1;

import net.fabricmc.fabric.api.event.Event;
import net.minecraft.text.Text;

/**
 * FAPI 替身。形状出处 = 真模块件 fabric-message-api-v1-*.jar 的 javap：
 * GAME : Event&lt;Game&gt;（驱动侧用法 = GAME.register((message, overlay) -&gt; message.getString())）。
 * 替身只证签名形状，不证类存在。
 */
public final class ClientReceiveMessageEvents {
    public static final Event<Game> GAME = null;

    private ClientReceiveMessageEvents() {
    }

    public interface Game {
        void onGameMessage(Text message, boolean overlay);
    }
}
`;

// ── 运行 ────────────────────────────────────────────────────────────────────

const REQUIRE = process.argv.includes("--require");
const wanted = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const tiers = wanted.length ? TIERS.filter((t) => wanted.includes(t.platform + "/" + t.version)) : TIERS;
if (!tiers.length) {
  console.error("没有匹配的档；可选：" + TIERS.map((t) => t.platform + "/" + t.version).join(", "));
  process.exit(2);
}

const env = { ...process.env, MC_SKILL_DATA: process.env.MC_SKILL_DATA || path.join(REPO, "data") };
const workRoot = path.join(process.env.MC_SKILL_CACHE || os.tmpdir(), "playtest-compile-leg");

let fail = 0;
let ran = 0;
const skipped = [];
const libJars = collectMojangLibJars();
console.log("（classpath 库件 " + libJars.length + " 个：com.mojang/**）");
// 定位器的可核读数：SKIP 时看这一行就知道是「本机没这个 major」还是「扫描面塌了」。
console.log("（本机 javac: " + (JAVACS.map((j) => j.major + "@" + j.path).join(" / ") || "无") + "）");

for (const tier of tiers) {
  const tag = tier.platform + "/" + tier.version;
  const jar = findNamedJar(tier.version);
  const javac = pickJavac(tier.jdk, { list: JAVACS })?.path ?? null;
  if (!jar || !javac || !fs.existsSync(javac)) {
    console.log("SKIP(缺件) " + tag + " :: jar=" + (jar ?? "ABSENT") + " javac=" + (javac && fs.existsSync(javac) ? "ok" : "ABSENT"));
    skipped.push(tag);
    continue;
  }

  const work = path.join(workRoot, tier.platform + "-" + tier.version);
  fs.rmSync(work, { recursive: true, force: true });
  const src = path.join(work, "src");
  const out = path.join(work, "out");
  fs.mkdirSync(out, { recursive: true });

  const put = (rel, body) => {
    const f = path.join(src, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, body, "utf8");
    return f;
  };

  let raw;
  try {
    raw = execFileSync(
      "node",
      ["dist/cli.js", "generate_playtest_driver", "--platform", tier.platform, "--version", tier.version, "--driverMode", "temporary_client_tick_driver", "--json"],
      { cwd: MCP, env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
  } catch (e) {
    console.log("FAIL " + tag + " :: 生成器失败 " + String(e).slice(0, 160));
    fail++;
    continue;
  }
  const result = JSON.parse(raw.slice(raw.indexOf("{"))).result;
  const driver = result.files["playtest/PlaytestQaDriver.java"];
  if (!driver) {
    console.log("FAIL " + tag + " :: 生成物里没有 PlaytestQaDriver.java");
    fail++;
    continue;
  }

  const sources = [];
  sources.push(put("net/fabricmc/fabric/api/event/Event.java", STUB_EVENT));
  sources.push(put("net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.java", STUB_TICK));
  if (driver.includes("net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents")) {
    sources.push(put("net/fabricmc/fabric/api/client/message/v1/ClientReceiveMessageEvents.java", STUB_MESSAGE));
  }
  const pkgDir = driver.match(/^package\s+([\w.]+);/m)[1].replace(/\./g, "/");
  sources.push(put(pkgDir + "/PlaytestQaDriver.java", driver));

  // -J-Duser.language=en：javac 在中文 Windows 上把错误行写成「错误:」，会让按词过滤的判读失效（实测 2026-10-14）
  const cp = [jar, ...libJars].join(path.delimiter);
  // -J-Duser.language=en：javac 在中文 Windows 上把错误行写成「错误:」，会让按词过滤的判读失效（实测 2026-10-14）
  const args = ["-J-Duser.language=en", "-J-Duser.country=US", "-encoding", "UTF-8", "-nowarn", "--release", String(tier.release), "-cp", cp, "-d", out, ...sources];
  const r = spawnSync(javac, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  ran++;
  if (r.status === 0) {
    const n = fs.readdirSync(path.join(out, pkgDir)).length;
    console.log("OK   " + tag + " :: " + path.basename(jar) + " + FAPI 替身 ⇒ javac 通过（" + n + " 个 class）");
  } else {
    fail++;
    const errs = ((r.stdout || "") + (r.stderr || ""))
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 10);
    console.log("FAIL " + tag + " :: javac 退出 " + r.status);
    errs.forEach((l) => console.log("      " + l));
  }
}

console.log(
  "assert-playtest-driver-compiles: " +
    (fail ? "FAIL" : "ok") +
    "（跑 " +
    ran +
    " 档 / 编译通过 " +
    (ran - fail) +
    " / 失败 " +
    fail +
    " / 缺件跳过 " +
    skipped.length +
    (skipped.length ? " = " + skipped.join(",") : "") +
    "）",
);
if (fail) process.exit(1);
if (!ran) {
  // 本门的依赖是**本机**资产（JDK + `~/.gradle` 缓存），CI / 别的机器上必然缺。
  // 与 assert-playtest-intent-gate 同范式：**默认降级但要吼**；`--require` 走强口径（缺件即红）。
  if (REQUIRE) process.exit(2);
  console.log(
    "⚠ 0 档真跑（缺件的档：" +
      skipped.join(", ") +
      "；原因见上方 SKIP 行 —— 本机 javac 候选见开头那行）⇒ 本次**未验证**，不是通过；要强口径请加 --require",
  );
  process.exit(0);
}
process.exit(0);