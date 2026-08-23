---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: forge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# mc-gametest

> 本档核实页 id：`misc_gametest`（`data/forge_1.20.4/forge-docs/1.20.4/index-l0.json` 命中；processed 正文与 1.20.1 档核实稿**逐字一致**）。

Game Test 是 Forge 内置的游戏内单元测试框架：由「结构模板」（.nbt 场景）+「逻辑方法」组成，可批量、并行地运行大量测试。测试结果存放在场景旁的讲台上；失败会记录（`required = false` 只记日志，不影响批次）。

## 快速开始

标准三步：加载模板 → 方法执行逻辑 → 达到成功状态；未在超时前标记成功则自动失败。

1. **写测试方法**：`@GameTest` 标注；方法签名必须是 `public static void exampleTest(GameTestHelper helper)`（即 `Consumer<GameTestHelper>` 引用，返回 void）。
2. **注册测试类**：类/接口/枚举/record 上标 `@GameTestHolder(MODID)`；value 必须是 mod id，否则默认配置下测试不运行。
3. **准备模板**：`.nbt` 放 `data/<modid>/structures/`；用结构方块保存场景，`/test pos` 导出相对坐标。
4. **运行**：游戏内 `/test run <test_name>`；自动化用 `gradlew runGameTestServer`。

```java
@GameTestHolder(MODID)
public class ExampleGameTests {
    @GameTest // 模板名缺省 = 类名小写 + 方法名 → modid:examplegametests.exampletest
    public static void exampleTest(GameTestHelper helper) {
        helper.succeed(); // 标记成功；超时（timeoutTicks）前未标记则自动失败
    }
}
```

`@GameTest` 成员配置：`template`（模板名）、`templateNamespace`（模板命名空间）、`batch`（分批）、`setupTicks`（开跑前 N tick 布置）、`required`（失败是否只记日志）、`timeoutTicks`（超时）等。

### 成功态与调度

成功态四个重要抽象：`#succeed`（立即成功）、`#succeedIf`（立即检查，未通过即失败）、`#succeedWhen`（每 tick 检查直到超时）、`#succeedOnTickWhen`（只在指定 tick 检查，其它 tick 通过算失败）。动作调度：`#runAtTickTime`（指定 tick 执行）、`#runAfterDelay`（当前 tick 后延迟 x tick）、`#onEachTick`（每 tick 执行）。

### 动态生成与批次示例

```java
@GameTestHolder(MODID)
public class ExampleGameTests {
    @GameTestGenerator // 无参数、返回 Collection<TestFunction>
    public static Collection<TestFunction> exampleTests() {
        // 用 GameTestRegistry#turnMethodIntoTestFunction 的思路打包
    }

    @BeforeBatch(batch = "firstBatch") // 批次 setup，方法是 Consumer<ServerLevel>
    public static void beforeTest(ServerLevel level) {
        // 布置该批次的世界状态
    }
}
```

## API 锚点

来源页 id：`misc_gametest` — https://docs.minecraftforge.net/en/1.20.4/misc/gametest/

| 条目 | 说明 |
|------|------|
| `@GameTest` | 标注测试方法；成员配置见上 |
| `GameTestHelper` | 测试方法入参；`#absolutePos` / `#relativePos` 做模板相对坐标 ↔ 世界绝对坐标换算 |
| `GameTestAssertException` | 断言失败的表现：抛出即失败 |
| `@GameTestGenerator` | 无参方法返回 `Collection<TestFunction>`，动态生成测试 |
| `TestFunction` | `@GameTest` 注解与方法本身的打包信息；原理参考 `GameTestRegistry#turnMethodIntoTestFunction` |
| `@GameTestHolder(MODID)` | 注册途径之一：标注类/接口/枚举/record |
| `RegisterGameTestsEvent` | 注册途径之二；监听器加到 **mod event bus**，`event.register(ExampleGameTests.class)`；此路每个 `@GameTest` 须自带 `templateNamespace` |
| `@BeforeBatch` / `@AfterBatch` | 批次 setup/teardown；方法是 `Consumer<ServerLevel>`（如 `public static void beforeTest(ServerLevel level)`），`batch` 值须与测试一致 |
| `@PrefixGameTestTemplate(false)` | 关闭「简单类名小写 + `.` + 模板名」前缀 |
| `/test` 子命令 | `run <name>` / `runall` / `runthis`（15 格内）/ `runthese`（200 格内）/ `runfailed`；`/test pos` 导出相对坐标 |
| `forge.enabledGameTestNamespaces` | buildscript run 配置属性；逗号分隔、**不能有空格**；空/未设置 = 所有命名空间 |
| `forge.enableGameTest` / `runGameTestServer` | 其它 run 配置开测试 → 设 `true`；`gradlew runGameTestServer` 退出码 = 必需失败的测试数 |

**模板定位**：命名空间按 `GameTest#templateNamespace` → `GameTestHolder#value` → `minecraft` 依次回退；模板名取 `GameTest#template`，缺省为方法名小写（前缀规则见 `@PrefixGameTestTemplate`）。

## Decision: 选择测试组织方式

```
IF 常规场景测试 → @GameTest 方法 + GameTestHelper（标准三步）
IF 参数化/动态生成 → @GameTestGenerator 返回 Collection<TestFunction>
IF 需要批次 setup/teardown → @GameTest(batch = "x") + @BeforeBatch/@AfterBatch（相同 batch 字符串）
IF 注册：类级省事 → @GameTestHolder(MODID)
IF 注册：按需/动态 → RegisterGameTestsEvent（mod event bus；方法级给 templateNamespace）
IF 本地快速验证 → /test runthis / runthese；批量 CI → gradlew runGameTestServer
```

## 常见错误

- ❌ 测试方法有返回值或非静态 → 必须是 `public static void xxx(GameTestHelper)`（`Consumer<GameTestHelper>`）
- ❌ 漏标 `@GameTest` → 方法不会被识别为测试
- ❌ `@GameTestHolder` 的 value 不是 mod id → 默认配置下测试不运行
- ❌ 用 `RegisterGameTestsEvent` 却没给方法加 `@GameTest(templateNamespace = MODID)` → 模板命名空间解析失败
- ❌ `.nbt` 放错目录或没按前缀规则命名 → 应在 `data/<modid>/structures/`，注意 `modid:examplegametests.exampletest` 型前缀
- ❌ 用 `succeedWhen`/`succeedOnTickWhen` 却未保证提前的 tick 抛断言失败 → 测试每 tick 都跑，提前通过会错判
- ❌ `forge.enabledGameTestNamespaces` 值里带空格 → 命名空间加载失败
- ✅ 需要布置/初始状态的场景 → 用 `setupTicks` 或 `@BeforeBatch` 做 setup，别依赖真实时间

## 参考资料

- 官方页 id：`misc_gametest`（Game Tests）：https://docs.minecraftforge.net/en/1.20.4/misc/gametest/
- Minecraft Wiki（GameTest）：https://minecraft.wiki/w/Game_test
- 规则文件：`forge/1.20.4/.cursor/rules/`（01-registry / 07-datagen / 09-anti-patterns）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 测试引用的方块/物品/实体先按 01-registry.mdc 注册 |
| `mc-structure` | 结构模板制作与 `.nbt` 放置 |
| `mc-datagen` | 模板/数据由数据生成器产出时注意包结构与命名 |
| `mc-blockentity` | 方块实体交互行为的测试 |

## 下一步

打开 `misc_gametest` 官方页全文（`get_doc_full` / 浏览器），按「方法 → 注册 → 模板 → `/test run`」落地第一个测试；写动态生成或批次前再核对 `@GameTest` 成员语义与 `TestFunction` 打包细节。
