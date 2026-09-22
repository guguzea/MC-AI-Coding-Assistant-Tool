# WorldClient

**Inheritance:** java.lang.Object → net.minecraft.world.World → net.minecraft.client.multiplayer.WorldClient

## Class signature

```java
public class WorldClient extends World
```

## Constructors

- `WorldClient(NetHandlerPlayClient netHandler, WorldSettings settings, int dimension, EnumDifficulty difficulty, Profiler profilerIn)`

## Methods

- `void addEntityToWorld(int entityID, Entity entityToSpawn)`
- `CrashReportCategory addWorldInfoToCrashReport(CrashReport report)`
- `protected IChunkProvider createChunkProvider()`
- `void doPreChunk(int chunkX, int chunkZ, boolean loadChunk)`
- `void doVoidFogParticles(int posX, int posY, int posZ)`
- `ChunkProviderClient getChunkProvider()`
- `Entity getEntityByID(int id)`
- `void invalidateBlockReceiveRegion(int x1, int y1, int z1, int x2, int y2, int z2)`
- `@Deprecated boolean invalidateRegionAndSetBlock(BlockPos pos, IBlockState state)`
- `protected boolean isChunkLoaded(int x, int z, boolean allowEmpty)`
- `void makeFireworks(double x, double y, double z, double motionX, double motionY, double motionZ, NBTTagCompound compound)`
- `void onEntityAdded(Entity entityIn)`
- `void onEntityRemoved(Entity entityIn)`
- `protected void playMoodSoundAndCheckLight(int p_147467_1_, int p_147467_2_, Chunk chunkIn)`
- `void playSound(BlockPos pos, SoundEvent soundIn, SoundCategory category, float volume, float pitch, boolean distanceDelay)`
- `void playSound(double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch, boolean distanceDelay)`
- `void playSound(EntityPlayer player, double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch)`
- `protected void refreshVisibleChunks()`
- `void removeAllEntities()`
- `void removeEntity(Entity entityIn)`
- `Entity removeEntityFromWorld(int entityID)`
- `void sendPacketToServer(Packet<?> packetIn)`
- `void sendQuittingDisconnectingPacket()`
- `void setWorldScoreboard(Scoreboard scoreboardIn)`
- `void setWorldTime(long time)`
- `void showBarrierParticles(int x, int y, int z, int offset, java.util.Random random, boolean holdingBarrier, BlockPos.MutableBlockPos pos)`
- `boolean spawnEntity(Entity entityIn)`
- `void tick()`
- `protected void updateBlocks()`
- `protected void updateWeather()`

## Fields

- `protected java.util.Set<ChunkPos> visibleChunks`