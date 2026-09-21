---
name: mc-potion
description: 药水与酿造。触发词：Potion、BrewingRecipe
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-potion

> 本档正文的类名/签名只来自 `data/fabric_1.21.4` 本档语料：页面 `fabric-docs/1.21.4/processed/develop_items_potions.md`，代码 `reference/1.21.4/src/main/java/com/example/docs/potion/FabricDocsReferencePotions.java`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.1 / 1.21.8 / 1.21.11）补全。

## 页面 prose 与盘上代码不一致（必读）

页面写「用 `FabricPotionBrewingBuilder.BUILD` 事件、调用 `PotionBrewing.addMix`」，但同页转引的参考代码盘上真实写法是 `FabricBrewingRecipeRegistryBuilder.BUILD` + `builder.addMix(...)`：

- `FabricPotionBrewingBuilder` 与 `PotionBrewing` 两个名字在本档参考代码的 import 面里**都不存在**，照页面 prose 去 import 会编译失败。
- 盘上唯一真实的 Fabric API 入口：`net.fabricmc.fabric.api.registry.FabricBrewingRecipeRegistryBuilder`。
- 需要逐签名时用 `query_loader_api(platform=fabric, minecraftVersion=1.21.4)`。

## 注册 Potion

注册进 `BuiltInRegistries.POTION`，本档 `Registry.register(...)` 返回裸 `Potion`（不是 Holder）：

```java
public class FabricDocsReferencePotions implements ModInitializer {
	public static final Potion TATER_POTION =
			Registry.register(
					BuiltInRegistries.POTION,
					ResourceLocation.fromNamespaceAndPath(FabricDocsReference.MOD_ID, "tater"),
					new Potion("tater",
							new MobEffectInstance(
									FabricDocsReferenceEffects.TATER,
									3600,
									0)));
```

该参考文件的 import 面（照抄即用）：`net.fabricmc.api.ModInitializer`、`net.fabricmc.fabric.api.registry.FabricBrewingRecipeRegistryBuilder`、`net.minecraft.core.Registry`、`net.minecraft.core.registries.BuiltInRegistries`、`net.minecraft.resources.ResourceLocation`、`net.minecraft.world.effect.MobEffectInstance`、`net.minecraft.world.item.Items`、`net.minecraft.world.item.alchemy.Potion`、`net.minecraft.world.item.alchemy.Potions`、`com.example.docs.FabricDocsReference`、`com.example.docs.effect.FabricDocsReferenceEffects`。

- **本档 `Potion` 构造是双参形态**：`new Potion(String id, MobEffectInstance ...)`，第一个参数是页内/盘上均为 `"tater"` 的字符串。这与 1.21.1 档的单参形态不同，两档互不可抄。
- 可变参数面（一次传多个 `MobEffectInstance`）本档示例只传了一个 ⇒ 其余重载 `// TODO(未核实)`。
- 标识符工厂为本档形态 `ResourceLocation.fromNamespaceAndPath(FabricDocsReference.MOD_ID, "tater")`。
- 禁止 `new` 完就丢，注册必须走 `Registry`（`01-registry.mdc`）。

## MobEffectInstance 参数面（页内表格）

| 参数 | 页内类型 | 说明 |
| --- | --- | --- |
| 效果 | `Holder<MobEffect> type` | 自定义效果或原版效果；页面只说「vanilla 的 `MobEffects` 类」，未给包名 |
| `int duration` | int | **游戏 tick**，不是秒；示例 `3600` |
| `int amplifier` | int | 叠加值，Haste II ⇒ amplifier `1` |

自定义效果本体见同档 `develop_entities_effects.md`（`mc-effect`）。

## 酿造注册：BUILD 事件 + addMix

`Potion` 进注册表只是有这个东西，要能被酿必须在 `onInitialize()` 里挂 `FabricBrewingRecipeRegistryBuilder.BUILD`：

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

页内 `addMix` 的 3 个参数：

- `Holder<Potion> input` — 起始药水的注册表条目，一般是水瓶或粗劣药水（示例 `Potions.WATER`）。
- `Item item` — 主材料（示例 `Items.POTATO`）。
- `Holder<Potion> output` — 结果药水的注册表条目。

- 裸 `Potion` → Holder 的本档真实写法：`BuiltInRegistries.POTION.wrapAsHolder(TATER_POTION)`。
- `BUILD.register(...)` 收一个回调；lambda 形参 `builder` 的具体类型页面未写 ⇒ `// TODO(未核实)`，不要自拟类型名。
- 注册后用马铃薯即可酿出 Tater 药水（页内配图 `/assets/develop/tater-potion.png`）。

## 资源与本地化

本档 `reference/1.21.4/src/main/resources/` 下的资源目录命名空间是 `fabric-docs-reference`（`assets/fabric-docs-reference/...`），但**没有 lang 文件**，页面也未给任何药水语言键 ⇒ `// TODO(未核实)`。显示名要用 `search_fabric_docs(version="1.21.4")` 或反编译原版资源核实后再写；禁止抄别的版本档的键。药水模型/纹理本档参考资源里同样没有。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.4/reference/1.21.4/build.gradle` 写 `mappings loom.officialMojangMappings()`。
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
- 可饮用的自定义药水物品（`PotionItem`、`use`）：本档药水页全程只注册 `Potion`。`use` 的返回类型（`TypedActionResult` / `ActionResult` 家族）出现在同档 `develop_items_custom-item-interactions.md`、`develop_events.md`，要写必须先读那两页。
- 酿造台方块 / 界面 / `BrewingStand`：本档语料零命中，无可引类名。
- 用 `Ingredient` 作酿造材料（1.20.4 档提到的 `FabricPotionBrewing`）：**本档页面没有该名字** ⇒ 本档不写。
- 延长 / 增幅 / 腐化等衍生配方链、药水颜色、`Potion` 的 data components 挂载：本档药水页 0 提及 ⇒ 不写。
- 附魔类效果：同档另有 `develop_items_custom-enchantment-effects.md`，与本主题（药水/酿造）不同面，未在此引。
- 酿造数据的 datagen：本档药水页无 datagen 片段。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；物品面：`03-item.mdc` / `mc-item`；数据生成：`07-datagen.mdc` / `mc-datagen`
- 效果本体：`mc-effect`（同档页 `develop_entities_effects`）
- 反模式：`09-anti-patterns.mdc`；本档核实表：`fabric/1.21.4/knowledge/common/verified-api-1.21.4.md`
- 全文核对：`get_fabric_doc_full(version="1.21.4", id="develop_items_potions")`
