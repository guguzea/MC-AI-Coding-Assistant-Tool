---
name: mc-capability
description: Minecraft Forge Capability 系统。
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

## 参考资料

参见 `05-events.mdc`
