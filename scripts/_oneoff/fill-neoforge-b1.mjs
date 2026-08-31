#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖已人工修订的规则树/Skill）。
 * B1：在脚手架 draft 上填已用 search_neoforge_docs 核对的 00/01/09 与核心 Skill，然后标 ready。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function write(p, t) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, t, "utf8");
}

function fill(ver, { loc, registryDoc, java, payloadEvent }) {
  const pack = path.join(ROOT, "neoforge", ver);
  write(
    path.join(pack, "AGENTS.md"),
    `# NeoForge ${ver} — Agent 总纲

> 只适用于 **NeoForge ${ver}**。禁止读取邻档 00–10 或扁平 \`neoforge/.cursor/rules\` 来填本档类名。
> 文档工具用 \`list_neoforge_versions\` / \`search_neoforge_docs\`（version=${ver}）。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | NeoForge ${ver} |
| Java | **${java}** |
| Mappings | mojmap |
| 入口 | \`@Mod\` + \`public ExampleMod(IEventBus modEventBus)\` |
| 元数据 | neoforge.mods.toml |
| 资源 id | \`${loc}\` |
| 网络 | ${payloadEvent} |
| 文档 | https://docs.neoforged.net/docs/${ver}/ |

类名必须能在 \`knowledge/common/verified-api-${ver}.md\` 或 \`search_neoforge_docs\` 该版页面找到。

pack-status: ready
`,
  );
  write(
    path.join(pack, "pack.meta.json"),
    `${JSON.stringify({ status: "ready", "pack-status": "ready", platform: "neoforge", minecraftVersion: ver }, null, 2)}\n`,
  );
  write(
    path.join(pack, ".cursor", "rules", "00-project-setup.mdc"),
    `---
description: 00 — 工程（NeoForge ${ver}）
globs:
alwaysApply: true
status: ready
---

# 00 — 项目结构（NeoForge ${ver}）

来源：search_neoforge_docs \`gettingstarted\` / \`gettingstarted/modfiles\`（version=${ver}）。不要用 ForgeGradle / Yarn 冒充。

## Decision Flow

\`\`\`
→ 构建插件 → 官方同时提供 ModDevGradle（net.neoforged.moddev）与 NeoGradle（net.neoforged.gradle.userdev）。禁止按版本硬绑。download_official_mdk 须传 buildPlugin
→ Java ${java}；mojmap；资源 id 用 ${loc}
→ 入口 → @Mod + IEventBus 构造
→ 元数据 → neoforge.mods.toml
\`\`\`
`,
  );
  write(
    path.join(pack, ".cursor", "rules", "01-registry.mdc"),
    `---
description: 01 — 注册（NeoForge ${ver}）
globs:
alwaysApply: true
status: ready
---

# 01 — 注册（NeoForge ${ver}）

来源：search_neoforge_docs \`${registryDoc}\` / \`items\` / \`blocks\`（version=${ver}）。

已核：\`DeferredRegister.Items\` / \`DeferredRegister.createItems\`、\`DeferredRegister.createBlocks\`、\`@Mod\`。

## Decision Flow

\`\`\`
→ 方块/物品 → DeferredRegister.createBlocks/createItems + register(modEventBus)
→ 不要把 Forge RegistryObject 当本档推荐
→ 查询用 vanilla Registry，不要拿 DeferredRegister 当运行时 map
→ 核不到 → search_neoforge_docs version=${ver}
\`\`\`
`,
  );
  write(
    path.join(pack, ".cursor", "rules", "09-anti-patterns.mdc"),
    `---
description: 09 — 反模式（NeoForge ${ver}）
globs:
alwaysApply: true
status: ready
---

# 09 — 反模式（NeoForge ${ver}）

- 读邻档 00–10 或把 1.20.4/1.21.3/26.1 方法名改版本号
- SimpleChannel / net.minecraftforge
- 把 query_api 当本版 Vanilla 索引（1.21+ 无索引）
- 无 docs 却编造类名

## Decision Flow

\`\`\`
→ 不确定 → search_neoforge_docs version=${ver}，禁止邻档
\`\`\`
`,
  );
  write(
    path.join(pack, "knowledge", "common", `verified-api-${ver}.md`),
    `# NeoForge ${ver} 已核实 API

来源：search_neoforge_docs（version=${ver}）items / blocks / gettingstarted/modfiles / networking / concepts/events。

| 名称 | 出处 |
|------|------|
| DeferredRegister.Items / createItems / createBlocks | items / blocks |
| @Mod + IEventBus | gettingstarted/modfiles |
| ${payloadEvent} | networking |
| ModConfigSpec | misc/config |
| Data Attachments | datastorage/attachments |

禁止把 Forge \`RegistryObject\` / \`SimpleChannel\` 当本档正解。资源 id：\`${loc}\`。
`,
  );
  const skills = ["mc-registry", "mc-item", "mc-block", "mc-events", "mc-networking", "mc-gui"];
  for (const name of skills) {
    write(
      path.join(pack, ".cursor", "skills", name, "SKILL.md"),
      `---
name: ${name}
description: NeoForge ${ver} ${name}。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "${ver}"
dependencies: []
mappings: mojmap
---

# ${name}（NeoForge ${ver}）

禁止从邻档复制。Java ${java}。\`${loc}\`。

对照 \`neoforge/${ver}/knowledge/common/verified-api-${ver}.md\` 与 search_neoforge_docs version=${ver}。
网络：${payloadEvent}，禁止 SimpleChannel。
`,
    );
  }
  console.log(`ready: neoforge/${ver}`);
}

fill("1.20.6", {
  loc: "ResourceLocation",
  registryDoc: "items",
  java: "21",
  payloadEvent: "networking 页 Payload（以该版文档为准，不要抄 1.21.1 复数 Handlers 除非该页写明）",
});
fill("1.21.5", {
  loc: "ResourceLocation",
  registryDoc: "concepts/registries",
  java: "21",
  payloadEvent: "RegisterPayloadHandlersEvent + PayloadRegistrar（以 networking 页为准）",
});
fill("1.21.10", {
  loc: "ResourceLocation",
  registryDoc: "concepts/registries",
  java: "21",
  payloadEvent: "RegisterPayloadHandlersEvent + PayloadRegistrar（以 networking 页为准）",
});
