---
title: "CPacketRecipeInfo"
description: "public class CPacketRecipeInfo extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketRecipeInfo.html"
sourceType: javadoc
---

# CPacketRecipeInfo

## Class signature

```java
public class CPacketRecipeInfo extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketRecipeInfo()`
- `public CPacketRecipeInfo( IRecipe p_i47518_1_)`
- `public CPacketRecipeInfo(boolean p_i47424_1_, boolean p_i47424_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public CPacketRecipeInfo.Purpose getPurpose()`
- `public IRecipe getRecipe()`
- `public boolean isGuiOpen()`
- `public boolean isFilteringCraftable()`
