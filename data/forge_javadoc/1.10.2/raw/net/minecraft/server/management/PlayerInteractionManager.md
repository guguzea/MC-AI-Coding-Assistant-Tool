---
title: "PlayerInteractionManager"
description: "public class PlayerInteractionManager extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/PlayerInteractionManager.html"
sourceType: javadoc
---

# PlayerInteractionManager

## Class signature

```java
public class PlayerInteractionManager extends java.lang.Object
```

## Constructors

- `public PlayerInteractionManager( World worldIn)`

## Methods

- `public void setGameType( GameType type)`
- `public GameType getGameType()`
- `public boolean survivalOrAdventure()`
- `public boolean isCreative()`
- `public void initializeGameType( GameType type)`
- `public void updateBlockRemoving()`
- `public void onBlockClicked( BlockPos pos, EnumFacing side)`
- `public void blockRemoving( BlockPos pos)`
- `public void cancelDestroyingBlock()`
- `public boolean tryHarvestBlock( BlockPos pos)`
- `public EnumActionResult processRightClick( EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `public EnumActionResult processRightClickBlock( EntityPlayer player, World worldIn, @Nullable ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void setWorld( WorldServer serverWorld)`
- `public double getBlockReachDistance()`
- `public void setBlockReachDistance(double distance)`
