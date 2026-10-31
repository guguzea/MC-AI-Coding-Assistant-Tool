---
description: 07 — 数据生成（NeoForge 26.2）
---

# 07 — 数据生成（NeoForge 26.2）

> 证据类型：NeoForge 26.2.0.93 sources jar（`data/event/GatherDataEvent.java` 全 285 行已读）+ 26.2 merged jar 的 `javap`。不是 docs 正文。
> ⚠ **本档 datagen 与 26.3 不同**：26.3 的事件上直接有 `addProvider` / `createProvider` / `createBlockAndItemTags`；26.2 **没有**，只能从 `DataGenerator` 拿 `PackGenerator`。

## 26.2 的 `GatherDataEvent` 公开面（实读全文，L64-261）

```java
public ModContainer getModContainer()
public ResourceManager getResourceManager(PackType packType)
public Collection<Path> getInputs()
public DataGenerator getGenerator()
public CompletableFuture<HolderLookup.Provider> getLookupProvider()
public boolean includeDev()
public boolean includeReports()
public boolean validate()
```

**没有** `addProvider`、**没有** `getConfig()` / `getGeneratorConfig()`（`private final DataGeneratorConfig config` 不对外暴露）。

`DataGeneratorConfig` 是 `public static class` 但带 `@ApiStatus.Internal`，只能由 NeoForge 在 fire 前构造 ⇒ **mod 侧拿不到它**。

## 26.2 的 provider 入口：`DataGenerator` → `PackGenerator`

`javap` 实核（26.2 merged jar）：

```java
public abstract class DataGenerator {
    public DataGenerator(Path)
    public abstract void run() throws IOException
    public PackGenerator getVanillaPack(boolean)                 // includeDev
    public PackGenerator getBuiltinDatapack(boolean, String)     // includeDev, modId
}
public class DataGenerator$PackGenerator {
    public <T extends DataProvider> T addProvider(DataProvider$Factory<T>)
}
public interface DataProvider$Factory<T extends DataProvider> {
    T create(PackOutput out);
}
```

⇒ 26.2 的写法必须是**给 factory**，不是给实例：

```java
modEventBus.addListener(this::gatherData);

private void gatherData(GatherDataEvent event) {
    event.getGenerator().getVanillaPack(event.includeDev())
        .addProvider(out -> new MyRecipeProvider(out, event.getLookupProvider()));
}
```

- `getVanillaPack(boolean includeDev)` —— 覆盖主数据包
- `getBuiltinDatapack(boolean includeDev, String modId)` —— 生成内置数据包
- `DataProvider.Factory.create(PackOutput)` 的 `PackOutput` **由框架传进来**（不用自己造）

## 与 26.3 的差异（对拍结论）

| 面 | 26.2 | 26.3 |
|---|---|---|
| 事件上的 provider 入口 | **无** | `addProvider(T)` / `createProvider(builder)` / `createBlockAndItemTags(...)` |
| 从事件拿 config | **无**（`private final`） | `getPackGenerator(PackOutput)` / `getDefaultPackGenerator()` |
| `DataGenerator` | `getVanillaPack` / `getBuiltinDatapack` + `PackGenerator.addProvider(Factory)` | **完全相同** |
| `getLookupProvider()` | 一个（世界+可重载合体） | 拆成 `getWorldLookupProvider()` / `getReloadableLookupProvider()` |
| 行数 | 285 | 135 |

## 已核 / 未核

| 项 | 状态 |
|---|---|
| `GatherDataEvent` 的 9 个公开方法 | **已核**（全文） |
| `DataGenerator` / `PackGenerator` / `DataProvider.Factory` | **已核**（javap） |
| `DataGeneratorConfig` 不可达 | **已核**（private 字段 + 无 getter） |
| `modEventBus.addListener(this::gatherData)` 的挂法 | **已核**（`GatherDataEvent implements IModBusEvent`） |
| `PackOutput` 在 datagen 运行期的线程/生命周期 | **未核** |

## 禁止

- 抄 26.3 的 `event.addProvider(new X(...))`（26.2 里没这个方法）
- 抄 Fabric 的 `FabricDataGenerator` / `DataGeneratorEntrypoint`
- 自己 `new DataGeneratorConfig(...)`（带 `@ApiStatus.Internal`，结构随版本变）
