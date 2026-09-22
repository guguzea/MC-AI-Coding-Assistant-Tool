---
title: "PathWorldListener"
description: "public class PathWorldListener extends java.lang.Object implements IWorldEventListener"
package: "net/minecraft/pathfinding"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/pathfinding/PathWorldListener.html"
sourceType: javadoc
---

# PathWorldListener

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathWorldListener

## Class signature

```java
public class PathWorldListener extends java.lang.Object implements IWorldEventListener
```

## Constructors

- `PathWorldListener()`

## Methods

- `void broadcastSound(int soundID, BlockPos pos, int data)`
- `protected boolean didBlockChange(World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState)`
- `void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `void notifyBlockUpdate(World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `void notifyLightSet(BlockPos pos)`
- `void onEntityAdded(Entity entityIn)`
- `void onEntityRemoved(Entity entityIn)`
- `void playEvent(EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `void playRecord(SoundEvent soundIn, BlockPos pos)`
- `void playSoundToAllNearExcept(EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `void spawnParticle(int p_190570_1_, boolean p_190570_2_, boolean p_190570_3_, double p_190570_4_, double p_190570_6_, double p_190570_8_, double p_190570_10_, double p_190570_12_, double p_190570_14_, int... p_190570_16_)`
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
