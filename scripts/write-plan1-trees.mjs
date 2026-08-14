import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
function w(rel, text) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text.replace(/\n/g, "\n"), "utf8");
}

const FAB_IDS = {
  project: "26.1.2/develop_getting-started_creating-a-project",
  build: "26.1.2/develop_getting-started_building-a-mod",
  fmj: "26.1.2/develop_loader_fabric-mod-json",
  loom: "26.1.2/develop_loom_index",
  item: "26.1.2/develop_items_first-item",
  itemModels: "26.1.2/develop_items_item-models",
  tools: "26.1.2/develop_items_custom-tools",
  block: "26.1.2/develop_blocks_first-block",
  blockModels: "26.1.2/develop_blocks_block-models",
  be: "26.1.2/develop_blocks_block-entities",
  entity: "26.1.2/develop_entities_first-entity",
  events: "26.1.2/develop_events",
  net: "26.1.2/develop_networking",
  datagen: "26.1.2/develop_data-generation_setup",
  recipes: "26.1.2/develop_data-generation_recipes",
  loot: "26.1.2/develop_data-generation_loot-tables",
  tags: "26.1.2/develop_data-generation_tags",
  mixin: "26.1.2/develop_mixins_bytecode",
  render: "26.1.2/develop_rendering_basic-concepts",
  gui: "26.1.2/develop_rendering_gui_custom-screens",
  keys: "26.1.2/develop_key-mappings",
  porting: "26.1.2/develop_porting_index",
  cmd: "26.1.2/develop_commands_basics",
};

w(
  "fabric/26.1.2/AGENTS.md",
  `# Fabric 26.1.2 — Agent 总纲

> 只适用于 **Minecraft / Fabric 26.1.2**。游戏已去混淆。
> **禁止**读取 \`fabric/1.21.11/.cursor/rules\` 或任何邻版 01–10。
> **禁止**把 \`fabric-wiki\` / 1.21.x wiki 当本版全文。
> 先 \`list_fabric_versions\`，再用 \`search_fabric_docs\`（version=26.1.2）。
> \`query_api\` 对 26.1+ **无索引**。Yarn convert 拒绝。

## 硬约束（来自入库文档，不是邻版记忆）

| 项 | 口径 | 文档 id |
|----|------|---------|
| 移植起点 | 入库 porting 是 **1.21.11 → 26.1** | \`${FAB_IDS.porting}\` |
| 映射 | 去掉 \`mappings\` 依赖；用官方名 | 同上 |
| Java | **25**（porting：不要再用 21） | 同上 |
| Loom 插件 id | \`id "net.fabricmc.fabric-loom"\`（不要旧的 \`id "fabric-loom"\`） | 同上 |
| 依赖配置 | \`implementation\` / \`compileOnly\` / \`api\`，不要 \`modImplementation\` | 同上 |
| 任务名 | \`jar\` 取代 \`remapJar\` | 同上 |
| AW | header \`named\` → \`official\` | 同上 |
| 26.2 | 不要建 \`data/fabric_26.2\` 树；移植页旁路见 \`search_fabric_docs\` \`porting/26.2\` | 计划 2 |

线上 https://docs.fabricmc.net/develop/porting/index 当前可能是 26.1→26.2，与本树入库的 1.21.11→26.1 **不是同一页**。

## 规则文件

00–10 只引用 \`data/fabric_26.1.2\` 能核到的 id。核不到的编号是「未核实、禁止输出」stub，**不是缺文件**。
`,
);

function stub(title, extra) {
  return `# ${title}

**未核实、禁止输出。** 本编号在 \`data/fabric_26.1.2\` 没有独立逐步页或方法签名未写入正文。

改口：\`search_fabric_docs\` version=26.1.2。禁止打开 \`fabric/1.21.11\` 规则顶上。

${extra || ""}
`;
}

w(
  "fabric/26.1.2/.cursor/rules/00-project-setup.mdc",
  `# 00 — 工程（26.1.2）

文档：\`${FAB_IDS.project}\`、\`${FAB_IDS.build}\`、\`${FAB_IDS.fmj}\`、\`${FAB_IDS.loom}\`、\`${FAB_IDS.porting}\`。

## Decision Flow

\`\`\`
→ 新建工程 → Fabric Template Mod Generator（creating-a-project）
→ 从 1.21.11 移植 → 先读 develop_porting_index：Java 25、去掉 mappings、Loom 插件 id 换成 net.fabricmc.fabric-loom、implementation 取代 modImplementation、jar 取代 remapJar
→ 元数据 → fabric.mod.json（develop_loader_fabric-mod-json）
→ 禁止 Yarn；禁止读 1.21.11 规则
\`\`\`
`,
);

w(
  "fabric/26.1.2/.cursor/rules/01-registry.mdc",
  `# 01 — 注册（26.1.2）

物品注册流程见 \`${FAB_IDS.item}\`（ModItems.register + \`Item.Properties\` + 静态 initialize）。
创造栏：该页写明 \`CreativeModeTabEvents.modifyOutputEvent\`。

\`\`\`
→ 物品 → 按 first-item 页的 register 工厂，不要编 DeferredRegister
→ 方块 → \`${FAB_IDS.block}\`
→ 实体 → \`${FAB_IDS.entity}\`
→ 类名以该页 reference 与 search_fabric_docs 为准（去混淆官方名）
\`\`\`
`,
);

w(
  "fabric/26.1.2/.cursor/rules/02-block.mdc",
  `# 02 — 方块

逐步：\`${FAB_IDS.block}\`、模型 \`${FAB_IDS.blockModels}\`、方块实体 \`${FAB_IDS.be}\`。
不要用 Forge BlockBehaviour 记忆顶上；打开上述 id。
`,
);

w(
  "fabric/26.1.2/.cursor/rules/03-item.mdc",
  `# 03 — 物品

逐步：\`${FAB_IDS.item}\`。\`Item.Properties.stacksTo\`。模型 \`${FAB_IDS.itemModels}\`。工具 \`${FAB_IDS.tools}\`。
创造栏事件：\`CreativeModeTabEvents.modifyOutputEvent\`（first-item 正文）。
`,
);

w(
  "fabric/26.1.2/.cursor/rules/04-entity.mdc",
  `# 04 — 实体

逐步：\`${FAB_IDS.entity}\`。渲染概念 \`${FAB_IDS.render}\`。缺签名则停。
`,
);

w(
  "fabric/26.1.2/.cursor/rules/05-events.mdc",
  `# 05 — 事件

\`${FAB_IDS.events}\`：\`net.fabricmc.fabric.api.event.Event\`，回调 \`register()\`。
示例：\`AttackBlockCallback\`、\`LootTableEvents.MODIFY\`。
不要用 Forge \`@SubscribeEvent\`。
`,
);

w(
  "fabric/26.1.2/.cursor/rules/06-networking.mdc",
  `# 06 — 网络

\`${FAB_IDS.net}\`：

1. Record 实现 \`CustomPacketPayload\`，带 \`Identifier\`、\`CustomPayload.Type\`、\`StreamCodec\`
2. 共通：\`PayloadTypeRegistry.clientboundPlay().register\` / \`serverboundPlay().register\`
3. 发：\`ServerPlayNetworking.send\` / \`ClientPlayNetworking.send\`
4. 收：\`ClientPlayNetworking.registerGlobalReceiver\` / \`ServerPlayNetworking.registerGlobalReceiver\`

禁止 SimpleChannel。26.2 的 Vulkan/gui.setScreen 不是本版网络页内容。
`,
);

w(
  "fabric/26.1.2/.cursor/rules/07-datagen.mdc",
  `# 07 — DataGen

\`${FAB_IDS.datagen}\`：模板勾选 Enable Data Generation；或 build.gradle + client 入口 + fabric.mod.json entrypoint。
配方/战利品/标签：\`${FAB_IDS.recipes}\` \`${FAB_IDS.loot}\` \`${FAB_IDS.tags}\`。
run 配置 / \`runDatagen\` 以该页为准。
`,
);

w(
  "fabric/26.1.2/.cursor/rules/08-client-server.mdc",
  `# 08 — 物理端

入口分 main / client（fmj）。按键 \`${FAB_IDS.keys}\`。Mixin \`${FAB_IDS.mixin}\`。
客户端渲染 \`${FAB_IDS.render}\`。不要在服务端调 \`Minecraft.getInstance()\`。
`,
);

w(
  "fabric/26.1.2/.cursor/rules/09-anti-patterns.mdc",
  `# 09 — 反模式（26.1.2）

- 读 \`fabric/1.21.11\` 规则或 1.21 wiki
- 保留 Yarn \`mappings\` 行、\`modImplementation\`、\`remapJar\`、Java 21
- \`query_api\` 当 26.1 有索引
- 把 26.2 博客/Vulkan/\`gui.setScreen\` 当 26.1.2 已核 API（26.1.2 GUI 页仍写 \`Minecraft.getInstance().setScreen\`）
- 为 26.2 克隆整棵 fabric_26.2 文档树
`,
);

w(
  "fabric/26.1.2/.cursor/rules/10-gui.mdc",
  `# 10 — GUI

\`${FAB_IDS.gui}\`：extends \`Screen\`，override \`init\`（可选 \`extractRenderState\` 且必须 super）。
打开：\`Minecraft.getInstance().setScreen(new CustomScreen(...))\`；关闭 \`setScreen(null)\`。
当前屏：\`Minecraft.getInstance().currentScreen\`。
这是 **26.1.2 入库页**；不要用 26.2 博客的 \`gui.setScreen\` 覆盖本页。
`,
);

w(
  "forge/1.7.10/AGENTS.md",
  `# Forge 1.7.10 — 无教程树

本目录 **不是** 完整 00–10 模组教程。1.7.10–1.11.2 只有 javadoc 类名索引，\`semantic: false\`。

改口：\`search_docs({platform:"forge", version:"1.7.10"})\` / forge_javadoc。
不要把 1.12.2/1.16+ Capability、DeferredRegister、DataGen 当本版教程。
`,
);

function unverifiedTree(plat, ver, note) {
  w(
    `${plat}/${ver}/AGENTS.md`,
    `# ${plat} ${ver} — 未核实

${note}

**禁止**从邻版 00–10 复制冒充。源码/MCP named 未逐方法打开前：**禁止输出具体 API**。改口打开该版 GitLab/MCP 或提供 \`decompile_mod_jar\`（摘要必须含 mappingsVersion）。
`,
  );
  const stubBody = (n, t) =>
    `# ${n} — ${t}\n\n**未核实、禁止输出。** 打开 ${ver} 源码后再写。禁止克隆邻版规则。\n`;
  const names = [
    ["00-project-setup", "工程"],
    ["01-registry", "注册"],
    ["02-block", "方块"],
    ["03-item", "物品"],
    ["04-entity", "实体"],
    ["05-events", "事件"],
    ["06-networking", "网络"],
    ["07-datagen", "数据"],
    ["08-client-server", "端分离"],
    ["09-anti-patterns", "反模式"],
    ["10-gui", "GUI"],
  ];
  for (const [f, t] of names) {
    w(`${plat}/${ver}/.cursor/rules/${f}.mdc`, stubBody(f, t));
  }
}

unverifiedTree(
  "liteloader",
  "1.10.2",
  "GitLab 分支 \`1.10.2\` **存在**（http://develop.liteloader.com/liteloader/LiteLoader/tree/1.10.2）。已打开该分支 \`HUDRenderListener\`：\`onPreRenderHUD(int,int)\` / \`onPostRenderHUD(int,int)\`，与 1.12.2 同名。**其余接口未在本树打开**，00–10 保持未核实 stub，避免整棵克隆 1.12.2。",
);
unverifiedTree(
  "liteloader",
  "1.8.9",
  "GitLab 分支 \`1.8.9\` **存在**。已打开 \`HUDRenderListener\` 方法名与 1.12.2 相同。其余未打开 → stub。禁止把 1.12.2 整树复制过来。",
);
unverifiedTree(
  "modloader",
  "1.5.2",
  "MCP named / BaseMod 本树 **尚未打开**。停在未核实。不要克隆 \`modloader/1.6.4\`。",
);
unverifiedTree(
  "modloader",
  "1.2.5",
  "若只剩 \`func_*\` 而无 MCP named：**禁止输出**。本树未打开 1.2.5 named。不要克隆 1.6.4。无 Gradle，即便以后加厚也是 MCP+Eclipse。",
);

w(
  "liteloader/1.10.2/knowledge/common/verified-api.md",
  `# LiteLoader 1.10.2 已核实（极少）

来源：GitLab 分支 1.10.2 \`HUDRenderListener.java\`（2026-08-15 打开）。

| 接口 | 方法 |
|------|------|
| \`com.mumfrey.liteloader.HUDRenderListener\` | \`onPreRenderHUD(int, int)\`；\`onPostRenderHUD(int, int)\`；extends LiteMod |

其它接口：未核实、禁止输出。
`,
);
w(
  "liteloader/1.8.9/knowledge/common/verified-api.md",
  `# LiteLoader 1.8.9 已核实（极少）

来源：GitLab 分支 1.8.9 \`HUDRenderListener.java\`（2026-08-15 打开）。

| 接口 | 方法 |
|------|------|
| \`com.mumfrey.liteloader.HUDRenderListener\` | \`onPreRenderHUD(int, int)\`；\`onPostRenderHUD(int, int)\`；extends LiteMod |

其它接口：未核实、禁止输出。
`,
);
w(
  "modloader/1.5.2/knowledge/common/safe-api.md",
  `# 1.5.2 安全 API

**空表。** 未打开 MCP 1.5.2 named。禁止用 1.6.4 表顶上。
`,
);
w(
  "modloader/1.2.5/knowledge/common/safe-api.md",
  `# 1.2.5 安全 API

**空表。** 未打开 MCP named。若只有 \`func_*\`：禁止输出。
`,
);

console.log("wrote fabric 26.1.2 + extra version stubs");
