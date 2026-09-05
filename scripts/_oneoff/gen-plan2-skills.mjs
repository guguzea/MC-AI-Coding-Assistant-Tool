#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖已人工修订的 Skill）。
 * Plan 2 A3/A4：生成 Fabric 26.1.2 Skill stub/核实稿，以及 NeoForge 分档主题 Skill。
 * 禁止从 1.21.11 正文抄错 API。核不到的写成 stub。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emit } from "../_lib/write-guard.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const FABRIC_SKILLS = [
  "mc-fabric-api",
  "mc-datagen",
  "mc-dimension",
  "mc-weather",
  "mc-villager",
  "mc-command",
  "mc-multiblock",
  "mc-energy",
  "mc-ai",
  "mc-effect",
  "mc-potion",
  "mc-enchantment",
  "mc-gametest",
  "mc-resourcepack",
  "mc-worldgen",
  "mc-advancement",
  "mc-datapack",
  "mc-structure",
  "mc-loottable",
  "mc-model",
  "mc-renderer",
  "mc-registry",
  "mc-sound",
  "mc-recipe",
  "mc-particle",
  "mc-mixin",
  "mc-networking",
  "mc-kotlin",
  "mc-item",
  "mc-fluid",
  "mc-gui",
  "mc-block",
  "mc-cloth-config",
  "mc-blockentity",
  "mc-entity",
  "mc-capability",
  "mc-compat-jei",
];

const VERIFIED_FABRIC = {
  "mc-registry": `# 注册（Fabric 26.1.2）

文档：\`26.1.2/develop_items_first-item\`、\`26.1.2/develop_blocks_first-block\`。去混淆官方名。禁止 DeferredRegister。禁止 Yarn。

## Decision Flow

\`\`\`
→ 物品/方块 → Registry.register(Registries.*, Identifier.fromNamespaceAndPath(MOD_ID, name), object)
→ 创造栏 → CreativeModeTabEvents.modifyOutputEvent
→ Mixin → fabric.mixins.json，不在 onInitialize 里注册
→ 客户端渲染 → ClientModInitializer
\`\`\`

query_api 对本版无索引。search_fabric_docs version=26.1.2。
`,
  "mc-item": `# 物品（Fabric 26.1.2）

文档：\`26.1.2/develop_items_first-item\`、\`26.1.2/develop_items_item-models\`、\`26.1.2/develop_items_custom-tools\`。

- \`Item.Properties\`（不要 Yarn \`Item.Settings\` 记忆顶上，以该页为准）
- \`stacksTo\`
- 创造栏：\`CreativeModeTabEvents.modifyOutputEvent\`
`,
  "mc-block": `# 方块（Fabric 26.1.2）

文档：\`26.1.2/develop_blocks_first-block\`、\`26.1.2/develop_blocks_block-models\`、\`26.1.2/develop_blocks_block-entities\`。

不要用 Forge BlockBehaviour 记忆顶上。打开上述 id。
`,
  "mc-networking": `# 网络（Fabric 26.1.2）

文档：\`26.1.2/develop_networking\`。

1. Record 实现 \`CustomPacketPayload\`，带 \`Identifier\`、\`CustomPayload.Type\`、\`StreamCodec\`
2. \`PayloadTypeRegistry.clientboundPlay().register\` / \`serverboundPlay().register\`
3. \`ServerPlayNetworking.send\` / \`ClientPlayNetworking.send\`
4. \`ClientPlayNetworking.registerGlobalReceiver\` / \`ServerPlayNetworking.registerGlobalReceiver\`

禁止 SimpleChannel。
`,
  "mc-datagen": `# DataGen（Fabric 26.1.2）

文档：\`26.1.2/develop_data-generation_setup\`。

- 入口：\`DataGeneratorEntrypoint\` + fabric.mod.json \`fabric-datagen\`
- **禁止** \`DataGeneratorInitializer\` / \`init_data\`（那是错 API）
- 配方/战利品/标签页：\`develop_data-generation_recipes\` 等
`,
  "mc-gui": `# GUI（Fabric 26.1.2）

文档：\`26.1.2/develop_rendering_gui_custom-screens\`。

- extends \`Screen\`，override \`init\`
- 打开：\`Minecraft.getInstance().setScreen(...)\`
- 关闭：\`setScreen(null)\`
- **禁止**把 26.2 博客的 \`gui.setScreen\` 当本版 API
`,
};

function stubBody(name, platform, ver, docsTool) {
  return `# ${name}（${platform} ${ver}）

本 Skill **尚未用本版文档核到可执行步骤**。禁止输出方法名/示例代码。

改口：\`${docsTool}\`（version=${ver}）。核不到就停。
`;
}

function writeSkill(dir, name, fmExtra, body) {
  return emit(path.join(dir, name, "SKILL.md"), `${fmExtra}\n${body}`.trimStart());
}

function fabricFm(name, extraDesc) {
  return `---
name: ${name}
description: ${extraDesc || `Fabric 26.1.2 ${name}。核不到则 search_fabric_docs version=26.1.2，禁止输出。`}
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---
`;
}

function neoFm(name, ver, mappings) {
  return `---
name: ${name}
description: NeoForge ${ver} ${name}。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "${ver}"
dependencies: []
mappings: ${mappings}
---
`;
}

const NEO_VERSIONS = [
  { ver: "1.20.4", mappings: "mojmap / NeoForm 官方名（不是 Forge MCP）", loc: "ResourceLocation", java: "21" },
  { ver: "1.21.1", mappings: "mojmap", loc: "ResourceLocation", java: "21" },
  { ver: "1.21.3", mappings: "mojmap", loc: "ResourceLocation", java: "21" },
  { ver: "1.21.8", mappings: "mojmap", loc: "ResourceLocation", java: "21" },
  { ver: "1.21.11", mappings: "mojmap（游戏仍混淆；与 26.1 去混淆不是同一档）", loc: "ResourceLocation", java: "21" },
  { ver: "26.1", mappings: "mojmap-unobfuscated（游戏 jar 已是 Mojang 名）", loc: "Identifier", java: "25" },
];

const NEO_TOPICS = [
  "mc-worldgen",
  "mc-recipe",
  "mc-fluid",
  "mc-sound",
  "mc-mixin",
  "mc-item",
  "mc-block",
  "mc-renderer",
  "mc-model",
  "mc-structure",
  "mc-advancement",
  "mc-loottable",
  "mc-datapack",
  "mc-resourcepack",
  "mc-gametest",
  "mc-enchantment",
  "mc-potion",
  "mc-effect",
  "mc-command",
  "mc-dimension",
];

// 方向不变式（§6.2-18）：本脚本只写 `.cursor/skills` 源稿，永不读回任何投影树
// （`.agents/` `.claude/` `.continue/` `.opencode/` `.pi/` `.trae/` `.zcode/`）。
// `.cursor` 是唯一权威，投影由 scripts/sync-skills.ps1 单向生成；反向复制会让权威倒流。

function main() {
  const fabDir = path.join(ROOT, "fabric", "26.1.2", ".cursor", "skills");
  let written = 0;
  for (const name of FABRIC_SKILLS) {
    const dest = path.join(fabDir, name, "SKILL.md");
    if (fs.existsSync(dest)) continue;
    const body = VERIFIED_FABRIC[name] || stubBody(name, "Fabric", "26.1.2", "search_fabric_docs");
    if (writeSkill(fabDir, name, fabricFm(name), body)) written++;
  }

  for (const { ver, mappings, loc, java } of NEO_VERSIONS) {
    const cursorSkills = path.join(ROOT, "neoforge", ver, ".cursor", "skills");
    const payloadEvent = ver === "1.20.4" ? "RegisterPayloadHandlerEvent（以该版 networking 页为准）" : "RegisterPayloadHandlersEvent";
    for (const name of NEO_TOPICS) {
      const dest = path.join(cursorSkills, name, "SKILL.md");
      if (fs.existsSync(dest)) continue;
      let extra = `Java ${java}。资源 id 类型：\`${loc}\`。禁止从扁平 neoforge/.agents/skills 或邻档复制旧 API。\n`;
      if (name === "mc-item" || name === "mc-block") {
        extra += `\n已核入口：\`DeferredRegister.createItems/createBlocks\`（search_neoforge_docs items/blocks，version=${ver}）。\n`;
      } else if (name === "mc-mixin") {
        extra += `\n先 mixin_analyze；deep 需缓存 jar。\n`;
      } else if (name === "mc-worldgen") {
        extra += `\n文档入口常见 id：worldgen/biomemodifier（以该版 l0 为准）。\n`;
      }
      extra += `\n网络不要用 SimpleChannel。payload 事件：${payloadEvent}。核不到则 search_neoforge_docs version=${ver}，禁止输出。\n`;
      if (writeSkill(cursorSkills, name, neoFm(name, ver, mappings), `# ${name}（NeoForge ${ver}）\n\n${extra}`)) written++;
    }
  }
  console.log(`fabric/26.1.2 + neoforge/<ver> .cursor/skills：实际写入 ${written} 个文件${written === 0 ? "（dry-run 未落盘；加 --write 才写）" : ""}`);
}

main();
