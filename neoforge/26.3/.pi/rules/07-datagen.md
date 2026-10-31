---
description: 07 — 数据生成（NeoForge 26.3）
---

# 07 — 数据生成（NeoForge 26.3）

> 证据类型：NeoForge 26.3 sources jar（`data/event/GatherDataEvent.java` 全 135 行 + `data/event/PackGenerator.java` 全 159 行已读）+ 26.3 merged jar 的 `javap` + **MDK-26.3 探针真编译**。不是 docs 正文。

## 事件上的入口（`GatherDataEvent.java:114-128` 实读）

```java
public <T extends DataProvider> T addProvider(T provider)
public <T extends DataProvider> T createProvider(PackGenerator.DataProviderFromOutput<T> builder)
public <T extends DataProvider> T createProvider(PackGenerator.DataProviderFromOutputLookup<T> builder)
public void createBlockAndItemTags(PackGenerator.DataProviderFromOutputLookup<TagsProvider<Block>> blockTags,
                                   PackGenerator.ItemTagsProvider itemTags)
public PackGenerator getPackGenerator(PackOutput output)
public PackGenerator getDefaultPackGenerator()
public CompletableFuture<HolderLookup.Provider> getWorldLookupProvider()
public CompletableFuture<HolderLookup.Provider> getReloadableLookupProvider()
```

## NeoForge 侧 `PackGenerator`（`net.neoforged.neoforge.data.event.PackGenerator`，不是 vanilla 那个）

```java
public PackOutput getPackOutput()
public CompletableFuture<HolderLookup.Provider> getWorldLookupProvider()
public CompletableFuture<HolderLookup.Provider> getReloadableLookupProvider()
public <T extends DataProvider> T addProvider(T provider)
public <T extends DataProvider> T createProvider(DataProviderFromOutput<T> builder)
public <T extends DataProvider> T createProvider(DataProviderFromOutputLookup<T> builder)
public void createBlockAndItemTags(DataProviderFromOutputLookup<TagsProvider<Block>>, ItemTagsProvider)
public void createWorldRegistryObjects(RegistrySetBuilder [, Set<String> modIds [, String name]])
public void createReloadableRegistryObjects(RegistrySetBuilder [, Set<String> modIds [, String name]])
```

三个函数式接口（`PackGenerator.java:145-158`）：

```java
@FunctionalInterface interface DataProviderFromOutput<T extends DataProvider> {
    T create(PackOutput output);
}
@FunctionalInterface interface DataProviderFromOutputLookup<T extends DataProvider> {
    T create(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider);
}
@FunctionalInterface interface ItemTagsProvider {
    TagsProvider<Item> create(PackOutput output,
                              CompletableFuture<HolderLookup.Provider> lookupProvider,
                              CompletableFuture<TagsProvider.TagLookup<Block>> contentsGetter);
}
```

## `PackOutput` 从哪来（**两条都编过**）

```java
// A. NeoForge 侧 PackGenerator（推荐，不依赖 vanilla 是否被 patch）
PackOutput out = event.getDefaultPackGenerator().getPackOutput();

// B. vanilla DataGenerator 上的 getPackOutput() —— ⚠ 原版 jar 里没有这个方法
//    （javap -p 实测：只有 protected final PackOutput vanillaPackOutput 字段），
//    它是 NeoForge 的 patch 加进 dev classpath 的；纯原版环境会「找不到符号」。
PackOutput out2 = event.getGenerator().getPackOutput();
```

⇒ **写代码用 A**（`getDefaultPackGenerator().getPackOutput()`），B 只在明确知道跑在 NeoForge 时才用。

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

⚠ **没有** `DataGenerator.addProvider(实例)` —— 那是 1.21 时代的记忆，本版编译不过。
`DataProvider` 本体（`javap`）：`CompletableFuture<?> run(CachedOutput)`、`String getName()`。

## 挂法（`GatherDataEvent implements IModBusEvent` ⇒ mod 总线）

```java
modEventBus.addListener(this::gatherData);

private void gatherData(GatherDataEvent event) {
    PackOutput out = event.getDefaultPackGenerator().getPackOutput();
    event.addProvider(new MyRecipeProvider(out, event.getWorldLookupProvider()));
    // 或让框架建：
    event.createProvider(o -> new MyRecipeProvider(o, event.getWorldLookupProvider()));
}
```

## 已核 / 未核

| 项 | 状态 |
|---|---|
| `GatherDataEvent` 的 12 个公开方法 | **已核**（全文） |
| NeoForge `PackGenerator` 的 15 个公开方法 + 3 个函数式接口 | **已核**（全文） |
| `DataGenerator` / `PackGenerator`(vanilla) / `DataProvider` / `DataProvider.Factory` | **已核**（javap） |
| `PackOutput` 的两个入口 | **已核**（探针真编） |
| `DataProviderFromOutput` / `DataProviderFromOutputLookup` 形态 | **已核**（探针真编） |
| `DatapackBuiltinEntriesProvider` 的构造签名 | **未核**（`createWorldRegistryObjects` 内部用） |
| `DataProvider.saveAll` / `FIXED_ORDER_FIELDS` 的用法 | **未核**（一般不用碰） |

## 禁止

- 抄 Fabric 的 `FabricDataGenerator` / `DataGeneratorEntrypoint`
- 写 `event.getGenerator().addProvider(实例)`（编译不过）
- 抄 26.2 的 `event.getGenerator().getVanillaPack(...)`（26.3 已改成事件上的 `addProvider` / `getPackGenerator`）
- 在非 NeoForge 环境（纯原版 classpath）依赖 `DataGenerator.getPackOutput()`
