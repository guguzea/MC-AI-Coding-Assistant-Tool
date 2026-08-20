---
name: mc-capability
description: Minecraft Forge Capability 系统。AttachCapabilitiesEvent、ICapabilitySerializable、getCapability 存储和查询模式。触发词：Capability、IStorage、ICapabilitySerializable、AttachCapabilitiesEvent、LazyOptional、getCapability
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# Capability 系统（Forge 1.14.4）

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
        CompoundNBT tag = new CompoundNBT();
        tag.putInt("value", value);
        return tag;
    }

    @Override
    public void deserializeNBT(CompoundNBT tag) {
        this.value = tag.getInt("value");
    }
}
```

## 注册 Capability

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class CapabilityEvents {
  public static void registerCapabilities() {
    CapabilityManager.INSTANCE.register(IExampleData.class, new ExampleDataStorage(), ExampleData::new);
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

  @SubscribeEvent
  public static void attachToTile(AttachCapabilitiesEvent<TileEntity> event) {
    // TileEntity 附加同理
  }
}
```

## 查询 Capability（必须用 LazyOptional）

```java
player.getCapability(ModCapabilities.EXAMPLE_DATA).ifPresent(data -> {
    data.setValue(10);
});

int val = player.getCapability(ModCapabilities.EXAMPLE_DATA)
    .map(IExampleData::getValue)
    .orElse(0);
```

## Decision: 选择附加目标

| 目标 | 事件 |
|------|------|
| 玩家 / 所有实体 | `AttachCapabilitiesEvent<Entity>` + 检查 `instanceof PlayerEntity` |
| 方块实体 | `AttachCapabilitiesEvent<TileEntity>` |
| 物品 | `ItemStack.getCapability()` / `initCapabilities()` |

## 内置 Capability（无需注册）

```java
player.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY)
player.getCapability(CapabilityFluidHandler.FLUID_HANDLER_CAPABILITY)
player.getCapability(CapabilityEnergy.ENERGY)
```

## 持久化注意

- TileEntity 的 Capability 数据变化后调用 `markDirty()`

## 常见错误

- ❌ `getCapability()` 返回 handler 或 null — 返回 `LazyOptional<T>`
- ❌ `ForgeCapabilities` / `RegisterCapabilitiesEvent` / `CompoundTag` / `Player` / `setChanged` — 1.19+ API
- ❌ `AttachCapabilitiesEvent<BlockEntity>` — MCP 是 `TileEntity`
- ❌ 在 `AttachCapabilitiesEvent` 中修改数据（只注册 Provider）

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.14.4/datastorage/capabilities/

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-registry` | Capability 附加到注册后的实体或 TileEntity |
| `mc-item` | ItemStack 可通过 initCapabilities 附加 Capability |
| `mc-networking` | Capability 数据可通过数据包同步到客户端 |
