---
id: authored/fabric-saveddata-persistent-state
title: Fabric 世界数据持久化（SavedData / 旧 PersistentState）
tags: [fabric, saveddata, persistent-state, codec, DimensionDataStorage, world-data]
summary: Fabric 侧世界级持久化：新 API SavedData+SavedDataType+Codec+computeIfAbsent（与 NeoForge 同构）；旧教程 PersistentState/Yarn 名对照；setDirty 落盘；Global World Data 概念；Yarn 与 Mojmap 命名差异提醒。
mcHint: 新 API：1.21.x/26.x docs；旧 PersistentState 见 Yarn ≤1.21 教程
sourceKind: authored
---

# Fabric 世界数据持久化

自写短文。依据 Fabric 官方文档 `docs.fabricmc.net/develop/serialization/saved-data`（26.2 版原文已核对）。

## 现代 API（Fabric 文档当前版）

与 NeoForge 的 SavedData **同一套原版底层**，写法几乎一致：

```java
public class SavedBlockData extends SavedData {
    private int blocksBroken;

    public void incrementBlocksBroken() { blocksBroken++; setDirty(); }   // 不 setDirty 不落盘
    public int getBlocksBroken() { return blocksBlocked; }                // 示意
    public SavedBlockData(int count) { this.blocksBroken = count; }
}

// Codec：原始值 ↔ 类
private static final Codec<SavedBlockData> CODEC = Codec.INT.xmap(
    SavedBlockData::new, SavedBlockData::getBlocksBroken);

private static final SavedDataType<SavedBlockData> TYPE = new SavedDataType<>(
    Identifier.fromNamespaceAndPath(MOD_ID, "saved_block_data"),
    SavedBlockData::new,   // 无数据时的空构造
    CODEC,
    null);                 // data fixer，一般 null
```

获取/创建：

```java
SavedBlockData state = level.getDataStorage().computeIfAbsent(TYPE);
```

- `.dat` 落在 `<world>/data/<modid>/<path>.dat`。
- 复杂结构用 `RecordCodecBuilder`（见 `authored/saveddata-world-persistence` 的通用规则：setDirty、挂 Overworld 存全局、选型表）。

## 旧教程名对照（读老 Wiki / Yarn 工程时）

| 旧（Yarn，≤1.21 大部分教程） | 新（Mojmap，1.21.5+/26.x） |
|------------------------------|------------------------------|
| `PersistentState` | `SavedData` |
| `PersistentStateManager#getOrCreate(type, id)` | `getDataStorage().computeIfAbsent(SavedDataType)` |
| `writeNbt(NbtCompound)` 手写字段 | `Codec` 序列化 |
| `getSavedDataId()` / 静态 `TYPE` 常量 | `SavedDataType` 一体化 |

老教程（如 wiki.fabricmc.net `/tutorial:persistent_states`）逻辑仍对——**只是类名和序列化方式换了**；按工程 mappings 决定用哪套名字。

## Fabric 特有注意

- **Yarn vs Mojmap**：≤1.21.11 用 Yarn 的工程里是 `PersistentState` + `NbtCompound`；26.x 已去混淆走 Mojmap 名。禁止混抄两套名字进同一个文件。
- 全局（跨维度）数据惯例仍挂 Overworld 的 storage。
- 监听方块破坏等事件再改数据：文档示例用 FAPI `PlayerBlockBreakEvents.AFTER`——事件细节见 `search_fabric_docs` events 页。

## 反模式

- ❌ 在客户端代码里 computeIfAbsent（服务端概念；显示需求走同步包）。
- ❌ 每 tick setDirty；❌ 静态 Map 当存档。
- ❌ 把 Yarn 教程的 `NbtCompound.writeXxx` 直接搬进 Codec 工程。

## 自检

- 重启后数据仍在；单人/专用服一致。
- NBT 查看器确认 `.dat` 里字段名与 Codec fieldOf 一致。

## 不清楚时

- 官方原文：https://docs.fabricmc.net/develop/serialization/saved-data （切版本看左上角下拉）
- 旧 Wiki 页：https://wiki.fabricmc.net/tutorial:persistent_states
- API：`search_fabric_docs`（先 `list_fabric_versions` 选工程精确版本）
