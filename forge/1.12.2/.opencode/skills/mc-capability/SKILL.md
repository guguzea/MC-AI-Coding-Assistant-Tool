---
name: mc-capability
description: Minecraft Forge Capability 系统。AttachCapabilitiesEvent、ICapabilityProvider、ICapabilitySerializable。触发词：Capability、IStorage、ICapabilitySerializable、AttachCapabilitiesEvent、getCapability
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# Capability 系统（Forge 1.12.2）

## 快速开始

```java
// 1. 定义接口
public interface IExampleData {
    int getValue();
    void setValue(int value);
}

// 2. 实现 ICapabilitySerializable
public class ExampleData implements IExampleData, ICapabilitySerializable<NBTTagCompound> {
    private int value = 0;

    @Override
    public int getValue() { return value; }
    @Override
    public void setValue(int v) { this.value = v; }

    @Override
    public NBTTagCompound serializeNBT() {
        NBTTagCompound tag = new NBTTagCompound();
        tag.setInteger("value", value);
        return tag;
    }

    @Override
    public void deserializeNBT(NBTTagCompound tag) {
        value = tag.getInteger("value");
    }
}
```

## 注册 Capability

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class CapabilityEvents {
    private static final Capability<IExampleData> EXAMPLE_DATA =
        CapabilityManager.get(new ResourceLocation(MOD_ID, "example_data"));

    @SubscribeEvent
    public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (event.getObject() instanceof EntityPlayer) {
            event.addCapability(
                new ResourceLocation(MOD_ID, "example_data"),
                new ICapabilityProvider<IExampleData>() {
                    private final IExampleData instance = new ExampleData();
                    private final LazyOptional<IExampleData> opt = LazyOptional.of(() -> instance);

                    @Override
                    public boolean hasCapability(Capability<IExampleData> cap, EnumFacing face) {
                        return cap == EXAMPLE_DATA;
                    }

                    @Override
                    public <T> LazyOptional<T> getCapability(Capability<T> cap, EnumFacing face) {
                        return cap == EXAMPLE_DATA ? opt.cast() : LazyOptional.empty();
                    }
                }
            );
        }
    }
}
```

## 查询 Capability

```java
// 读取
player.getCapability(EXAMPLE_DATA).ifPresent(data -> {
    data.setValue(10);
});

// 或使用 orElse
IExampleData data = player.getCapability(EXAMPLE_DATA).orElse(null);
```

## 内置 Capability

```java
// 物品栏
player.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY).ifPresent(...);

// 流体栏
player.getCapability(CapabilityFluidHandler.FLUID_HANDLER_CAPABILITY).ifPresent(...);

// 能量
player.getCapability(CapabilityEnergy.ENERGY).ifPresent(...);
```

## 常见错误

- ❌ `getCapability()` 返回 null → 永远返回 `LazyOptional`
- ❌ 在 `AttachCapabilitiesEvent` 中修改数据 → 只注册 Provider
- ❌ 自定义 Capability 未存储到 NBT

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.12.2/capabilities/

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | Capability 附加到注册后的实体或 TileEntity |
| `mc-item` | ItemStack 可通过 initCapabilities 附加 Capability |
| `mc-networking` | Capability 数据可通过数据包同步 |
