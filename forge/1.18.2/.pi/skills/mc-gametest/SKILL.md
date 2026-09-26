---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: forge
version: "1.18.2"
dependencies: []
mappings: parchment
---

# mc-gametest

> 本档正文的类名/注解名/属性名只来自 `data/forge_1.18.2` 本档语料：页面 `forge-docs/1.18.2/processed/misc_gametest.md`（标题 `# Game Tests`）。该页的示例代码全部是**页内围栏代码块**，无 `<<< @/…` 或 `@[code …]` 转引标记，故本件里每一段代码都是该页正文逐字出现过的内容。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.19.4 / 1.20.1 / 1.20.4 的同名页）或 NeoForge 的对应章节补全。

> 口径：本件出现的名字逐字照抄该页（该页用可读类名，如 `GameTestHelper`、`ServerLevel`、`BlockPos`）。本档 frontmatter 声明 `mappings: mcp`，落到自己工程按工程实际映射通道核对；**禁止**写 `class_` / `method_` 形态的中间名。

## 这套系统在做什么

页内：Game Test 是跑**游戏内单元测试**的方式，设计目标是可扩展、可并行跑大量测试；测试对象交互与行为只是它的应用之一。一个标准 Game Test 走三步（页内编号原样）：

1. 载入一个 structure（模板），里面装着被测试交互/行为所在的场景；
2. 一个方法在场景上执行逻辑；
3. 方法逻辑执行；到达成功态则测试通过，否则失败，结果写在场景旁边的 lectern 里。

所以造一个 Game Test 需要两样东西：**一个持有初始场景状态的模板** + **一个提供执行逻辑的方法**。

## 测试方法：`@GameTest` + `Consumer<GameTestHelper>`

页内：测试方法是 `Consumer<GameTestHelper>` 形态（收一个 `GameTestHelper`，不返回东西）；要被识别，必须带 `@GameTest` 注解：

```java
public class ExampleGameTests {
  @GameTest
  public static void exampleTest(GameTestHelper helper) {
    // Do stuff
  }
}
```

`@GameTest` 还带若干配置成员；页内出现的成员与写法：

```
// In some class
@GameTest(
  setupTicks = 20L, // The test spends 20 ticks to set up for execution
  required = false // The failure is logged but does not affect the execution of the batch
)
public static void exampleConfiguredTest(GameTestHelper helper) {
  // Do stuff
}
```

页内另外点名到的成员（只在这些句子里出现，未给完整清单）：`GameTest#timeoutTicks`（超时）、`GameTest#batch`（分批）、`GameTest#template`、`GameTest#templateNamespace`。**其余成员本档语料未列 ⇒ `TODO(未核实)`，不要凭记忆写。**

### 相对坐标

页内：所有 `GameTestHelper` 方法都把模板场景内的相对坐标换算成结构方块当前位置下的绝对坐标；换算用 `GameTestHelper#absolutePos` 与 `GameTestHelper#relativePos`。

想在游戏里拿某个位置：用 `/test` 命令载入结构 → 把玩家站到目标位置 → 执行 `/test pos`，它取玩家周围 200 格内最近结构的相对坐标，并以可复制的 text component 导出，用作一个 final 局部变量。页内的 Tip：追加变量名即可指定引用名——`/test pos <var>` 导出 `final BlockPos <var> = new BlockPos(...);`。

### 判定成功

页内：测试方法只负责一件事——在有效完成时标记测试成功。若超时（由 `GameTest#timeoutTicks` 定义）前没到成功态，测试自动失败。页内列出四个「极其重要」的方法：

| 方法 | 页内描述 |
| --- | --- |
| `#succeed` | 标记测试成功 |
| `#succeedIf` | 立刻执行传入的 `Runnable`，未抛 `GameTestAssertException` 即成功；当前 tick 没成就记失败 |
| `#succeedWhen` | 每 tick 执行传入的 `Runnable` 直到超时，任一次未抛 `GameTestAssertException` 即成功 |
| `#succeedOnTickWhen` | 只在指定 tick 执行传入的 `Runnable`，未抛 `GameTestAssertException` 即成功；在其他任意 tick 成功则记失败 |

页内的 Important 提醒：Game Test 在被标记成功前**每 tick 都执行**，所以按 tick 安排成功的方法必须保证在之前的 tick 上总是失败。

### 安排动作时机

| 方法 | 页内描述 |
| --- | --- |
| `#runAtTickTime` | 在指定 tick 执行 |
| `#runAfterDelay` | 在当前 tick 之后 `x` tick 执行 |
| `#onEachTick` | 每 tick 执行 |

### 断言

页内：测试期间任意时刻都能做条件断言；`GameTestHelper` 内有许多断言方法，其本质是「状态不满足就抛 `GameTestAssertException`」。**具体断言方法名该页未列 ⇒ `TODO(未核实)`**，需要时先 `get_forge_doc_full` 复核或反编译 `GameTestHelper`，禁止默写方法名。

## 动态生成测试：`@GameTestGenerator` + `TestFunction`

页内：若测试方法需要动态生成，就写一个生成器——不收参数、返回 `TestFunction` 集合，并带 `@GameTestGenerator`：

```java
public class ExampleGameTests {
  @GameTestGenerator
  public static Collection<TestFunction> exampleTests() {
    // Return a collection of TestFunction
  }
}
```

`TestFunction` 是 `@GameTest` 注解与实际跑测试的方法之间那层装箱信息。页内 Tip：任何被 `@GameTest` 标注的方法都会经 `GameTestRegistry#turnMethodIntoTestFunction` 变成一个 `TestFunction`；该方法可作为「不用注解手搓 `TestFunction`」的参照。

## 分批（Batching）与批前后钩子

页内：测试可以按批次而非注册顺序执行，同一批次靠给相同的 `GameTest#batch` 字符串。单看批次本身没有作用，它用于在测试所在 level 上做 setup / teardown——给方法加 `@BeforeBatch`（setup）或 `@AfterBatch`（teardown），且 `#batch` 必须与测试给的字符串一致。批方法是 `Consumer<ServerLevel>` 形态（收一个 `ServerLevel`，不返回东西）：

```java
public class ExampleGameTests {
  @BeforeBatch(batch = "firstBatch")
  public static void beforeTest(ServerLevel level) {
    // Perform setup
  }

  @GameTest(batch = "firstBatch")
  public static void exampleTest2(GameTestHelper helper) {
    // Do stuff
  }
}
```

## 注册测试：`@GameTestHolder` 或 `RegisterGameTestsEvent`

页内：测试必须注册才能在游戏里跑，有两条路——`@GameTestHolder` 注解或 `RegisterGameTestsEvent`；两条路都仍要求测试方法带 `@GameTest` / `@GameTestGenerator` / `@BeforeBatch` / `@AfterBatch` 之一。

### `@GameTestHolder`

加在类型（class、interface、enum、record）上即注册其中的测试方法。页内原话：「`@GameTestHolder` contains a single method which has multiple uses. In this instance, the supplied `#value` must be the mod id of the mod; otherwise, the test will not run under default configurations.」——即本件讲的是它拿来做 mod id 的这一用途。

```
@GameTestHolder(MODID)
public class ExampleGameTests {
  // ...
}
```

### `RegisterGameTestsEvent`

页内正文把事件类名写成了 `RegisterGameTestEvent`（**无 s**），而标题与示例代码写的是 `RegisterGameTestsEvent`——上游该页自身拼写不一致，本件两种都登记，实读代码块用的是 `RegisterGameTestsEvent`。用法：`#register` 注册类或方法，事件监听要挂到 **mod event bus**（页内指向 `../../concepts/events/#creating-an-event-handler`）；这样注册的测试方法必须逐个给 `GameTest#templateNamespace` 提供 mod id。

```
// In some class
public void registerTests(RegisterGameTestsEvent event) {
  event.register(ExampleGameTests.class);
}

// In ExampleGameTests
@GameTest(templateNamespace = MODID)
public static void exampleTest3(GameTestHelper helper) {
  // Perform setup
}
```

页内 Note：`GameTestHolder#value` 与 `GameTest#templateNamespace` 给的值可以和当前 mod id 不同，但那需要改构建脚本配置（见下一节）。

## 结构模板（Structure Templates）

页内：测试跑在由 structure（模板）载入的场景里，模板决定场景尺寸与初始数据（方块与实体）。**模板必须以 `.nbt` 文件存放在 `data/<namespace>/structures`**。Tip：模板可用 structure block 创建并保存。

模板位置由三个因素决定（页内三条）：是否指定了模板 namespace、类名是否要前缀到模板名、是否指定了模板名。规则：

- namespace：先看 `GameTest#templateNamespace`，未给则看 `GameTestHolder#value`，都没有则是 `minecraft`。
- 类名前缀：若类或带测试注解的方法上应用了 `@PrefixGameTestTemplate(false)`，则不加前缀；否则把类 simple name 转小写，前缀 + `.` 放在模板名前。
- 模板名：看 `GameTest#template`；未指定则用方法名小写。

页内示例（逐字，含其位置注释）：

```
// Modid for all structures will be MODID
@GameTestHolder(MODID)
public class ExampleGameTests {

  // Class name is prepended, template name is not specified
  // Template Location at 'modid:examplegametests.exampletest'
  @GameTest
  public static void exampleTest(GameTestHelper helper) { /*...*/ }

  // Class name is not prepended, template name is not specified
  // Template Location at 'modid:exampletest2'
  @PrefixGameTestTemplate(false)
  @GameTest
  public static void exampleTest2(GameTestHelper helper) { /*...*/ }

  // Class name is prepended, template name is specified
  // Template Location at 'modid:examplegametests.test_template'
  @GameTest(template = "test_template")
  public static void exampleTest3(GameTestHelper helper) { /*...*/ }

  // Class name is not prepended, template name is specified
  // Template Location at 'modid:test_template2'
  @PrefixGameTestTemplate(false)
  @GameTest(template = "test_template2")
  public static void exampleTest4(GameTestHelper helper) { /*...*/ }
}
```

## 跑测试：`/test`

页内：用 `/test` 命令跑；子命令跟在命令后（`/test <subcommand>`）。页内认为重要的几个：

| 子命令 | 页内描述 |
| --- | --- |
| `run` | 跑指定测试：`run <test_name>` |
| `runall` | 跑所有可用测试 |
| `runthis` | 跑玩家 15 格内最近的那个测试 |
| `runthese` | 跑玩家 200 格内的测试 |
| `runfailed` | 跑上次运行中失败的所有测试 |

## 构建脚本配置

### 放开其他 namespace

页内：若构建脚本按推荐方式配置过，则只有当前 mod id 下的 Game Test 被启用。要放开别的，得在 run configuration 里把属性 `forge.enabledGameTestNamespaces` 设为逗号分隔的 namespace 串；该属性为空或未设置时，所有 namespace 都会被载入。

```
// Inside a run configuration
property 'forge.enabledGameTestNamespaces', 'modid1,modid2,modid3'
```

页内 Warning：namespace 之间**不能有空格**，否则该 namespace 不会被正确加载。

### Game Test Server

页内：`gameTestServer` 是一个特殊配置，跑一个 build server，返回「必需的失败测试数」作为退出码；所有失败测试（必需或可选）都会被记录。用 `gradlew runGameTestServer` 跑。

### 在其他 run configuration 里启用

页内：默认只有 `client`、`server`、`gameTestServer` 三个 run configuration 启用 Game Test。想让其他配置也跑，需把 `forge.enableGameTest` 属性设为 `true`：

```
// Inside a run configuration
property 'forge.enableGameTest', 'true'
```

## 本档未覆盖（禁止默写）

- **`GameTestHelper` 的断言方法清单**：页内只说「numerous assertion methods」并给异常类型 `GameTestAssertException`，未列方法名 ⇒ 不写；需要时 `get_minecraft_source` / 反编译核对。
- **`GameTestHelper` 的建场景 API**（放置方块/实体、找相对位置之外的方法）：页内只出现 `#absolutePos` / `#relativePos` ⇒ 其余不猜。
- **`@GameTest` 的完整成员表**：页内只出现 `setupTicks` / `required` / `timeoutTicks` / `batch` / `template` / `templateNamespace` ⇒ 其余成员（例如重试次数、手动 tick 一类）本档无证据，禁止按邻版或记忆补。
- **模板 `.nbt` 的 datagen / 自动化生成**：页内只给「用 structure block 手工创建」；本档 `07-datagen.mdc` 那条线不覆盖模板导出 ⇒ `TODO(未核实)`。
- **`@GameTestHolder` 成员的其他用途**：页内只讲「本实例下给 mod id」这一用途。
- **CI / 批量结果解析**：页内只说 `runGameTestServer` 的退出码语义，未给报表格式。

## 相关

- 事件挂载（`RegisterGameTestsEvent` 要挂 mod event bus）：`05-events.mdc` / `mc-events`；注册总则：`01-registry.mdc` / `mc-registry`
- 构建脚本与 run configuration：`00-project-setup.mdc`
- 全文核对：`get_forge_doc_full(version="1.18.2", id="misc_gametest")`；检索：`search_forge_docs(version="1.18.2", query="gametest")`
