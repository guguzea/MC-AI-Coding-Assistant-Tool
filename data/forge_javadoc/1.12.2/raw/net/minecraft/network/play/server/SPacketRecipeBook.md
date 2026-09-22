---
title: "SPacketRecipeBook"
description: "public class SPacketRecipeBook extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketRecipeBook.html"
sourceType: javadoc
---

# SPacketRecipeBook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketRecipeBook

## Class signature

```java
public class SPacketRecipeBook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketRecipeBook()`
- `SPacketRecipeBook(SPacketRecipeBook.State stateIn, java.util.List<IRecipe> recipesIn, java.util.List<IRecipe> displayedRecipesIn, boolean isGuiOpen, boolean p_i47597_5_)`

## Methods

- `java.util.List<IRecipe> getDisplayedRecipes()`
- `java.util.List<IRecipe> getRecipes()`
- `SPacketRecipeBook.State getState()`
- `boolean isFilteringCraftable()`
- `boolean isGuiOpen()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
