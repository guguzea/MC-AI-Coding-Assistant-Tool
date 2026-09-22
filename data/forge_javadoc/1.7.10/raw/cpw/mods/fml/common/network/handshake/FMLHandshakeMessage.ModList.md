---
title: "FMLHandshakeMessage.ModList"
description: "public static class FMLHandshakeMessage.ModList extends FMLHandshakeMessage"
package: "cpw/mods/fml/common/network/handshake"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/handshake/FMLHandshakeMessage.ModList.html"
sourceType: javadoc
---

# FMLHandshakeMessage.ModList

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.handshake.FMLHandshakeMessage → cpw.mods.fml.common.network.handshake.FMLHandshakeMessage.ModList

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
