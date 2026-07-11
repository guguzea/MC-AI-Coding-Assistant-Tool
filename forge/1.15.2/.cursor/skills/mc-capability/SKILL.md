---
name: mc-capability
description: Minecraft Forge Capability 系统。AttachCapabilitiesEvent、IStorage、ICapabilitySerializable。触发词：Capability、IStorage、ICapabilitySerializable、AttachCapabilitiesEvent、LazyOptional
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# Capability 系统（Forge 1.15.2）

## 快速开始

```java
// 1. 定义接口
public interface IExampleData {
    int getValue();
    void setValue(int value);
}

// 2. 实现 ICapabilitySerializable（自带存储，无需单独 IStorage）
public class ExampleData implements IExampleData, ICapabilitySerializable<NBTTagCompound> {
    private int value = 0;

    @Override public int getValue() { return value; }
    @Override public void setValue(int v) { this.value = v; }

    @Override
    public NBTTagCompound serializeNBT() {
        NBTTagCompound nbt = new NBTTagCompound();
        nbt.putInt("value", value);
        return nbt;
    }

    @Override
    public void deserializeNBT(NBTTagCompound nbt) {
        this.value = nbt.getInt("value");
    }
}
```

## 注册 Capability

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class CapabilityEvents {
    @SubscribeEvent
    public static void registerCaps(RegistryEvent.Register<Capabilities> event) {
        // Capability 已在 Forge 中注册
    }

    // 附加到玩家
    @SubscribeEvent
    public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (!(event.getObject() instanceof PlayerEntity)) return;
        event.addCapability(
            new ResourceLocation(MOD_ID, "example_data"),
            new ICapabilityProvider<IExampleData>() {
                private final IExampleData instance = new ExampleData();

                @Override
                public boolean hasCapability(Capability<IExampleData> cap, Direction side) {
                    return cap == ModCapabilities.EXAMPLE_DATA;
                }

                @Override
                public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
                    return cap == ModCapabilities.EXAMPLE_DATA ? 
                        LazyOptional.of(() -> (T) instance) : LazyOptional.empty();
                }
            }
        );
    }
}
```

## 查询 Capability

```java
// ✅ 推荐：ifPresent 模式
player.getCapability(ModCapabilities.EXAMPLE_DATA).ifPresent(data -> {
    data.setValue(10);
});

// ❌ 错误：直接调用
int val = player.getCapability(CAP).orElse(null).getValue(); // NPE!
```

## Decision: 选择附加目标

| 目标 | 事件 |
|------|------|
| 玩家 / 所有实体 | `AttachCapabilitiesEvent<Entity>` + 检查 `instanceof PlayerEntity` |
| TileEntity | `AttachCapabilitiesEvent<TileEntity>` |
| ItemStack | `ItemStack.initCapabilities()`（无需事件） |

## 内置 Capability

```java
// ItemHandler（物品栏）
player.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY)
// FluidHandler（流体栏）
player.getCapability(CapabilityFluidHandler.FLUID_HANDLER_CAPABILITY)
// EnergyStorage（能量）
player.getCapability(CapabilityEnergy.ENERGY)
```

## 常见错误

- ❌ `getCapability()` 返回 null（永远返回 `LazyOptional`，用 `ifPresent`）
- ❌ 在 `AttachCapabilitiesEvent` 中修改数据（只注册 Provider）
- ❌ `LazyOptional` 泄漏：`invalidate()` 中必须调用 `close()`

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.15.2/datastorage/capabilities/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Capability 附加到注册后的实体或 TileEntity |
| `mc-item` | ItemStack 可通过 initCapabilities 附加 Capability |
