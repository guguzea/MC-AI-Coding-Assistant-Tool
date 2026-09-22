---
title: "PlayerInteractionManager"
description: "public class PlayerInteractionManager extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/PlayerInteractionManager.html"
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
- `@Deprecated double getBlockReachDistance()`
- `GameType getGameType()`
- `void initializeGameType(GameType type)`
- `boolean isCreative()`
- `void onBlockClicked(BlockPos pos, EnumFacing side)`
- `EnumActionResult processRightClick(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `EnumActionResult processRightClickBlock(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `@Deprecated void setBlockReachDistance(double distance)`
- `void setGameType(GameType type)`
- `void setWorld(WorldServer serverWorld)`
- `boolean survivalOrAdventure()`
- `boolean tryHarvestBlock(BlockPos pos)`
- `void updateBlockRemoving()`

## Fields

- `EntityPlayerMP player`
- `World world`
