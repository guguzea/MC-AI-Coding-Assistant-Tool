---
title: "PlayerInteractionManager"
description: "public class PlayerInteractionManager extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/management/PlayerInteractionManager.html"
sourceType: javadoc
---

# PlayerInteractionManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerInteractionManager

## Class signature

```java
public class PlayerInteractionManager extends java.lang.Object
```

## Constructors

- `PlayerInteractionManager(World worldIn)`

## Methods

- `void blockRemoving(BlockPos pos)`
- `void cancelDestroyingBlock()`
- `double getBlockReachDistance()`
- `WorldSettings.GameType getGameType()`
- `void initializeGameType(WorldSettings.GameType type)`
- `boolean isCreative()`
- `void onBlockClicked(BlockPos pos, EnumFacing side)`
- `EnumActionResult processRightClick(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `EnumActionResult processRightClickBlock(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void setBlockReachDistance(double distance)`
- `void setGameType(WorldSettings.GameType type)`
- `void setWorld(WorldServer serverWorld)`
- `boolean survivalOrAdventure()`
- `boolean tryHarvestBlock(BlockPos pos)`
- `void updateBlockRemoving()`

## Fields

- `World theWorld`
- `EntityPlayerMP thisPlayerMP`
