# WorldClient

## Class signature

```java
public class WorldClient extends World
```

## Constructors

- `public WorldClient( NetHandlerPlayClient p_i45063_1_, WorldSettings p_i45063_2_, int p_i45063_3_, EnumDifficulty p_i45063_4_, Profiler p_i45063_5_)`

## Methods

- `public void tick()`
- `public void invalidateBlockReceiveRegion(int p_73031_1_, int p_73031_2_, int p_73031_3_, int p_73031_4_, int p_73031_5_, int p_73031_6_)`
- `protected IChunkProvider createChunkProvider()`
- `protected void updateBlocks()`
- `public void doPreChunk(int p_73025_1_, int p_73025_2_, boolean p_73025_3_)`
- `public boolean spawnEntityInWorld( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void addEntityToWorld(int p_73027_1_, Entity p_73027_2_)`
- `public Entity getEntityByID(int id)`
- `public Entity removeEntityFromWorld(int p_73028_1_)`
- `public boolean invalidateRegionAndSetBlock( BlockPos p_180503_1_, IBlockState p_180503_2_)`
- `public void sendQuittingDisconnectingPacket()`
- `protected void updateWeather()`
- `protected int getRenderDistanceChunks()`
- `public void doVoidFogParticles(int p_73029_1_, int p_73029_2_, int p_73029_3_)`
- `public void removeAllEntities()`
- `public CrashReportCategory addWorldInfoToCrashReport( CrashReport report)`
- `public void playSoundAtPos( BlockPos p_175731_1_, java.lang.String p_175731_2_, float p_175731_3_, float p_175731_4_, boolean p_175731_5_)`
- `public void playSound(double x, double y, double z, java.lang.String soundName, float volume, float pitch, boolean distanceDelay)`
- `public void makeFireworks(double x, double y, double z, double motionX, double motionY, double motionZ, NBTTagCompound compund)`
- `public void setWorldScoreboard( Scoreboard p_96443_1_)`
- `public void setWorldTime(long time)`

## Description

Add an ID to Entity mapping to entityHashSet