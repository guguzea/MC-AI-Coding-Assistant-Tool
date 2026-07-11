---
name: capability
description: Minecraft Forge Capability 系统（Forge 1.13.2）。AttachCapabilitiesEvent、CapabilityProvider。触发词：Capability、AttachCapabilitiesEvent、getCapability
---

# Capability 系统（Forge 1.13.2）

## 快速开始

```java
// 定义接口
public interface IExampleData {
    int getValue();
    void setValue(int value);
}

// 注册 Capability
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

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
