---
title: "IWorldEventListener"
description: "public interface IWorldEventListener"
package: "net/minecraft/world"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/IWorldEventListener.html"
sourceType: javadoc
---

# IWorldEventListener

## Class signature

```java
public interface IWorldEventListener
```

## Methods

- `void notifyBlockUpdate( World worldIn, BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `void notifyLightSet( BlockPos pos)`
- `void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `void playSoundToAllNearExcept(@Nullable EntityPlayer player, SoundEvent soundIn, SoundCategory category, double x, double y, double z, float volume, float pitch)`
- `void playRecord( SoundEvent soundIn, BlockPos pos)`
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `void onEntityAdded( Entity entityIn)`
- `void onEntityRemoved( Entity entityIn)`
- `void broadcastSound(int soundID, BlockPos pos, int data)`
- `void playEvent( EntityPlayer player, int type, BlockPos blockPosIn, int data)`
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
