---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-enchantment

> 本档正文的类名/签名只来自 `data/fabric_1.21.1` 本档语料：页面 `fabric-docs/1.21.1/processed/develop_items_custom-enchantment-effects.md`；该页的转引标记 `@[code ...](@/reference/1.21.1/...)` 已逐个去 `reference/` 读真身，实读文件为 `reference/1.21.1/src/main/java/com/example/docs/enchantment/effect/LightningEnchantmentEffect.java`、`reference/1.21.1/src/main/java/com/example/docs/enchantment/ModEnchantmentEffects.java`、`reference/1.21.1/src/client/java/com/example/docs/datagen/EnchantmentGenerator.java`、`reference/1.21.1/src/main/generated/data/example-mod/enchantment/thundering.json`、`reference/1.21.1/src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.20.4 / 1.21.3 / 1.21.11）补全。

## 前提：1.21 起附魔是数据驱动的

页内原话：「Starting from version 1.21, custom enchantments in Minecraft use a "data-driven" approach.」——简单的附魔（例如增加攻击伤害）更容易写，复杂的更难；做法是把附魔拆成 _effect components_。一个 effect component 承载定义特殊效果的代码，Minecraft 自带若干默认效果（页内举例：item damage、knockback、experience）。

页内 tip 要求先确认默认效果是否够用（指向 Minecraft Wiki 的 Enchantment Effect Components 页）；本页只讲**默认不支持的自定义效果**，并假定你已会配「简单」的数据驱动附魔。

> 口径提醒：frontmatter 的 `mappings: yarn` 是本档工程默认映射，而本档语料正文与参考文件用的是 Mojang 官方名（`ResourceLocation`、`BuiltInRegistries`、`Registry`）。两套不同源，落到 Yarn 工程前用 `convert_mapping` 对照，不要把官方名当 Yarn 名直接写。

## 自定义效果：`EnchantmentEntityEffect` 的 record

效果类放在 `enchantment` 包下的 `effect` 子目录，是一个实现 `EnchantmentEntityEffect` 的 `record`，带 `CODEC`（页内：用来 encode / decode 我们的 effect）与 `apply()`（页内：「The bulk of our code will go into the `apply()` event, which is called when the criteria for your enchantment to work is met.」）、`codec()` 两个 `@Override`。以下为参考文件 `//#entrypoint` 区段的真身，逐字照抄：

```java
public record LightningEnchantmentEffect(LevelBasedValue amount) implements EnchantmentEntityEffect {
	public static final MapCodec<LightningEnchantmentEffect> CODEC = RecordCodecBuilder.mapCodec(instance ->
			instance.group(
					LevelBasedValue.CODEC.fieldOf("amount").forGetter(LightningEnchantmentEffect::amount)
			).apply(instance, LightningEnchantmentEffect::new)
	);

	@Override
	public void apply(ServerLevel world, int level, EnchantedItemInUse context, Entity target, Vec3 pos) {
		if (target instanceof LivingEntity victim) {
			if (context.owner() != null && context.owner() instanceof Player player) {
				float numStrikes = this.amount.calculate(level);

				for (float i = 0; i < numStrikes; i++) {
					BlockPos position = victim.blockPosition();
					EntityType.LIGHTNING_BOLT.spawn(world, position, MobSpawnType.TRIGGERED);
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

- 页内对 `amount` 的说明：它表示「a value scaled to the level of the enchantment」，本例用附魔等级决定闪电生成条数；取值入口是 `LevelBasedValue#calculate(int level)`。
- 该参考文件的 import 面（照抄即用）：`com.mojang.serialization.MapCodec`、`com.mojang.serialization.codecs.RecordCodecBuilder`、`net.minecraft.core.BlockPos`、`net.minecraft.server.level.ServerLevel`、`net.minecraft.world.entity.Entity`、`net.minecraft.world.entity.EntityType`、`net.minecraft.world.entity.LivingEntity`、`net.minecraft.world.entity.MobSpawnType`、`net.minecraft.world.entity.player.Player`、`net.minecraft.world.item.enchantment.EnchantedItemInUse`、`net.minecraft.world.item.enchantment.LevelBasedValue`、`net.minecraft.world.item.enchantment.effects.EnchantmentEntityEffect`、`net.minecraft.world.phys.Vec3`。

## 注册效果类型 + 附魔的 `ResourceKey`

页内：效果「Like every other component of your mod, we'll have to add this `EnchantmentEffect` to Minecraft's registry」，建议建一个 `ModEnchantmentEffects` 类加辅助注册方法，并在含 `onInitialize()` 的主类里调用 `registerModEnchantmentEffects()`。参考文件真身：

```java
public class ModEnchantmentEffects {
	public static final ResourceKey<Enchantment> THUNDERING = of("thundering");
	public static MapCodec<LightningEnchantmentEffect> LIGHTNING_EFFECT = register("lightning_effect", LightningEnchantmentEffect.CODEC);

	private static ResourceKey<Enchantment> of(String path) {
		ResourceLocation id = ResourceLocation.fromNamespaceAndPath(ExampleMod.MOD_ID, path);
		return ResourceKey.create(Registries.ENCHANTMENT, id);
	}

	private static <T extends EnchantmentEntityEffect> MapCodec<T> register(String id, MapCodec<T> codec) {
		return Registry.register(BuiltInRegistries.ENCHANTMENT_ENTITY_EFFECT_TYPE, ResourceLocation.fromNamespaceAndPath(ExampleMod.MOD_ID, id), codec);
	}

	public static void registerModEnchantmentEffects() {
		ExampleMod.LOGGER.info("Registering EnchantmentEffects for" + ExampleMod.MOD_ID);
	}
}
```

要点：

- **效果类型**走注册表：`Registry.register(BuiltInRegistries.ENCHANTMENT_ENTITY_EFFECT_TYPE, <ResourceLocation>, <MapCodec>)`，返回 `MapCodec<T>`；禁止 `new` 完就丢（`01-registry.mdc`）。
- **附魔本体不是 `Registry.register` 的直接对象**：本档写法是先拿一个 `ResourceKey<Enchantment>`（`ResourceKey.create(Registries.ENCHANTMENT, id)`），真正的 `Enchantment` 实例由下一步的 datagen 产出。
- 该文件的 import 面：`net.minecraft.core.Registry`、`net.minecraft.core.registries.BuiltInRegistries`、`net.minecraft.core.registries.Registries`、`net.minecraft.resources.ResourceKey`、`net.minecraft.resources.ResourceLocation`、`net.minecraft.world.item.enchantment.Enchantment`、`net.minecraft.world.item.enchantment.effects.EnchantmentEntityEffect`，加上本模组的 `com.example.docs.ExampleMod` 与 `com.example.docs.enchantment.effect.LightningEnchantmentEffect`。
- 同一个 `THUNDERING` 键被这里与下面的生成器共用，不要另建一份。

## 附魔定义：`FabricDynamicRegistryProvider`

页内把这步写成「create an `EnchantmentGenerator` class … we'll first register a new enchantment, and then use the `configure()` method to create our JSON programmatically」。参考文件真身（`//#entrypoint` 区段）：

```java
public class EnchantmentGenerator extends FabricDynamicRegistryProvider {
	public EnchantmentGenerator(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
		super(output, registriesFuture);
		System.out.println("REGISTERING ENCHANTS");
	}

	@Override
	protected void configure(HolderLookup.Provider registries, Entries entries) {
		register(entries, ModEnchantmentEffects.THUNDERING, Enchantment.enchantment(
				Enchantment.definition(
					registries.lookupOrThrow(Registries.ITEM).getOrThrow(ItemTags.WEAPON_ENCHANTABLE),
					10,
					3,
					Enchantment.dynamicCost(1, 10),
					Enchantment.dynamicCost(1, 15),
					5,
					EquipmentSlotGroup.HAND
				)
			)
					.withEffect(
						EnchantmentEffectComponents.POST_ATTACK,
						EnchantmentTarget.ATTACKER,
						EnchantmentTarget.VICTIM,
						new LightningEnchantmentEffect(LevelBasedValue.perLevel(0.4f, 0.2f))
					)
		);
	}

	private void register(Entries entries, ResourceKey<Enchantment> key, Enchantment.Builder builder, ResourceCondition... resourceConditions) {
		entries.add(key, builder.build(key.location()), resourceConditions);
	}

	@Override
	public String getName() {
		return "ExampleModEnchantmentGenerator";
	}
}
```

`Enchantment.definition(...)` 七个位置参数，含义按页内注释逐字登记（顺序即上面的实参顺序）：

| 位置 | 实参 | 页内注释 |
| --- | --- | --- |
| 1 | `registries.lookupOrThrow(Registries.ITEM).getOrThrow(ItemTags.WEAPON_ENCHANTABLE)` | 可施加的物品标签（页内未加注释） |
| 2 | `10` | `this is the "weight" or probability of our enchantment showing up in the table` |
| 3 | `3` | `the maximum level of the enchantment` |
| 4 | `Enchantment.dynamicCost(1, 10)` | `base cost for level 1 of the enchantment, and min levels required for something higher` |
| 5 | `Enchantment.dynamicCost(1, 15)` | `same fields as above but for max cost` |
| 6 | `5` | `anvil cost` |
| 7 | `EquipmentSlotGroup.HAND` | `valid slots` |

`withEffect(...)` 四个实参按页内注释：效果组件类型（`EnchantmentEffectComponents.POST_ATTACK`，注释「enchantment occurs POST_ATTACK」）、`EnchantmentTarget.ATTACKER`、`EnchantmentTarget.VICTIM`、效果实例（`new LightningEnchantmentEffect(LevelBasedValue.perLevel(0.4f, 0.2f))`，注释「scale the enchantment linearly」）。两个 `EnchantmentTarget` 分别指「谁带附魔」与「效果打到谁」——页内没写这句，故此处只登记位置，不解释语义。

该文件的 import 面：`java.util.concurrent.CompletableFuture`、`net.fabricmc.fabric.api.datagen.v1.FabricDataOutput`、`net.fabricmc.fabric.api.datagen.v1.provider.FabricDynamicRegistryProvider`、`net.fabricmc.fabric.api.resource.conditions.v1.ResourceCondition`、`net.minecraft.core.HolderLookup`、`net.minecraft.core.registries.Registries`、`net.minecraft.resources.ResourceKey`、`net.minecraft.tags.ItemTags`、`net.minecraft.world.entity.EquipmentSlotGroup`、`net.minecraft.world.item.enchantment.Enchantment`、`net.minecraft.world.item.enchantment.EnchantmentEffectComponents`、`net.minecraft.world.item.enchantment.EnchantmentTarget`、`net.minecraft.world.item.enchantment.LevelBasedValue`。

## 把生成器挂进 DataGen

页内：「simply add the `EnchantmentGenerator` to this inside of the `onInitializeDataGenerator` method」，其转引标记为 `@[code transclude={22-22}](@/reference/1.21.1/src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java)`。

⚠️ **该转引行号与本档参考文件已失步**：实读 `ExampleModDataGenerator.java` 第 22 行是 `pack.addProvider(ExampleModAdvancementProvider::new);`，附魔那行在其**第 20 行**：

```java
pack.addProvider(EnchantmentGenerator::new);
```

宿主方法是 `onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator)`（该类 `implements DataGeneratorEntrypoint`），其中另有 `FabricDataGenerator.Pack pack = fabricDataGenerator.createPack();`。页内也提醒：跑之前先确保工程已按 datagen 配好（指向 `../data-generation/setup`，本档对应页面 `develop_data-generation_setup.md`）。

## 生成产物与语言键

页内：跑 datagen 后附魔 JSON 落在 `generated` 文件夹。本档实读的 `src/main/generated/data/example-mod/enchantment/thundering.json` 全文即字段面：

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

- 效果里的 `"type": "example-mod:lightning_effect"` 对应上面上注册表时给的 id。
- 页内要求在 `en_us.json` 里给可读名，正文示例逐字为 `"enchantment.ExampleMod.thundering": "Thundering",`；而实读的生成 JSON 用的是 `"translate": "enchantment.example-mod.thundering"`（modid 带连字符）。**上游这两处不一致**，本件按生成件 `enchantment.example-mod.thundering` 登记；落到你自己工程时用 `<你的 modid>` 并与 `description.translate` 对齐。
- 验证方式（页内原话）：给武器打上该附魔去打怪（「Test it by enchanting a weapon with the enchantment and hitting a mob.」）。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.1/reference/1.21.1/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `ResourceLocation` | `Identifier` | 1.14.4–1.21.10 | join（`net.minecraft.util.Identifier`） |
| `ServerLevel` | `ServerWorld` | 1.14.4–1.21.11 | join（`net.minecraft.server.world.ServerWorld`） |
| `Player` | `PlayerEntity` | 1.14.4–1.21.11 | join（`net.minecraft.entity.player.PlayerEntity`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11 | join（`net.minecraft.registry.Registries`） |
| `Vec3` | `Vec3d` | 1.14.4–1.21.11 | join（`net.minecraft.util.math.Vec3d`） |
| `HolderLookup` | `RegistryWrapper` | 1.19.4–1.21.11 | join（`net.minecraft.registry.RegistryWrapper`）· 本轮纠正（原写 `DynamicRegistryManager`） |
| `MobSpawnType` | `SpawnReason` | 1.16.5–1.21.1 | join（`net.minecraft.entity.SpawnReason`） |
| `EnchantmentTarget` | `EnchantmentEffectTarget` | 1.21.1–1.21.11 | join（`net.minecraft.enchantment.effect.EnchantmentEffectTarget`） |
| `EquipmentSlotGroup` | `AttributeModifierSlot` | 1.21.1–1.21.11 | join（`net.minecraft.component.type.AttributeModifierSlot`） |
| `LevelBasedValue` | `EnchantmentLevelBasedValue` | 1.21.1–1.21.11 | join（`net.minecraft.enchantment.EnchantmentLevelBasedValue`） |
| `EnchantedItemInUse` | `EnchantmentEffectContext` | 1.21.1–1.21.11 | join（`net.minecraft.enchantment.EnchantmentEffectContext`） |
| `ResourceKey` | `RegistryKey` | 1.16.5–1.21.11 | join（`net.minecraft.registry.RegistryKey`，1.16.5–1.20.x 包路径为 `net.minecraft.util.registry`） |
| `EnchantmentEffectComponents` | `EnchantmentEffectComponentTypes` | 1.21.1–1.21.11 | join（`net.minecraft.component.EnchantmentEffectComponentTypes`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- **纯 JSON 手写附魔的目录规范**：页内只说「this can be done by creating a JSON file similar to those in datapacks, this guide will show you how to generate the JSON dynamically」，没给手写路线的路径与字段 ⇒ `TODO(未核实)`，禁止拿 1.21.11 档那句「Create the JSON file in `data/example-mod/enchantments` folder」顶到本档。
- **`Enchantment` 直接注册进 `BuiltInRegistries.ENCHANTMENT`**：本档语料无此写法（走 `Registries.ENCHANTMENT` 的 `ResourceKey` + `FabricDynamicRegistryProvider`）。
- **附魔标签 / 诅咒 / 附魔台出现率的 tag 路线**：`EnchantmentTags`、`NON_TREASURE`、`CURSE`、`FabricTagProvider<Enchantment>` 在本档语料零出现 ⇒ 问这类先 `search_fabric_docs version=1.21.1`，零命中就停，别抄邻版。
- **效果条件与多效果合并**：`LootItemEntityPropertyCondition`、`AllOf`、`ApplyEntityImpulse`、`PlaySoundEffect`、`ConstantFloat` 在本档参考文件未出现 ⇒ 不写。
- **`RegistrySetBuilder` / `buildRegistry` 接线**：本档 `EnchantmentGenerator` 走 `Entries`，未出现 `bootstrap(BootstrapContext<Enchantment>)` 形态 ⇒ 不写。
- **盔甲/工具的可附魔性**（`getEnchantmentValue()`）在同档 `develop_items_custom-armor.md` / `develop_items_custom-tools.md`，是另一条线，须先读该页再写。
- `EnchantmentEffectComponents` 除 `POST_ATTACK` 外的成员本档语料未列 ⇒ 不猜。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`；物品（附魔挂在物品/装备上）：`03-item.mdc` / `mc-item`
- 状态效果（`MobEffect`，与附魔效果不是一回事）：`mc-effect`
- 全文核对：`get_fabric_doc_full(version="1.21.1", id="develop_items_custom-enchantment-effects")`
