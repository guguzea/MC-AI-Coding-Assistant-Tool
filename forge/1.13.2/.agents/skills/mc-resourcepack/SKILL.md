---
name: mc-resourcepack
description: 资源包格式、pack_format、纹理。触发词：resourcepack、assets
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-resourcepack（1.13.2）

> 一手来源：`forge/1.13.2/knowledge/common/resourcepack-format.md`（pack_format 对齐官方 1.13.2-25.0.223 MDK，sha256 钉在 `mcp-server/data/mdk-checksums.json`）。

## Decision Flow

```
→ 方块/物品视觉（blockstate、模型、贴图）→ 本技能
→ 语言文件 → 1.13 起改 JSON（assets/<modid>/lang/<locale>.json，键前缀 block./item.）
→ 配方/战利品 JSON → 1.13 起在 data/（mc-datapack）
→ Java 侧 → mc-registry、01-registry.mdc
```

## pack.mcmeta（已核实）

```json
{ "pack": { "pack_format": 4, "description": "..." } }
```

序列（官方 MDK 实测）：1.12.2 = 3、1.13.2 = 4、1.14.4 = 4、1.15.2 = 5、1.16.5 = 6、1.17.1 = 7；1.18 之前数据包与资源包共用一个号，1.18 起分家。

## 目录结构（本档实证）

```
assets/<modid>/
├── blockstates/<block>.json
├── lang/<locale>.json        # locale 小写，如 en_us
├── models/{block,item}/<name>.json
└── textures/…png
data/<modid>/                # 1.13 起：配方/战利品搬这边
```

⚠️ 贴图目录单/复数：**未核实到唯一正解**——官方语料写 `textures/blocks/`、`textures/items/`，而本包另两处语料写单数 `textures/block/`、`textures/item/`。写工程前先对照原版 jar 实际目录，两边都别当官方保证（速查原文口径）。

## 反模式

- 配方/战利品/进度/函数留在 `assets/` → 1.13 不再生效，挪 `data/`。
- 继续用 `.lang` 或 `tile.foo.name` 键 → 已改 JSON + `block.`/`item.` 前缀。
- 只注册 `Block` 期待有物品形态 → 1.13.2 必须另注册 ItemBlock（同名注册）。
- 模型引用名与注册名不一致 → 紫黑块；用 metadata 表达变体 → 改 `IProperty` 值 + blockstate 按 `属性=值` 命中。
- blockstate 引用不存在的模型路径 / 模型缺 `parent`。

## 下一步

- 完整速查（含 blockstate/物品模型 overrides）：`forge/1.13.2/knowledge/common/resourcepack-format.md`。
- 反模式库：`forge/1.13.2/knowledge/antipatterns/`。
