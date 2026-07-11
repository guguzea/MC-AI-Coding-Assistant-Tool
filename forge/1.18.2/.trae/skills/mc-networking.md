---
name: mc-networking
description: Minecraft Forge 网络通信。注册网络通道、发送数据包。触发词：网络、Network、SimpleChannel、PacketDistributor、IMessage
platform: forge
version: "1.18.2"
---

# 网络通信（Forge 1.18.2）

## 快速开始

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
