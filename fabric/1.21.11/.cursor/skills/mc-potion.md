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

## 页面 prose 与盘上代码不一致（必读）

本档页面方向与别档相反：入口类名 `FabricBrewingRecipeRegistryBuilder.BUILD` 页面**写对了**，但方法名页面写的是 `BrewingRecipeRegistry.registerPotionRecipe`，而同页转引的盘上代码调的是 `builder.addMix(...)`：

- `BrewingRecipeRegistry` 这个类名在本档参考代码 import 面里**不存在**。
- 盘上真实调用：`builder.addMix(Holder<Potion>, Item, Holder<Potion>)`（`builder` 即 `BUILD.register(...)` 的回调形参）。
- 页面参数表的标题也写的是 `registerPotionRecipe`，参数三元组（`Holder<Potion> input` / `Item item` / `Holder<Potion> output`）与盘上 `addMix` 实参一致，所以**参数面可信、方法名以盘上为准**。
- 要坐实 `registerPotionRecipe` 是否也存在，用 `query_loader_api(platform=fabric, minecraftVersion=1.21.11)`，禁止凭页面 prose 直接 import。

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

该参考文件的 import 面（照抄即用）：`net.minecraft.core.Holder`、`net.minecraft.core.Registry`、`net.minecraft.core.registries.BuiltInRegistries`、`net.minecraft.resources.Identifier`、`net.minecraft.world.effect.MobEffectInstance`、`net.minecraft.world.item.Items`、`net.minecraft.world.item.alchemy.Potion`、`net.minecraft.world.item.alchemy.Potions`、`net.fabricmc.api.ModInitializer`、`net.fabricmc.fabric.api.registry.FabricBrewingRecipeRegistryBuilder`、`com.example.docs.ExampleMod`、`com.example.docs.effect.ExampleModEffects`。

- 本档 `Potion` 构造形态是**双参**：`new Potion(String, MobEffectInstance...)`，示例第一参数 `"tater"`。其余重载本档未出现 ⇒ `// TODO(未核实)`。
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

页内参数表（原文挂的名词见上节的不一致说明）：

- `Holder<Potion> input` — 起始药水，一般是水瓶或粗劣药水（示例 `Potions.WATER`）。
- `Item item` — 主材料（示例 `Items.POTATO`）。
- `Holder<Potion> output` — 结果药水。

- 因为本档字段已经是 `Holder<Potion>`，实参**直接传 `TATER_POTION`**，本档页面与代码里没有出现 `BuiltInRegistries.POTION.wrapAsHolder(...)` 这种转换写法。
- `Potions.WATER` 能直接当 `Holder<Potion>` 实参传（本档示例即如此），其字段声明类型页面未写 ⇒ `// TODO(未核实)`。
- `BUILD.register(...)` 的 lambda 形参类型页面未写 ⇒ `// TODO(未核实)`，不要自拟类型名。
- 注册后用马铃薯即可酿出 Tater 药水（页内配图 `/assets/develop/tater-potion.png`）。

## 资源与本地化

本档参考资源命名空间是 `example-mod`（`reference/1.21.11/src/main/resources/assets/example-mod/...`），但该目录下**没有 lang 文件**，页面也未给任何药水语言键 ⇒ `// TODO(未核实)`。显示名请 `search_fabric_docs(version="1.21.11")` 或反编译原版资源核实后再写，禁止抄别的版本档的键。药水模型/纹理本档参考资源同样没有。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.11/reference/1.21.11/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `MobEffectInstance` | `StatusEffectInstance` | 1.14.4–1.21.11 | join（`net.minecraft.entity.effect.StatusEffectInstance`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- `PotionContents` / `PotionUtil`：本档 `processed/` 全量检索**零命中**，本档不存在这两个入口，不要写。
- 可饮用的自定义药水物品（`PotionItem` / `use`）：本档药水页全程只注册 `Potion`。`use` 的返回类型（`TypedActionResult` / `ActionResult` 家族）出现在同档 `develop_items_custom-item-interactions.md`、`develop_events.md`、`develop_debugging.md`、`develop_blocks_block-containers.md`，要写必须先读那些页。
- 酿造台方块 / 界面 / `BrewingStand`：本档语料零命中，无可引类名。
- `BrewingRecipeRegistry.registerPotionRecipe` 是否真为本档可用 API：只有页面 prose 提到，盘上代码用的是 `addMix` ⇒ 未核实。
- 用 `Ingredient` 作酿造材料（1.20.4 档的 `FabricPotionBrewing`）：本档页面没有该名字 ⇒ 不写。
- 延长 / 增幅 / 腐化等衍生配方链、药水颜色、`Potion` 的 data components 挂载：本档药水页 0 提及 ⇒ 不写。
- 附魔效果面与附魔 datagen：同档另有 `develop_items_custom-enchantment-effects.md`、`develop_data-generation_enchantments.md`，与药水/酿造不同面，未在此引。
- 酿造数据的 datagen：本档药水页无 datagen 片段。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；物品面：`03-item.mdc` / `mc-item`；数据生成：`07-datagen.mdc` / `mc-datagen`
- 效果本体：`mc-effect`（同档页 `develop_entities_effects`）
- 反模式：`09-anti-patterns.mdc`、`fabric/1.21.11/knowledge/antipatterns/`
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_items_potions")`
