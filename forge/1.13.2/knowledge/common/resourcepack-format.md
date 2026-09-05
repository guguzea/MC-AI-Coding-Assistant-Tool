# 资源包格式速查（Forge 1.13.2）

> 本文件只写 1.13.2 档可核实的资源包/模型 JSON 事实。出处逐条见 `temp/` 证据日志；DOCS = `data/forge_1.13.2/forge-docs/1.13.2/processed/`（1.13.x 官方文档语料，`search_forge_docs --version=1.13.2` 的 `versionFallback:false`）。

## pack.mcmeta

```json
{
  "pack": {
    "description": "Example Mod",
    "pack_format": 4
  }
}
```

> 1.13.2 用 `pack_format = 4`：本包 `scaffold/src/main/resources/pack.mcmeta:4` 与 `knowledge/common/datapack-format.md:34,39` 两处一致。
> 序列旁证：1.12.2 = 3、1.14.4 = 5、1.15.2 = 6（各档 `knowledge/common/resourcepack-format.md`）。
> ⚠️ 本包 `.pi/rules/00-project-setup.md:238,243` 写的 **6** 无 scaffold / 语料支撑，属该规则文件陈旧，勿跟。
> ⚠️ 1.13 的**数据包** pack_format 与资源包是否同一编号：**未核实**（本仓两处都记 4，但都没有区分两类 pack）。

## 1.13 的第一件事：`assets/` 与 `data/` 分工

- `assets/` = 客户端可见资源（模型、贴图、语言、粒子等）；`data/` = 玩法数据（配方、战利品表、进度、函数、结构）。mod 自身的 `src/main/resources` 会被当成 pack 参与合并，上层覆盖下层，但 mod 的资源包不可禁用；mod 的数据包可用原版 `/datapack` 命令关闭（DOCS/concepts_resources.md:3）。
- 从 1.12 移植时必须把 advancements / functions / loot tables / recipes / structures 从 `assets/` 搬到 `data/`（`get_migration_guide --route=1.12->1.14 --section="Data packs"`）。
- `data/<domain>/recipes` 与 `data/<domain>/structures` 被原版在**所有**命名空间下保留；自定义数据要再带一层 modid 前缀子目录（如 `data/<modid>/<modid>_machines/...`），否则会被原版当配方解析。
- 所有路径与文件名用 snake_case（小写 + `_`），该约束自 1.11 起强制（DOCS/concepts_resources.md:7、models_introduction.md:7）。

## 目录结构（本档实证）

```
src/main/resources/
├── assets/<modid>/
│   ├── blockstates/<block>.json      # DOCS/conventions_locations.md:13
│   ├── lang/<locale>.json            # :17,19（locale 小写，如 en_us）
│   ├── models/block/<block>.json     # :23
│   ├── models/item/<item>.json       # :23
│   └── textures/…png                 # :27（见下方单复数冲突）
└── data/<modid>/
    ├── recipes/<recipe>.json         # :31
    └── loot_tables/…                 # 本包 datapack-format.md:20-25
```

> ⚠️ 贴图目录单/复数：**未核实到唯一正解**。本档官方语料写 `assets/<modid>/textures/blocks/`、`textures/items/`（`conventions_locations.md:27`、`models_files.md:17` 示例 `examplemod:blocks/test`），而本包 `knowledge/common/datapack-format.md:15-17` 与 `knowledge/patterns/examples/cube-all-resources.md:36` 写单数 `textures/block/`、`textures/item/`。写 1.13.2 工程时先对照原版 jar 的实际目录，再决定引用 id 用 `block/…` 还是 `blocks/…`；两边都别当成官方保证。

## Blockstate JSON

```json
// assets/<modid>/blockstates/my_block.json
{
  "variants": {
    "": { "model": "modid:block/my_block" }
  }
}
```

- `variants` 键写法为本包已核实形式（`knowledge/common/datapack-format.md:41-51`、`knowledge/patterns/examples/cube-all-resources.md:9-15`）。
- blockstate JSON 里的模型路径相对 `models/block`，所以 `examplemod:block` → `assets/examplemod/models/block/block`（DOCS/models_files.md:5）。
- 带属性变体时，键按 `属性=值,属性=值` 拼写（如 `facing=north,powered=false`），旋转用 `"y": 90/180/270` —— 该形式来自邻档 `forge/1.15.2/knowledge/common/resourcepack-format.md:50-62`，对本档仅作版式参考；1.13.2 的属性名必须来自本档方块实际声明的 `IProperty` 名（`PropertyBool.create("<name>")` 等，DOCS/blocks_states.md:40-44），不要照抄邻档属性名。
- DOCS/models_files.md:5 提到 blockstate JSON 有「三种格式（all 3 formats）」，但语料未点名另外两种 → **未核实**（`search_forge_docs --query=multipart --version=1.13.2` 返回 `total:0`）。

## 方块模型 JSON

```json
// assets/<modid>/models/block/my_block.json
{
  "parent": "minecraft:block/cube_all",
  "textures": {
    "all": "modid:block/my_block"
  }
}
```

- JSON 模型引用不带 `.json` 后缀（`minecraft:block/cube_all`，非 `...json`）（DOCS/models_files.md:28）。
- 原版 JSON 模型只能表达 cuboid（立方/长方体）元素，无法表达三角楔形 → 复杂形状要换格式（DOCS/models_files.md:21,26）。
- 模型格式在代码里统一为 `IModel`，非 JSON 格式由 `ICustomModelLoader` 在运行时加载（DOCS/models_files.md:5）。

## 物品模型 JSON

```json
// 方块物品形态：直接继承方块模型
{ "parent": "modid:block/my_block" }

// 普通物品（本档语料形式：parent 不带 minecraft: 前缀）
{
  "parent": "item/generated",
  "textures": { "layer0": "examplemod:items/examplePartial" }
}
```

- `item/generated` + `layer0` 形式实证：DOCS/models_overrides.md:22-25。继承 `builtin/generated` 的物品，每个图层（`layer0`、`layer1`…）对应一个 tint index（DOCS/models_color.md:12）。
- 注册了 `Block` 不等于有物品形态；需要 `ItemBlock` 并注册（DOCS/blocks_blocks.md:32），否则模型/贴图正确也会缺物品。

## 物品属性覆盖（overrides）

```json
{
  "parent": "item/generated",
  "textures": {
    "__comment": "Default",
    "layer0": "examplemod:items/examplePartial"
  },
  "overrides": [
    {
      "__comment": "power >= .75",
      "predicate": { "examplemod:power": 0.75 },
      "model": "examplemod:item/examplePowered"
    }
  ]
}
```

- `predicate` 的语义是「**大于等于**该值即生效」（DOCS/models_overrides.md:20）。
- 配套代码（本档语料原文，注意用 `@SideOnly(Side.CLIENT)`）：`item.addPropertyOverride(new IItemPropertyGetter() { @SideOnly(Side.CLIENT) @Override public float apply(ItemStack stack, @Nullable World world, @Nullable EntityLivingBase entity) { ... } })`（DOCS/models_overrides.md:41-47）。原版在物品构造器里注册属性（:39）。

## 贴图与外部模型格式

- 贴图路径相对 `textures/`；UV 原点在 **左上**，恒为 0–16，非 16² 时按比例缩放；贴图须为正方形且边长为 2 的幂，否则破坏 mipmap；带 `.mcmeta` 动画时可按竖向帧序列为矩形（DOCS/models_files.md:17）。
- OBJ：需 `OBJLoader.addDomain` 注册命名空间，`.mtl` 与 `.obj` 同目录且其中路径要改成 `ResourceLocation`；V 轴翻转用 Forge 扩展块 `"custom": { "flip-v": true }`（与 `"model"` 同级，可加 `"__comment"`）（DOCS/models_files.md:32-40）。
- Blitz3D：`B3DLoader.addDomain` 注册命名空间，接受路径以 `.b3d` 结尾的模型位置（DOCS/models_files.md:42-44）。
- 染色：模型面上写 tint index，由 `IBlockColor`（入参 `IBlockState`、可空 `IBlockAccess`、可空 `BlockPos`、`tintindex`）与 `IItemColor`（入参 `ItemStack`、`tintindex`）返回颜色乘数；注册到 `Minecraft.getMinecraft().getBlockColors()` / `getItemColors()` 的 `registerBlockColorHandler` / `registerItemColorHandler`，必须在客户端 initialization 阶段，且方块染色不会自动作用到其 `ItemBlock`（DOCS/models_color.md:5-18）。

## lang（1.13 起是 JSON）

```json
// assets/<modid>/lang/en_us.json
{
  "item.examplemod.example_item": "Example Item Name",
  "block.examplemod.my_block": "My Block"
}
```

- 文件位置 `assets/[namespace]/lang/[locale].json`，UTF-8 编码（DOCS/concepts_internationalization.md:11）。
- 默认键 = `block.` / `item.` + 注册名（`:`→`.`）；`ItemBlock` 默认取方块键（:25）。
- 从 1.12 迁移：`tile.` 前缀改 `block.`，并去掉尾部 `.name`（Primer §Lang changes）。
- 服务端只有 en_US locale；要让客户端按自己的语言显示，服务端须发 `TextComponentTranslation(String key, Object... args)` 之类的语言中立键，格式符仅支持 `%s` 与 `%1$s`/`%2$s`…（:46,58）。

## 常见错误（1.13 专属）

- ❌ 把配方 / 战利品表 / 进度 / 函数留在 `assets/` → 1.13 不再生效，应挪 `data/`。
- ❌ 继续用 `.lang` 或 `tile.foo.name` 键 → 语言文件已改 JSON 且前缀为 `block.` / `item.`。
- ❌ 只注册 `Block` 就期待有物品形态 → 必须另注册 `ItemBlock`（同名注册）。
- ❌ 模型里写 `modid:block/foo` 但方块注册名是 `bar` → 紫黑块（`knowledge/patterns/examples/cube-all-resources.md:38`）。
- ❌ 用 metadata 数字表达外观变体 → 改用 `IProperty` 值并在 blockstate JSON 里按 `属性=值` 命中。
- ❌ blockstate 引用不存在的模型路径 / 模型缺 `parent`。
- ❌ 贴图非正方形或非 2 的幂边长。
- ❌ 直接抄邻档（1.14.4+）的 `DeferredRegister` / `Properties.of()` / `textures/block` 单复数结论当本档事实。

## 参考

- 本包配套：`knowledge/common/datapack-format.md`（数据包侧布局与配方/战利品 JSON）、`.cursor/skills/mc-model`、`mc-resourcepack`、`mc-datapack`。
- 复核命令：`node mcp-server/dist/cli.js search_forge_docs --query="blockstate" --version=1.13.2` → `get_forge_doc_full --id=1.13.2/models_files`（等）。
