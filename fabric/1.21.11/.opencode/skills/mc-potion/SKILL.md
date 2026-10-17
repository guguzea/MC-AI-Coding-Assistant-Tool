---
name: mc-potion
description: 药水与酿造。触发词：Potion、BrewingRecipe
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-potion

> 本档正文的类名/签名只来自 `data/fabric_1.21.11` 本档语料：页面 `fabric-docs/1.21.11/processed/develop_items_potions.md`，代码 `reference/1.21.11/src/main/java/com/example/docs/potion/ExampleModPotions.java`；与本档 `mc-effect.md`（同域样板）互指。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.10 / 1.21.3 / 26.1.2）补全。

## 方法名分两层：`addMix`（mojmap）/ `registerPotionRecipe`（Yarn）

入口类 `FabricBrewingRecipeRegistryBuilder.BUILD` 页面写对了；但**回调形参的方法名分两层**（真构件实测，不是页面口径问题）：

- 盘上参考代码（mojmap 工程）调 `builder.addMix(Holder<Potion>, Item, Holder<Potion>)`。
- 本档 yarn 侧的等价方法名是 **`builder.registerPotionRecipe(RegistryEntry<Potion>, Item, RegistryEntry<Potion>)`**；**yarn 侧没有 `addMix`**（javap @ yarn 1.21.11+build.6：`BrewingRecipeRegistry.Builder` 只有 `registerItemRecipe` / `registerPotionType` / `registerPotionRecipe` / `registerRecipes`）。
- 页面参数三元组（`Holder<Potion> input` / `Item item` / `Holder<Potion> output`）与两侧签名一致，**参数面可信**。
- 回调形参的实际类型是 vanilla `net.minecraft.recipe.BrewingRecipeRegistry.Builder`（不是本档自造类型）；`BrewingRecipeRegistry` 这个类名不出现在参考代码 import 面里。

## 注册 Potion：走 Holder

页面原话：跟注册效果一样，这里用 `Registry.registerForHolder`，因为「大多数使用药水的原版方法更偏好 holder」。所以字段类型是 `Holder<Potion>`：

```java
public class ExampleModPotions implements ModInitializer {
	public static final Holder<Potion> TATER_POTION =
			Registry.registerForHolder(
					BuiltInRegistries.POTION,
					Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "tater"),
					new Potion("tater",
							new MobEffectInstance(
									ExampleModEffects.TATER,
									3600,
									0)));
```

**Yarn 等价**（本档 `scaffold` 钉 yarn；换名后同结构，逐名出处见文末映射口径表）：

```java
public class ExampleModPotions implements ModInitializer {
	public static final RegistryEntry<Potion> TATER_POTION =
			Registry.registerReference(
					Registries.POTION,
					Identifier.of(ExampleMod.MOD_ID, "tater"),
					new Potion("tater",
							new StatusEffectInstance(
									ExampleModEffects.TATER,
									3600,
									0)));
```

该参考文件的 import 面（照抄即用）：`net.minecraft.core.Holder`、`net.minecraft.core.Registry`、`net.minecraft.core.registries.BuiltInRegistries`、`net.minecraft.resources.Identifier`、`net.minecraft.world.effect.MobEffectInstance`、`net.minecraft.world.item.Items`、`net.minecraft.world.item.alchemy.Potion`、`net.minecraft.world.item.alchemy.Potions`、`net.fabricmc.api.ModInitializer`、`net.fabricmc.fabric.api.registry.FabricBrewingRecipeRegistryBuilder`、`com.example.docs.ExampleMod`、`com.example.docs.effect.ExampleModEffects`。

- 本档 `Potion` 构造形态是**双参**：`new Potion(String, MobEffectInstance...)`（Yarn：`Potion(String, StatusEffectInstance...)`），示例第一参数 `"tater"`。**javap 实测两侧都只有这一个公开构造器**（mojmap `net.minecraft.world.item.alchemy.Potion` / yarn `net.minecraft.potion.Potion`），没有其它重载。
- `Identifier` 工厂在本档内有两种写法：本页参考代码用 `Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "tater")`，而 `01-registry.mdc:16` 钉的是 `Identifier.of(MOD_ID, "registry_name")`（并说明 1.21 的构造器是 private，不要写 `new Identifier(...)`，也不要抄 mojmap 的 `ResourceLocation`）。跟工程既有写法保持一致，不要混。
- 禁止 `new` 完就丢，注册必须走 `Registry`（`01-registry.mdc`）。

## MobEffectInstance 参数面（页内表格）

`new Potion(...)` 收 `MobEffectInstance`，页面给出 3 个参数：

| 参数 | 页内类型 | 说明 |
| --- | --- | --- |
| 效果 | `Holder<MobEffect> type` | 以 holder 表示的效果；页面只说「vanilla 的 `MobEffects` 类」，未给包名 |
| `int duration` | int | **游戏 tick**，不是秒；示例 `3600` |
| `int amplifier` | int | 叠加值，Haste II ⇒ amplifier `1` |

自定义效果本体见同档 `develop_entities_effects.md`（`mc-effect`）。

## 酿造注册：BUILD 事件

药水进了注册表只是有这瓶东西；要能在酿造台出成品，得在 `onInitialize()` 里挂 `FabricBrewingRecipeRegistryBuilder.BUILD`：

```java
	@Override
	public void onInitialize() {
		FabricBrewingRecipeRegistryBuilder.BUILD.register(builder -> {
			builder.addMix(
					// Input potion.
					Potions.WATER,
					// Ingredient
					Items.POTATO,
					// Output potion.
					TATER_POTION
			);
		});
	}
```

**Yarn 等价**（回调形参是 vanilla `BrewingRecipeRegistry.Builder`：mojmap 侧方法名 `addMix`，Yarn 侧是 `registerPotionRecipe(RegistryEntry, Item, RegistryEntry)`——javap @ yarn 1.21.11+build.6，且 **yarn 侧没有 `addMix`**）：

```java
	@Override
	public void onInitialize() {
		FabricBrewingRecipeRegistryBuilder.BUILD.register(builder -> {
			builder.registerPotionRecipe(
					// Input potion.
					Potions.WATER,
					// Ingredient
					Items.POTATO,
					// Output potion.
					TATER_POTION
			);
		});
	}
```

页内参数表（原文挂的名词见上节的不一致说明）：

- `Holder<Potion> input` — 起始药水，一般是水瓶或粗劣药水（示例 `Potions.WATER`）。
- `Item item` — 主材料（示例 `Items.POTATO`）。
- `Holder<Potion> output` — 结果药水。

- 因为本档字段已经是 `Holder<Potion>`，实参**直接传 `TATER_POTION`**，本档页面与代码里没有出现 `BuiltInRegistries.POTION.wrapAsHolder(...)` 这种转换写法。
- `Potions.WATER` 的声明类型已核实：**`RegistryEntry<Potion>`**（javap @ yarn 1.21.11+build.6 的 `net.minecraft.potion.Potions.WATER`），可直接当 Holder/RegistryEntry 实参传。
- `BUILD.register(...)` 的 lambda 形参类型已核实：`BUILD` 是 `Event<FabricBrewingRecipeRegistryBuilder.BuildCallback>`，`BuildCallback` 的唯一抽象方法 `build(net.minecraft.recipe.BrewingRecipeRegistry.Builder)` ⇒ lambda 形参就是 vanilla **`BrewingRecipeRegistry.Builder`**（javap @ FAPI `fabric-content-registries-v0` + 本档 yarn jar）。
- 注册后用马铃薯即可酿出 Tater 药水（页内配图 `/assets/develop/tater-potion.png`）。

## 资源与本地化

本档参考资源命名空间是 `example-mod`（`reference/1.21.11/src/main/resources/assets/example-mod/...`），该目录下**没有 lang 文件**；语言键本身已按本档原版资源核实（客户端 jar `assets/minecraft/lang/en_us.json`）：

- 普通药水：`item.minecraft.potion.effect.<potion path>`（原版逐字例：`item.minecraft.potion.effect.fire_resistance` = "Potion of Fire Resistance"）。
- 喷溅/滞留：`item.minecraft.splash_potion.effect.<path>` / `item.minecraft.lingering_potion.effect.<path>`。
- 自定义 `mymod:tater` 药水的路径是 `tater`，所以显示名写 `"item.minecraft.potion.effect.tater": "Potion of Tater"`（按同上规则推得；原版没有 `tater` 条目本身）。

药水模型/纹理本档参考资源没有；需要时按 `mc-model` 的物品模型流程生成。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.11/reference/1.21.11/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `MobEffectInstance` | `StatusEffectInstance` | 1.14.4–1.21.11 | join（`net.minecraft.entity.effect.StatusEffectInstance`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |
| `Potion` | `Potion` | 两者同名，包不同 | chain（mojmap `net.minecraft.world.item.alchemy.Potion` → yarn `net.minecraft.potion.Potion`） |
| `Potions` | `Potions` | 同上 | chain（→ yarn `net.minecraft.potion.Potions`） |
| `Holder` | `RegistryEntry` | 1.19.4–1.21.11 | chain（`client-1.21.11.txt` → 本档 yarn sqlite） |

**成员级换名**（上面代码块用到的）：

| mojmap | Yarn | 依据 |
| --- | --- | --- |
| `Potion` 构造 `(String, MobEffectInstance...)` | `Potion(String, StatusEffectInstance...)` | javap @ yarn 1.21.11+build.6 |
| `Registry#registerForHolder(..)` | `Registry#registerReference(..)` | javap @ 同上 |
| `Identifier.fromNamespaceAndPath(a,b)` | `Identifier.of(a,b)` | javap @ 同上 |
| `BuiltInRegistries.POTION` | `Registries.POTION`（**字段名同名**） | javap @ 同上 |
| `BrewingRecipeRegistry.Builder#addMix(..)` | `BrewingRecipeRegistry.Builder#registerPotionRecipe(..)` | javap @ 同上（**yarn 侧无 `addMix`**） |

- 类名级行由本档 `mappings/yarn-mappings.sqlite` 证实**存在与包路径**；成员级行另以 **javap 真构件**或 **`client-1.21.11.txt` → 本档 yarn sqlite 的链路**核实过（中轴文件不入库）。未列出的签名仍须 `get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources` 核实。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- `PotionContents` / `PotionUtil`：本档 `processed/` 全量检索**零命中**，本档不存在这两个入口，不要写。
- 可饮用的自定义药水物品（`PotionItem` / `use`）：本档药水页全程只注册 `Potion`。`use` 的返回类型（`TypedActionResult` / `ActionResult` 家族）出现在同档 `develop_items_custom-item-interactions.md`、`develop_events.md`、`develop_debugging.md`、`develop_blocks_block-containers.md`，要写必须先读那些页。
- 酿造台方块 / 界面 / `BrewingStand`：本档语料零命中，无可引类名。
- `BrewingRecipeRegistry.registerPotionRecipe` **已核实存在**（不是「未核实」）：javap @ yarn 1.21.11+build.6 的 `net.minecraft.recipe.BrewingRecipeRegistry$Builder` 有 `registerPotionRecipe(RegistryEntry<Potion>, Item, RegistryEntry<Potion>)`；mojmap 侧同名方法叫 `addMix`。两套名不要混。
- 用 `Ingredient` 作酿造材料（1.20.4 档的 `FabricPotionBrewing`）：本档页面没有该名字 ⇒ 不写。
- 延长 / 增幅 / 腐化等衍生配方链、药水颜色、`Potion` 的 data components 挂载：本档药水页 0 提及 ⇒ 不写。
- 附魔效果面与附魔 datagen：同档另有 `develop_items_custom-enchantment-effects.md`、`develop_data-generation_enchantments.md`，与药水/酿造不同面，未在此引。
- 酿造数据的 datagen：本档药水页无 datagen 片段。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；物品面：`03-item.mdc` / `mc-item`；数据生成：`07-datagen.mdc` / `mc-datagen`
- 效果本体：`mc-effect`（同档页 `develop_entities_effects`）
- 反模式：`09-anti-patterns.mdc`、`fabric/1.21.11/knowledge/antipatterns/`
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_items_potions")`
