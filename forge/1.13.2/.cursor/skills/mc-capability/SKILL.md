---
name: mc-capability
description: Minecraft Forge Capability 系统。AttachCapabilitiesEvent、CapabilityProvider、getCapability 存储和查询模式。触发词：Capability、CapabilityProvider、AttachCapabilitiesEvent、LazyOptional、getCapability
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# Capability 系统（Forge 1.13.2）

## 快速开始

```java
// 1. 定义接口
public interface IExampleData {
    int getValue();
    void setValue(int value);
}

// 2. 实现 CapabilityProvider
public class ExampleDataProvider implements ICapabilityProvider {
    private final IExampleData instance = new IExampleData() {
        private int value = 0;
        @Override public int getValue() { return value; }
        @Override public void setValue(int v) { value = v; }
    };

    @Override
    public <T> T getCapability(Capability<T> cap, Direction side) {
        return cap == ModCapabilities.EXAMPLE_DATA ? (T) instance : null;
    }
}
```

## 注册 Capability

```java
@SubscribeEvent
public void onAttachCapabilities(AttachCapabilitiesEvent<Entity> event) {
    if (event.getObject() instanceof PlayerEntity) {
        event.addCapability(
            new ResourceLocation(MOD_ID, "example_data"),
            new ExampleDataProvider()
        );
    }
}
```

## 查询 Capability

```java
// 读取
player.getCapability(ModCapabilities.EXAMPLE_DATA).ifPresent(data -> {
    data.setValue(10);
});
```

## 常见错误

- ❌ `getCapability()` 返回 null（永远返回 `LazyOptional`，用 `ifPresent`）
- ❌ 在 `AttachCapabilitiesEvent` 中修改数据（只注册 Provider）

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Capability 附加到注册后的实体或 TileEntity |
| `mc-item` | ItemStack 可通过 CapabilityProvider 附加 |
