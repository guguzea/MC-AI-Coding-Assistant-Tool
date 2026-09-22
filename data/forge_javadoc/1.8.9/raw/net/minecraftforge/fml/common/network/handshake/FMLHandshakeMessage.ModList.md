---
title: "FMLHandshakeMessage.ModList"
description: "public static class FMLHandshakeMessage.ModList extends FMLHandshakeMessage"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.ModList.html"
sourceType: javadoc
---

# FMLHandshakeMessage.ModList

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage.ModList

## Class signature

```java
public static class FMLHandshakeMessage.ModList extends FMLHandshakeMessage
```

## Constructors

- `ModList()`
- `ModList(java.util.List<ModContainer> modList)`

## Methods

- `void fromBytes(ByteBuf buffer)`
- `java.util.Map<java.lang.String, java.lang.String> modList()`
- `java.lang.String modListAsString()`
- `int modListSize()`
- `void toBytes(ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`
