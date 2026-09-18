---
title: "ItemInWorldManager"
description: "The world object that this object is connected to."
package: "net/minecraft/server/management"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/ItemInWorldManager.html"
sourceType: javadoc
---

# ItemInWorldManager

## Class signature

```java
public class ItemInWorldManager extends java.lang.Object
```

## Constructors

- `public ItemInWorldManager( World worldIn)`

## Methods

- `public void setGameType( WorldSettings.GameType type)`
- `public WorldSettings.GameType getGameType()`
- `public boolean survivalOrAdventure()`
- `public boolean isCreative()`
- `public void initializeGameType( WorldSettings.GameType type)`
- `public void updateBlockRemoving()`
- `public void onBlockClicked( BlockPos pos, EnumFacing side)`
- `public void blockRemoving( BlockPos pos)`
- `public void cancelDestroyingBlock()`
- `public boolean tryHarvestBlock( BlockPos pos)`
- `public boolean tryUseItem( EntityPlayer player, World worldIn, ItemStack stack)`
- `public boolean activateBlockOrUseItem( EntityPlayer player, World worldIn, ItemStack stack, BlockPos pos, EnumFacing side, float offsetX, float offsetY, float offsetZ)`
- `public void setWorld( WorldServer serverWorld)`
- `public double getBlockReachDistance()`
- `public void setBlockReachDistance(double distance)`

## Description

The world object that this object is connected to.
