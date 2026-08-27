---
name: mc-capability
description: Minecraft Forge Capability 系统。AttachCapabilitiesEvent、ICapabilitySerializable、getCapability 存储和查询模式。触发词：Capability、IStorage、ICapabilitySerializable、AttachCapabilitiesEvent、LazyOptional、getCapability
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# Capability 系统（Forge 1.16.5）

## 快速开始

```java
// 1. 定义接口
public interface IExampleData {
    int getValue();
    void setValue(int value);
}

// 2. 实现 ICapabilitySerializable（自带存储，无需单独 IStorage）
public class ExampleData implements IExampleData, INBTSerializable<CompoundNBT> {
    private int value = 0;

    @Override public int getValue() { return value; }
    @Override public void setValue(int v) { this.value = v; }

    @Override
    public CompoundNBT serializeNBT() {
        CompoundNBT nbt = new CompoundNBT();
        nbt.putInt("value", value);
        return nbt;
    }

    @Override
    public void deserializeNBT(CompoundNBT nbt) {
        this.value = nbt.getInt("value");
    }
}
```

## 注册 Capability

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class CapabilityEvents {
    // 附加到玩家
    @SubscribeEvent
    public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (!(event.getObject() instanceof PlayerEntity)) return;
        event.addCapability(
            new ResourceLocation(MOD_ID, "example_data"),
            new ICapabilityProvider<IExampleData>() {
                private final IExampleData instance = new ExampleData();
                private final LazyOptional<IExampleData> opt = LazyOptional.of(() -> instance);

                @Override
                public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
                    return cap == ModCapabilities.EXAMPLE_DATA ? opt.cast() : LazyOptional.empty();
                }
            }
        );
    }
}
```

## 查询 Capability（必须用 LazyOptional）

```java
// ✅ 推荐：ifPresent 模式
player.getCapability(ModCapabilities.EXAMPLE_DATA).ifPresent(data -> {
    data.setValue(10);
});

// ✅ 安全读取（带默认值）
int val = player.getCapability(ModCapabilities.EXAMPLE_DATA)
    .map(IExampleData::getValue)
    .orElse(0);

// ❌ 错误：直接调用（cap 可能不存在）
int val = player.getCapability(CAP).orElse(null).getValue(); // NPE!
```

## Decision: 选择附加目标

| 目标 | 事件 |
|------|------|
| 玩家 / 所有实体 | `AttachCapabilitiesEvent<Entity>` + 检查 `instanceof PlayerEntity` |
| 方块实体 | `AttachCapabilitiesEvent<BlockEntity>` |
| 物品 | `ItemStack.getCapability()`（无需事件） |
| 世界 / 区块 | `AttachCapabilitiesEvent<World>` / `AttachCapabilitiesEvent<Chunk>` |

## 内置 Capability（无需注册）

```java
// ItemHandler（物品栏）
player.getCapability(ForgeCapabilities.ITEM_HANDLER)
// FluidHandler（流体栏）
player.getCapability(ForgeCapabilities.FLUID_HANDLER)
// EnergyStorage（能量）
player.getCapability(ForgeCapabilities.ENERGY)
```

## 常见错误

- ❌ `getCapability()` 返回 null（永远返回 `LazyOptional`，用 `ifPresent`）
- ❌ 在 `AttachCapabilitiesEvent` 中修改数据（只注册 Provider）
- ❌ `LazyOptional` 泄漏：`invalidate()` 中必须调用 `opt.invalidate()`
- ❌ 在服务端查询玩家 Capability 前未确认 `LogicalSide`

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.16.5/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Capability 附加到注册后的实体或方块实体 |
| `mc-item` | ItemStack 可通过 getCapability 附加 Capability |
| `mc-networking` | Capability 数据可通过数据包同步到客户端 |
