# WorldClient

## Class signature

```java
public class WorldClient extends World
```

## Constructors

- `public WorldClient( NetHandlerPlayClient netHandler, WorldSettings settings, int dimension, EnumDifficulty difficulty, Profiler profilerIn)`

## Methods

- `public void tick()`
- `public void invalidateBlockReceiveRegion(int x1, int y1, int z1, int x2, int y2, int z2)`
- `protected IChunkProvider createChunkProvider()`
- `protected boolean isChunkLoaded(int x, int z, boolean allowEmpty)`
- `protected void buildChunkCoordList()`
- `protected void updateBlocks()`
- `public void doPreChunk(int chunkX, int chunkZ, boolean loadChunk)`
- `public boolean spawnEntityInWorld( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void addEntityToWorld(int entityID, Entity entityToSpawn)`
- `@Nullable public Entity getEntityByID(int id)`
- `public Entity removeEntityFromWorld(int entityID)`
- `@Deprecated public boolean invalidateRegionAndSetBlock( BlockPos pos, IBlockState state)`
- `public void sendQuittingDisconnectingPacket()`
- `protected void updateWeather()`
- `protected void playMoodSoundAndCheckLight(int p_147467_1_, int p_147467_2_, Chunk chunkIn)`
- `public void doVoidFogParticles(int posX, int posY, int posZ)`
- `public void showBarrierParticles(int p_184153_1_, int p_184153_2_, int p_184153_3_, int p_184153_4_, java.util.Random random, boolean p_184153_6_, BlockPos.MutableBlockPos pos)`
- `public void removeAllEntities()`
- `public CrashReportCategory addWorldInfoToCrashReport( CrashReport report)`
- `public void playSound(@Nullable EntityPlayer player, double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch)`
- `public void playSound( BlockPos pos, SoundEvent soundIn, SoundCategory category, float volume, float pitch, boolean distanceDelay)`
- `public void playSound(double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch, boolean distanceDelay)`
- `public void makeFireworks(double x, double y, double z, double motionX, double motionY, double motionZ, @Nullable NBTTagCompound compund)`
- `public void sendPacketToServer( Packet <?> packetIn)`
- `public void setWorldScoreboard( Scoreboard scoreboardIn)`
- `public void setWorldTime(long time)`
- `public ChunkProviderClient getChunkProvider()`

## Description

Deprecated.