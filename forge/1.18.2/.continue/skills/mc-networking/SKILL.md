---
name: mc-networking
description: Minecraft Forge 网络通信。
platform: forge
version: "1.18.2"
---

# 网络通信（Forge 1.18.2）

## SimpleChannel

```java
public static final SimpleChannel CHANNEL = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MOD_ID, "main"),
    () -> PROTOCOL_VERSION,
    PROTOCOL_VERSION::equals,
    PROTOCOL_VERSION::equals
);
```

## 参考资料

参见 `06-networking.mdc`
