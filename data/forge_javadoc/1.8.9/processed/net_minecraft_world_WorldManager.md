# WorldManager

## Class signature

```java
public class WorldManager extends java.lang.Object implements IWorldAccess
```

## Constructors

- `public WorldManager( MinecraftServer p_i1517_1_, WorldServer p_i1517_2_)`

## Methods

- `public void spawnParticle(int particleID, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xOffset, double yOffset, double zOffset, int... p_180442_15_)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void playSound(java.lang.String soundName, double x, double y, double z, float volume, float pitch)`
- `public void playSoundToNearExcept( EntityPlayer except, java.lang.String soundName, double x, double y, double z, float volume, float pitch)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void markBlockForUpdate( BlockPos pos)`
- `public void notifyLightSet( BlockPos pos)`
- `public void playRecord(java.lang.String recordName, BlockPos blockPosIn)`
- `public void playAuxSFX( EntityPlayer player, int sfxType, BlockPos blockPosIn, int p_180439_4_)`
- `public void broadcastSound(int p_180440_1_, BlockPos p_180440_2_, int p_180440_3_)`
- `public void sendBlockBreakProgress(int breakerId, BlockPos pos, int progress)`

## Description

On the client, re-renders all blocks in this range, inclusive.