---
name: mc-capability
description: Minecraft Forge Capability 系统。AttachCapabilitiesEvent、getCapability。触发词：Capability、IStorage、AttachCapabilitiesEvent、LazyOptional
platform: forge
version: "1.18.2"
---

# Capability 系统（Forge 1.18.2）

## 注册 Capability

```java
@SubscribeEvent
public static void registerCaps(RegisterCapabilitiesEvent event) {
    event.register(IExampleData.class);
}
```

## 查询 Capability

```java
player.getCapability(Capabilities.ITEM_HANDLER).ifPresent(handler -> {
    // 使用 handler
});
```

## 参考资料

参见 `05-events.mdc`
