---
id: authored/saveddata-world-persistence
title: 世界数据持久化（SavedData）与选型
tags: [saveddata, DimensionDataStorage, SavedDataType, codec, persistence, world-data, neoforge, forge]
summary: SavedData 存世界级数据；1.20.4- 的 DimensionDataStorage+Factory+save(NBT) 与 1.21.5+ 的 SavedDataType+Codec 两条 API；computeIfAbsent 挂载；setDirty 才落盘；Overworld 存跨维度数据；与 persistentData / attachment 的选型边界。
mcHint: API 分版本：≤1.20.6 Factory/NBT；≥1.21.5 SavedDataType/Codec（1.21.1–1.21.8 过渡期两套并存，以当档文档为准）
sourceKind: authored
---

# 世界数据持久化（SavedData）与选型

自写短文。API 依据 NeoForge 官方文档 SavedData 页（main 与 version-1.20.4 两个版本均已核对原文）。

## 什么时候用 SavedData

存**世界级**、跨玩家、重启后要还在的数据：团队据点列表、经济账本、boss 讨伐进度、自定义结构探索标记等。

| 数据形态 | 首选方案 |
|----------|----------|
| 跟着方块/方块实体走 | BE 自己的 `saveAdditional`/`load`（NBT） |
| 跟着实体/玩家走 | 实体 NBT；玩家临时标记 `getPersistentData()`；结构化数据用 Data Attachment |
| 跟着区块走 | Chunk 数据 / Attachment（`Chunk` 级别） |
| 跟着世界走（本篇） | **SavedData** |

## 旧 API（≤1.20.6：DimensionDataStorage + Factory + NBT）

```java
public class ExampleSavedData extends SavedData {
    private final Map<UUID, BlockPos> homes = new HashMap<>();

    public static ExampleSavedData create() { return new ExampleSavedData(); }

    public static ExampleSavedData load(CompoundTag tag) {
        ExampleSavedData data = new ExampleSavedData();
        // 从 tag 读回字段
        return data;
    }

    @Override
    public CompoundTag save(CompoundTag tag) {
        // 写字段进 tag
        return tag;
    }

    public void addHome(UUID id, BlockPos pos) {
        homes.put(id, pos);
        setDirty();          // 不调就不落盘！
    }
}

// 获取/加载（ServerLevel 或 ServerChunkCache 上）：
level.getDataStorage().computeIfAbsent(
    new SavedData.Factory<>(ExampleSavedData::create, ExampleSavedData::load), "examplemod_homes");
```

- 文件落在 `<world>/data/<名字>.dat`；挂在下界则 `DIM-1/data/`。
- `computeIfAbsent` 每次要调（缓存一份实例引用也行，但注意维度卸载）；名字是文件名，不能含 `/` `\`。

## 新 API（≥1.21.5：SavedDataType + Codec）

1.21.5 起 `computeIfAbsent` 改收一个 `SavedDataType<T>`，序列化交给 Codec，不再手写 save/load：

```java
public static final SavedDataType<ExampleSavedData> ID = new SavedDataType<>(
    ResourceLocation.fromNamespaceAndPath("examplemod", "example"),  // → data/examplemod/example.dat
    ExampleSavedData::new,                                           // 无数据时的初始构造
    RecordCodecBuilder.create(inst -> inst.group(
        Codec.INT.fieldOf("val1").forGetter(d -> d.val1),
        BuiltInRegistries.BLOCK.byNameCodec().fieldOf("val2").forGetter(d -> d.val2)
    ).apply(inst, ExampleSavedData::new)));

// 获取/加载：
level.getDataStorage().computeIfAbsent(ExampleSavedData.ID);
// 或跨维度：server.getDataStorage().computeIfAbsent(ExampleSavedData.ID)
```

- 需要在数据里存 `ServerLevel` 或世界种子时，用带 `SavedDataType.Factory` 的构造重载，Codec 能拿到 level 上下文。
- 存储类名变化：新文档叫 `SavedDataStorage`；1.20.4 文档叫 `DimensionDataStorage`。方法都是 `getDataStorage()` / `computeIfAbsent(...)`。
- 过渡期版本（1.21.1–1.21.8）两套签名在不同小版本里交替/并存，**写代码前先 `search_neoforge_docs` 对准工程的具体版本**，不要跨版本抄。

## setDirty：最常见的丢档原因

改了字段不调 `setDirty()` → 内存里看着对、重启全丢。所有 mutate 方法末尾统一 `setDirty()`；只读 getter 不要调。

## 挂哪个维度

- 只在单维度有意义的数据：挂该 `ServerLevel`。
- **跨维度/全局数据：挂 Overworld**（`server.overworld().getDataStorage()`）——Overworld 是唯一永不完全卸载的维度。教程/文档惯例：从任何维度访问都绕道 overworld storage。

## 与 PlayerEvent.Clone 的关系（命令教程实例）

Kaupenjoe sethome 教程把家坐标放 `player.getPersistentData()` 并监听 `PlayerEvent.Clone` 手动拷贝（persistentData 默认不随死亡保留）。对比：

- persistentData：玩家级、临时、无结构、死亡要自己拷 → 适合短命标记。
- SavedData：世界级、自动落盘、要写序列化 → 适合正式功能数据。把「每个玩家的家」做成 SavedData（key=UUID）比塞 persistentData 更稳。

## 反模式

- ❌ 用静态 `Map` 存世界数据（重启丢、多世界互相污染、专用服内存泄漏）。
- ❌ 在客户端类里读 SavedData（它是服务端概念；要显示走同步包）。
- ❌ 每 tick setDirty（存档 IO 放大）；改成标记脏 + 关键节点统一落。
- ❌ 手写 `data/xxx.dat` 或把 dat 文件当 JSON 改（它是压缩 NBT）。

## 自检

- 存档退出重进，数据还在；`/kill @e` 级别的崩溃恢复后仍在。
- 专用服 + 单人各测一遍；多维度世界确认跨维度读写走的是同一份（Overworld）实例。
- 改字段不 setDirty 的路径（如果有）确认是故意的只读缓存。

## 不清楚时

- NeoForge 官方文档 SavedData（新 API）：https://docs.neoforged.net/docs/datastorage/saveddata/
- 1.20.4 版本存档（旧 API）：https://docs.neoforged.net/1.20.4/docs/datastorage/saveddata/
- API 细节：`search_neoforge_docs` / `search_forge_docs`（关键词 saveddata, data storage）、`query_api`（Vanilla 类 SavedData/DimensionDataStorage，约 1.16.5–1.20.4 有索引）
