---
name: mc-capability
description: Minecraft Forge Capability 系统。AttachCapabilitiesEvent、ICapabilityProvider / ICapabilitySerializable、CapabilityManager、getCapability 存储和查询模式。触发词：Capability、ICapabilitySerializable、AttachCapabilitiesEvent、LazyOptional、CapabilityManager、CapabilityToken、getCapability
platform: forge
version: "1.17.1"
dependencies: []
mappings: parchment
---

# Capability 系统（Forge 1.17.1）

> **本档命名基线**：1.17.1 已切到 official/mojmap 名。`Level` / `LevelChunk` / `Player` / `CompoundTag` / `Tag` 是本档名字，`World` / `Chunk` / `PlayerEntity` / `CompoundNBT` / `INBT` 是 1.16.5 档的名字，**禁止**往本档抄。
> 包路径（`query_loader_api --platform=forge --minecraftVersion=1.17.1`，`mappingsVersion: official-1.17.1`）：
> `net.minecraft.resources.ResourceLocation`、`net.minecraft.core.Direction`、`net.minecraft.nbt.Tag` / `CompoundTag`、`net.minecraft.world.level.Level`、`net.minecraft.world.level.chunk.LevelChunk`、`net.minecraft.world.entity.Entity`、`net.minecraft.world.entity.player.Player`、`net.minecraft.world.item.ItemStack`。
> Forge 侧：`net.minecraftforge.common.capabilities.{Capability, CapabilityManager, CapabilityToken, ICapabilityProvider, ICapabilitySerializable, RegisterCapabilitiesEvent}`、`net.minecraftforge.common.util.{LazyOptional, INBTSerializable}`、`net.minecraftforge.event.AttachCapabilitiesEvent`。

## 快速开始

Capability 以「接口 + 默认实现 + storage handler」的形式暴露。第一步只有接口和实现：

```java
// 1. 定义能力接口
public interface IExampleCapability {
    int getValue();
    void setValue(int value);
}

// 2. 实现接口；需要持久化时再实现 INBTSerializable
public class ExampleCapability implements IExampleCapability, INBTSerializable<CompoundTag> {
    private int value = 0;

    @Override public int getValue() { return value; }
    @Override public void setValue(int v) { this.value = v; }

    @Override
    public CompoundTag serializeNBT() {
        CompoundTag tag = new CompoundTag();
        tag.putInt("value", value);
        return tag;
    }

    @Override
    public void deserializeNBT(CompoundTag nbt) {
        this.value = nbt.getInt("value");
    }
}
```

> `INBTSerializable` 只有 `serializeNBT()`（返回 `T`）和 `deserializeNBT(T nbt)` 两个方法。带 `T` 参数的 `serializeNBT(T)` 签名不是本档 API。

## 注册 Capability

自定义能力必须先注册，注册在 **mod 事件总线**上的 `RegisterCapabilitiesEvent`：

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class ModCapabilities {
    // CapabilityManager.get 返回非 null 的 Capability 句柄；
    // 匿名 CapabilityToken 用来保留泛型信息（软依赖）
    public static final Capability<IExampleCapability> EXAMPLE =
        CapabilityManager.get(new CapabilityToken<>() {});

    @SubscribeEvent
    public static void registerCaps(RegisterCapabilitiesEvent event) {
        event.register(IExampleCapability.class);
    }
}
```

**`CapabilityManager.get` 拿到的句柄永远非 null，但这不代表能力已注册**——用 `Capability#isRegistered` 判断：

```java
if (!ModCapabilities.EXAMPLE.isRegistered()) {
    // 上游模组缺席：不要实例化它的默认实现
    return;
}
```

## 附加 Capability（AttachCapabilitiesEvent）

`AttachCapabilitiesEvent` 只有 **5 个合法泛型**，且**不能比这 5 个更具体**：

| 泛型 | 触发范围 |
|------|---------|
| `AttachCapabilitiesEvent<Entity>` | 所有实体（要给 `Player` 附加也只能订阅这个，再自己 `instanceof` 收窄） |
| `AttachCapabilitiesEvent<BlockEntity>` | 所有方块实体 |
| `AttachCapabilitiesEvent<ItemStack>` | 所有 ItemStack |
| `AttachCapabilitiesEvent<Level>` | 所有 Level |
| `AttachCapabilitiesEvent<LevelChunk>` | 所有 LevelChunk |

```java
@Mod.EventBusSubscriber(modid = MOD_ID)   // 注意：没有 bus = ...Bus.MOD，这是游戏总线事件
public class CapabilityEvents {
    @SubscribeEvent
    public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (!(event.getObject() instanceof Player)) return;

        event.addCapability(
            new ResourceLocation(MOD_ID, "example_data"),
            new ICapabilitySerializable<CompoundTag>() {   // ICapabilityProvider 是**非泛型**接口
                private final ExampleCapability instance = new ExampleCapability();
                private final LazyOptional<IExampleCapability> opt =
                    LazyOptional.of(() -> instance);

                @Override
                public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
                    return cap == ModCapabilities.EXAMPLE ? opt.cast() : LazyOptional.empty();
                }

                @Override
                public CompoundTag serializeNBT() { return instance.serializeNBT(); }

                @Override
                public void deserializeNBT(CompoundTag nbt) { instance.deserializeNBT(nbt); }
            }
        );

        // 非自有 provider：生命周期不由你覆写，把 invalidate 挂到事件监听上
        event.addListener(() -> { /* 释放该 provider 持有的 LazyOptional */ });
    }
}
```

`addCapability` 的签名是 `void addCapability(ResourceLocation, ICapabilityProvider)`，`getObject()` 返回 `T`，`getCapabilities()` 返回 `Map<ResourceLocation, ICapabilityProvider>`，`addListener(Runnable)`。同一个事件里 capability ID 唯一，只能附加一次。

**物品不走这个事件**：`Item` 的 provider 存在 `ItemStack` 上，应通过 `Item#initCapabilities` 附加（`IForgeItem` 侧覆写）。

## 自己实现 provider（方块实体 / 实体）

`BlockEntity`、`Entity`、`ItemStack` 本身已实现 `ICapabilityProvider`，直接覆写 `getCapability`：

```java
public class MyBlockEntity extends BlockEntity {
    private final LazyOptional<IExampleCapability> opt =
        LazyOptional.of(() -> new ExampleCapability());   // 每个持有者一个独立实例

    @Override
    public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
        if (cap == ModCapabilities.EXAMPLE) {
            return opt.cast();
        }
        return super.getCapability(cap, side);   // 漏掉 super 会让别人附加进来的 capability 失效
    }

    @Override
    public void invalidateCaps() {
        super.invalidateCaps();
        opt.invalidate();   // 自有 provider 在此失效
    }
}
```

`side` 语义：按面区分输入/输出口时用它判断（`Direction#UP`、`Direction#WEST` …）；传 `null` 表示来自内部或侧向无意义的位置。**`Entity` 和 `ItemStack` 一般可以忽略 `side`**。

## 查询 Capability（必须用 LazyOptional）

```java
// ✅ 推荐：ifPresent，缺席就什么都不做
player.getCapability(ModCapabilities.EXAMPLE).ifPresent(data -> data.setValue(10));

// ✅ 安全读取（带默认值）
int val = player.getCapability(ModCapabilities.EXAMPLE)
    .map(IExampleCapability::getValue)
    .orElse(0);

// ✅ 需要显式分支
LazyOptional<IExampleCapability> lazy = player.getCapability(ModCapabilities.EXAMPLE);
if (lazy.isPresent()) {
    lazy.ifPresent(data -> data.setValue(10));
}
```

`getCapability` **从不返回 null**，缺席时返回空 `LazyOptional`。可用成员：`LazyOptional.of` / `empty` / `cast` / `map` / `lazyMap` / `filter` / `ifPresent` / `isPresent` / `orElse` / `orElseGet` / `orElseThrow` / `getValue` / `getValueUnsafe` / `invalidate` / `addListener`。

## Decision: 附加还是查询

```
IF 目标是你自己写的 BlockEntity / Entity
  → 覆写 getCapability(cap, side) + invalidateCaps()，不要另开 AttachCapabilitiesEvent

IF 目标是原版 / 别人的 Entity / BlockEntity / Level / LevelChunk
  → AttachCapabilitiesEvent<对应泛型> + addCapability(ResourceLocation, provider)
  → provider 用 ICapabilitySerializable<CompoundTag>（需要落盘时）或 ICapabilityProvider（纯内存）

IF 目标是物品（ItemStack）
  → Item#initCapabilities，不是 AttachCapabilitiesEvent

IF 只是要读一个可能不存在的能力
  → getCapability(...).ifPresent(...) 或 .map(...).orElse(默认值)
```

## 内置 Capability

Forge 自带三个能力，接口 FQCN 本档已核实：

```java
// 物品栏（替代旧 IInventory / ISidedInventory）
// 字段名 ITEM_HANDLER_CAPABILITY 已由 1.17.1 官方文档核实
player.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY, Direction.NORTH)
      .ifPresent(handler -> handler.getSlots());
// 接口 net.minecraftforge.items.IItemHandler：
//   getSlots / getStackInSlot / insertItem / extractItem / getSlotLimit / isItemValid

// 流体：net.minecraftforge.fluids.capability.CapabilityFluidHandler
//   接口 net.minecraftforge.fluids.capability.IFluidHandler：
//   getTanks / getFluidInTank / getTankCapacity / isFluidValid / fill / drain
// TODO(未核实) 1.17.1 本档语料未给出 CapabilityFluidHandler 上的字段常量名，勿凭记忆填写

// 能量：net.minecraftforge.energy.CapabilityEnergy
//   接口 net.minecraftforge.energy.IEnergyStorage：
//   receiveEnergy / extractEnergy / getEnergyStored / getMaxEnergyStored / canExtract / canReceive
// TODO(未核实) 1.17.1 本档语料未给出 CapabilityEnergy 上的字段常量名，勿凭记忆填写
```

> `net.minecraftforge.common.ForgeCapabilities` 与 `Capabilities.ITEM_HANDLER` 两种写法在 1.17.1 的文档语料和 `query_loader_api` 索引里**都查不到**，本档不使用；需要聚合入口时先 `query_loader_api` / 反编译核实，别照抄 1.18.2 或 1.16.5 档。

## 持久化（NBT）

- 需要落盘的 provider 实现 `ICapabilitySerializable<T extends Tag>`（1.17.1 上是 `ICapabilitySerializable<CompoundTag>`），它 = `ICapabilityProvider` + `INBTSerializable<T>`；读写就是 `serializeNBT()` / `deserializeNBT(T)`。
- **`LevelChunk` 和 `BlockEntity` 只有被标脏才写盘**。状态一变就要标脏：

```java
private final IItemHandler inventory = new ItemStackHandler(9) {
    @Override
    protected void onContentsChanged(int slot) {
        super.onContentsChanged(slot);
        setChanged();   // 关键：不标脏就丢数据
    }
};
```

- 存档里 `ForgeCaps` 是 Forge 写 capability 的键，`id` / `x` / `y` / `z` / `ForgeData` 同样是保留键，**不要**用作你自己的 NBT key。
- 玩家死亡默认**不**保留能力数据，需要在 `PlayerEvent$Clone` 里手动把旧实体数据拷到新实体；该事件中的 `wasDead` 字段用来区分「死亡重生」和「从末地回来」（后者数据已存在，别重复拷贝）。
  - TODO(未核实) `PlayerEvent.Clone` 内联类的 FQCN 与 `wasDead` 的访问器方法名未出现在本档 CLI 索引中，只按文档表述，不写代码。

## Dist / 物理端安全

- **能力数据默认不发往客户端**。要让客户端看到，必须自己写同步包（见 `mc-networking`），三个时机可选：实体生成/方块放置时、数据变化时、新客户端开始观察时。
- 因此不要凭「客户端读到了」推断服务端也有值：读写能力前先确认你在哪一侧。服务端逻辑里查询玩家能力是安全的，反向（客户端改服务端数据）不行。
- 只在客户端需要的 provider / 渲染相关注册放在 `Dist.CLIENT` 的订阅类里（形状见 `mc-blockentity` Skill 的 `@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)`）。

## 常见错误

- ❌ `new ICapabilityProvider<>() { ... }` —— `ICapabilityProvider` 是**非泛型**接口（`addCapability` 第二参数就是裸类型）。带尖括号写会编译不过；仓库内 1.16.5 / 1.18.2 档和 `05-events.mdc` 的尖括号写法对本档不成立。
- ❌ `serializeNBT(CompoundTag tag)` 这种带参序列化 —— `INBTSerializable` 的 `serializeNBT()` 无参并返回 `T`。
- ❌ 覆写 `getCapability` 忘了 `return super.getCapability(cap, side)` —— 别人附加的 capability 会全部失效。
- ❌ `getCapability()` 返回 null / 直接 `.get()` —— 它返回 `LazyOptional`，用 `ifPresent` / `orElse`。
- ❌ `LazyOptional` 泄漏：自有 provider 必须在 `invalidateCaps()` 里 `opt.invalidate()`；非自有 provider 用 `AttachCapabilitiesEvent#addListener(Runnable)`。症状是内存泄漏、区块卸载后不释放。
- ❌ `LevelChunk` / `BlockEntity` 能力状态变化后忘了 `setChanged()` —— 区块不落盘，数据静默丢。
- ❌ 用 Map/数据结构缓存能力判断 —— 官方明确要求用直接判断，能力检查可能每 tick 被大量对象执行。
- ❌ 未确认能力已注册就实例化其默认实现 —— 用 `Capability#isRegistered` 兜住（可选的 `@CapabilityInject` 注解也服务同一目的；TODO(未核实) 该注解的包路径未出现在本档 CLI 索引，名字仅由 1.17.1 文档正文背书）。
- ❌ 想给 `Player` 专用就写 `AttachCapabilitiesEvent<Player>` —— 泛型只能是那 5 个，得用 `<Entity>` + `instanceof Player`。

## 参考资料

- 本档文档语料：`1.17.1/datastorage_capabilities`（"The Capability System"）→ `search_forge_docs --query=capability --version=1.17.1` / `get_forge_doc_full --id=datastorage_capabilities --version=1.17.1`
- 反模式旁证：`knowledge/antipatterns/events.md`（本档，Capability 未检查 null / LazyOptional 泄漏）
- 事件选择旁证：`.cursor/rules/05-events.mdc`「示例：Capability 附加事件」
- 官方文档：<https://docs.minecraftforge.net/en/1.17.1/datastorage/capabilities/>

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Capability 附加到注册后的实体或方块实体；能力本身在 mod 总线注册 |
| `mc-blockentity` | BlockEntity 覆写 `getCapability` / `invalidateCaps`，配合 `setChanged()` 标脏 |
| `mc-item` | 物品的 provider 走 `Item#initCapabilities`，不是附加事件 |
| `mc-events` | `AttachCapabilitiesEvent` 在游戏总线、`RegisterCapabilitiesEvent` 在 mod 总线 |
| `mc-networking` | 能力数据默认不同步到客户端，需要自定义包 |
| `mc-energy` | `IEnergyStorage` 是能量互通的能力接口 |
