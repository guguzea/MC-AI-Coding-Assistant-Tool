---
title: "FMLHandshakeMessage.RegistryData"
description: "public static class FMLHandshakeMessage.RegistryData extends FMLHandshakeMessage"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.RegistryData.html"
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
- `RegistryData(boolean hasMore, ResourceLocation name, PersistentRegistryManager.GameDataSnapshot.Entry entry)`

## Methods

- `void fromBytes(io.netty.buffer.ByteBuf buffer)`
- `java.util.Set<ResourceLocation> getDummied()`
- `java.util.Map<ResourceLocation, java.lang.Integer> getIdMap()`
- `ResourceLocation getName()`
- `java.util.Set<ResourceLocation> getSubstitutions()`
- `boolean hasMore()`
- `void toBytes(io.netty.buffer.ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`
