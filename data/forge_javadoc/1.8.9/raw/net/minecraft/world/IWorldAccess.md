---
title: "IWorldAccess"
description: "public interface IWorldAccess"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/IWorldAccess.html"
sourceType: javadoc
---

# IWorldAccess

## Class signature

```java
public interface IWorldAccess
```

## Methods

- `void broadcastSound(int p_180440_1_, BlockPos p_180440_2_, int p_180440_3_)`
- `void markBlockForUpdate(BlockPos pos)`
- `void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)` — On the client, re-renders all blocks in this range, inclusive.
- `void notifyLightSet(BlockPos pos)`
- `void onEntityAdded(Entity entityIn)` — Called on all IWorldAccesses when an entity is created or loaded.
- `void onEntityRemoved(Entity entityIn)` — Called on all IWorldAccesses when an entity is unloaded or destroyed.
- `void playAuxSFX(EntityPlayer player, int sfxType, BlockPos blockPosIn, int p_180439_4_)`
- `void playRecord(java.lang.String recordName, BlockPos blockPosIn)`
- `void playSound(java.lang.String soundName, double x, double y, double z, float volume, float pitch)` — Plays the specified sound.
- `void playSoundToNearExcept(EntityPlayer except, java.lang.String soundName, double x, double y, double z, float volume, float pitch)` — Plays sound to all near players except the player reference given
- `void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`
- `void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xOffset, double yOffset, double zOffset, int... p_180442_15_)`
