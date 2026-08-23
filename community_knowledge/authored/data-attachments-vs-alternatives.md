---
id: authored/data-attachments-vs-alternatives
title: 数据附件（Data Attachment）与持久化选型（NeoForge 1.20.5+）
tags: [attachment, dataattachment, codec, serialize, sync, neoforge, persistence, entity-data]
summary: AttachmentType 注册（builder + 默认值 + Codec.serialize + 可选 sync）；挂在 Entity/BlockEntity/Chunk/Level/ItemStack；getData/hasData/setData/removeData；与 SavedData、persistentData、Data Components 的选型边界。
mcHint: NeoForge 1.20.5+/1.21（26.X 课程源码核实）
sourceKind: authored
---

# 数据附件与持久化选型

自写短文。代码依据 Kaupenjoe NeoForge 26.X 课程分支 `31-data-attachment`（MIT）核对；概念对照官方文档 datastorage/attachments。

## 是什么

Attachment = 给**已有对象**（实体、方块实体、区块、level、ItemStack）外挂数据，不改原版类、不写 mixin。内部存 NBT，注册时声明序列化方式。1.20.5 起取代旧 Capabilities 的大部分「附加数据」用途。

## 注册

```java
public class ModAttachmentTypes {
    public static final DeferredRegister<AttachmentType<?>> ATTACHMENT_TYPES =
        DeferredRegister.create(NeoForgeRegistries.ATTACHMENT_TYPES, MOD_ID);

    public static final Supplier<AttachmentType<Integer>> MANA = ATTACHMENT_TYPES.register("mana",
        () -> AttachmentType.builder(() -> 0)                    // 默认值 supplier
            // .sync(ByteBufCodecs.INT)                          // 可选：自动同步到客户端追踪的实体
            .serialize(Codec.INT.fieldOf("mana"))                // 存盘编解码（可省略＝不落盘）
            .build());

    public static void register(IEventBus eventBus) { ATTACHMENT_TYPES.register(eventBus); }
}
```

- `serialize(...)` 不写 → 数据只在内存/同步有效，**不会保存**（适合临时状态）。
- `sync(codec)` → 对玩家正在追踪的实体自动 S2C 同步；不需要客户端显示时别开（省带宽）。课程作者特意注释掉 sync 以便教学手写网络包——两种都合法。
- 复杂数据用 record + `RecordCodecBuilder`；可变集合注意 builder 里给拷贝默认值。

## 使用

```java
player.setData(ModAttachmentTypes.MANA, 10);
int mana = player.getData(ModAttachmentTypes.MANA);     // 未 set 过时返回 builder 默认值
boolean has = player.hasData(ModAttachmentTypes.MANA);
player.removeData(ModAttachmentTypes.MANA);
```

可挂载体：`Entity`、`BlockEntity`、`ChunkAccess`、`Level`、`ItemStack`（物品附件另有 `DataComponents` 更合适，见下）。

事件侧：`EntityJoinLevelEvent` 初始化、`PlayerEvent.Clone`（死亡重生拷贝——附件有 `IAttachmentHolder#deserializeAttachments` 自动路径，但自定义逻辑仍需监听）、复制实体（`EntityEvent.EnteringSection` 等按需处理）。

## 选型表：四种「加数据」手段

| 手段 | 挂哪 | 生命周期 | 适用 |
|------|------|----------|------|
| **Attachment** | 实体/BE/区块/世界 | 随载体存盘 | 「给这个怪/这台机器记点状态」 |
| **SavedData** | 世界级单例 | 世界存档 `<world>/data/*.dat` | 全局账本、团队据点（见 `authored/saveddata-world-persistence`） |
| **persistentData**（原版） | 实体 | 不随死亡保留（要 Clone 事件手动拷） | 快速临时标记，不想注册 |
| **Data Components**（1.20.5+ 原版） | ItemStack | 物品栈随存盘/合成流转 | 物品属性（耐久外数据、充能数）；需注册 DataComponentType |

经验法则：**跟着东西走的用 attachment，全局一份的用 SavedData，在物品上的用 data component，写完就扔的用 persistentData。**

## 反模式

- ❌ 用静态 Map<UUID, State> 存实体状态代替 attachment（重启丢、专用服泄漏、维度切换错乱）。
- ❌ 忘了 `.serialize()` 又期望重启还在。
- ❌ 大库存塞进 attachment 每 tick sync；同步只放 GUI 需要的小标量。
- ❌ Forge 1.20.1 工程照抄本篇（那是 Capabilities 体系，见 `authored/itemhandler-capability` 与当档规则）。

## 自检

- 存档重进后附件值还在（serialize 生效）。
- 开 sync 的字段在客户端 HUD 能读到；没开的确认没有客户端代码偷读。
- 死亡重生 / 从下界回来后数据符合预期（Clone/跨维度策略验证过）。

## 不清楚时

- 教程源码（分支 `31-data-attachment`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X
- 官方文档：https://docs.neoforged.net/docs/datastorage/attachments/
- API 细节：`search_neoforge_docs`（关键词 attachments）
