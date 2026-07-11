---
name: mc-capability
description: Minecraft Forge Capability 系统（Forge 1.13.2）。AttachCapabilitiesEvent。
---

# Capability 系统（Forge 1.13.2）

## 快速开始

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

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
