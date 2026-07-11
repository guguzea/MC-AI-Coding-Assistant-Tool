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

    @Override public int getValue() { return value; }
    @Override public void setValue(int v) { this.value = v; }

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
private static final Capability<IExampleData> EXAMPLE_DATA =
    CapabilityManager.get(new ResourceLocation(MOD_ID, "example_data"));

@Mod.EventBusSubscriber(modid = MOD_ID)
public class CapabilityEvents {
    @SubscribeEvent
    public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (event.getObject() instanceof EntityPlayer) {
            event.addCapability(
                new ResourceLocation(MOD_ID, "example_data"),
                new ICapabilityProvider<IExampleData>() {
                    private final IExampleData instance = new ExampleData();
                    @Override
                    public boolean hasCapability(Capability<IExampleData> cap, EnumFacing face) {
                        return cap == EXAMPLE_DATA;
                    }
                    @Override
                    public <T> LazyOptional<T> getCapability(Capability<T> cap, EnumFacing face) {
                        return cap == EXAMPLE_DATA ? LazyOptional.of(() -> (T) instance) : LazyOptional.empty();
                    }
                }
            );
        }
    }
}
```

## 查询 Capability

```java
player.getCapability(EXAMPLE_DATA).ifPresent(data -> data.setValue(10));
```

## 内置 Capability

```java
player.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY).ifPresent(...);
```

## 常见错误

- ❌ `getCapability()` 返回 null → 永远返回 `LazyOptional`

## 参考资料

- 详细示例：参见 `09-anti-patterns.mdc`
