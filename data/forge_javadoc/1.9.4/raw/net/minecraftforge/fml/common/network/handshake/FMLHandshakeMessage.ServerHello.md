---
title: "FMLHandshakeMessage.ServerHello"
description: "public static class FMLHandshakeMessage.ServerHello extends FMLHandshakeMessage"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.ServerHello.html"
sourceType: javadoc
---

# FMLHandshakeMessage.ServerHello

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage.ServerHello

## Class signature

```java
public static class FMLHandshakeMessage.ServerHello extends FMLHandshakeMessage
```

## Constructors

- `ServerHello()`
- `ServerHello(int overrideDim)`

## Methods

- `void fromBytes(io.netty.buffer.ByteBuf buffer)`
- `int overrideDim()`
- `byte protocolVersion()`
- `void toBytes(io.netty.buffer.ByteBuf buffer)`
