#!/usr/bin/env node
/**
 * 一次性生成五平台规则树 + 最小 scaffold（禁止整包复制 fabric/forge）。
 * 运行：node scripts/generate-five-platform-trees.mjs
 *
 * 警告：会覆盖 quilt/rift/liteloader/modloader/bedrock 的 AGENTS 与 00–10。
 * 计划 1 加厚后不要无脑重跑；只需更新 indexKnowledge 列表并单独写 processed/L0。
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
function w(rel, text) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text.replace(/\n/g, "\n"), "utf8");
}

const IDE = `### 本规则集的 IDE 加载优先级

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | \`.cursor/rules/*.mdc\` + \`.cursor/skills/\` |
| OpenCode / Codex / ZCode | \`AGENTS.md\` |
| Pi | \`.pi/rules/*.md\`（+ \`AGENTS.md\`） |

当上述路径不存在时，降级读取本文件和 \`.cursor/\`。
`;

function quiltTree(ver, java) {
  const fab = `fabric/${ver}`;
  w(
    `quilt/${ver}/AGENTS.md`,
    `# Quilt ${ver} — Agent 总纲

> 本规则集适用于 **Quilt ${ver}**。检测 \`quilt.mod.json\` 或 \`org.quiltmc.loom\`（可同时有 \`fabric.mod.json\`）。
> **必须再读** \`${fab}/.cursor/rules/\` 的 **02–10**（方块/物品/实体/网络/datagen/客户端/反模式/GUI）。
> 本目录只写 QSL / Quilt Loader **差异**（00 / 01 / 05）。禁止把整棵 Fabric 规则复制进来。

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Quilt |
| Minecraft | ${ver} |
| Java | **Java ${java}** |
| Gradle | Quilt Loom（\`id 'org.quiltmc.loom'\`） |
| Mappings | Yarn / intermediary（与 Fabric 同层） |
| 元数据 | \`quilt.mod.json\`（\`quilt_loader.id\`） |
| 注册 | 优先 **QSL \`org.quiltmc\`**；不要生成 \`net.fabricmc.fabric.api.event.registry\` 当 QSL |

库 Skill：仍按 \`fabric-only\` + \`all-platforms\` 读 \`knowledge/libs/\`。

${IDE}

## 规则文件

| 编号 | 本目录 | 说明 |
|------|--------|------|
| 00 | \`00-project-setup.mdc\` | Quilt Loom / quilt.mod.json |
| 01 | \`01-registry.mdc\` | QSL vs FAPI Registry（必读） |
| 05 | \`05-events.mdc\` | 仅 QSL 分叉；否则指向 ${fab} 的 05 |
| 02–04, 06–10 | **不要本目录找** | 打开 \`${fab}/.cursor/rules/\` |

\`query_api\` 仅当 ${ver} 落在 Parchment 窗口（约 1.16.5–1.20.4）。平台 API 用 \`search_docs({platform:"quilt"})\`。QSL 专用查询禁止把 Fabric Registry 当命中。
`,
  );
  w(
    `quilt/${ver}/.cursor/rules/00-project-setup.mdc`,
    `# 00 — Quilt 项目结构

> 适用：Quilt ${ver}。方块/物品细节读 \`${fab}/.cursor/rules/02-block.mdc\` 等。

## 约束

- Java **${java}**；\`id 'org.quiltmc.loom'\`（不要混用 \`fabric-loom\` 当主插件）
- 元数据：\`src/main/resources/quilt.mod.json\`，id 在 \`quilt_loader.id\`，全小写无 \`-\`
- 入口：Quilt Loader \`org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)\`（\`entrypoints.init\`）。禁止用 Fabric \`onInitialize()\` 记忆冒充 QSL 专用 API
- 官方 Loom 版本对照 docs.quiltmc.org / 官方模板，禁止臆造 snapshot 号
- \`diagnose_gradle\` 对 Quilt Loom 会拒绝；改 \`search_docs({platform:"quilt"})\`

## Decision Flow

\`\`\`
→ IF 只有 fabric.mod.json 且无 quilt.mod.json / quilt-loom → 这是 Fabric，去 ${fab}
→ IF quilt.mod.json 或 quilt-loom → 本规则集
\`\`\`
`,
  );
  w(
    `quilt/${ver}/.cursor/rules/01-registry.mdc`,
    `# 01 — Quilt 注册（QSL ≠ FAPI Registry）

> 适用：Quilt ${ver}。**禁止编造 \`QuiltRegistry.register()\`。** 未核实的 QSL 方法名：停止生成，改 \`search_docs({platform:"quilt"})\` 或 QSL 源码 / loader-api-summaries。

## 核心事实（已核实）

- QSL Core Registry 与 Fabric API Registry **不完全相同**（Addition Events Helper、按条目排除同步等）
- Quilted Fabric API 在 **有 QSL 替代** 处 **弃用** 对应 FAPI 模块
- 简单物品/方块仍可用 **Vanilla** \`Registry.register(Registries.*, id, value)\`（与 Fabric 共享，不是 FAPI 专属）
- **不要**生成 \`net.fabricmc.fabric.api.event.registry\` / \`FabricRegistryBuilder\` / \`RegistrySyncManager\` 当作 QSL

## Decision Flow

\`\`\`
Decision: 注册方式
→ 简单 Item/Block/BlockEntity → Vanilla Registry.register（在 org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer) 中）
→ 需要注册表同步/条目附件/QSL 专属 → 只使用 org.quiltmc.qsl.* 已核实 API；不清楚就拒绝臆造
→ 禁止：把 Fabric Registry 教程改名交差
\`\`\`

对照：https://wiki.quiltmc.org/en/concepts/qsl-qfapi
`,
  );
  w(
    `quilt/${ver}/.cursor/rules/05-events.mdc`,
    `# 05 — Quilt 事件差异

> 默认读 \`${fab}/.cursor/rules/05-events.mdc\`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。

- QSL 生命周期/注册事件 ≠ \`net.fabricmc.fabric.api.event.lifecycle\`
- 不清楚方法名 → \`search_docs({platform:"quilt"})\`；无独立树时 QSL 查询会 \`PLATFORM_DATA_MISSING\`，**不会**回退 Fabric Registry 页
- 通用 Mixin / 数据包问题可回退 Fabric 文档（已过滤 FAPI 专属类）
`,
  );
  w(
    `quilt/${ver}/knowledge/common/quilt-mod-json.md`,
    `# quilt.mod.json（摘要）

\`schema_version\` + \`quilt_loader\`：\`id\`, \`version\`, \`group\`, \`entrypoints\`, \`depends\`, \`metadata\`。

可与 \`fabric.mod.json\` 共存；**检测时 Quilt 优先**。

不要把 Fabric \`schemaVersion\` 顶层字段当成 Quilt 官方结构。
`,
  );
  w(
    `quilt/${ver}/scaffold/src/main/resources/quilt.mod.json`,
    `{
  "schema_version": 1,
  "quilt_loader": {
    "group": "com.example",
    "id": "examplemod",
    "version": "1.0.0",
    "metadata": {
      "name": "Example Mod",
      "description": "Quilt scaffold"
    },
    "intermediate_mappings": "net.fabricmc:intermediary",
    "entrypoints": {
      "init": ["com.example.examplemod.ExampleMod"]
    },
    "depends": [
      { "id": "quilt_loader", "versions": "*" },
      { "id": "minecraft", "versions": "${ver}" }
    ]
  }
}
`,
  );
  w(
    `quilt/${ver}/scaffold/gradle.properties`,
    `org.gradle.jvmargs=-Xmx2G
minecraft_version=${ver}
# loom / loader 版本对照官方 Quilt 模板，禁止臆造
`,
  );
  w(
    `quilt/${ver}/scaffold/build.gradle`,
    `plugins {
    // 版本号对照 https://docs.quiltmc.org/ 官方模板，不要抄过期 snapshot
    id 'org.quiltmc.loom' version '1.7.4'
    id 'maven-publish'
}
java { toolchain { languageVersion = JavaLanguageVersion.of(${java}) } }
version = '1.0.0'
group = 'com.example'
base { archivesName = 'examplemod' }
repositories { maven { url = 'https://maven.quiltmc.org/repository/release' } }
dependencies {
    minecraft "com.mojang:minecraft:\${project.minecraft_version}"
    mappings "net.fabricmc:yarn:\${project.minecraft_version}+build.1:v2"
    modImplementation "org.quiltmc:quilt-loader:0.26.0"
    // QSL：按模块引入 org.quiltmc.qsl.*，不要把 fabric-api 整包当 QSL
}
`,
  );
  w(
    `quilt/${ver}/scaffold/src/main/java/com/example/examplemod/ExampleMod.java`,
    `package com.example.examplemod;

import org.quiltmc.loader.api.ModContainer;
import org.quiltmc.loader.api.entrypoint.ModInitializer;

public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize(ModContainer mod) {
        // 简单注册用 Vanilla Registry.register；不要调用 Fabric RegistrySync
    }
}
`,
  );
}

quiltTree("1.18.2", 17);
quiltTree("1.19.4", 17);
quiltTree("1.20.1", 17);
quiltTree("1.20.4", 17);
quiltTree("1.21.1", 21);

// ── Bedrock ──────────────────────────────────────────────────────────────
w(
  "bedrock/AGENTS.md",
  `# 基岩版 Add-On — Agent 总纲

与 Java 模组 **零共享**：无 Gradle、无 Mixin、无 \`query_api\`、无 Yarn。规则编号 **不是** Java 的 DeferredRegister 系列。

打开含 \`manifest.json\`（\`format_version\` + \`modules\`）的包 → 本目录。

| 编号 | 文件 | 主题 |
|------|------|------|
| 00 | 工程目录 RP/BP/SP、UUID、min_engine_version |
| 01 | manifest |
| 02 | 资源包 |
| 03 | 行为包 |
| 04 | 实体成对 |
| 05 | 方块/物品 JSON |
| 06 | Molang |
| 07 | Script API（实验开关分层） |
| 08 | 世界生成 JSON |
| 09 | 反模式 |
| 10 | 发布 mcpack |

文档：\`search_bedrock_docs\`（带 \`docsStatus\`）。\`diagnose_gradle\` / \`convert_mapping\` / \`query_api\` / \`mixin_analyze\` 必须拒绝并改口。

库 Skill：\`knowledge/libs/bedrock-only/\`。禁止 CCA/Trinkets/GeckoLib。

${IDE}
`,
);

const beRules = {
  "00-project-setup": `# 00 — 基岩包结构

- 目录：\`RP/\`（resources）+ \`BP/\`（data）+ 可选 \`SP/\`（script 可放在 BP \`scripts/\`）
- 每个 manifest 的 header.uuid 与 module.uuid **必须不同**
- \`min_engine_version\` 为 \`[major, minor, patch]\` 数组
- 不要套 Java \`src/main/java\`
`,
  "01-manifest": `# 01 — manifest.json

- \`format_version\`、\`header\`（name/description/uuid/version/min_engine_version）、\`modules\`
- module.type：\`resources\` | \`data\` | \`script\` | \`world_template\`
- **禁止** \`"experimentalGameplay": true\`
- \`capabilities\` 仅 chemistry / script_eval / raytraced / pbr（现行 Learn）。这 **不是** 世界 Beta APIs 开关
- 校验：\`validate_addon_manifest\`（不是 \`validate_project\`）
`,
  "02-resource-pack": `# 02 — 资源包

纹理、terrain_texture、item_texture、attachables、sounds.json、client entity。
不要把 Java \`assets/<modid>/models\` 路径当基岩 RP。
`,
  "03-behavior-pack": `# 03 — 行为包

实体/方块/物品 JSON、战利品、合成、spawn。\`validate_bp_json\` 精简校验，不是 Java \`validate_datapack_json\`。
`,
  "04-entity": `# 04 — 实体成对

client_entity（RP）与 \`minecraft:entity\`（BP）identifier 必须一致。
不要用 Java EntityType / DeferredRegister。
`,
  "05-blocks-items": `# 05 — 方块与物品 JSON

BP \`minecraft:block\` / \`minecraft:item\` + RP 纹理引用。identifier 必须 \`namespace:name\`。
`,
  "06-molang": `# 06 — Molang

表达式用 Molang，不是 Java / JavaScript。查询 \`q.\` / \`v.\` 以 Learn 为准，禁止臆造。
`,
  "07-script-api": `# 07 — Script API 与实验开关

默认 **stable** \`@minecraft/server\`。用户点名 Beta 才允许。

## Decision Flow（禁止一刀切）

\`\`\`
→ 未点名 Beta → 只生成 stable；不写 Beta 事件
→ 点名 @minecraft/server-beta 或 Beta 事件（如 BlockExplodeAfterEvent）
    → 允许生成；回复必须写「须在世界设置打开 Beta APIs」
    → pack：dependencies 声明 beta 模块
    → 需要 eval 才写 capabilities: ["script_eval"]
    → 禁止 experimentalGameplay、禁止虚构 worldgen/experimental.json
→ min_engine_version < 约 1.19.80：对照该引擎归档，不要倒灌现行 capabilities
→ ≥ 1.19.80：世界实验走 level.dat experiments.gametest；pack 不能替玩家打开
\`\`\`

滞后：\`search_bedrock_docs\` 的 docsStatus.stale **不是**拒绝令。
`,
  "08-worldgen": `# 08 — 基岩世界生成 JSON

feature / biome / structure 在 BP \`worldgen/\`。这是 jigsaw/feature JSON，**不是** Beta APIs 开关存放处。
`,
  "09-anti-patterns": `# 09 — 基岩反模式

- 错 UUID / RP 与 BP identifier 对不上
- 用 Java query_api 查 Script API
- 一律写 experimentalGameplay
- 发明 worldgen/experimental.json 当开关
`,
  "10-publish": `# 10 — 发布

.mcpack / .mcaddon、市场、BDS。实验室调试用 Minecraft Preview / Editor，不要用 ForgeGradle。
`,
};
for (const [name, body] of Object.entries(beRules)) {
  w(`bedrock/.cursor/rules/${name}.mdc`, body);
}
w(
  "bedrock/knowledge/common/experiments.md",
  `# 实验开关分层

| 层 | 写什么 | 哪里 |
|----|--------|------|
| Pack 能力 | capabilities（script_eval 等） | manifest.json |
| Script 模块 | dependencies 里 @minecraft/server 的 beta | BP manifest |
| 世界实验 | experiments.gametest=1 | level.dat / 游戏 UI「Beta APIs」 |

Learn: Experimental Features Toggle。wiki.bedrock.dev/nbt/enabling-experiments。
`,
);
w(
  "bedrock/scaffold/RP/manifest.json",
  JSON.stringify(
    {
      format_version: 2,
      header: {
        name: "Example RP",
        description: "scaffold",
        uuid: "aaaaaaaa-bbbb-4ccc-addd-eeeeeeeeeee1",
        version: [1, 0, 0],
        min_engine_version: [1, 21, 0],
      },
      modules: [{ type: "resources", uuid: "aaaaaaaa-bbbb-4ccc-addd-eeeeeeeeeee2", version: [1, 0, 0] }],
    },
    null,
    2,
  ) + "\n",
);
w(
  "bedrock/scaffold/BP/manifest.json",
  JSON.stringify(
    {
      format_version: 2,
      header: {
        name: "Example BP",
        description: "scaffold",
        uuid: "aaaaaaaa-bbbb-4ccc-addd-eeeeeeeeeee3",
        version: [1, 0, 0],
        min_engine_version: [1, 21, 0],
      },
      modules: [
        { type: "script", uuid: "aaaaaaaa-bbbb-4ccc-addd-eeeeeeeeeee4", version: [1, 0, 0], language: "javascript", entry: "scripts/main.js" },
      ],
      dependencies: [{ module_name: "@minecraft/server", version: "1.11.0" }],
    },
    null,
    2,
  ) + "\n",
);
w(
  "bedrock/scaffold/BP/scripts/main.js",
  `import { world } from "@minecraft/server";
world.afterEvents.playerSpawn.subscribe(() => {
  console.warn("example pack loaded (stable Script API)");
});
`,
);

// ── LiteLoader ───────────────────────────────────────────────────────────
w(
  "liteloader/1.12.2/AGENTS.md",
  `# LiteLoader 1.12.2 — Agent 总纲

纯客户端加载器。**不要**把 Forge \`RegistryEvent\` 改名交差。

## 两套入口

| 判定 | 读什么 |
|------|--------|
| 有 litemod.json / LiteMod，**无** javafml / @Mod | 只读本目录 |
| 两边都有，且 \`apply plugin: 'net.minecraftforge.gradle.liteloader'\` | 先读 [HYBRID.md](HYBRID.md)，再读 \`forge/1.12.2\` 的 01–03 + 本目录 05/08 |
| 分别 apply 标准 Forge 插件 **和** 另一个 LiteLoader 插件 | **拒绝**生成构建文件 |
| 两边元数据都在但无该专用插件 | **询问用户**，禁止默默当 Forge |

Java 8。映射：混合工程钉 \`mappings = 'stable_39'\`（社区 1.12.2 常见兼容值，来自当时 FG/LiteLoader 文档，不要臆造 snapshot）。

已核实 API（hempflower 镜像 / LiteMod 源码）：

- \`LiteMod\`: \`getVersion()\`, \`init(File)\`, \`upgradeSettings(...)\`
- \`Listener.getName()\`
- \`Tickable.onTick(Minecraft, float, boolean, boolean)\`
- \`ChatFilter.onChat\` / \`ChatListener.onChat\`
- \`OutboundChatListener.onSendChatMessage(CPacketChatMessage, String)\`（混合工程客户端聊天命令用这个）

缺名则拒绝臆造。\`query_api\` 无 1.12 Parchment 完整树。\`diagnose_gradle\` 对 liteloader 插件走轻量模式。

${IDE}
`,
);
w(
  "liteloader/1.12.2/HYBRID.md",
  `# LiteLoader + Forge 混合（1.12.2）

- **注册走 Forge**（\`RegistryEvent\`，读 \`forge/1.12.2\` 的 01–03）
- **Tick/聊天/渲染走 LiteLoader**（本目录 05 / 08）
- **唯一 Gradle 入口**：

\`\`\`groovy
apply plugin: 'net.minecraftforge.gradle.liteloader'
\`\`\`

禁止：\`apply plugin: 'net.minecraftforge.gradle.forge'\` 再另 apply 一个 LiteLoader 插件。

- **MCP 映射必须钉死**，例如：

\`\`\`groovy
minecraft {
    mappings = 'stable_39'
}
\`\`\`

缺映射 → 运行时 \`NoSuchMethodError\` / \`AbstractMethodError\`。

聊天命令（E2E-001）：同时有 \`@Mod\`（Forge 侧）和 \`LiteMod\` + \`OutboundChatListener\`（客户端）。
`,
);

const ll = {
  "00-project-setup": `# 00 — LiteLoader 工程

- Java 8。混合 **只** apply \`net.minecraftforge.gradle.liteloader\`
- 钉死 \`mappings = 'stable_39'\`（或当时文档要求的 channel，禁止臆造）
- 产出 \`.litemod\` / 按 FG 文档打包
- 纯 LiteLoader 不要当 Forge 1.20 跑 \`diagnose_gradle\`
`,
  "01-registry": `# 01 — 注册

- **纯 LiteLoader**：几乎不注册方块/物品；不要生成 Forge RegistryEvent
- **混合**：指向 \`forge/1.12.2/.cursor/rules/01-registry.mdc\`
`,
  "02-block": `# 02 — 方块

纯客户端模组通常不注册方块。混合模式读 Forge 1.12.2 的 02-block。禁止把 1.20 DeferredRegister 抄到 1.12。
`,
  "03-item": `# 03 — 物品

同上。混合 → Forge 1.12.2 的 03-item。
`,
  "04-entity": `# 04 — 实体

纯 LL 一般不注册实体。混合 → Forge 1.12.2 的 04。客户端渲染钩子见 08。
`,
  "05-events": `# 05 — LiteMod 生命周期（混合也不能省）

已核实：

| 接口 | 方法 |
|------|------|
| LiteMod | getVersion(); init(File); upgradeSettings(...) |
| Listener | getName() |
| Tickable | onTick(Minecraft, float, boolean, boolean) |
| ChatFilter / ChatListener | onChat(...) |
| OutboundChatListener | onSendChatMessage(CPacketChatMessage, String) |

HUD/Render 等客户端接口目录还有其它类型；**方法未打开源码则禁止臆造**。
`,
  "06-networking": `# 06 — 网络

LiteLoader 偏客户端。不要生成 1.20 Payload 包。自定义包用 1.12 原版/Forge 网络（混合时读 Forge 06）。
`,
  "07-datagen": `# 07 — 数据

1.12 无现代 DataGen。资源手写 JSON。不要调用 \`generate_datagen\` 当 LiteLoader 工具。
`,
  "08-client-server": `# 08 — 客户端

LiteLoader **几乎全是客户端**。不要在专用服务器假设 LiteMod 存在。混合模组：服务端逻辑走 Forge \`@Mod\`，客户端钩子走 LiteMod。
`,
  "09-anti-patterns": `# 09 — 反模式

- 把工程收成纯 Forge 而丢掉 LiteMod 回调
- 分别 apply Forge + 另一个 LL 插件
- 不钉 mappings 导致 NSME/AME
- 用 Yarn 名
`,
  "10-gui": `# 10 — GUI

1.12 \`GuiScreen\`。混合可走 Forge GUI。不要用 1.16+ Screen/AbstractContainerScreen API。
`,
};
for (const [n, b] of Object.entries(ll)) w(`liteloader/1.12.2/.cursor/rules/${n}.mdc`, b);

w(
  "liteloader/1.12.2/scaffold/pure/src/main/resources/litemod.json",
  `{
  "name": "examplelitemod",
  "version": "1.0.0",
  "mcversion": "1.12.2",
  "revision": "1",
  "author": "example",
  "description": "pure LiteLoader scaffold"
}
`,
);
w(
  "liteloader/1.12.2/scaffold/pure/src/main/java/com/example/examplelitemod/LiteModExample.java",
  `package com.example.examplelitemod;

import java.io.File;
import com.mumfrey.liteloader.LiteMod;

public class LiteModExample implements LiteMod {
    @Override public String getName() { return "examplelitemod"; }
    @Override public String getVersion() { return "1.0.0"; }
    @Override public void init(File configPath) { }
    @Override public void upgradeSettings(String version, File configPath, File oldConfigPath) { }
}
`,
);
w(
  "liteloader/1.12.2/scaffold/hybrid/build.gradle",
  `apply plugin: 'net.minecraftforge.gradle.liteloader'

minecraft {
    version = '1.12.2-14.23.5.2847'
    mappings = 'stable_39'
    runDir = 'run'
}

jar { classifier = '' }
`,
);
w(
  "liteloader/1.12.2/scaffold/hybrid/src/main/resources/litemod.json",
  `{
  "name": "examplehybrid",
  "version": "1.0.0",
  "mcversion": "1.12.2",
  "revision": "1"
}
`,
);
w(
  "liteloader/1.12.2/scaffold/hybrid/src/main/java/com/example/examplehybrid/ForgeEntry.java",
  `package com.example.examplehybrid;

import net.minecraftforge.fml.common.Mod;

@Mod(modid = "examplehybrid", name = "Example Hybrid", version = "1.0.0")
public class ForgeEntry {
}
`,
);
w(
  "liteloader/1.12.2/scaffold/hybrid/src/main/java/com/example/examplehybrid/LiteModExample.java",
  `package com.example.examplehybrid;

import java.io.File;
import com.mumfrey.liteloader.LiteMod;
import com.mumfrey.liteloader.OutboundChatListener;
import net.minecraft.network.play.client.CPacketChatMessage;

public class LiteModExample implements LiteMod, OutboundChatListener {
    @Override public String getName() { return "examplehybrid"; }
    @Override public String getVersion() { return "1.0.0"; }
    @Override public void init(File configPath) { }
    @Override public void upgradeSettings(String version, File configPath, File oldConfigPath) { }

    @Override
    public void onSendChatMessage(CPacketChatMessage packet, String message) {
        // 客户端发出的聊天；自定义命令在此拦截。勿臆造未核实的其它方法名。
    }
}
`,
);

// ── Rift ─────────────────────────────────────────────────────────────────
w(
  "rift/1.13.2/AGENTS.md",
  `# Rift 1.13.2 — Agent 总纲

短命加载器。方法名 **只许** 来自 \`knowledge/common/\` 与已核实源码，**禁止**用 Fabric \`ModInitializer\` / \`onInitialize\` 记忆填写。

- 元数据官方拼写：**\`riftmod.json\`**（兼容误写 \`rift.mod.json\`）
- Gradle：\`apply plugin: 'net.minecraftforge.gradle.tweaker-client'\`
- Java 8；\`tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'\`
- dimdev.org maven 可能已死 → scaffold 用 \`libs/\` 备用，禁止写死失效仓库当唯一源
- \`search_docs({platform:"rift"})\` **不要**回退 Fabric 文档树
- \`port_project\` 对 Rift 默认 dryRun；Rift→Fabric 只出笔记

已核实 Listener 方法见 \`knowledge/common/listeners.md\`。

${IDE}
`,
);

const riftRules = {
  "00-project-setup": `# 00 — Rift 工程

- \`tweaker-client\` + \`RiftLoaderClientTweaker\` + Java 8
- \`riftmod.json\` 在 \`src/main/resources\`
- 依赖：优先 \`libs/rift-dev.jar\`；wiki 曾写 \`implementation 'org.dimdev:rift:1.0.3-45:dev'\` 与 \`https://www.dimdev.org/maven/\`（实施时可能失效）
`,
  "01-registry": `# 01 — 注册（已核实）

| 接口 | 方法 |
|------|------|
| org.dimdev.rift.listener.BlockAdder | void registerBlocks() |
| org.dimdev.rift.listener.ItemAdder | void registerItems() |
| org.dimdev.rift.listener.BootstrapListener | void afterVanillaBootstrap() |
| org.dimdev.riftloader.listener.InitializationListener | void onInitialization() |

Listener 须 **public 无参构造**；在 riftmod.json 的 \`listeners\` 列出类名。
禁止编造 Fabric Registry.register 当 Rift 入口。
`,
  "02-block": `# 02 — 方块

实现 \`BlockAdder.registerBlocks()\`。其它 \`*Adder\` 仅类名已核实、方法未打开则标未核实，禁止臆造。
`,
  "03-item": `# 03 — 物品

\`ItemAdder.registerItems()\`。
`,
  "04-entity": `# 04 — 实体

目录中有 \`EntityTypeAdder\` **仅类名核实**。缺方法签名则停止生成，提示打开 GitHub \`org.dimdev.rift.listener\` 或 summaries。
`,
  "05-events": `# 05 — Listener

完整类名列表见 knowledge/common/listeners.md。Mixin：\`InitializationListener.onInitialization()\`，建议单独一类。
`,
  "06-networking": `# 06 — 网络

\`CustomPayloadHandler\` / \`PacketAdder\` / \`MessageAdder\` 仅类名核实。不要用 Fabric ServerPlayNetworking 记忆填方法。
`,
  "07-datagen": `# 07 — 数据

无现代 DataGen。资源：\`assets/<id>\` 与 \`data/<id>\`。AT：\`access_transformations.at\`（notch 名）。
`,
  "08-client-server": `# 08 — 客户端

\`listener/client/\` 方法未逐一打开则禁止臆造。wiki 记载 listener 对象可含 \`"side":"client"\`。
`,
  "09-anti-patterns": `# 09 — 反模式

- 写成 \`rift.mod.json\` 当唯一官方名（仅兼容误写）
- 用 Fabric onInitialize
- 写死已死的 dimdev maven 且无 libs/ 备用
- 回退 Fabric 文档树
`,
  "10-gui": `# 10 — GUI

未核实 Rift GUI API。缺名则拒绝；不要抄 Fabric Screen。
`,
};
for (const [n, b] of Object.entries(riftRules)) w(`rift/1.13.2/.cursor/rules/${n}.mdc`, b);

w(
  "rift/1.13.2/scaffold/src/main/resources/riftmod.json",
  `{
  "id": "examplemod",
  "name": "Example Rift Mod",
  "authors": ["example"],
  "listeners": ["com.example.examplemod.ExampleMod"]
}
`,
);
w(
  "rift/1.13.2/scaffold/build.gradle",
  `apply plugin: 'net.minecraftforge.gradle.tweaker-client'

sourceCompatibility = '1.8'
targetCompatibility = '1.8'

minecraft {
    version = '1.13.2'
    mappings = 'snapshot_20180921'
    runDir = 'run'
    tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'
}

repositories {
    // dimdev.org maven 可能已失效；把 rift 的 dev jar 放进 libs/
    flatDir { dirs 'libs' }
}

dependencies {
    implementation name: 'rift-1.0.3-45-dev'
}
`,
);
w(
  "rift/1.13.2/scaffold/libs/README.md",
  `# 将 Rift API/dev jar 放到此目录（例如 rift-1.0.3-45-dev.jar）

wiki 坐标 \`org.dimdev:rift:1.0.3-45:dev\` 的 maven \`https://www.dimdev.org/maven/\` 可能已不可达。不要把失效 URL 当成唯一源。
`,
);
w(
  "rift/1.13.2/scaffold/src/main/java/com/example/examplemod/ExampleMod.java",
  `package com.example.examplemod;

import org.dimdev.rift.listener.BlockAdder;
import org.dimdev.rift.listener.ItemAdder;

public class ExampleMod implements BlockAdder, ItemAdder {
    @Override public void registerBlocks() { }
    @Override public void registerItems() { }
}
`,
);

// ── ModLoader ────────────────────────────────────────────────────────────
w(
  "modloader/1.6.4/AGENTS.md",
  `# Risugami's ModLoader 1.6.4 — Agent 总纲

工程形态：**MCP + Eclipse**，通常无 Gradle。生成代码 **只能**用 [knowledge/common/safe-api.md](knowledge/common/safe-api.md) 内的名字。

- 表外名字 → 停止编造；返回「不在安全 API 表内」
- **不要**默认走 \`get_minecraft_source\` / 现场 MCP CSV
- \`query_api\` 禁用；不要用 Forge 1.7.10 Javadoc 冒充
- \`diagnose_gradle\` 对无 Gradle 工程拒绝

${IDE}
`,
);

const ml = {
  "00-project-setup": `# 00 — 历史 MCP 工作区

给人类维护者：经典 MCP 1.6.4 + Eclipse。**不是** Agent 默认步骤（现代机器极难配齐）。
无 Gradle。入口类名 \`mod_Example\` 继承 \`BaseMod\`。
`,
  "01-registry": `# 01 — BaseMod（仅安全表）

见 knowledge/common/safe-api.md：\`load()\` / \`modsLoaded()\` / \`ModLoader.addRecipe\` / \`addName\`。
禁止 \`DeferredRegister\`、禁止 \`func_*\`。
`,
  "02-block": `# 02 — 方块

只用表内 \`Block\` / \`ModLoader.registerBlock\`。缺名则停。
`,
  "03-item": `# 03 — 物品

表内 \`Item\` / \`ItemStack\` / \`ModLoader.addName\`。
`,
  "04-entity": `# 04 — 实体

仅表内名字（如 \`ModLoader.getUniqueEntityId\`）。无 DistExecutor。
`,
  "05-events": `# 05 — 钩子

表内 \`ModLoader.setInGameHook\` / \`setInGUIHook\`。不要编造 Forge 事件总线。
`,
  "06-networking": `# 06 — 网络

安全表未收录数据包 API → **禁止臆造**。提示补表或提供已反编译源码。
`,
  "07-datagen": `# 07 — 无 DataGen

1.6.4 无数据包生成器。
`,
  "08-client-server": `# 08 — 客户端

仅表内客户端 API。无 \`@OnlyIn(Dist.CLIENT)\`（那是后来的 Forge）。
`,
  "09-anti-patterns": `# 09 — 反模式

- 用 Forge Javadoc 冒充 ModLoader
- 输出 func_* SRG
- 先反编译原版再写 BaseMod 当默认路径
`,
  "10-gui": `# 10 — GUI

仅当安全表收录 Gui 类时才生成。否则拒绝。
`,
};
for (const [n, b] of Object.entries(ml)) w(`modloader/1.6.4/.cursor/rules/${n}.mdc`, b);

w(
  "modloader/1.6.4/knowledge/common/safe-api.md",
  `# 1.6.4 ModLoader 安全 API 表

来源：Risugami's ModLoader 公开 API + MCP 1.6.4 named（写规则时核对）。**表外禁止输出。**

## BaseMod（\`mod_<Name> extends BaseMod\`）

| 方法 | 说明 |
|------|------|
| \`public String getVersion()\` | 版本字符串 |
| \`public void load()\` | 加载期 |
| \`public void modsLoaded()\` | 全部 mod 已 load 之后 |
| \`public String getName()\` | 显示名（若实现） |

## ModLoader

| 方法 | 说明 |
|------|------|
| \`ModLoader.addRecipe(ItemStack, Object...)\` | 有序合成 |
| \`ModLoader.addShapelessRecipe(ItemStack, Object...)\` | 无序合成 |
| \`ModLoader.addName(Object, String)\` | 语言名 |
| \`ModLoader.addLocalization(String, String)\` | 本地化键 |
| \`ModLoader.registerBlock(Block)\` | 注册方块 |
| \`ModLoader.registerBlock(Block, Class)\` | 带 ItemBlock |
| \`ModLoader.registerTileEntity(Class, String)\` | TileEntity |
| \`ModLoader.addSpawn(Class, int, int, int, EnumCreatureType)\` | 生物生成 |
| \`ModLoader.getUniqueEntityId()\` | 实体网络 ID |
| \`ModLoader.setInGameHook(BaseMod, boolean, boolean)\` | 游戏内 tick 钩子 |
| \`ModLoader.setInGUIHook(BaseMod, boolean, boolean)\` | GUI 钩子 |

## 常用 Vanilla（MCP named，1.6.4）

\`ItemStack\`, \`Block\`, \`Item\`, \`World\`, \`World.setBlock\`, \`World.getBlockId\`

不在表内：停止生成，请补表或提供 \`decompile_mod_jar\` 缓存。
`,
);
w(
  "modloader/1.6.4/scaffold/mod_Example.java",
  `package net.minecraft.src;

public class mod_Example extends BaseMod {
    @Override
    public String getVersion() {
        return "1.0.0";
    }

    @Override
    public void load() {
        ModLoader.addName(this, "Example");
    }

    @Override
    public void modsLoaded() {
    }
}
`,
);

// 把已落盘 Rift wiki 编进 L0，便于 search_docs(platform=rift)
function indexKnowledge(platform, ver, source, files) {
  const processed = join(ROOT, "data", `${platform}_${ver}`, source, ver, "processed");
  mkdirSync(processed, { recursive: true });
  const index = [];
  for (const [id, rel] of files) {
    const src = join(ROOT, rel);
    if (!existsSync(src)) continue;
    const body = readFileSync(src, "utf8");
    const dest = join(processed, `${id}.md`);
    writeFileSync(dest, body, "utf8");
    index.push({
      id: `${ver}/${id}`,
      version: ver,
      label: id,
      url: rel,
      tags: [platform],
      priority: "⭐",
      sectionCount: 1,
      source,
      fetchedAt: new Date().toISOString(),
    });
  }
  writeFileSync(
    join(ROOT, "data", `${platform}_${ver}`, source, ver, "index-l0.json"),
    JSON.stringify(index, null, 2),
    "utf8",
  );
}

indexKnowledge("rift", "1.13.2", "rift-docs", [
  ["upstream-readme", "rift/1.13.2/knowledge/common/upstream-readme.md"],
  ["making-mods-wiki", "rift/1.13.2/knowledge/common/making-mods-wiki.md"],
  ["listeners", "rift/1.13.2/knowledge/common/listeners.md"],
]);
indexKnowledge("modloader", "1.6.4", "modloader-docs", [
  ["safe-api", "modloader/1.6.4/knowledge/common/safe-api.md"],
]);
indexKnowledge("liteloader", "1.12.2", "liteloader-docs", [
  ["hybrid", "liteloader/1.12.2/HYBRID.md"],
  ["verified-api", "liteloader/1.12.2/knowledge/common/verified-api.md"],
]);

console.log("five-platform trees written");
