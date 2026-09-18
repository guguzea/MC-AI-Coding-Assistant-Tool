---
title: "FMLHandshakeMessage.RegistryData"
description: ""
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/handshake/FMLHandshakeMessage.RegistryData.html"
sourceType: javadoc
---

# FMLHandshakeMessage.RegistryData

## Constructors

- `public RegistryData()`
- `public RegistryData(boolean hasMore, ResourceLocation name, PersistentRegistryManager.GameDataSnapshot.Entry entry)`

## Methods

- `public void fromBytes(io.netty.buffer.ByteBuf buffer)`
- `public void toBytes(io.netty.buffer.ByteBuf buffer)`
- `public java.util.Map< ResourceLocation ,java.lang.Integer> getIdMap()`
- `public java.util.Set< ResourceLocation > getSubstitutions()`
- `public java.util.Set< ResourceLocation > getDummied()`
- `public ResourceLocation getName()`
- `public boolean hasMore()`
- `public java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`
