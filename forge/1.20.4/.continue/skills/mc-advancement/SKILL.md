---
name: mc-advancement
description: 进度 JSON 与 AdvancementProvider。触发词：advancement、criteria
platform: forge
version: "1.20.4"
dependencies: []
mappings: parchment
---

# mc-advancement

> 本档正文的类名/签名只来自 `data/forge_1.20.4` 本档语料，逐字读自这两页：
> `forge-docs/1.20.4/processed/resources_server_advancements.md`、
> `forge-docs/1.20.4/processed/datagen_server_advancements.md`。
> 页内没有的签名一律留 `TODO(未核实)`；**禁止**用 `data/forge_1.20.1` 或 NeoForge 文档补全。
> 实测 `diff` 本档这两页与 1.20.1 档同名页面**逐字节相同** ⇒ advancement 面在 1.20.1 / 1.20.4 之间**读不出任何 API 差异**。下文按本档路径书写，不是从邻档搬来的。

## JSON 结构（页内给出的部分）

进度在原版里全部数据驱动：不需要模组也能新增进度，只要一个数据包。页内只给出 `criteria` / `requirements` / `rewards` 三块的确切字段，其余顶层键（`parent`、`display` 一类）**本页未出现** ⇒ `TODO(未核实)`。

```json
// In some advancement JSON

// List of defined criteria to meet
"criteria": {
  "example_criterion1": { /*...*/ },
  "example_criterion2": { /*...*/ },
  "example_criterion3": { /*...*/ },
  "example_criterion4": { /*...*/ }
},

// This advancement is only unlocked once
// - criterion 1 AND 2 have been met
// OR
// - criterion 3 and 4 have been met
"requirements": [
  ["example_criterion1", "example_criterion2"],
  ["example_criterion3", "example_criterion4"]
]
```

`requirements` 是「字符串数组的数组」：外层是 OR，内层是 AND。一条内层数组全部满足即解锁。

奖励（同样在 JSON 里）：

```json
// In some advancement JSON
"rewards": {
  "experience": 10,
  "loot": ["minecraft:example_loot_table", "minecraft:example_loot_table2"],
  "recipes": ["minecraft:example_recipe", "minecraft:example_recipe2"],
  "function": "minecraft:example_function"
}
```

奖励可以是经验、loot table、配方书配方、或以创造玩家身份执行的 function 四者的组合。

完整的进度 JSON 格式本页**不自己维护**，而是明确指向 Minecraft Wiki `Advancement/JSON_format`；trigger 的 JSON 格式指向同页 `#List_of_triggers`。要写这两个面的细节就必须去开那两个链接（指路不等于入库，禁止凭记忆填）。

## Criteria 与 trigger 的运行模型

解锁进度要满足 `criteria`。criteria 由 trigger 跟踪：玩家杀死实体、改变背包、繁殖动物等动作各对应一个 trigger。进度被载入游戏时，其定义的 criteria 会作为监听器挂到对应 trigger 上；随后 trigger 函数（通常命名 `#trigger`）被调用，检查所有监听器当前状态是否满足条件。**criteria 监听器只在进度被完整达成后才移除**。

原版自定义 trigger 的名字清单在 `CriteriaTriggers` 里，页内只给出这个类名，没有逐项列出 ⇒ 想知道某个具体 trigger 名**本页无证据**，改走 `search_forge_docs(version="1.20.4", query="CriteriaTriggers")` 或反编译。

## 自定义 criteria trigger

两个类配套：`AbstractCriterionTriggerInstance` 的子类持有条件，`SimpleCriterionTrigger<T>` 的子类负责注册名、反序列化和派发。`T` 是 trigger instance 的类型。

### `AbstractCriterionTriggerInstance` 子类

表示 `criteria` 对象里的**单个**条件。职责：持有定义好的条件、判断输入是否匹配条件、以及在数据生成时把自己写回 JSON。

条件通常经构造器传入。父构造器要求实例给出 trigger 的注册名，以及玩家必须满足的条件（类型为 `ContextAwarePredicate`）。**注册名直接传给 super，玩家条件作为构造器参数**：

```java
// Where ID is the registry name of the trigger
public ExampleTriggerInstance(ContextAwarePredicate player, ItemPredicate item) {
  super(ID, player);
  // Store the item condition that must be met
}
```

页内建议给 trigger instance 一个静态构造方法，方便数据生成调用；也可以静态导入该方法而不是导入整个类：

```java
public static ExampleTriggerInstance instance(ContextAwarePredicate player, ItemPredicate item) {
  return new ExampleTriggerInstance(player, item);
}
```

需要覆写 `#serializeToJson`，把本实例的条件追加进父类给出的 JSON：

```java
@Override
public JsonObject serializeToJson(SerializationContext context) {
  JsonObject obj = super.serializeToJson(context);
  // Write conditions to json
  return obj;
}
```

最后加一个「拿当前数据状态、返回是否满足条件」的方法。玩家侧条件已经由 `SimpleCriterionTrigger#trigger(ServerPlayer, Predicate)` 检查过了，所以这里只查实例自己存的条件；页内示例命名 `#matches`：

```java
// This method is unique for each instance and is as such not overridden
public boolean matches(ItemStack stack) {
  // Since ItemPredicate matches a stack, a stack is the input
  return this.item.matches(stack);
}
```

### `SimpleCriterionTrigger` 子类

三件事：给出 trigger 注册名、创建 trigger instance、以及检查所有 instance 并在成功时跑监听器。

- 注册名由 `#getId` 供给，**必须与 trigger instance 里传给 super 的注册名一致**。
- instance 由 `#createInstance` 创建，该方法从 JSON 读出一个 criteria：

```java
@Override
public ExampleTriggerInstance createInstance(JsonObject json, ContextAwarePredicate player, DeserializationContext context) {
  // Read conditions from JSON: item
  return new ExampleTriggerInstance(player, item);
}
```

- 再定义一个方法检查所有 instance、条件命中就跑监听器。它接收 `ServerPlayer` 加上 instance 匹配方法所需的其它数据；内部**必须**调 `SimpleCriterionTrigger#trigger` 才能正确处理监听器。页内示例命名 `#trigger`：

```java
// This method is unique for each trigger and is as such not overridden
public void trigger(ServerPlayer player, ItemStack stack) {
  this.trigger(player,
    // The condition checker method within the AbstractCriterionTriggerInstance subclass
    triggerInstance -> triggerInstance.matches(stack)
  );
}
```

> ⚠️ 页内标注的常见错误：**`#trigger` 的调用点不能漏**。自定义动作执行时必须显式调用你在 `SimpleCriterionTrigger` 子类里定义的那个 `#trigger`，否则挂上去的监听器永远不会跑。

```java
// In some piece of code where the action is being performed
// Where EXAMPLE_CRITERIA_TRIGGER is the custom criteria trigger
public void performExampleAction(ServerPlayer player, ItemStack stack) {
  // Run code to perform action
  EXAMPLE_CRITERIA_TRIGGER.trigger(player, stack);
}
```

### 注册 trigger

trigger 实例本身要用 `CriteriaTriggers#register` 注册，时机是 `FMLCommonSetupEvent`。

> **Important（页内原文）**：`CriteriaTriggers#register` 必须通过 `FMLCommonSetupEvent#enqueueWork` 排入同步工作队列，因为该方法**不是线程安全**的。

```java
// 页内只给出「在 FMLCommonSetupEvent 里经 enqueueWork 调 CriteriaTriggers#register」这条约束；
// 事件处理器的完整样板与 register 的确切重载形态本页未逐字出现
// ⇒ // TODO(未核实)：register(...) 的参数顺序/返回值请核 `get_minecraft_source` 或用户自备 forge 1.20.4 jar。
```

## 数据生成

原生形态是构造 `AdvancementProvider` 并提供 `AdvancementSubProvider`；进度可以手工造好递进去，也可以用 `Advancement$Builder` 方便地造。provider 必须加到 `DataGenerator` 上。

**但本档文档明确改用 Forge 的扩展类**：`ForgeAdvancementProvider` 集成得更好，配套子 provider 接口是 `ForgeAdvancementProvider$AdvancementGenerator`。下面这套示例就按 Forge 版写。

```java
// On the MOD event bus
@SubscribeEvent
public void gatherData(GatherDataEvent event) {
    event.getGenerator().addProvider(
        // Tell generator to run only when server data are generating
        event.includeServer(),
        output -> new ForgeAdvancementProvider(
          output,
          event.getLookupProvider(),
          event.getExistingFileHelper(),
          // Sub providers which generate the advancements
          List.of(subProvider1, subProvider2, /*...*/)
        )
    );
}
```

### `ForgeAdvancementProvider$AdvancementGenerator`

负责生成进度：一个方法，收 registry lookup、writer（`Consumer<Advancement>`）和 existing file helper。

```java
// In some subclass of ForgeAdvancementProvider$AdvancementGenerator or as a lambda reference

@Override
public void generate(HolderLookup.Provider registries, Consumer<Advancement> writer, ExistingFileHelper existingFileHelper) {
  // Build advancements here
}
```

### `Advancement$Builder`

造 `Advancement` 的便利实现。可定义父进度、展示信息、完成奖励、解锁条件。**只有 requirements 是必须指定的**，其余可不填。

页内点名的方法：

| 方法 | 作用 |
| --- | --- |
| `parent` | 设定本进度直接挂接的父进度。可以给进度名，也可以直接给模组自己生成的那个 advancement 对象 |
| `display` | 设定显示到聊天栏、toast、进度界面的信息 |
| `rewards` | 设定完成后获得的奖励 |
| `addCriterion` | 给进度加一条条件 |
| `requirements` | 指定条件是全部都要为 true 还是至少一条为 true；另有一个 overload 可混用两种语义 |

builder 就绪后调 `#save`，参数是 writer、进度的注册名、以及用来检查所给 parent 是否存在的 file helper：

```java
// In some ForgeAdvancementProvider$AdvancementGenerator#generate(registries, writer, existingFileHelper)
Advancement example = Advancement.Builder.advancement()
  .addCriterion("example_criterion", triggerInstance) // How the advancement is unlocked
  .save(writer, name, existingFileHelper); // Add data to builder
```

`display` 具体收什么类型、`requirements` overload 的确切两种签名，本页都只给了方法名和一句描述 ⇒ `TODO(未核实)`。

## 本档未覆盖（禁止默写）

- **注册进 registry 的形态**：这两页**完全没有**出现 `Registries` 常量、`ResourceKey`、`Registry.register` 之类字样（grep `Registries\.[A-Z_]` 零命中）。进度是「datapack 里的 JSON」而非模组注册表条目，页面对自定义 trigger 只给了 `CriteriaTriggers#register` 这一条。想写「把 advancement 注册进某个 registry」之前必须先读同档 `concepts_registries.md`（见下），别按别的加载器的习惯默写。
- `DisplayInfo` / `IconItemStack` 一类展示信息的具体类型与字段：页内只有 `display` 一个方法名。
- 原版 trigger 名单：页内只说「见 `CriteriaTriggers`」，未逐项列出。
- `criteria` 内层 trigger 的 JSON 字段名（除自定义 instance 的 `serializeToJson` 之外）：指向 Minecraft Wiki，本仓未入库。
- 条件性加载 / 默认值：页内指向 `../conditional/#implementations`，本档 `processed/` 无 `conditional` 页 ⇒ 缺来源，不写。
- 进度 Tab / 图标 / 背景图、`announce_to_chat`、`show_toast` 等显示开关：本档语料无 ⇒ 不写。
- **本档 vs 1.20.1 差异**：语料层面零差异（四页 `diff` 全同）。若真机遇到行为不同，那是 MC 1.20.4 侧变更，不是本档文档差异 ⇒ 必须另找证据，禁止在本正文里编差异表。

## 相关

- 注册（含「不属于 Forge registry 的注册表」一节）：`01-registry.mdc`、`mc-registry`；同档页 `data/forge_1.20.4/forge-docs/1.20.4/processed/concepts_registries.md`
- 数据生成接线（`GatherDataEvent` / `DataGenerator#addProvider`）：`07-datagen.mdc`、`mc-datagen`、`mc-datapack`
- 战利品奖励字段与 loot table 本体：同档 `mc-loottable`；global loot modifier 在同档页 `resources_server_glm.md` / `datagen_server_glm.md`
- 反模式：`09-anti-patterns.mdc`、`forge/1.20.4/knowledge/antipatterns/registry.md`
- 全文核对：`search_forge_docs(version="1.20.4", query="advancement")` → 上面点名的两个页面 id
