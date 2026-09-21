---
name: mc-effect
description: MobEffect 状态效果。触发词：MobEffect、StatusEffect、MobEffectInstance、StatusEffectInstance、AttributeModifier、EntityAttributeModifier
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-effect

> 本档正文的类名/签名只来自 `data/fabric_1.21.1` 本档语料：页面 `fabric-docs/1.21.1/processed/develop_entities_effects.md`、`fabric-docs/1.21.1/processed/develop_items_potions.md`，代码 `reference/1.21.1/src/main/java/com/example/docs/effect/{TaterEffect,ExampleModEffects}.java`、`reference/1.21.1/src/main/java/com/example/docs/ReferenceMethods.java`、`reference/1.21.1/src/main/java/com/example/docs/potion/ExampleModPotions.java`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.20.4 / 1.21.4 / 1.21.11）补全。

## 基类与构造

自定义效果继承 `MobEffect`，构造 `super(MobEffectCategory, int color)`；参考文件注释原话：「category: StatusEffectCategory - describes if the effect is helpful (BENEFICIAL), harmful (HARMFUL) or useless (NEUTRAL)」「color: int - Color is the color assigned to the effect (in RGB)」。

```java
public class TaterEffect extends MobEffect {
	protected TaterEffect() {
		super(MobEffectCategory.BENEFICIAL, 0xe9b8b3);
	}

	// Called every tick to check if the effect can be applied or not
	@Override
	public boolean shouldApplyEffectTickThisTick(int duration, int amplifier) {
		return true;
	}

	// Called when the effect is applied.
	@Override
	public boolean applyEffectTick(LivingEntity entity, int amplifier) {
		if (entity instanceof Player) {
			((Player) entity).giveExperiencePoints(1 << amplifier); // Higher amplifier gives you experience faster
		}

		return super.applyEffectTick(entity, amplifier);
	}
}
```

- 本档 `applyEffectTick(LivingEntity entity, int amplifier)` 返回 `boolean` 且转发 `super`。**不要**按 1.20.4 写成 `void`，也**不要**按 1.21.4+ 加 `ServerLevel` 首参——那两个签名都不是本档的。
- `shouldApplyEffectTickThisTick(int duration, int amplifier)` 每 tick 决定是否施加，返回 `boolean`。
- 该参考文件的 import 面（照抄即用）：`net.minecraft.world.effect.MobEffect`、`net.minecraft.world.effect.MobEffectCategory`、`net.minecraft.world.entity.LivingEntity`、`net.minecraft.world.entity.player.Player`。

## 注册

注册进 `BuiltInRegistries.MOB_EFFECT`。本档参考文件用 `Registry.registerForHolder(...)`，在 `static` 块里赋值并直接持有 `Holder<MobEffect>`：

```java
public class ExampleModEffects implements ModInitializer {
	public static final Holder<MobEffect> TATER;

	static {
		TATER = Registry.registerForHolder(BuiltInRegistries.MOB_EFFECT, ResourceLocation.fromNamespaceAndPath("example-mod", "tater"), new TaterEffect());
	}

	@Override
	public void onInitialize() {
		// ...
	}
}
```

- 页面正文：「we use `Registry.register` to register our custom effect into the `MOB_EFFECT` registry. This can be done in our initializer.」——正文说的是 `Registry.register`，而参考代码实际调的是 `Registry.registerForHolder`（因为要拿 `Holder<MobEffect>`）。两者同族，按参考代码写。
- id 工厂在本档参考代码里是 `ResourceLocation.fromNamespaceAndPath(namespace, path)`；`new ResourceLocation(...)` 构造器形态只在 1.20.x 档的参考文件出现，本档没有 ⇒ 不写。
- 注册必须走 `Registry`，禁止 `new` 完就丢（`01-registry.mdc`）。
- 映射口径：本档语料正文与参考代码是 **Mojang 官方名**（`ResourceLocation` / `MobEffect` / `BuiltInRegistries`），而 frontmatter 钉 `mappings: yarn`；同档 `01-registry.mdc:16` 明确「使用 Yarn `Identifier.of(MOD_ID, "registry_name")`（1.21 构造器是 private；不要写 `new Identifier`，也不要抄 Mojmap `ResourceLocation`）」。也就是说：**照抄本档语料 = 官方名工程；照抄本档规则 = Yarn 工程**。两套不能混，落地前用 `convert_mapping` 逐名对照。

## 施加到实体

`LivingEntity#addEffect` 收一个 `MobEffectInstance`，返回 `boolean`（页面原话：「returns a boolean, specifying whether the effect was successfully applied」）。本档参考文件 `ReferenceMethods.java` 给出的实际构造：

```java
var instance = new MobEffectInstance(ExampleModEffects.TATER, 5 * 20, 0, false, true, true);
entity.addEffect(instance);
```

import 面：`com.example.docs.effect.ExampleModEffects`、`net.minecraft.world.effect.MobEffectInstance`、`net.minecraft.world.entity.LivingEntity`。

页面参数表（`MobEffectInstance` 各参数，逐字对应上表顺序）：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `effect` | `Holder<MobEffect>` | 效果注册项 |
| `duration` | `int` | 持续 **tick**，**不是**秒 |
| `amplifier` | `int` | 不是等级本身而是叠加值：`amplifier` 为 `4` ⇒ 等级 `5` |
| `ambient` | `boolean` | `true` 表示环境来源（如 **Beacon**）、无直接成因；此时 HUD 图标带青色叠加 |
| `particles` | `boolean` | 是否显示粒子 |
| `icon` | `boolean` | 是否在 HUD 显示图标；无论该标志如何，物品栏总会显示 |

三参重载在本档药水参考文件里也在用：`new MobEffectInstance(ExampleModEffects.TATER, 3600, 0)`；药水页说明为 `Holder<MobEffect> type` / `int duration`（game ticks）/ `int amplifier`。**除这两种外的其他重载本档未给出** ⇒ `// TODO(未核实)`。

## 资源与本地化

- 图标 18×18 PNG（出现在玩家物品栏界面）：`resources/assets/example-mod/textures/mob_effect/tater.png`。
- 语言键格式：`"effect.example-mod.<effect-identifier>": "Value"`，页内示例 `{ "effect.example-mod.tater": "Tater" }`。
- 快速验证（页面 tip 原话，mcfunction）：`effect give @p example-mod:tater`。本档页面**没有** `/effect clear` 用法（1.20.4 页面才有），需要时先核实命令面。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.1/reference/1.21.1/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `MobEffect` | `StatusEffect` | 1.14.4–1.21.11 | join（`net.minecraft.entity.effect.StatusEffect`） |
| `MobEffectInstance` | `StatusEffectInstance` | 1.14.4–1.21.11 | join（`net.minecraft.entity.effect.StatusEffectInstance`） |
| `MobEffectCategory` | `StatusEffectCategory` | 1.17.1–1.21.11 | join（`net.minecraft.entity.effect.StatusEffectCategory`） |
| `ResourceLocation` | `Identifier` | 1.14.4–1.21.10 | join（`net.minecraft.util.Identifier`） |
| `Player` | `PlayerEntity` | 1.14.4–1.21.11 | join（`net.minecraft.entity.player.PlayerEntity`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- `AttributeModifier` 挂到效果：本档 `fabric-docs/1.21.1/processed/` 全树 grep `AttributeModifier` **零命中**，也没有 `develop_entities_attributes.md` 这一页 ⇒ 禁止编造属性修正写法。
- `applyEffectTick` 带 `ServerLevel` 的重载：本档参考文件形参只有 `(LivingEntity, int)`；那是 1.21.4+ 的形态 ⇒ 不写。
- `MobEffect` 的瞬时/持续分支（`isInstantenous` 一类）：本档语料无 ⇒ 不写。
- `MobEffects`（原版效果类）：药水页只写「vanilla's `MobEffects` class」，**未给包路径** ⇒ 用之前先 `get_minecraft_source` 核实 import。
- 药水/酿造联动：effects 页 info 指向同档 `develop_items_potions.md`（`mc-potion`）。本档药水注册走 `FabricBrewingRecipeRegistryBuilder.BUILD.register(builder -> builder.addMix(...))`（以 `ExampleModPotions.java` 的 import 为准；**注意同页正文把它写成 `FabricPotionBrewingBuilder.BUILD`，与本档参考代码不一致**，取代码里的名字），与 1.20.4 的直接 `PotionBrewing.addMix` 不同，细节归 `mc-potion`。
- 附魔效果联动：同档另有 `develop_items_custom-enchantment-effects.md`（本轮未读该页正文），需要时先 `get_fabric_doc_full(version="1.21.1", id="develop_items_custom-enchantment-effects")`。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`；药水：`mc-potion`
- 全文核对：`get_fabric_doc_full(version="1.21.1", id="develop_entities_effects")`、`get_fabric_doc_full(version="1.21.1", id="develop_items_potions")`
