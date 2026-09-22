---
title: "IWorldEventListener"
description: "public interface IWorldEventListener"
package: "net/minecraft/world"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/IWorldEventListener.html"
sourceType: javadoc
---

# IWorldEventListener

## Class signature

```java
public interface IWorldEventListener
```

## Methods

- `void broadcastSound(int soundID, BlockPos pos, int data)`
- `void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `void notifyBlockUpdate(World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `void notifyLightSet(BlockPos pos)`
- `void onEntityAdded(Entity entityIn)`
- `void onEntityRemoved(Entity entityIn)`
- `void playEvent(EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `void playRecord(SoundEvent soundIn, BlockPos pos)`
- `void playSoundToAllNearExcept(EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
