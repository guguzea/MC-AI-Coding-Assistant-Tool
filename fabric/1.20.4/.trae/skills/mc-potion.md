---
name: mc-potion
description: 药水与酿造。触发词：Potion、BrewingRecipe
platform: fabric
version: "1.20.4"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-potion

> 本档正文的类名/签名只来自 `data/fabric_1.20.4` 本档语料：页面 `fabric-docs/1.20.4/processed/develop_items_potions.md`，代码 `reference/1.20.4/src/main/java/com/example/docs/potion/ExampleModPotions.java` 与 `reference/1.20.4/src/main/java/com/example/docs/mixin/potion/BrewingRecipeRegistryInvoker.java`，语言键 `reference/1.20.4/src/main/resources/assets/example-mod/lang/en_us.json`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.20.1 / 1.21.1 / 1.21.4）补全。

## 本档语料的映射口径（先看清再抄）

本档页面与参考代码**自身混用两套名**，抄之前按你的工程映射选一套，不要在同一文件里混：

- 页面正文写 `net.minecraft.entity.effect.MobEffects`（Yarn 包名风格）。
- 同页参考代码的 import 全是 mojmap/官方名：`net.minecraft.world.effect.MobEffectInstance`、`net.minecraft.world.item.alchemy.Potion`、`net.minecraft.world.item.alchemy.PotionBrewing`、`net.minecraft.core.registries.BuiltInRegistries`、`net.minecraft.resources.ResourceLocation`。
- 本档参考代码直接写 `new ResourceLocation("example-mod", "tater")`——构造器在本档可用，**不要**把 1.21.x 档的工厂写法搬过来。

## 注册 Potion

药水跟物品一样要注册，注册进 `BuiltInRegistries.POTION`，本档用 `Registry.register(...)`，返回值直接是 `Potion`（不是 Holder）：

```java
public class ExampleModPotions implements ModInitializer {
	public static final Potion TATER_POTION =
			Registry.register(
					BuiltInRegistries.POTION,
					new ResourceLocation("example-mod", "tater"),
					new Potion(
							new MobEffectInstance(
									ExampleModEffects.TATER_EFFECT,
									3600,
									0)));

	@Override
	public void onInitialize() {
		PotionBrewing.addMix(Potions.WATER, Items.POTATO, TATER_POTION);

		// Use the mixin invoker if you are not using Fabric API
		// BrewingRecipeRegistryInvoker.invokeAddMix(Potions.WATER, Items.POTATO, TATER_POTION);
	}
}
```

该参考文件的 import 面（照抄即用）：`net.fabricmc.api.ModInitializer`、`net.minecraft.core.Registry`、`net.minecraft.core.registries.BuiltInRegistries`、`net.minecraft.resources.ResourceLocation`、`net.minecraft.world.effect.MobEffectInstance`、`net.minecraft.world.item.Items`、`net.minecraft.world.item.alchemy.Potion`、`net.minecraft.world.item.alchemy.PotionBrewing`、`net.minecraft.world.item.alchemy.Potions`。

- 本页对本档 `Potion` 的构造只演示了单参形态 `new Potion(MobEffectInstance)`；`new Potion(String id, MobEffectInstance...)` 双参形态在本档参考代码里**没有**出现 ⇒ `// TODO(未核实)`（别的 1.21.x 档用了带名字参数的形态，禁止当本档 API 抄）。
- 注册必须走 `Registry`，禁止 `new` 完就丢（`01-registry.mdc`）。

## MobEffectInstance 参数面（页内表格）

`new Potion(...)` 收一个 `MobEffectInstance`，本页给出 3 个参数：

| 参数 | 页内写法 | 说明 |
| --- | --- | --- |
| 效果 | `MobEffect type` | 自定义效果，或经 `net.minecraft.entity.effect.MobEffects` 取原版效果 |
| `int duration` | tick | **游戏 tick**，不是秒；示例值 `3600` |
| `int amplifier` | int | 叠加值，例如 Haste II 的 amplifier 是 `1` |

自定义效果本体见同档 `develop_entities_effects.md`（`mc-effect`）。

## 酿造注册：PotionBrewing.addMix

页内 `addMix` 的 3 个参数：

- `Potion input` — 起始药水，一般是水瓶或粗劣药水（示例用 `Potions.WATER`）。
- `Item item` — 主材料（示例用 `Items.POTATO`）。
- `Potion output` — 结果药水。

页面原文标注：**有 Fabric API 时，`PotionBrewing.addMix` 通过 Access Widener 变为可访问**。

注册完成后，用马铃薯即可在酿造台酿出 Tater 药水（页内配图 `/assets/develop/tater-potion.png`；原文只说 "Brewing Stand"，未给该方块/界面的类名）。

### 用 `Ingredient` 注册（页内只给了类名）

页面 info 块原文：借助 Fabric API 可以用 `Ingredient` 而不是 `Item` 来注册药水，入口是 `net.fabricmc.fabric.api.registry.FabricPotionBrewing`。**该类的具体方法名与签名本页未给出** ⇒ `// TODO(未核实)`：先用 `search_fabric_docs(version="1.20.4")` 或 `query_loader_api(platform=fabric, minecraftVersion=1.20.4)` 核实，禁止凭记忆补方法链。

### 不用 Fabric API 时：Mixin invoker

页面原文：没有 Fabric API 时 `PotionBrewing.addMix` 是 private，要用下面的 mixin invoker 或 Access Widener。

```java
@Mixin(PotionBrewing.class)
public interface BrewingRecipeRegistryInvoker {
	@Invoker("addMix")
	static void invokeAddMix(Potion input, Item item, Potion output) {
		throw new AssertionError();
	}
}
```

import：`net.minecraft.world.item.Item`、`net.minecraft.world.item.alchemy.Potion`、`net.minecraft.world.item.alchemy.PotionBrewing`、`org.spongepowered.asm.mixin.Mixin`、`org.spongepowered.asm.mixin.gen.Invoker`。

⚠️ 页面转引的路径是 `.../mixin/potion/PotionBrewingInvoker.java`，**盘上该文件不存在**；盘上真实文件与类名是 `BrewingRecipeRegistryInvoker.java` / `interface BrewingRecipeRegistryInvoker`（见 `mc-mixin`、`09-anti-patterns.mdc`）。以盘上类名为准。

## 资源与本地化

本档参考资源里药水只有一条语言键（`assets/example-mod/lang/en_us.json`）：

```json
"item.minecraft.potion.effect.tater": "Tater Potion"
```

- 注意命名空间是 `item.minecraft.potion.effect.<id>`（原版物品的翻译键被 mod 语言文件覆盖），不是 `item.example-mod.*`。
- 同文件另有配套效果键 `"effect.example-mod.tater": "Tater"`。
- 药水物品模型/纹理：本档参考资源内**没有**药水相关 PNG / model json ⇒ 不写；`Potion` 走原版水瓶贴图。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：本档语料页（reference/1.20.4/src/main/java/com/example/docs/potion/ExampleModPotions.java / reference/1.20.4/src/main/java/com/example/docs/ExampleMod.java）就是 mojmap 写法。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `MobEffectInstance` | `StatusEffectInstance` | 1.14.4–1.21.11 | join（`net.minecraft.entity.effect.StatusEffectInstance`） |
| `ResourceLocation` | `Identifier` | 1.14.4–1.21.10 | join（`net.minecraft.util.Identifier`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |
| `PotionBrewing` | `BrewingRecipeRegistry` | 1.14.4–1.21.11 | join（`net.minecraft.recipe.BrewingRecipeRegistry`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- `PotionContents`、`PotionUtil`：本档 `processed/` 全量检索**零命中**（这两个名字属于别的版本档的形态），一律不要写进本档代码。
- 自定义「可饮用」物品：本档药水页全程只注册 `Potion` 本身，没有 `PotionItem` / `use` 的例子。物品 `use` 的返回类型（`TypedActionResult` / `ActionResult` 家族）在同档 `develop_items_custom-item-interactions.md` 与 `develop_events.md`，要写就得先读那两页。
- 酿造台方块/界面（`BrewingStand` 一类）：本档语料零命中，没有可引的类名。
- 效果药水 ↔ 延长 / 增幅 / 降级等衍生配方链（glowstone、redstone、fermented spider eye 的混配规则）：本页未出现 ⇒ `// TODO(未核实)`。
- 药水颜色、粒子颜色、`Potion` 的名称组件：本页未出现 ⇒ 不写。
- 酿造数据的 datagen：本档药水页无任何 datagen 片段。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；物品面：`03-item.mdc` / `mc-item`；Mixin / Access Widener：`10` 之外的 `mc-mixin`
- 效果本体：`mc-effect`（同档页 `develop_entities_effects`）
- 反模式：`09-anti-patterns.mdc`、`fabric/1.20.4/knowledge/antipatterns/`
- 全文核对：`get_fabric_doc_full(version="1.20.4", id="develop_items_potions")`
