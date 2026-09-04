# Fabric 1.21.11 已核实 API

来源：本档 **1.21.11** 语料 + 本档映射表 + `query_loader_api`。禁止把 1.21.4 / 26.x 文档当本档，也不要把邻版 API 名补进未核实骨架。

证据口径（每条都能在仓库里重跑）：

- `CLI` = `node mcp-server/dist/cli.js <tool> --参数=值` 的真实返回体
- `映射表` = `data/fabric_1.21.11/mappings/yarn-mappings.sqlite`（`classes` / `methods` / `fields`，列含 `named` / `intermediary` / `official`）
- `源码树` = 按需反编译的 1.21.11 yarn / mojmap 源码（`get_minecraft_source` 产物）
- `语料` = `data/fabric_1.21.11/fabric-docs/1.21.11/raw/<page>.md`
- `LIVE` = `maven.fabricmc.net` 实查（截至 2026-09-04）

## 已核实（可用）

| 名称 | 签名 / 形态 | 证据 |
|------|-------------|------|
| `ItemGroupEvents.modifyEntriesEvent` | `Event<ModifyEntries> modifyEntriesEvent(RegistryKey<ItemGroup>)` | CLI（`query_loader_api`，fabric-api 1.21.11 摘要）+ 映射表（`class_5321`=`RegistryKey`、`class_1761`=`ItemGroup`）+ 语料 `develop_items_first-item.md:75` |
| `ItemGroups` 创造栏常量 | `net.minecraft.item.ItemGroups`，18 个常量全部具名，类型 `RegistryKey` | 映射表 `fields` + 源码树（mojmap `CreativeModeTabs.INGREDIENTS` 同形） |
| `ItemGroup.Entries` 回调参数 | `add(ItemConvertible)` / `add(ItemStack)` / `add(…, ItemGroup.StackVisibility)` / `addAll(Collection)` | 映射表 `methods`（owner `net/minecraft/item/ItemGroup$Entries` = `class_7704`） |
| `FabricItemGroupEntries` | 另提供 `prepend` / `addAfter` / `addBefore` | CLI（fabric-api 摘要） |
| `FabricItemGroup.builder()` | `ItemGroup.Builder builder()`（无参；`class_7913` = `ItemGroup$Builder`） | CLI + 映射表 |
| `Item.Settings.sword` / `pickaxe` / `axe` / `hoe` / `shovel` | `(ToolMaterial, float, float) → Item.Settings` | 映射表 `methods` |
| `ToolMaterial` | record；具名常量 `WOOD` / `STONE` / `IRON` / `COPPER` / `DIAMOND` / `GOLD` / `NETHERITE` | 映射表 `fields` |
| `ToolMaterial.applyToolSettings` | `(Settings, TagKey, F, F, F)` | 映射表 `methods` |
| `Item.Settings.maxDamage` / `maxCount` | 具名 `max*` 只有这两个 | 映射表 `methods`（owner `net/minecraft/item/Item$Settings`） |
| `FoodComponent.Builder` | 具名方法只有 `nutrition(int)` / `saturationModifier(float)` / `alwaysEdible()` / `build()` | 映射表 `methods` |
| `Item#use` | `ActionResult use(World, PlayerEntity, Hand)` | 映射表 + 源码树 |
| `Item.postHit` | `void postHit(ItemStack, LivingEntity, LivingEntity)` | 映射表 `methods` |
| `ItemStack.damage` | 具名形态 `(int, LivingEntity, Hand)` / `(int, LivingEntity, EquipmentSlot)` / `(int, PlayerEntity)` | 映射表 `methods` |
| `PlayerEntity#getActiveHand` | `Hand getActiveHand()` | 映射表 `methods` |
| `ActionResult` 常量 | `CONSUME` / `FAIL` / `PASS` / `PASS_TO_DEFAULT_BLOCK_ACTION` / `SUCCESS` / `SUCCESS_SERVER` | 映射表 `fields` |
| `Item` 实现 `ItemConvertible` | `public class Item implements ToggleableFeature, ItemConvertible` | 源码树（yarn）+ 映射表（`ItemConvertible#asItem() → Item`） |

## 已核实为「本档口径下不可用」

写出来即编译失败。措辞用「本档 Yarn 命名下不可用」，不要写成「游戏里没有」。

| 名称 | 结论 | 证据 |
|------|------|------|
| `MiningToolItem` / `DiggerItem` / `PickaxeItem` / `SwordItem` / `ToolItem` | 本档映射表无这些类名；工具走 `Item.Settings` 工具组件 | 映射表 `classes` |
| `TypedActionResult` | 无此类名，`use` 不带泛型 | 映射表 `classes` |
| `ItemGroupEntries`（顶层类） | 只有嵌套 `ItemGroup.Entries` | 映射表 `classes` |
| `ItemGroup` 上的创造栏常量 | 常量在 `ItemGroups`（复数） | 映射表 `fields` |
| `FoodComponent.Builder.hunger` | 只有 `nutrition` | 映射表 `methods` |
| `Item.Settings.maxDamageIfAbsent` | 具名 `max*` 只有 `maxCount` / `maxDamage` | 映射表 `methods` |
| `sendToolBreakStatus` | `PlayerEntity` 145 个具名方法里没有 | 映射表 `methods` |
| `damage(int, LivingEntity, Consumer)` | 无该形态 | 映射表 `methods` |
| `StatusEffects.SPEED` 等具名常量 | `StatusEffects` 41 个字段里只有 `DARKNESS_PADDING_DURATION` 具名，其余 `field_*`；要给状态效果先核具名 | 映射表 `fields` |
| `BlockTags.PICKAXE_MINEABLE` | `BlockTags` 常量全部 `field_*`（Mojmap 侧才叫 `MINEABLE_WITH_PICKAXE`） | 映射表 `fields` |
| `EquipmentSlot.MAINHAND` | `EquipmentSlot` 常量仍是 `field_*` → 用 `player.getActiveHand()` | 映射表 `fields` |
| `Item.postHit` 返回 `boolean` | 本档返回 `void` | 映射表 `methods` |

## 未核实（禁止默写）

- `FabricItemGroup.Builder` 上逐个方法名（`displayName` / `icon` / `registerItems` 之类）—— 只核实到 `builder()` 与返回类型；要写先 `query_loader_api`。
- `ItemGroupEvents.ModifyEntries` 的方法名（摘要表未收嵌套类）。
- `ToolMaterial` record 六个组件的参数名（映射表只有 `comp_*`），含义顺序以官方 `develop_items_custom-tools` 页为准。
- 语料里所有 `@[code transclude]` 占位（本档 raw 页未展开），不要当成「文档没给代码」→ 需要示例时回 CLI / 映射表核名。

## 构建版本（LIVE 实查 2026-09-04）

| 字段 | 制品坐标 | 值 |
|------|----------|-----|
| `loader_version` | `net.fabricmc:fabric-loader` | `0.19.5`（maven-metadata `<latest>` = `<release>`） |
| `fabric_api_version` | `net.fabricmc.fabric-api:fabric-api` | `0.141.6+1.21.11`（1.21.11 线最新构建；`<latest>` 全局值 `0.159.2+26.3` 属 26.x，勿抄） |
| `yarn_mappings` | `net.fabricmc:yarn` | `1.21.11+build.6`（该 MC 版本最新 build） |

Loader 与 Fabric API 是两个不同制品，版本号互不相关。
