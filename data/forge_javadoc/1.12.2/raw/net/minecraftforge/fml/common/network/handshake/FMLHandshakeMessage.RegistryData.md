---
title: "FMLHandshakeMessage.RegistryData"
description: "public static class FMLHandshakeMessage.RegistryData extends FMLHandshakeMessage"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.RegistryData.html"
sourceType: javadoc
---

# FMLHandshakeMessage.RegistryData

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage.RegistryData

## Class signature

```java
public static class FMLHandshakeMessage.RegistryData extends FMLHandshakeMessage
```

## Constructors

- `RegistryData()`
- `RegistryData(boolean hasMore, ResourceLocation name, ForgeRegistry.Snapshot entry)`

## Methods

- `void fromBytes(ByteBuf buffer)`
- `java.util.Set<ResourceLocation> getDummied()`
- `java.util.Map<ResourceLocation, java.lang.Integer> getIdMap()`
- `ResourceLocation getName()`
- `java.util.Map<ResourceLocation, java.lang.String> getOverrides()`
- `boolean hasMore()`
- `void toBytes(ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`
