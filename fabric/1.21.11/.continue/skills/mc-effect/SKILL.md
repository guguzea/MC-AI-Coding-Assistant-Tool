---
name: mc-effect
description: MobEffect 状态效果。触发词：MobEffect、StatusEffect、MobEffectInstance、StatusEffectInstance、AttributeModifier、EntityAttributeModifier
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-effect

> 本档正文的类名/签名来自 `data/fabric_1.21.11` 本档语料：页面 `fabric-docs/1.21.11/processed/develop_entities_effects.md`，代码 `reference/1.21.11/src/main/java/com/example/docs/effect/{TaterEffect,ExampleModEffects}.java`。正文里标了 `javap @ yarn 1.21.11+build.6` 的条目来自本档真构件；页内没有的签名先按本档真构件 javap 核，核不到才留 `TODO(未核实)`，禁止用邻版（1.21.10 / 1.21.3 / 26.1.2）补全。

## 基类与构造

自定义效果继承 `MobEffect`，构造 `super(MobEffectCategory, int color)` 决定归类（有益 / 有害 / 中性）与配色。

```java
public class TaterEffect extends MobEffect {
	protected TaterEffect() {
		super(MobEffectCategory.BENEFICIAL, 0xe9b8b3);
	}

	@Override
	public boolean shouldApplyEffectTickThisTick(int duration, int amplifier) {
		return true;
	}

	@Override
	public boolean applyEffectTick(ServerLevel level, LivingEntity entity, int amplifier) {
		if (entity instanceof Player) {
			((Player) entity).giveExperiencePoints(1 << amplifier);
		}
		return super.applyEffectTick(level, entity, amplifier);
	}
}
```

**Yarn 等价**（本档 `scaffold` 钉 yarn；同签名换名，逐名出处见文末映射口径表）：

```java
public class TaterEffect extends StatusEffect {
	protected TaterEffect() {
		super(StatusEffectCategory.BENEFICIAL, 0xe9b8b3);
	}

	@Override
	public boolean canApplyUpdateEffect(int duration, int amplifier) {
		return true;
	}

	@Override
	public boolean applyUpdateEffect(ServerWorld level, LivingEntity entity, int amplifier) {
		if (entity instanceof PlayerEntity) {
			((PlayerEntity) entity).addExperience(1 << amplifier);
		}
		return super.applyUpdateEffect(level, entity, amplifier);
	}
}
```

- `shouldApplyEffectTickThisTick(int duration, int amplifier)` 每 tick 决定是否施加；`applyEffectTick(ServerLevel, LivingEntity, int amplifier)` 是效果本体。两者均返回 `boolean`。
- 该参考文件的 import 面（照抄即用）：`net.minecraft.server.level.ServerLevel`、`net.minecraft.world.effect.MobEffect`、`net.minecraft.world.effect.MobEffectCategory`、`net.minecraft.world.entity.LivingEntity`、`net.minecraft.world.entity.player.Player`。

## 注册

注册进 `BuiltInRegistries.MOB_EFFECT`。本档参考文件用 `Registry.registerForHolder(...)` 并直接持有 `Holder<MobEffect>`：

```java
public class ExampleModEffects implements ModInitializer {
	public static final Holder<MobEffect> TATER =
			Registry.registerForHolder(BuiltInRegistries.MOB_EFFECT, Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "tater"), new TaterEffect());

	@Override
	public void onInitialize() {
		// ...
	}
}
```

- 禁止 `new` 完就丢，注册必须走 `Registry`（`01-registry.mdc`）。
- 注意本档内部有两种 `Identifier` 工厂：`01-registry.mdc` 钉 `Identifier.of(MOD_ID, ...)`（并说明 1.21 的构造器是 private），本页参考代码用 `Identifier.fromNamespaceAndPath(...)`。两种都在本档语料里出现，跟工程既有写法保持一致，不要混。

## 施加到实体

`LivingEntity#addEffect` 收一个 `MobEffectInstance`，返回 `boolean`（是否成功施加）。`MobEffectInstance` 的参数面按本页表格：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `effect` | `Holder<MobEffect>` | 效果持有者 |
| `duration` | `int` | **tick**，不是秒 |
| `amplifier` | `int` | 叠加值：`amplifier=4` ⇒ 等级 5 |
| `ambient` | `boolean` | `true` = 环境来源（如 Beacon），HUD 图标带青色叠加 |
| `particles` | `boolean` | 是否显示粒子 |
| `icon` | `boolean` | 是否在 HUD 显示图标（物品栏总会显示） |

`new MobEffectInstance(...)` 的重载已核实（javap @ mojmap jar，共 7 个公开构造器）：`(Holder<MobEffect>)`、`(Holder<MobEffect>, int)`、`(Holder<MobEffect>, int, int)`、`(Holder<MobEffect>, int, int, boolean, boolean)`、`(Holder<MobEffect>, int, int, boolean, boolean, boolean)`、`(Holder<MobEffect>, int, int, boolean, boolean, boolean, MobEffectInstance)`、`(MobEffectInstance)`。Yarn 侧 `StatusEffectInstance(RegistryEntry<StatusEffect>, …)` 同形（javap @ yarn 1.21.11+build.6）。

## 资源与本地化

- 图标 18×18 PNG：`resources/assets/<modid>/textures/mob_effect/<id>.png`。
- 语言键：`effect.<modid>.<id>`（页内示例 `"effect.example-mod.tater": "Tater"`）。
- 快速验证：`/effect give @p <modid>:<id>`。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.11/reference/1.21.11/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `MobEffect` | `StatusEffect` | 1.14.4–1.21.11 | join（`net.minecraft.entity.effect.StatusEffect`） |
| `MobEffectCategory` | `StatusEffectCategory` | 1.17.1–1.21.11 | join（`net.minecraft.entity.effect.StatusEffectCategory`） |
| `ServerLevel` | `ServerWorld` | 1.14.4–1.21.11 | join（`net.minecraft.server.world.ServerWorld`） |
| `Player` | `PlayerEntity` | 1.14.4–1.21.11 | join（`net.minecraft.entity.player.PlayerEntity`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |
| `Holder` | `RegistryEntry` | 1.19.4–1.21.11 | chain（`client-1.21.11.txt` → 本档 yarn sqlite） |
| `MobEffectInstance` | `StatusEffectInstance` | 1.14.4–1.21.11 | chain（同上） |

**成员级换名**（上面两段代码块用到的；上表只到类名级）：

| mojmap | Yarn | 依据 |
| --- | --- | --- |
| `MobEffect` 构造 `(MobEffectCategory, int)` | `StatusEffect(StatusEffectCategory, int)`（**protected**） | javap @ yarn 1.21.11+build.6 |
| `MobEffect#shouldApplyEffectTickThisTick(int,int)` | `StatusEffect#canApplyUpdateEffect(int,int)` | javap @ 同上 |
| `MobEffect#applyEffectTick(ServerLevel,LivingEntity,int)` | `StatusEffect#applyUpdateEffect(ServerWorld,LivingEntity,int)` | javap @ 同上 |
| `MobEffectCategory.BENEFICIAL` | `StatusEffectCategory.BENEFICIAL` | javap @ 同上 |
| `LivingEntity#addEffect(..)` | `LivingEntity#addStatusEffect(..)` | chain（`client-1.21.11.txt` → yarn sqlite） |
| `Player#giveExperiencePoints(int)` | `PlayerEntity#addExperience(int)` | javap @ 同上 |
| `Registry#registerForHolder(..)` | `Registry#registerReference(..)` | javap @ 同上 |
| `BuiltInRegistries.MOB_EFFECT` | `Registries.STATUS_EFFECT`（**字段名也换了**） | javap @ 同上 |

- 类名级「Yarn 对应名」由本档 `mappings/yarn-mappings.sqlite` 证实**存在与包路径**；成员级那些行另以 **javap 真构件**或 **`client-1.21.11.txt`（Mojang 官方映射）→ 本档 yarn sqlite 的链路**核实过（`client-1.21.11.txt` 只当中轴、不入库）。未列出的签名仍须 `get_minecraft_source`（需 JDK 17+）或 `./gradlew genSources` 核实。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- `AttributeModifier` 挂到效果：本页与两个参考文件均未出现该 API。属性面在同档 `develop_entities_attributes.md`，须先读该页再写。
- 药水/酿造联动：同页指向 `develop_items_potions.md`（见 `mc-potion`）。
- 自定义效果的持续期显示、`MobEffect` 的 `isInstantenous` 一类分支：本档语料无 ⇒ 不写。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_entities_effects")`
