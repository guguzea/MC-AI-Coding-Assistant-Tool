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
@CapabilityInject(IExampleData.class)
public static Capability<IExampleData> EXAMPLE_DATA = null;

@Mod.EventHandler
public void preInit(FMLPreInitializationEvent event) {
    CapabilityManager.INSTANCE.register(
        IExampleData.class,
        new ExampleDataStorage(),
        ExampleData::new
    );
}

@Mod.EventBusSubscriber(modid = MOD_ID)
public class CapabilityEvents {
    @SubscribeEvent
    public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (event.getObject() instanceof EntityPlayer) {
            event.addCapability(
                new ResourceLocation(MOD_ID, "example_data"),
                new ICapabilityProvider() {
                    private final IExampleData instance = new ExampleData();

                    @Override
                    public boolean hasCapability(Capability<?> capability, EnumFacing facing) {
                        return capability == EXAMPLE_DATA;
                    }

                    @Override
                    public <T> T getCapability(Capability<T> capability, EnumFacing facing) {
                        if (capability == EXAMPLE_DATA) {
                            return EXAMPLE_DATA.cast(instance);
                        }
                        return null;
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
if (player.hasCapability(EXAMPLE_DATA, null)) {
  IExampleData data = player.getCapability(EXAMPLE_DATA, null);
  data.setValue(10);
}
```

## 内置 Capability

```java
// 物品栏
if (player.hasCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY, null)) {
  player.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY, null);
}

// 流体栏
player.getCapability(CapabilityFluidHandler.FLUID_HANDLER_CAPABILITY, null);

// 能量
player.getCapability(CapabilityEnergy.ENERGY, null);
```

## 常见错误

- ❌ `getCapability()` 返回 null 未检查 → 先 `hasCapability` 或判空
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
