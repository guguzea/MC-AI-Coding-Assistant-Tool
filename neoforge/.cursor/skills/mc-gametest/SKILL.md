---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# mc-gametest（NeoForge）

GameTest 是 vanilla 内置的「结构测试」体系：**结构模板（.nbt 场景）+ 逻辑方法**，可批量/并行运行，不需要真实玩家。

> **核实状态声明**：NeoForge 1.21.1+ 与 Forge 语义同源；本档（data/neoforge_1.21.1 与 26.1 树）**没有独立 GameTest 文档页**，以下以 **Forge 1.20.1 页 `misc_gametest` 已核实条目**为语义基线；**NeoForge 侧类名/事件名/run 配置名以 `search_neoforge_docs` 复核后使用**，不照抄 Forge 名字、不凭记忆补签名。

## 入口（标准三步）

1. **写测试方法**：`@GameTest` 标注；签名必须是 `public static void exampleTest(GameTestHelper helper)`（无返回值，即 `Consumer<GameTestHelper>` 引用）。
2. **登记测试类**：类/接口/枚举/record 上标 `@GameTestHolder(MODID)`；value 必须是 mod id，否则默认配置下测试不运行。
3. **准备模板**：`.nbt` 放 `data/<modid>/structures/`；结构方块保存场景，`/test pos` 导出相对坐标。
4. **运行**：游戏内 `/test run <test_name>`；批量用 `gradlew runGameTestServer`（Forge 名，NeoForge 的 run 配置名复核后使用）。

```java
@GameTestHolder(MODID)
public class ExampleGameTests {
    @GameTest // 模板名缺省 = 类名小写 + 方法名 → modid:examplegametests.exampletest
    public static void exampleTest(GameTestHelper helper) {
        helper.succeed(); // 超时（timeoutTicks）前未标记成功则自动失败
    }
}
```

## 语义基线锚点（Forge 1.20.1 `misc_gametest` 已核实；NeoForge 以 search_neoforge_docs 复核）

| 条目 | 说明 |
|------|------|
| `@GameTest` | 标注测试方法；成员：`template`、`templateNamespace`、`batch`、`setupTicks`、`required`、`timeoutTicks` 等 |
| `GameTestHelper` | 方法入参；`#absolutePos` / `#relativePos` 做模板相对坐标 ↔ 世界坐标换算 |
| 成功态 | `#succeed`（立即成功）、`#succeedIf`、`#succeedWhen`（每 tick 检查）、`#succeedOnTickWhen`（指定 tick 检查） |
| 调度 | `#runAtTickTime` / `#runAfterDelay` / `#onEachTick` |
| `@GameTestGenerator` | 无参、返回 `Collection<TestFunction>`，动态生成测试 |
| `TestFunction` | `@GameTest` 注解与方法本身的打包信息 |
| `@GameTestHolder(MODID)` | 登记途径之一（类/接口/枚举/record） |
| `RegisterGameTestsEvent` | 登记途径之二；**mod event bus**；此路每个 `@GameTest` 须自带 `templateNamespace` |
| `@BeforeBatch` / `@AfterBatch` | 批次 setup/teardown；`batch` 值与测试一致；方法是 `Consumer<ServerLevel>` |
| `@PrefixGameTestTemplate(false)` | 关闭「简单类名小写 + `.` + 模板名」前缀 |
| `/test` 子命令 | `run <name>` / `runall` / `runthis`（15 格内）/ `runthese`（200 格内）/ `runfailed`；`/test pos` 导出相对坐标 |
| run 配置 | Forge：`forge.enabledGameTestNamespaces`（逗号分隔、不能有空格）等；**NeoForge 对应属性名未在本档核实，先 search_neoforge_docs** |

**模板定位**（Forge 已核实）：`GameTest#templateNamespace` → `GameTestHolder#value` → `minecraft` 依次回退。

## Decision: 选择测试组织方式

```
IF 常规场景测试 → @GameTest + GameTestHelper（标准三步）
IF 参数化/动态生成 → @GameTestGenerator 返回 Collection<TestFunction>
IF 批次 setup/teardown → @GameTest(batch = "x") + @BeforeBatch/@AfterBatch（batch 字符串一致）
IF 类级登记省事 → @GameTestHolder(MODID)
IF 按需/动态登记 → RegisterGameTestsEvent（mod event bus；方法级给 templateNamespace）
IF 本地快速验证 → /test runthis / runthese；批量 CI → runGameTestServer（NeoForge 名复核）
```

## 常见错误

- ❌ 测试方法有返回值或非静态 → 必须是 `public static void xxx(GameTestHelper)`
- ❌ 漏标 `@GameTest` → 方法不会被识别为测试
- ❌ `@GameTestHolder` 的 value 不是 mod id → 默认配置下测试不运行
- ❌ `.nbt` 放错目录或没按前缀规则命名 → 应在 `data/<modid>/structures/`，`modid:examplegametests.exampletest` 型
- ❌ 把 Forge 的 `forge.enabledGameTestNamespaces` 前缀照搬到 NeoForge → 先 `search_neoforge_docs` 复核
- ❌ `succeedWhen` / `succeedOnTickWhen` 未保证提前的 tick 抛断言失败 → 测试每 tick 都跑，提前通过会错判
- ✅ 需要布置/初始状态的场景 → 用 `setupTicks` 或 `@BeforeBatch` 做 setup，别依赖真实时间

## 参考资料

- Forge 语义基线页 id `misc_gametest`：https://docs.minecraftforge.net/en/1.20.1/misc/gametest/
- Minecraft Wiki（GameTest）：https://minecraft.wiki/w/Game_test
- NeoForge 判定：`search_neoforge_docs`（platform=neoforge + 对应版本）；本档未核实项保持机制路线，不补签名。

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 测试引用的方块/物品/实体先按 01-registry 注册 |
| `mc-structure` | 结构模板制作与 `.nbt` 放置 |
| `mc-blockentity` | 方块实体交互行为的测试 |
| `mc-datagen` | 模板/数据由数据生成器产出时注意包结构与命名 |
