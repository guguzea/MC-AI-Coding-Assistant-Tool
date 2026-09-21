---
name: mc-advancement
description: 进度 JSON 与 AdvancementProvider。触发词：advancement、criteria
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-advancement

> 本档正文的类名/签名只来自 `data/fabric_1.21.11` 本档语料：页面 `fabric-docs/1.21.11/processed/develop_data-generation_advancements.md`，代码 `reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModAdvancementProvider.java`、`.../datagen/ExampleModDataGenerator.java`、`reference/1.21.11/src/main/java/com/example/docs/advancement/{ExampleModDatagenAdvancement,UseToolCriterion,ParameterizedUseToolCriterion,ModCriteria}.java`、产物 `reference/1.21.11/src/main/generated/data/example-mod/advancement/get_dirt.json`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.10 / 1.21.8 / 1.21.4 / 26.1.2）补全。

## 先读这条：本档与 1.21.10 档不同名（禁止互抄）

本档参考代码用 **`net.minecraft.resources.Identifier`** 与 **`net.minecraft.advancements.criterion.*`（单数）**；本档页面 warning 也逐字写「the function accepts the `Identifier` of the advancement in `String` format」。

`data/fabric_1.21.10` 的同一批参考文件用的是 **`net.minecraft.resources.ResourceLocation`** 与 **`net.minecraft.advancements.critereon.*`**，且那边页面写的是 `ResourceLocation` 并给包名标了 `[sic]`。两档各自内部自洽，但名字互不通用。

⇒ 本档正文与用户工程里不要出现 `ResourceLocation`、`critereon`；同样不要把本档的 `Identifier` / `criterion` 抄去 1.21.10。另注意本档 `Identifier` 工厂在本档内有两种写法并存：本页参考代码用 `Identifier.withDefaultNamespace(...)`，`01-registry.mdc:16` 钉的是 `Identifier.of(MOD_ID, "registry_name")`（1.21 的构造器是 private，不要写 `new Identifier(...)`），而 `mc-effect` / `mc-potion` 同域参考代码用 `Identifier.fromNamespaceAndPath(...)`。跟工程既有写法保持一致，不要混。

## 页面 prose 与盘上代码不一致（必读）

本档页面有两处说了盘上代码里不存在的名字，照 prose 写会编译不过：

1. 「Advancement Structure」一节列了 `DisplayInfo`、`AdvancementRequirements`、`AdvancementRewards`、`Strategy` 四个类型名——**这四个名字在本档任何参考文件的 import 面里都不存在**。盘上只有 `Advancement`、`AdvancementHolder`、`AdvancementType`；展示信息是 `.display(...)` 方法调用，奖励与 strategy 本档代码**一次都没写过**。
2. 「Definitions」说 `playerPredicate` 「technically a `LootContextPredicate`」，而本档两份 criterion 代码的字段类型逐字是 `Optional<ContextAwarePredicate>`，`LootContextPredicate` 在本档语料里只出现在页面这句 prose 中。

「One More Example」一节还写「We'll practice adding rewards」，但 `datagen-advancements:second-advancement` 标记段里**没有任何 reward 调用**，只有 `.parent(...)` + 两个 `.addCriterion(...)`。⇒ 奖励 API 一律 `TODO(未核实)`。

## Provider：继承 FabricAdvancementProvider

```java
public class ExampleModAdvancementProvider extends FabricAdvancementProvider {
	protected ExampleModAdvancementProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
		super(output, registryLookup);
	}

	@Override
	public void generateAdvancement(HolderLookup.Provider wrapperLookup, Consumer<AdvancementHolder> consumer) {
		// ...
	}
}
```

- 本文件 import 面（照抄即用）：`java.util.Optional`、`java.util.concurrent.CompletableFuture`、`java.util.function.Consumer`、`net.minecraft.advancements.Advancement`、`net.minecraft.advancements.AdvancementHolder`、`net.minecraft.advancements.AdvancementType`、`net.minecraft.advancements.criterion.ConsumeItemTrigger`、`net.minecraft.advancements.criterion.InventoryChangeTrigger`、`net.minecraft.core.HolderLookup`、`net.minecraft.core.registries.Registries`、`net.minecraft.network.chat.Component`、`net.minecraft.resources.Identifier`、`net.minecraft.world.item.Item`、`net.minecraft.world.item.Items`、`net.fabricmc.fabric.api.datagen.v1.FabricDataOutput`、`net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider`。
- 覆写方法签名逐字：`generateAdvancement(HolderLookup.Provider wrapperLookup, Consumer<AdvancementHolder> consumer)`。
- 页面前置要求：先完成 datagen setup（页面链接 `./setup`）。

## 注册进 DataGeneratorEntrypoint

页面：把该 provider 加进 `DataGeneratorEntrypoint` 的 `onInitializeDataGenerator` 方法里。本档转引标记是 `transcludeWith=:::datagen-advancements:register`，盘上该标记段逐字是：

```java
pack.addProvider(ExampleModAdvancementProvider::new);
```

`pack` 来自同文件 `FabricDataGenerator.Pack pack = fabricDataGenerator.createPack();`；入口类形态是 `public class ExampleModDataGenerator implements DataGeneratorEntrypoint`，另有 `buildRegistry(RegistrySetBuilder registryBuilder)` 覆写（与本主题无关）。其余 datagen 装配细节属 `mc-datagen` / `07-datagen.mdc`。

## 简单进度：display + addCriterion + save

```java
AdvancementHolder getDirt = Advancement.Builder.advancement()
		.display(
				Items.DIRT, // The display icon
				Component.literal("Your First Dirt Block"), // The title
				Component.literal("Now make a house from it"), // The description
				Identifier.withDefaultNamespace("textures/gui/advancements/backgrounds/adventure.png"), // Background image for the tab in the advancements page, if this is a root advancement (has no parent)
				AdvancementType.TASK, // TASK, CHALLENGE, or GOAL
				true, // Show the toast when completing it
				true, // Announce it to chat
				false // Hide it in the advancement tab until it's achieved
		)
		// "got_dirt" is the name referenced by other advancements when they want to have "requirements."
		.addCriterion("got_dirt", InventoryChangeTrigger.TriggerInstance.hasItems(Items.DIRT))
		// Give the advancement an id
		.save(consumer, ExampleMod.MOD_ID + ":get_dirt");
```

- 建造入口是 `Advancement.Builder.advancement()`（静态）。
- `.display(...)` 在本档是 **7 参**：icon（`Item`）、title（`Component`）、description（`Component`）、background（`Identifier`，子进度传 `null`）、`AdvancementType`、三个 `boolean`（toast / 播报聊天 / 是否提前隐藏）。本档出现的 `AdvancementType` 常量只有 `TASK`、`CHALLENGE`、`GOAL`；其余形态 ⇒ `TODO(未核实)`。
- `.addCriterion(String name, TriggerInstance)`：第二个实参的类型页面与代码都未写出 ⇒ `TODO(未核实)`。本档出现的构造入口有 `InventoryChangeTrigger.TriggerInstance.hasItems(Item...)` 与 `ConsumeItemTrigger.TriggerInstance.usedItem(HolderLookup.RegistryLookup<Item>, Item)`。
- `.save(Consumer<AdvancementHolder>, String)`：**页面 warning 原文**——「the function accepts the `Identifier` of the advancement in `String` format」。本档实参一律是拼接串 `ExampleMod.MOD_ID + ":get_dirt"`，不是 `Identifier` 对象。
- `HolderLookup.RegistryLookup<Item>` 取自 `wrapperLookup.lookupOrThrow(Registries.ITEM)`。

## 多条件与父子

```java
final HolderLookup.RegistryLookup<Item> itemLookup = wrapperLookup.lookupOrThrow(Registries.ITEM);
AdvancementHolder appleAndBeef = Advancement.Builder.advancement()
		.parent(getDirt)
		.display(/* 同上，background 传 null */)
		.addCriterion("ate_apple", ConsumeItemTrigger.TriggerInstance.usedItem(itemLookup, Items.APPLE))
		.addCriterion("ate_cooked_beef", ConsumeItemTrigger.TriggerInstance.usedItem(itemLookup, Items.COOKED_BEEF))
		.save(consumer, ExampleMod.MOD_ID + ":apple_and_beef");
```

`.parent(...)` 收的是一个已保存的 `AdvancementHolder`（本档传 `getDirt` / `breakBlockWithTool`）。多个 criterion 的「列表的列表」语义页面在 Structure 一节用 `AdvancementRequirements` 解释（每子列表至少满足一个），但本档代码里没有出现构造 requirements 的调用 ⇒ 该 API `TODO(未核实)`。

## 生成产物 JSON

本档盘上真有生成结果：`src/main/generated/data/example-mod/advancement/get_dirt.json`（注意目录名是单数 `advancement`）。逐字字段：

```json
{
  "criteria": {
    "got_dirt": {
      "conditions": { "items": [ { "items": "minecraft:dirt" } ] },
      "trigger": "minecraft:inventory_changed"
    }
  },
  "display": {
    "background": "minecraft:textures/gui/advancements/backgrounds/adventure.png",
    "description": "Now make a house from it",
    "icon": { "count": 1, "id": "minecraft:dirt" },
    "title": "Your First Dirt Block"
  },
  "requirements": [ [ "got_dirt" ] ],
  "sends_telemetry_event": true
}
```

- 语言键、tab/根进度、`announce_to_chat` 一类字段在本档产物里**没出现**（toast / 播报是在 Java 侧设的）⇒ 手写 JSON 前必须 `get_fabric_doc_full` 或用 `validate_datapack_json` 复核，不要默写字段名。
- `sends_telemetry_event: true` 由 Java 侧生成，本档代码未显式设置 ⇒ 其开关 API `TODO(未核实)`。

## 自定义 criterion：SimpleCriterionTrigger

页面警告原文：datagen 可以在客户端侧，但 `Criterion` 与 `Predicate` 必须在 main source set（两侧都要），因为服务端要触发和求值。

```java
public class UseToolCriterion extends SimpleCriterionTrigger<UseToolCriterion.Conditions> {
	public void trigger(ServerPlayer player) {
		trigger(player, Conditions::requirementsMet);
	}

	@Override
	public Codec<Conditions> codec() {
		return Conditions.CODEC;
	}

	public record Conditions(Optional<ContextAwarePredicate> playerPredicate) implements SimpleCriterionTrigger.SimpleInstance {
		public static Codec<UseToolCriterion.Conditions> CODEC = ContextAwarePredicate.CODEC.optionalFieldOf("player")
				.xmap(Conditions::new, Conditions::player).codec();

		@Override
		public Optional<ContextAwarePredicate> player() {
			return playerPredicate;
		}

		public boolean requirementsMet() {
			return true; // AbstractCriterion#trigger helpfully checks the playerPredicate for us.
		}
	}
}
```

import 面：`java.util.Optional`、`com.mojang.serialization.Codec`、`net.minecraft.advancements.criterion.ContextAwarePredicate`、`net.minecraft.advancements.criterion.SimpleCriterionTrigger`、`net.minecraft.server.level.ServerPlayer`。

- 必须覆写 `codec()` 返回 `Codec<Conditions>`；`Conditions` 是实现 `SimpleCriterionTrigger.SimpleInstance` 的 record，须覆写 `player()`。
- 代码注释里的 `AbstractCriterion#trigger` 说明玩家谓词由父类检查——`AbstractCriterion` 在本档**只出现在注释**中，未 import，其签名 `TODO(未核实)`。
- `trigger(player, Conditions::requirementsMet)` 继承自父类，父类声明面本档不在盘上 ⇒ 不要写其余重载。

## 带参数的 criterion

```java
public record Conditions(Optional<ContextAwarePredicate> playerPredicate, int requiredTimes) implements SimpleCriterionTrigger.SimpleInstance {
	public static Codec<ParameterizedUseToolCriterion.Conditions> CODEC = RecordCodecBuilder.create(instance -> instance.group(
			ContextAwarePredicate.CODEC.optionalFieldOf("player").forGetter(Conditions::player),
			Codec.INT.fieldOf("requiredTimes").forGetter(Conditions::requiredTimes)
	).apply(instance, Conditions::new));

	public boolean requirementsMet(int totalTimes) {
		return totalTimes > requiredTimes;
	}
}

public void trigger(ServerPlayer player, int totalTimes) {
	trigger(player, conditions -> conditions.requirementsMet(totalTimes));
}
```

额外 import：`com.mojang.serialization.codecs.RecordCodecBuilder`。JSON 字段名 `requiredTimes`、`player` 就是从 `fieldOf(...)` 来的。

## 注册 criterion 与触发

```java
public class ModCriteria {
	public static final UseToolCriterion USE_TOOL = CriteriaTriggers.register(ExampleMod.MOD_ID + ":use_tool", new UseToolCriterion());
	public static final ParameterizedUseToolCriterion PARAMETERIZED_USE_TOOL = CriteriaTriggers.register(ExampleMod.MOD_ID + ":parameterized_use_tool", new ParameterizedUseToolCriterion());

	public static void init() {
	}
}
```

- import `net.minecraft.advancements.CriteriaTriggers`；`register(String, T)` 的返回值直接赋给具体类型字段（泛型形态本档未写 ⇒ `TODO(未核实)`）。
- `init()` 是空方法，只为「在正确时机初始化」而存在，需在 `ModInitializer#onInitialize()` 里调 `ModCriteria.init();`。
- 触发示例（本档 `ExampleModDatagenAdvancement` 用 `PlayerBlockBreakEvents.AFTER.register(...)`，lambda 五参 `(level, player, blockPos, blockState, blockEntity)`）：`ModCriteria.USE_TOOL.trigger(serverPlayer);`、`ModCriteria.PARAMETERIZED_USE_TOOL.trigger(serverPlayer, usedCount);`，并先 `if (player instanceof ServerPlayer serverPlayer)` 收窄。
- 在 provider 里挂自定义条件：`ModCriteria.USE_TOOL.createCriterion(new UseToolCriterion.Conditions(Optional.empty()))`、`ModCriteria.PARAMETERIZED_USE_TOOL.createCriterion(new ParameterizedUseToolCriterion.Conditions(Optional.empty(), 5))`。`createCriterion` 的返回类型本档未写 ⇒ `TODO(未核实)`。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.11/reference/1.21.11/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `ServerPlayer` | `ServerPlayerEntity` | 1.14.4–1.21.11 | join（`net.minecraft.server.network.ServerPlayerEntity`） |
| `HolderLookup` | `RegistryWrapper` | 1.19.4–1.21.11 | join（`net.minecraft.registry.RegistryWrapper`）· 本轮纠正（原写 `DynamicRegistryManager`） |
| `AdvancementHolder` | `AdvancementEntry` | 1.20.4–1.21.11 | join（`net.minecraft.advancement.AdvancementEntry`）· 本轮纠正（原写 `Advancement`） |
| `CriteriaTriggers` | `Criteria` | 1.16.5–1.21.11 | join（`net.minecraft.advancement.criterion.Criteria`）· 本轮纠正（原写 `Criterion`） |
| `ContextAwarePredicate` | `LootContextPredicate` | 1.20.1–1.21.11 | join（`net.minecraft.predicate.entity.LootContextPredicate`） |
| `RegistryLookup` | 未核实 | **禁止猜**：Yarn 侧名字未经本档 sqlite 证实，走 `get_minecraft_source` 或 IDE `genSources` |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- **奖励 API**（`AdvancementRewards` / 经验 / 掉落表 / 解锁配方）：页面 prose 提到类型名并宣称要演示 rewards，盘上代码零出现 ⇒ 整面不写。
- **`Strategy`**（all / any 语义）：只有页面 prose 出现，代码无 ⇒ `TODO(未核实)`。
- **`DisplayInfo`**：页面 prose 的名，盘上只有 `.display(...)` 七参调用；该类型在本档 import 面不存在。
- 进度 tab / 根进度 / `advancement_tab`、图标 `ItemStack` 变体、`Component.translatable`、语言键：本档语料无（同档 `develop_data-generation_translations.md` 是另一主题，未在此引）。
- `CriteriaTriggers.register` 的泛型签名、`SimpleCriterionTrigger` 除 `codec()` / `trigger(...)` / `SimpleInstance` 之外的成员、`AbstractCriterion` 本体：需 `query_loader_api(platform=fabric, minecraftVersion=1.21.11)` 或 `get_minecraft_source` 核实。
- 原版 criterion 触发器清单：页面只给外链 `https://minecraft.wiki/w/Advancement_definition#List_of_triggers` 与包名 `net.minecraft.advancements.criterion`，未列类名；本档代码只出现 `ConsumeItemTrigger`、`InventoryChangeTrigger`、`ContextAwarePredicate`、`SimpleCriterionTrigger` 四个。
- 手写（非 datagen）进度 JSON 的完整 schema、`requirements` 的手写规则、`sends_telemetry_event` 的开关：本档无证据。
- 映射口径提醒：本档 frontmatter 钉 `mappings: yarn`，而参考工程用 `mappings loom.officialMojangMappings()`，正文里的 `net.minecraft.*` 名因此是官方名。工程真用 Yarn 时须自行 `convert_mapping` 对照，禁止把上面的包名当 Yarn 名直写。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`（前置 datagen setup 页：`develop_data-generation_setup.md`）；战利品表（reward 相关时先读该页）：`mc-loottable`；编码：页面链接原文 `../codecs`，盘上 `processed/develop_codecs.md`
- 反模式：`09-anti-patterns.mdc`、`fabric/1.21.11/knowledge/antipatterns/`
- 本档核实表：`fabric/1.21.11/knowledge/common/verified-api-1.21.11.md`
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_data-generation_advancements")`
