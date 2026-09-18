---
title: "IWorldAccess"
description: "On the client, re-renders all blocks in this range, inclusive."
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/IWorldAccess.html"
sourceType: javadoc
---

# IWorldAccess

## Class signature

```java
public interface IWorldAccess
```

## Methods

- `void markBlockForUpdate( BlockPos pos)`
- `void notifyLightSet( BlockPos pos)`
- `void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `void playSound(java.lang.String soundName, double x, double y, double z, float volume, float pitch)`
- `void playSoundToNearExcept( EntityPlayer except, java.lang.String soundName, double x, double y, double z, float volume, float pitch)`
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xOffset, double yOffset, double zOffset, int... p_180442_15_)`
- `void onEntityAdded( Entity entityIn)`
- `void onEntityRemoved( Entity entityIn)`
- `void playRecord(java.lang.String recordName, BlockPos blockPosIn)`
- `void broadcastSound(int p_180440_1_, BlockPos p_180440_2_, int p_180440_3_)`
- `void playAuxSFX( EntityPlayer player, int sfxType, BlockPos blockPosIn, int p_180439_4_)`
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`

## Description

On the client, re-renders all blocks in this range, inclusive.
