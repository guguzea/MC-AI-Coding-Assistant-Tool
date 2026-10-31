---
description: 09 — 反模式（26.2）
---

# 09 — 反模式（26.2）

- ❌ 读 `fabric/1.21.11` 规则或 1.21 wiki 当本版
- ❌ 保留 Yarn `mappings` 行、`modImplementation`、`remapJar`、Java 21
- ❌ 把 `query_api` 当 26.x 有索引（26.1+ 已去混淆，用官方 Mojmap 名）
- ❌ **照抄 26.1.2 的「`gui.setScreen` 是旁路、不是本档」** —— 26.2 语料正文写的就是 `Minecraft.getInstance().gui.setScreen(...)`（`26.2/develop_rendering_gui_custom-screens:43`），旧的 `Minecraft.setScreen` 已删
- ❌ `Minecraft.getMainRenderTarget()` —— 26.2 已删，改用 `Screenshot.grab(Minecraft, boolean)`（javap 实测，`mcp-server/src/generators/playtest-driver.ts:565-570`）
- ❌ 直接写 OpenGL —— 26.2 起有可选 Vulkan 后端，raw OpenGL 不受支持，必须走 `Blaze3D`（`26.2/develop_rendering_basic-concepts:15`）
- ❌ 物品 / 方块共用一个 id 类 —— 26.2 拆成 `ModItemIds` / `ModBlockIds` / `ModBlockItemIds`（`26.2/develop_items_first-item:25`、`26.2/develop_blocks_first-block:30,45`）；原版对应类在 `net.minecraft.references.{ItemIds,BlockIds,BlockItemIds}`（javap 已核，全是 `public static final ResourceKey<…>` 常量）
- ❌ 用 `DataGeneratorInitializer` / `init_data` 当 datagen 入口
- ❌ 为 26.2 再克隆一棵 `data/fabric_26.2`（本档语料已按 latest 面 pin 入库）

## Decision Flow

```
→ 看见邻版 API / Yarn / Forge 包名 → 停，改 search_fabric_docs version=26.2
→ 看见「26.2 博客说…」但没有语料行号 → 按未核实处理
```
