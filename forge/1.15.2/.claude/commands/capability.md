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

// 2. 实现 ICapabilitySerializable
public class ExampleData implements IExampleData, ICapabilitySerializable<CompoundNBT> {
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
    @SubscribeEvent
    public static void commonSetup(FMLCommonSetupEvent event) {
        CapabilityManager.INSTANCE.register(
            IExampleData.class,
            new ExampleDataStorage(),
            ExampleData::new
        );
    }

    @SubscribeEvent
    public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (!(event.getObject() instanceof PlayerEntity)) return;
        event.addCapability(
            new ResourceLocation(MOD_ID, "example_data"),
            new ICapabilityProvider() {
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

## 查询 Capability

```java
player.getCapability(ModCapabilities.EXAMPLE_DATA).ifPresent(data -> {
    data.setValue(10);
});
```

## Decision: 选择附加目标

| 目标 | 事件 |
|------|------|
| 玩家 / 所有实体 | `AttachCapabilitiesEvent<Entity>` + 检查 `instanceof PlayerEntity` |
| TileEntity | `AttachCapabilitiesEvent<TileEntity>` |
| ItemStack | `ItemStack.getCapability()` |

## 内置 Capability

```java
player.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY)
player.getCapability(CapabilityFluidHandler.FLUID_HANDLER_CAPABILITY)
player.getCapability(CapabilityEnergy.ENERGY)
```

## 常见错误

- ❌ `getCapability()` 返回 null — 返回 `LazyOptional<T>`
- ❌ `hasCapability` / `ICapabilityProvider<IExampleData>` — 只实现 `getCapability(..., Direction)`
- ❌ `RegistryEvent.Register<Capabilities>` — 用 `CapabilityManager.INSTANCE.register`
- ❌ 在 `AttachCapabilitiesEvent` 中修改数据（只注册 Provider）

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.15.2/datastorage/capabilities/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Capability 附加到注册后的实体或 TileEntity |
| `mc-item` | ItemStack 可通过 initCapabilities 附加 Capability |
