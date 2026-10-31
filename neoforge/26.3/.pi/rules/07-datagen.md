---
description: 07 — 数据生成（NeoForge 26.3）
---

# 07 — 数据生成（NeoForge 26.3）

> 证据类型：NeoForge 26.3 sources jar（`data/event/GatherDataEvent.java` 全 135 行已读）+ 26.3 merged jar 的 `javap`。不是 docs 正文。

## 在事件上直接加 provider（`GatherDataEvent.java:114-128` 实读）

```java
public <T extends DataProvider> T addProvider(T provider)                        // 传实例
public <T extends DataProvider> T createProvider(PackGenerator.DataProviderFromOutput<T> builder)
public <T extends DataProvider> T createProvider(PackGenerator.DataProviderFromOutputLookup<T> builder)
public void createBlockAndItemTags(PackGenerator.DataProviderFromOutputLookup<TagsProvider<Block>> blockTags,
                                   PackGenerator.ItemTagsProvider itemTags)
public PackGenerator getPackGenerator(PackOutput output)                          // 额外 pack（可多次调，内部 packCounter++）
public PackGenerator getDefaultPackGenerator()
public CompletableFuture<HolderLookup.Provider> getWorldLookupProvider()          // 世界/维度注册表
public CompletableFuture<HolderLookup.Provider> getReloadableLookupProvider()     // 可重载注册表
```

三个 provider 入口的区别：

| 入口 | 何时用 |
|---|---|
| `addProvider(new MyProvider(out, lookup))` | 你自己 new 好（最常见） |
| `createProvider(factory)` | 让框架建（factory 吃 `PackOutput` / `PackOutput + Provider`） |
| `event.getPackGenerator(output)` | 要生成**另一个** pack（不是默认那个） |

## `DataGenerator` 本身**不能**挂 provider（`javap` 实核）

```java
public abstract class DataGenerator {
    public DataGenerator(Path)
    public abstract void run() throws IOException
    public PackGenerator getVanillaPack(boolean)
    public PackGenerator getBuiltinDatapack(boolean, String)
}
public class DataGenerator$PackGenerator {
    public <T extends DataProvider> T addProvider(DataProvider$Factory<T>)   // Factory.create(PackOutput)
}
```

⚠ **没有** `DataGenerator.getPackOutput()`、**没有** `DataGenerator.addProvider(实例)` —— 那是 1.21 时代的记忆，本版会编译不过。

`DataProvider` 本体（`javap` 实核）：`CompletableFuture<?> run(CachedOutput)`、`String getName()`。

## 挂法（`GatherDataEvent implements IModBusEvent`）

```java
modEventBus.addListener(this::gatherData);

private void gatherData(GatherDataEvent event) {
    PackOutput out = ...;                                   // 见下
    event.addProvider(new MyRecipeProvider(out, event.getWorldLookupProvider()));
}
```

⚠ **`PackOutput` 从哪来**：`GatherDataEvent` **没有** `getPackOutput()`，`DataGenerator` 也没有。`getPackGenerator(PackOutput)` 需要你自己有 output。⇒ 若用 `addProvider(new X(...))`，`X` 的 `PackOutput` 需要从 `createProvider(...)` 的 builder 回调里拿（builder 吃 `PackOutput`）。**这一段是本档唯一仍靠推断的地方**，写之前先 `javap` 或读 `PackGenerator$DataProviderFromOutput` 的接口签名。

## 已核 / 未核

| 项 | 状态 |
|---|---|
| `GatherDataEvent` 的 12 个公开方法 | **已核**（全表） |
| `DataGenerator` / `PackGenerator` 的方法集 | **已核**（javap） |
| `DataProvider` / `DataProvider.Factory` | **已核**（javap） |
| `DataProviderFromOutput` / `DataProviderFromOutputLookup` 的函数形态 | **未核** |
| `PackOutput` 在 26.3 的实例来源 | **未核** |

## 禁止

- 抄 Fabric 的 `FabricDataGenerator` / `DataGeneratorEntrypoint`
- 写 `event.getGenerator().getPackOutput()` 或 `event.getGenerator().addProvider(...)`（编译不过）
- 抄 26.2 的 `event.getGenerator().getVanillaPack(...)`（26.3 已改成事件上的 `addProvider` / `getPackGenerator`）
