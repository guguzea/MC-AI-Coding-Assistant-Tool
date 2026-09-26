---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-enchantment

> 本档正文的类名/签名只来自 `data/fabric_1.21.11` 本档语料，两页实读：`fabric-docs/1.21.11/processed/develop_items_custom-enchantment-effects.md`（自定义效果）与 `fabric-docs/1.21.11/processed/develop_data-generation_enchantments.md`（用 datagen 造附魔本体、条件、多效果、标签、诅咒）。两页的 `@[code transcludeWith=:::…](@/reference/1.21.11/…)` 标记**不是可抄代码**，全部去 `reference/1.21.11/` 读了真身：`src/main/java/com/example/docs/enchantment/effect/LightningEnchantmentEffect.java`、`src/main/java/com/example/docs/enchantment/ModEnchantmentEffects.java`、`src/main/java/com/example/docs/enchantment/ModEnchantments.java`、`src/client/java/com/example/docs/datagen/ExampleModEnchantmentGenerator.java`、`src/client/java/com/example/docs/datagen/ExampleModEnchantmentTagProvider.java`、`src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java`、`src/main/generated/data/example-mod/enchantment/thundering.json`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.1 / 1.21.10 / 26.1）补全。

## 前提：附魔是数据驱动的

页内原话：「Starting from version 1.21, custom enchantments in Minecraft use a "data-driven" approach.」——简单附魔（如加攻击伤害）更好写，复杂附魔更难；做法是把附魔拆成 _effect components_，一个 component 承载定义特殊效果的代码，Minecraft 自带 item damage / knockback / experience 等默认效果。两页都要求：先确认默认效果是否够用（页内指向 Minecraft Wiki 的 Enchantment definition 与 Misode 的 Enchantment Generator），自定义页只讲默认不支持的效果。

> 口径提醒：frontmatter 写 `mappings: yarn`，但本档语料的参考代码用 Mojang 官方名（`net.minecraft.resources.Identifier`、`BuiltInRegistries`、`Registry`）。本档仍在混淆版区间，落到 Yarn 工程前用 `convert_mapping` 对照，禁止把官方名当 Yarn 名直接写，也禁止写 `class_` / `method_` 中间名。

## 第一步：自定义效果（`EnchantmentEntityEffect`）

页内：在 `enchantment` 包下建 `effect` 目录，写 `LightningEnchantmentEffect` record，覆写 `EnchantmentEntityEffect` 接口方法，并建 `CODEC` 用于 encode/decode；主体逻辑放 `apply()`（页内：「called when the criteria for your enchantment to work is met」）。`reference/…/effect/LightningEnchantmentEffect.java` 的 `//#entrypoint` 区段真身：

```java
public record LightningEnchantmentEffect(LevelBasedValue amount) implements EnchantmentEntityEffect {
	public static final MapCodec<LightningEnchantmentEffect> CODEC = RecordCodecBuilder.mapCodec(instance ->
			instance.group(
					LevelBasedValue.CODEC.fieldOf("amount").forGetter(LightningEnchantmentEffect::amount)
			).apply(instance, LightningEnchantmentEffect::new)
	);

	@Override
	public void apply(ServerLevel serverLevel, int level, EnchantedItemInUse context, Entity target, Vec3 pos) {
		if (target instanceof LivingEntity victim) {
			if (context.owner() != null && context.owner() instanceof Player player) {
				float numStrikes = this.amount.calculate(level);

				for (float i = 0; i < numStrikes; i++) {
					BlockPos position = victim.blockPosition();
					EntityType.LIGHTNING_BOLT.spawn(serverLevel, position, EntitySpawnReason.TRIGGERED);
				}
			}
		}
	}

	@Override
	public MapCodec<? extends EnchantmentEntityEffect> codec() {
		return CODEC;
	}
}
```

- 页内对 `amount` 的说明：一个随附魔等级缩放的值，本例用等级决定闪电条数；取值入口 `LevelBasedValue#calculate(int level)`。
- 本档版本的生成原因是 `EntitySpawnReason.TRIGGERED`（该参考文件的 import `net.minecraft.world.entity.EntitySpawnReason`）。
- 该文件的 import 面：`com.mojang.serialization.MapCodec`、`com.mojang.serialization.codecs.RecordCodecBuilder`、`net.minecraft.core.BlockPos`、`net.minecraft.server.level.ServerLevel`、`net.minecraft.world.entity.Entity`、`net.minecraft.world.entity.EntitySpawnReason`、`net.minecraft.world.entity.EntityType`、`net.minecraft.world.entity.LivingEntity`、`net.minecraft.world.entity.player.Player`、`net.minecraft.world.item.enchantment.EnchantedItemInUse`、`net.minecraft.world.item.enchantment.LevelBasedValue`、`net.minecraft.world.item.enchantment.effects.EnchantmentEntityEffect`、`net.minecraft.world.phys.Vec3`。

## 第二步：注册效果类型

效果类型是**唯一需要进注册表**的一步；附魔本体不是（见第三步）。`reference/…/enchantment/ModEnchantmentEffects.java` 真身：

```java
public class ModEnchantmentEffects {
	public static MapCodec<LightningEnchantmentEffect> LIGHTNING_EFFECT = register("lightning_effect", LightningEnchantmentEffect.CODEC);

	private static <T extends EnchantmentEntityEffect> MapCodec<T> register(String id, MapCodec<T> codec) {
		return Registry.register(BuiltInRegistries.ENCHANTMENT_ENTITY_EFFECT_TYPE, Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, id), codec);
	}

	public static void registerModEnchantmentEffects() {
		ExampleMod.LOGGER.info("Registering EnchantmentEffects for" + ExampleMod.MOD_ID);
	}
}
```

页内要求在主类（含 `onInitialize()`）里调用 `registerModEnchantmentEffects()`。注册入口固定为 `Registry.register(BuiltInRegistries.ENCHANTMENT_ENTITY_EFFECT_TYPE, Identifier, MapCodec)`；禁止 `new` 完就丢（`01-registry.mdc`）。

## 第三步：`ResourceKey<Enchantment>`

datagen 页要求先在 main source set 建 `enchantment` 包与 `ModEnchantments` 类，并加 `key` 方法；用该方法为附魔造 `ResourceKey`。`reference/…/enchantment/ModEnchantments.java` 真身（含 `:::key-helper` 与 `:::register-enchantment` 两段）：

```java
public class ModEnchantments {
	// :::register-enchantment
	public static final ResourceKey<Enchantment> THUNDERING = key("thundering");
	// :::register-enchantment
	public static final ResourceKey<Enchantment> REPULSION_CURSE = key("repulsion_curse");

	// :::key-helper
	private static ResourceKey<Enchantment> key(String path) {
		Identifier id = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, path);
		return ResourceKey.create(Registries.ENCHANTMENT, id);
	}
	// :::key-helper
}
```

## 第四步：datagen 生成器

页内：在 datagen 包建一个 `extends FabricDynamicRegistryProvider` 的类，构造函数匹配 `super`，实现 `configure` 与 `getName`（`:::provider` 段）；再加 `register` 辅助方法（`:::register-helper`）；再加 `bootstrap` 方法登记要加入游戏的附魔（`:::bootstrap`）。`reference/…/datagen/ExampleModEnchantmentGenerator.java` 的骨架真身：

```java
public class ExampleModEnchantmentGenerator extends FabricDynamicRegistryProvider {
	public ExampleModEnchantmentGenerator(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
		super(output, registriesFuture);
	}

	@Override
	protected void configure(HolderLookup.Provider registries, Entries entries) {
		entries.addAll(registries.lookupOrThrow(Registries.ENCHANTMENT)); // Add all bootstrapped enchantments for the current mod id
	}

	@Override
	public String getName() {
		return "Enchantments";
	}

	private static void register(BootstrapContext<Enchantment> context, ResourceKey<Enchantment> key, Enchantment.Builder builder) {
		context.register(key, builder.build(key.identifier()));
	}

	public static void bootstrap(BootstrapContext<Enchantment> context) {
		// 各 register(...) 调用见下一步
	}
}
```

注意本档是 `builder.build(key.identifier())`（`ResourceKey#identifier`）。

## 第五步：接线 DataGeneratorEntrypoint

页内：在 `DataGeneratorEntrypoint` 里 override `buildRegistry` 并登记 bootstrap，再确保生成器注册在 `onInitializeDataGenerator` 内。`reference/…/datagen/ExampleModDataGenerator.java` 的两行真身：

```java
// onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator) 内，createPack() 之后：
pack.addProvider(ExampleModEnchantmentGenerator::new);
pack.addProvider(ExampleModEnchantmentTagProvider::new);

// buildRegistry(RegistrySetBuilder registryBuilder) 内：
registryBuilder.add(Registries.ENCHANTMENT, ExampleModEnchantmentGenerator::bootstrap);
```

前置：datagen 页 info 要求先完成本档 `develop_data-generation_setup.md` 的 setup 流程。

## 附魔定义：`Enchantment.definition(...)` 七个位置参数

页内「Creating the Enchantment」：用生成器里的 `register` 方法、拿 `ModEnchantments` 里登记的键来建定义。`ExampleModEnchantmentGenerator.java` 的 `:::register-enchantment` 段真身（注释也是原文件的）：

```java
register(context, ModEnchantments.THUNDERING,
		Enchantment.enchantment(
				Enchantment.definition(
						context.lookup(Registries.ITEM).getOrThrow(ItemTags.WEAPON_ENCHANTABLE), // The items this enchantment can be applied to
						10, // The weight / probability of our enchantment being available in the enchanting table
						3, // The max level of the enchantment
						Enchantment.dynamicCost(1, 10), // The base minimum cost of the enchantment, and the additional cost for every level
						Enchantment.dynamicCost(1, 15), // Same as the other dynamic cost, but for the maximum instead
						5, // The cost to apply the enchantment in an anvil, in levels
						EquipmentSlotGroup.HAND // The slot types in which this enchantment will be able to apply its effects
				)
		)
		.withEffect(
				EnchantmentEffectComponents.POST_ATTACK, // The type of effect to be applied
				EnchantmentTarget.ATTACKER, // The target to be checked for the enchantment
				EnchantmentTarget.VICTIM, // The target to apply the enchantment effect to
				new LightningEnchantmentEffect(LevelBasedValue.perLevel(0.4f, 0.2f))
		)
);
```

页内补充：效果既可来自 [Custom Enchantment Effects] 页做的自定义效果，也可用 vanilla enchantment effects（页内链接指向 Minecraft Wiki 的 Enchantment definition # Effect components）。

## 效果条件（Effect Conditions）

页内：「Most enchantment effect types are conditional effects. When adding these effects, it is possible to pass conditions to the `withEffect` call.」条件类型总览页内只给外链（`Enchantments` 类的 mcsrc 页面，标注 `1.21.11_unobfuscated`），正文未列 ⇒ 那里面的成员名本件不写。本档 `REPULSION_CURSE` 的 `withEffect` 尾部条件真身：

```java
.withEffect(
		EnchantmentEffectComponents.POST_ATTACK,
		EnchantmentTarget.ATTACKER,
		EnchantmentTarget.ATTACKER,
		AllOf.entityEffects(
				new ApplyEntityImpulse(new Vec3(0, 0.2, -1), new Vec3(1, 1, 1), LevelBasedValue.perLevel(0.7f, 0.2f)),
				new PlaySoundEffect(List.of(SoundEvents.LUNGE_1), ConstantFloat.of(5), ConstantFloat.of(1))
		),
		LootItemEntityPropertyCondition.hasProperties(
				LootContext.EntityTarget.ATTACKER,
				EntityPredicate.Builder.entity().flags(
						EntityFlagsPredicate.Builder.flags().setIsFlying(false)
				)
		)
)
```

- 相关 import（同一参考文件）：`net.minecraft.advancements.criterion.EntityFlagsPredicate`、`net.minecraft.advancements.criterion.EntityPredicate`、`net.minecraft.sounds.SoundEvents`、`net.minecraft.util.valueproviders.ConstantFloat`、`net.minecraft.world.item.enchantment.effects.AllOf`、`net.minecraft.world.item.enchantment.effects.ApplyEntityImpulse`、`net.minecraft.world.item.enchantment.effects.PlaySoundEffect`、`net.minecraft.world.level.storage.loot.LootContext`、`net.minecraft.world.level.storage.loot.predicates.LootItemEntityPropertyCondition`、`java.util.List`。

## 多效果（Multiple Effects）

页内：`withEffect` 可以链式追加多个效果，但那样每个效果都要各自写条件；想共享条件与目标，用 `AllOf` 合并成单个效果（上面 `AllOf.entityEffects(...)` 即是）。页内警告：**方法取决于效果类型**——例如 `EnchantmentValueEffect` 要改用 `AnyOf.valueEffects`；不同类型仍要额外的 `withEffect` 调用。`AnyOf` 与 `EnchantmentValueEffect` 在本档参考文件里只以页内文字出现，没有可抄 import ⇒ `// TODO(未核实)`：用之前先 `get_fabric_doc_full` 核对或用 `get_minecraft_source` 查签名。

## 进附魔台：`non_treasure` 标签

页内：即使在定义里写了 weight，附魔默认**不会**出现在附魔台；要能被村民交易并在附魔台出现，必须加入 `non_treasure` 标签。做法是在 `datagen` 包建 `extends FabricTagProvider<Enchantment>` 的类，构造函数里给 `super` 传 `Registries.ENCHANTMENT` 作 `registryKey`，并实现 `addTags`：

```java
public class ExampleModEnchantmentTagProvider extends FabricTagProvider<Enchantment> {
	public ExampleModEnchantmentTagProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
		super(output, Registries.ENCHANTMENT, registriesFuture);
	}

	@Override
	protected void addTags(HolderLookup.Provider wrapperLookup) {
		builder(EnchantmentTags.NON_TREASURE).add(ModEnchantments.THUNDERING);
		builder(EnchantmentTags.CURSE).add(ModEnchantments.REPULSION_CURSE);
	}
}
```

## 诅咒（Curses）

页内：诅咒同样走标签——复用上面 Enchanting Table 一节那个 tag provider，在 `addTags` 里把附魔加进 `EnchantmentTags.CURSE` 即标记为诅咒（上一节代码第二行就是它）。

## 纯 JSON 路线（与 datagen 二选一）

自定义效果页把最后一步写成直接放 JSON：「Create the JSON file in `data/example-mod/enchantments` folder. The name of this file will be the id of the enchantment: `thundering.json` will become `example-mod:thundering`.」并外链 Minecraft Wiki 的 Enchantment definition 与 Misode generator 说明字段格式。

⚠️ **上游路径不一致（实读记录）**：页内正文写目录 `data/example-mod/enchantments`（复数），而本档实读的生成件在 `src/main/generated/data/example-mod/enchantment/thundering.json`（单数）。本件按生成件登记为 `data/<modid>/enchantment/<id>.json`；复数写法的实际归属本档无第二处证据 ⇒ `TODO(未核实)`，别当规范抄。

实读的 `thundering.json` 全文即字段面：

```json
{
  "anvil_cost": 5,
  "description": {
    "translate": "enchantment.example-mod.thundering"
  },
  "effects": {
    "minecraft:post_attack": [
      {
        "affected": "victim",
        "effect": {
          "type": "example-mod:lightning_effect",
          "amount": {
            "type": "minecraft:linear",
            "base": 0.4,
            "per_level_above_first": 0.2
          }
        },
        "enchanted": "attacker"
      }
    ]
  },
  "max_cost": {
    "base": 1,
    "per_level_above_first": 15
  },
  "max_level": 3,
  "min_cost": {
    "base": 1,
    "per_level_above_first": 10
  },
  "slots": [
    "hand"
  ],
  "supported_items": "#minecraft:enchantable/weapon",
  "weight": 10
}
```

- `"type": "example-mod:lightning_effect"` 对应第二步注册 `MapCodec` 时给的 id。

## 语言键与验证

页内要求在 `en_us.json` 里给可读名，正文示例逐字为 `"enchantment.example-mod.thundering": "Thundering",`（与上面生成件的 `description.translate` 一致）。验证方式（页内原话）：给武器打上该附魔去打怪（「Test it by enchanting a weapon with the enchantment and hitting a mob.」）。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.11/reference/1.21.11/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `ServerLevel` | `ServerWorld` | 1.14.4–1.21.11 | join（`net.minecraft.server.world.ServerWorld`） |
| `Player` | `PlayerEntity` | 1.14.4–1.21.11 | join（`net.minecraft.entity.player.PlayerEntity`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |
| `Vec3` | `Vec3d` | 1.14.4–1.21.11 | join（`net.minecraft.util.math.Vec3d`） |
| `HolderLookup` | `RegistryWrapper` | 1.19.4–1.21.11 | join（`net.minecraft.registry.RegistryWrapper`）· 本轮纠正（原写 `DynamicRegistryManager`） |
| `EnchantmentTarget` | `EnchantmentEffectTarget` | 1.21.1–1.21.11 | join（`net.minecraft.enchantment.effect.EnchantmentEffectTarget`） |
| `EquipmentSlotGroup` | `AttributeModifierSlot` | 1.21.1–1.21.11 | join（`net.minecraft.component.type.AttributeModifierSlot`） |
| `LevelBasedValue` | `EnchantmentLevelBasedValue` | 1.21.1–1.21.11 | join（`net.minecraft.enchantment.EnchantmentLevelBasedValue`） |
| `EnchantedItemInUse` | `EnchantmentEffectContext` | 1.21.1–1.21.11 | join（`net.minecraft.enchantment.EnchantmentEffectContext`） |
| `ResourceKey` | `RegistryKey` | 1.16.5–1.21.11 | join（`net.minecraft.registry.RegistryKey`，1.16.5–1.20.x 包路径为 `net.minecraft.util.registry`） |
| `EnchantmentEffectComponents` | `EnchantmentEffectComponentTypes` | 1.21.1–1.21.11 | join（`net.minecraft.component.EnchantmentEffectComponentTypes`） |
| `EntitySpawnReason` | `SpawnReason` | 1.21.3–1.21.11 | join（`net.minecraft.entity.SpawnReason`） |
| `BootstrapContext` | `Registerable` | 1.21.1–1.21.11 | join（`net.minecraft.registry.Registerable`） |
| `RegistrySetBuilder` | `RegistryBuilder` | 1.19.4–1.21.11 | join（`net.minecraft.registry.RegistryBuilder`） |
| `ApplyEntityImpulse` | `ApplyImpulseEnchantmentEffect` | 1.21.11（本档起） | join（`net.minecraft.enchantment.effect.entity.ApplyImpulseEnchantmentEffect`） |
| `PlaySoundEffect` | `PlaySoundEnchantmentEffect` | 1.21.1–1.21.11 | join（`net.minecraft.enchantment.effect.entity.PlaySoundEnchantmentEffect`） |
| `ConstantFloat` | `ConstantFloatProvider` | 1.17.1–1.21.11 | join（`net.minecraft.util.math.floatprovider.ConstantFloatProvider`） |
| `LootItemEntityPropertyCondition` | `EntityPropertiesLootCondition` | 1.16.5–1.21.11 | join（`net.minecraft.loot.condition.EntityPropertiesLootCondition`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- **附魔本体直接 `Registry.register(BuiltInRegistries.ENCHANTMENT, ...)`**：本档两页都没这种写法（只有效果类型走 `Registry.register`，附魔走 `ResourceKey` + `Registries.ENCHANTMENT` bootstrap）。
- **`Enchantments` 类的可用条件/效果组件清单**：页内只给外链（mcsrc），正文不列成员 ⇒ 需要时先 `get_fabric_doc_full` 或 `get_minecraft_source` 核实，禁止按记忆补。
- **`AnyOf.valueEffects` / `EnchantmentValueEffect` 的 import 与签名**：只有页内一句话，参考文件未出现 ⇒ 未核实。
- **展示台/村民交易之外的其它标签**（除 `NON_TREASURE`、`CURSE` 外）本档语料未出现 ⇒ 不猜。
- **`ResourceLocation` 这个类名**：本档参考文件用 `net.minecraft.resources.Identifier`；`ResourceLocation` 是邻版（1.21.1 档）写法，禁止混进本工程。
- **盔甲/工具的可附魔性（enchantability）** 与 **`MobEffect` 状态效果**：本件不覆盖，分别走同档 `develop_items_custom-armor.md` / `develop_entities_effects.md`（`mc-effect`）。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`；物品与装备槽：`03-item.mdc` / `mc-item`
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_items_custom-enchantment-effects")` 与 `get_fabric_doc_full(version="1.21.11", id="develop_data-generation_enchantments")`
