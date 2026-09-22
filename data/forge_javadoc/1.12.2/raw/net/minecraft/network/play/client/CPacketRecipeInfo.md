---
title: "CPacketRecipeInfo"
description: "public class CPacketRecipeInfo extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketRecipeInfo.html"
sourceType: javadoc
---

# CPacketRecipeInfo

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketRecipeInfo

## Class signature

```java
public class CPacketRecipeInfo extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketRecipeInfo()`
- `CPacketRecipeInfo(boolean p_i47424_1_, boolean p_i47424_2_)`
- `CPacketRecipeInfo(IRecipe p_i47518_1_)`

## Methods

- `CPacketRecipeInfo.Purpose getPurpose()`
- `IRecipe getRecipe()`
- `boolean isFilteringCraftable()`
- `boolean isGuiOpen()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
