---
name: mc-potion
description: 药水与酿造。触发词：Potion、BrewingRecipe
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-potion

> 本档正文的类名/签名只来自 `data/fabric_1.21.1` 本档语料：页面 `fabric-docs/1.21.1/processed/develop_items_potions.md`，代码 `reference/1.21.1/src/main/java/com/example/docs/potion/ExampleModPotions.java`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.20.4 / 1.21.4 / 1.21.11）补全。

## 页面 prose 与盘上代码不一致（必读）

本档页面写的是「用 `FabricPotionBrewingBuilder.BUILD` 事件、调用 `PotionBrewing.addMix`」，但同页转引的参考代码**盘上真实写法**是 `FabricBrewingRecipeRegistryBuilder.BUILD` + `builder.addMix(...)`：

- 页面提到的 `FabricPotionBrewingBuilder` 在本档参考代码的 import 里**不存在**（只有 `net.fabricmc.fabric.api.registry.FabricBrewingRecipeRegistryBuilder`）⇒ 不要按页面 prose 去 import 一个 `FabricPotionBrewingBuilder`。
- 页面提到的 `PotionBrewing` 类名同样没出现在本档参考代码 import 面（1.20.4 档才直接调 `PotionBrewing.addMix`）。
- 以盘上代码为准；要引 Fabric API 的逐签名，用 `query_loader_api(platform=fabric, minecraftVersion=1.21.1)`。

## 注册 Potion

注册进 `BuiltInRegistries.POTION`，本档 `Registry.register(...)` 返回裸 `Potion`（不是 Holder）：

```java
public class ExampleModPotions implements ModInitializer {
	public static final Potion TATER_POTION =
			Registry.register(
					BuiltInRegistries.POTION,
					ResourceLocation.fromNamespaceAndPath("example-mod", "tater"),
					new Potion(
							new MobEffectInstance(
									ExampleModEffects.TATER,
									3600,
									0)));
```

该参考文件的 import 面（照抄即用）：`net.fabricmc.api.ModInitializer`、`net.fabricmc.fabric.api.registry.FabricBrewingRecipeRegistryBuilder`、`net.minecraft.core.Registry`、`net.minecraft.core.registries.BuiltInRegistries`、`net.minecraft.resources.ResourceLocation`、`net.minecraft.world.effect.MobEffectInstance`、`net.minecraft.world.item.Items`、`net.minecraft.world.item.alchemy.Potion`、`net.minecraft.world.item.alchemy.Potions`。

- 本档参考代码里 `Potion` 只有**单参**构造形态 `new Potion(MobEffectInstance)`；带名字参数的 `new Potion(String, MobEffectInstance)` 在本档未出现 ⇒ `// TODO(未核实)`，别处看到也别抄进本档。
- 标识符工厂是本档形态 `ResourceLocation.fromNamespaceAndPath(...)`，禁止套用邻版写法。
- 禁止 `new` 完就丢，注册必须走 `Registry`（`01-registry.mdc`）。

## MobEffectInstance 参数面（页内表格）

| 参数 | 页内类型 | 说明 |
| --- | --- | --- |
| 效果 | `Holder<MobEffect> type` | 自定义效果或原版效果；页面只说「vanilla 的 `MobEffects` 类」，未给包名 |
| `int duration` | int | **游戏 tick**，不是秒；示例 `3600` |
| `int amplifier` | int | 叠加值，Haste II ⇒ amplifier `1` |

> 注意 `Holder<MobEffect>` 是本档页面的写法：效果侧要拿 Holder（参考代码把 `ExampleModEffects.TATER` 直接塞进去，其类型由 `mc-effect` 那页决定）。自定义效果见同档 `develop_entities_effects.md`。

## 酿造注册：BUILD 事件 + addMix

`Potion` 注册只让它进注册表，能被酿还要在 `onInitialize()` 里挂 `FabricBrewingRecipeRegistryBuilder.BUILD`：

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
					BuiltInRegistries.POTION.wrapAsHolder(TATER_POTION)
			);
		});
	}
```

页内 `addMix` 的 3 个参数（本档已 Holder 化，与 1.20.4 的裸 `Potion` 形态不同）：

- `Holder<Potion> input` — 起始药水的注册表条目，一般是水瓶或粗劣药水（示例 `Potions.WATER`）。
- `Item item` — 主材料（示例 `Items.POTATO`）。
- `Holder<Potion> output` — 结果药水的注册表条目。

- 从裸 `Potion` 取 Holder 的本档真实写法：`BuiltInRegistries.POTION.wrapAsHolder(TATER_POTION)`。
- `BUILD` 的回调形参类型页面未写（示例里以 lambda 形参 `builder` 出现）⇒ `// TODO(未核实)`：不要自拟 `BrewingRecipeRegistry.Builder` 一类类型名。
- 注册后用马铃薯即可酿出 Tater 药水（页内配图 `/assets/develop/tater-potion.png`）。

## 资源与本地化

本档 `reference/1.21.1/src/main/resources/` 下**没有 lang 文件**，页面也没给任何药水相关语言键 ⇒ `// TODO(未核实)`。显示名请 `search_fabric_docs(version="1.21.1")` 或反编译原版资源核实后再写，禁止抄别的版本档的键。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.1/reference/1.21.1/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `MobEffectInstance` | `StatusEffectInstance` | 1.14.4–1.21.11 | join（`net.minecraft.entity.effect.StatusEffectInstance`） |
| `ResourceLocation` | `Identifier` | 1.14.4–1.21.10 | join（`net.minecraft.util.Identifier`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- `PotionContents` / `PotionUtil`：本档 `processed/` 全量检索**零命中**，本档不存在这两个入口，不要写。
- 药水物品本体（`PotionItem`、可饮用自定义物品）：页面全程只注册 `Potion`。`use` 的返回类型（`TypedActionResult` / `ActionResult` 家族）在同档 `develop_items_custom-item-interactions.md` 与 `develop_events.md`，要用先读那两页。
- 酿造台方块 / 界面 / `BrewingStand`：本档语料零命中，无可引类名。
- 用 `Ingredient`（而非 `Item`）作材料：`FabricPotionBrewing` 是 1.20.4 档页面提到的名字，**本档页面没有** ⇒ 本档不写；要确认本档有没有等价入口，走 `query_loader_api`。
- 效果药水的延长 / 增幅 / 腐化等衍生配方链、药水颜色、`Items.POTION` 的 data components 挂载：本档页面 0 提及 ⇒ 不写。
- 酿造数据的 datagen：本档药水页无 datagen 片段。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；物品面：`03-item.mdc` / `mc-item`；数据生成：`07-datagen.mdc` / `mc-datagen`
- 效果本体：`mc-effect`（同档页 `develop_entities_effects`）
- 反模式：`09-anti-patterns.mdc`、`fabric/1.21.1/knowledge/antipatterns/`
- 全文核对：`get_fabric_doc_full(version="1.21.1", id="develop_items_potions")`
