#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖已人工修订的 Fabric 1.21.4/8/10 包）。
 * Write short Fabric 1.21.4 / 1.21.8 / 1.21.10 packs from versioned fabric-docs only.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

function writeRel(rel, text) {
  const abs = join(repo, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

const SKILLS = [
  ["mc-registry", "registry", "Registry.register 在 common initializer。禁止 DeferredRegister。"],
  ["mc-item", "items", "Item.Properties、ItemGroupEvents.modifyEntriesEvent、FuelRegistryEvents.BUILD、CompostableItemRegistry。"],
  ["mc-block", "blocks", "方块注册见 first-block 页。禁止默写邻档 BlockBehaviour 签名。"],
  ["mc-blockentity", "block-entities", "BlockEntity / BlockEntityType；FabricBlockEntityTypeBuilder.Factory 以 block-entities 页为准。"],
  ["mc-events", "events", "Fabric Event 回调。search_fabric_docs query=events。禁止 Forge @SubscribeEvent。"],
  ["mc-networking", "networking", "PayloadTypeRegistry.playS2C/playC2S、CustomPayload.Id、PacketCodec、ServerPlayNetworking / ClientPlayNetworking。"],
  ["mc-datagen", "data-generation", "DataGeneratorEntrypoint#onInitializeDataGenerator。fabric.mod.json fabric-datagen 入口以 setup 页为准。"],
  ["mc-recipe", "recipes", "RecipeProvider 加到 DataGeneratorEntrypoint。"],
  ["mc-loottable", "loot-tables", "战利品 Provider 加到 DataGeneratorEntrypoint。"],
  ["mc-gui", "custom-screens", "Screen 仅客户端。search_fabric_docs query=screens version 写死本档。"],
  ["mc-command", "commands", "命令见 commands/basics。禁止默写 Brigadier 邻档重载。"],
  ["mc-renderer", "rendering", "渲染概念见 rendering/basic-concepts。禁止服务端加载 Renderer。"],
  ["mc-mixin", "mixins", "若本档无独立 mixins 页：search_fabric_docs query=mixin；核不到禁止默写。"],
  ["mc-model", "item-models", "物品/方块模型 JSON 以本档 resources 页为准；无页则禁止默写。"],
];

const RULES = [
  ["00-project-setup", "工程", "Java 21。Loom id net.fabricmc.fabric-loom。文档代码示例用官方 mappings（creating-a-project 页）。download_official_mdk 若无 pin 则 MDK_NOT_PINNED。禁止 Yarn/modImplementation 记忆顶上，以本档文档为准。"],
  ["01-registry", "注册", "Registry.register。禁止 DeferredRegister / GameRegistry。"],
  ["02-block", "方块", "first-block 页。世界里一份 Block 单例。"],
  ["03-item", "物品", "first-item 页：Item.Properties、ItemGroupEvents。"],
  ["04-entity", "实体", "本档若无独立 first-entity 版本化页，禁止默写 EntityType.Builder。改口 search_fabric_docs。"],
  ["05-events", "事件", "Fabric Event；禁止 @SubscribeEvent。"],
  ["06-networking", "网络", "CustomPayload + PayloadTypeRegistry。禁止 SimpleChannel。"],
  ["07-datagen", "DataGen", "DataGeneratorEntrypoint。"],
  ["08-client-server", "端分离", "ClientPlayNetworking 只放客户端入口。"],
  ["09-anti-patterns", "反模式", "禁止拷 fabric/1.21.11 规则或 wiki。禁止把未版本化 github_raw 页当本档 API。"],
  ["10-gui", "GUI", "Custom Screens 页。Screen 只在客户端。"],
];

function writePack(ver) {
  const id = (slug) => `${ver}/${slug}`;
  writeRel(
    `fabric/${ver}/knowledge/common/verified-api-${ver}.md`,
    `# Fabric ${ver} 已核实 API

来源：search_fabric_docs version=${ver}（仅 github_raw_versioned）。禁止把 1.21.11 wiki 当本档。

| 名称 | 出处文档 id |
|------|-------------|
| PayloadTypeRegistry.playS2C / playC2S | ${id("develop_networking")} |
| CustomPayload.Id / PacketCodec | ${id("develop_networking")} |
| ServerPlayNetworking.send / registerGlobalReceiver | ${id("develop_networking")} |
| ClientPlayNetworking.send / registerGlobalReceiver | ${id("develop_networking")} |
| ItemGroupEvents.modifyEntriesEvent | ${id("develop_items_first-item")} |
| CompostableItemRegistry | ${id("develop_items_first-item")} |
| FuelRegistryEvents.BUILD | ${id("develop_items_first-item")} |
| BlockEntity / BlockEntityType | ${id("develop_blocks_block-entities")} |
| FabricBlockEntityTypeBuilder.Factory | ${id("develop_blocks_block-entities")} |
| DataGeneratorEntrypoint#onInitializeDataGenerator | ${id("develop_data-generation_setup")} |
| Item.Properties | ${id("develop_items_first-item")} |
| loom / fabric-loom | ${id("develop_loom_index")} |

核不到的类名写成「以该版文档为准，禁止默写」。
`,
  );

  writeRel(
    `fabric/${ver}/AGENTS.md`,
    `# Fabric ${ver} — Agent 总纲

> 只适用于 **Fabric ${ver}**。文档：search_fabric_docs version=${ver}（先 list_fabric_versions）。**禁止**复制 \`fabric/1.21.11\` 或邻版 wiki。

| 项 | 值 |
|---|---|
| 平台 | Fabric ${ver} |
| Java | **21** |
| 文档 mappings 示例 | 官方名（creating-a-project 页）。工程若用 Yarn 须自行对照，禁止把 class_ 中间名当 API |
| 注册 | Registry.register（search_fabric_docs query=registry version=${ver}） |
| 网络 | PayloadTypeRegistry + CustomPayload |

核实表：knowledge/common/verified-api-${ver}.md。
`,
  );

  writeRel(
    `fabric/${ver}/pack.meta.json`,
    JSON.stringify(
      { status: "ready", "pack-status": "ready", platform: "fabric", minecraftVersion: ver, note: "versioned fabric-docs only; no wiki clone" },
      null,
      2,
    ),
  );

  for (const [file, title, body] of RULES) {
    writeRel(
      `fabric/${ver}/.cursor/rules/${file}.mdc`,
      `---
description: ${file} Fabric ${ver}
alwaysApply: true
---

# ${file} — ${title}（Fabric ${ver}）

来源：search_fabric_docs version=${ver}。核实表 knowledge/common/verified-api-${ver}.md。

${body}
`,
    );
  }

  for (const [name, query, blurb] of SKILLS) {
    writeRel(
      `fabric/${ver}/.cursor/skills/${name}/SKILL.md`,
      `---
name: ${name}
description: Fabric ${ver} ${name}。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "${ver}"
docsTool: search_fabric_docs
---

# ${name}（Fabric ${ver}）

核实表：knowledge/common/verified-api-${ver}.md。
必须 search_fabric_docs query=${query} version=${ver}。核不到禁止默写。

${blurb}

反面：DeferredRegister、SimpleChannel、邻档 Yarn 记忆、1.21.11 wiki。
`,
    );
  }

  writeRel(
    `fabric/${ver}/scaffold/README_AI.md`,
    `# Fabric ${ver} scaffold

只引用 data/fabric_${ver} 已核实口径。search_fabric_docs version=${ver}。
禁止抄 fabric/1.21.11/scaffold。无 wiki。Java 21。Loom：id "net.fabricmc.fabric-loom"。
`,
  );
  writeRel(
    `fabric/${ver}/scaffold/gradle.properties`,
    `mod_version=1.0.0
mod_id=examplemod
maven_group=com.example
minecraft_version=${ver}
org.gradle.jvmargs=-Xmx2G
`,
  );
  writeRel(
    `fabric/${ver}/scaffold/settings.gradle`,
    `pluginManagement {
    repositories {
        maven { url "https://maven.fabricmc.net/" }
        gradlePluginPortal()
        mavenCentral()
    }
}
rootProject.name = "examplemod"
`,
  );
  writeRel(
    `fabric/${ver}/scaffold/build.gradle`,
    `plugins {
    // Loom 版本以 https://fabricmc.net/develop/ 与 search_fabric_docs version=${ver} 为准，禁止默写
    id "net.fabricmc.fabric-loom"
}

version = project.mod_version
group = project.maven_group

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    minecraft "com.mojang:minecraft:\${project.minecraft_version}"
    // mappings / fabric-loader 版本以 search_fabric_docs version=${ver} 与官方模板为准，禁止默写
}

processResources {
    filesMatching("fabric.mod.json") {
        expand "version": project.version
    }
}
`,
  );
  writeRel(
    `fabric/${ver}/scaffold/src/main/resources/fabric.mod.json`,
    `{
  "schemaVersion": 1,
  "id": "examplemod",
  "version": "\${version}",
  "name": "Example Mod",
  "environment": "*",
  "entrypoints": { "main": ["com.example.examplemod.ExampleMod"] },
  "depends": { "fabricloader": "*", "minecraft": "${ver}" }
}
`,
  );
  writeRel(
    `fabric/${ver}/scaffold/src/main/java/com/example/examplemod/ExampleMod.java`,
    `package com.example.examplemod;

import net.fabricmc.api.ModInitializer;

public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        // Registry.register：search_fabric_docs query=registry version=${ver}
        // 以该版文档为准，禁止默写
    }
}
`,
  );
}

for (const ver of process.argv.slice(2)) writePack(ver);
console.log("wrote fabric hollow packs", process.argv.slice(2).join(", "));
