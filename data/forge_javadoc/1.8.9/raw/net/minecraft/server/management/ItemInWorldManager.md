---
title: "ItemInWorldManager"
description: "public class ItemInWorldManager extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/ItemInWorldManager.html"
sourceType: javadoc
---

# ItemInWorldManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.ItemInWorldManager

## Class signature

```java
public class ItemInWorldManager extends java.lang.Object
```

## Constructors

- `ItemInWorldManager(World worldIn)`

## Methods

- `boolean activateBlockOrUseItem(EntityPlayer player, World worldIn, ItemStack stack, BlockPos pos, EnumFacing side, float offsetX, float offsetY, float offsetZ)` — Activate the clicked on block, otherwise use the held item.
- `void blockRemoving(BlockPos pos)`
- `void cancelDestroyingBlock()` — Stops the block breaking process
- `double getBlockReachDistance()`
- `WorldSettings.GameType getGameType()`
- `void initializeGameType(WorldSettings.GameType type)` — if the gameType is currently NOT_SET then change it to par1
- `boolean isCreative()` — Get if we are in creative game mode.
- `void onBlockClicked(BlockPos pos, EnumFacing side)` — If not creative, it calls sendBlockBreakProgress until the block is broken first. tryHarvestBlock can also be the result of this call.
- `void setBlockReachDistance(double distance)`
- `void setGameType(WorldSettings.GameType type)`
- `void setWorld(WorldServer serverWorld)` — Sets the world instance.
- `boolean survivalOrAdventure()`
- `boolean tryHarvestBlock(BlockPos pos)` — Attempts to harvest a block
- `boolean tryUseItem(EntityPlayer player, World worldIn, ItemStack stack)` — Attempts to right-click use an item by the given EntityPlayer in the given World
- `void updateBlockRemoving()`

## Fields

- `World theWorld` — The world object that this object is connected to.
- `EntityPlayerMP thisPlayerMP` — The EntityPlayerMP object that this object is connected to.
