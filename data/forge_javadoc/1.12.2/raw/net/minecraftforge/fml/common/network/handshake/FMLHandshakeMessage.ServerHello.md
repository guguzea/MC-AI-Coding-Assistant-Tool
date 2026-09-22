---
title: "FMLHandshakeMessage.ServerHello"
description: "public static class FMLHandshakeMessage.ServerHello extends FMLHandshakeMessage"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.ServerHello.html"
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

- `void fromBytes(ByteBuf buffer)`
- `int overrideDim()`
- `byte protocolVersion()`
- `void toBytes(ByteBuf buffer)`
