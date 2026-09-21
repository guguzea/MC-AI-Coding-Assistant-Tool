---
name: mc-effect
description: MobEffect 状态效果。触发词：MobEffect、StatusEffect、MobEffectInstance、StatusEffectInstance、AttributeModifier、EntityAttributeModifier
platform: fabric
version: "1.20.4"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-effect

> 本档正文的类名/签名只来自 `data/fabric_1.20.4` 本档语料：页面 `fabric-docs/1.20.4/processed/develop_entities_effects.md`、`fabric-docs/1.20.4/processed/develop_items_potions.md`，代码 `reference/1.20.4/src/main/java/com/example/docs/effect/{TaterEffect,ExampleModEffects}.java`、`reference/1.20.4/src/main/java/com/example/docs/potion/ExampleModPotions.java`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.1 / 1.21.4 / 1.21.11）补全。

## 基类与构造

自定义效果继承 `MobEffect`，构造 `super(MobEffectCategory, int color)`；本档参考文件的注释原话是「category: StatusEffectCategory - describes if the effect is helpful (BENEFICIAL), harmful (HARMFUL) or useless (NEUTRAL)」，color 为 RGB int。

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

	// Called when the effect is applied
	@Override
	public void applyEffectTick(LivingEntity entity, int amplifier) {
		if (entity instanceof Player) {
			((Player) entity).giveExperiencePoints(1 << amplifier); // Higher amplifier gives you experience faster
		}
	}
}
```

- **本档 `applyEffectTick` 返回 `void`，形参是 `(LivingEntity entity, int amplifier)`**，参考文件里没有 `super.applyEffectTick(...)` 调用。这是 1.20.4 与 1.21.x 的硬差异：1.21.1 起该方法是 `boolean` 并带 `super` 转发，1.21.4 起还多一个 `ServerLevel` 形参。**禁止**把邻版签名套到本档工程上。
- `shouldApplyEffectTickThisTick(int duration, int amplifier)` 每 tick 决定是否施加，返回 `boolean`。
- 该参考文件的 import 面（照抄即用）：`net.minecraft.world.effect.MobEffect`、`net.minecraft.world.effect.MobEffectCategory`、`net.minecraft.world.entity.LivingEntity`、`net.minecraft.world.entity.player.Player`。

## 注册

注册进 `BuiltInRegistries.MOB_EFFECT`。本档参考文件用 `Registry.register(...)`，字段类型直接是 `MobEffect`：

```java
public class ExampleModEffects implements ModInitializer {
	public static final MobEffect TATER_EFFECT = new TaterEffect();

	@Override
	public void onInitialize() {
		Registry.register(BuiltInRegistries.MOB_EFFECT, new ResourceLocation("example-mod", "tater"), TATER_EFFECT);
	}
}
```

- 页面正文：「we use `Registry.register` to register our custom effect into the `MOB_EFFECT` registry. This can be done in our initializer.」
- 本档参考文件里 id 走 **`new ResourceLocation("example-mod", "tater")` 构造器**；`ResourceLocation.fromNamespaceAndPath(...)` 与 `Registry.registerForHolder(...)` / `Holder<MobEffect>` 在本档这两个文件里都没有出现 ⇒ `// TODO(未核实)`，不要按 1.21.x 抄过来。
- 注册必须走 `Registry`，禁止 `new` 完就丢（`01-registry.mdc`）。
- 映射口径：本档语料正文与参考代码是 **Mojang 官方名**（`ResourceLocation` / `MobEffect` / `BuiltInRegistries`），而 frontmatter 钉 `mappings: yarn`；同档 `01-registry.mdc:16` 写的是「使用 `Identifier` 构造 `ResourceLocation`：`new Identifier(MOD_ID, "registry_name")`」并配 `Registries.ITEM` 这类 Yarn 常量。两套名不能混在一个工程里，落到 Yarn 工程前先用 `convert_mapping` 逐个对照。

## 施加到实体

本档 `develop_entities_effects.md` **没有**「Applying The Effect」小节，`reference/1.20.4/.../ReferenceMethods.java` 在盘上不存在 ⇒ 以下两点未核实，不许凭记忆补：

- `LivingEntity#addEffect` 的本档签名 ⇒ `// TODO(未核实)`（改走 `get_minecraft_source` / 用户自备 jar 核实）。
- 带 `ambient` / `particles` / `icon` 的 `MobEffectInstance` 多参重载 ⇒ 本档语料零证据，`// TODO(未核实)`。

本档唯一能落地的构造形态来自药水页 `ExampleModPotions.java`（三参）：

```java
new MobEffectInstance(
        ExampleModEffects.TATER_EFFECT,
        3600,
        0)
```

药水页对该三参形的说明（原文）：`MobEffect type` = 效果（可用自定义效果，或「access vanilla effects through `net.minecraft.entity.effect.MobEffects`」）、`int duration` = 「Duration of the effect in game ticks」、`int amplifier` = 「For example, Haste II would have an amplifier of 1」。

> 注意：上面那句包路径 `net.minecraft.entity.effect.MobEffects` 是 1.20.4 药水页原文照抄，与本档参考文件里 `net.minecraft.world.entity.*` 的包面不一致，**未核实**；要用原版效果类请先 `get_minecraft_source` 核对，别照抄这行。

## 资源与本地化

- 图标 18×18 PNG（出现在玩家物品栏界面）：`resources/assets/example-mod/textures/mob_effect/tater.png`。
- 语言键格式：`"effect.example-mod.<effect-identifier>": "Value"`，页内示例 `{ "effect.example-mod.tater": "Tater" }`。
- 验证命令（页面「Testing」节原文）：`/effect give @p example-mod:tater` 给予；`/effect clear @p example-mod:tater` 移除。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：本档语料页（reference/1.20.4/src/main/java/com/example/docs/effect/ExampleModEffects.java / reference/1.20.4/src/main/java/com/example/docs/potion/ExampleModPotions.java / reference/1.20.4/src/main/java/com/example/docs/effect/TaterEffect.java / reference/1.20.4/src/main/java/com/example/docs/ExampleMod.java）就是 mojmap 写法。
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

- `AttributeModifier` 挂效果：本档 `fabric-docs/1.20.4/processed/` 全树 grep `AttributeModifier` **零命中**，页面与参考文件也都没有 ⇒ 禁止编造，需要属性修正先与用户确认版本可行性。
- `Registry.registerForHolder` / `Holder<MobEffect>` 字段形态：本档 effects、potions 参考文件都是直接持有 `MobEffect`。`registerForHolder`、`fromNamespaceAndPath`、`wrapAsHolder` 三个名字在 `data/fabric_1.20.4` 全树只命中 `mappings/parchment-params.json`（映射参数名字符串，不是教程签名），`fabric-docs/1.20.4` 正文与 `reference/1.20.4` 代码零命中 ⇒ 属 1.21.x 面，不写。
- `applyEffectTick` 的 `ServerLevel` 重载：本档无 ⇒ 不写。
- 药水/酿造联动：effects 页 info 指向同档 `develop_items_potions.md`（`mc-potion`）。本档该页用的是 `PotionBrewing.addMix(Potions.WATER, Items.POTATO, TATER_POTION)`，无 Fabric API 时该方法私有、需 Access Widener 或 mixin invoker（页面原文），细节归 `mc-potion`。
- 自定义附魔效果页 `develop_items_custom-enchantment-effects.md` 在本档 processed 目录**不存在**（1.21.1 起才有）⇒ 不要按邻版页给本档加这一面。
- 效果 HUD 图标叠加、`ambient` 语义等参数面：本档无表格证据 ⇒ 不写。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`；药水：`mc-potion`
- 全文核对：`get_fabric_doc_full(version="1.20.4", id="develop_entities_effects")`、`get_fabric_doc_full(version="1.20.4", id="develop_items_potions")`
