---
title: "FMLHandshakeMessage"
description: "public abstract class FMLHandshakeMessage extends java.lang.Object"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.html"
sourceType: javadoc
---

# FMLHandshakeMessage

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage

## Class signature

```java
public abstract class FMLHandshakeMessage extends java.lang.Object
```

## Constructors

- `FMLHandshakeMessage()`

## Methods

- `void fromBytes(io.netty.buffer.ByteBuf buffer)`
- `static FMLProxyPacket makeCustomChannelRegistration(java.util.Set<java.lang.String> channels)`
- `void toBytes(io.netty.buffer.ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`
