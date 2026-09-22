---
title: "FMLHandshakeMessage"
description: "public abstract class FMLHandshakeMessage extends java.lang.Object"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.html"
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

- `void fromBytes(ByteBuf buffer)`
- `static FMLProxyPacket makeCustomChannelRegistration(java.util.Set<java.lang.String> channels)`
- `void toBytes(ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`
