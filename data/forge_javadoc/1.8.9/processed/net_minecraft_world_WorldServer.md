# WorldServer

## Class signature

```java
public class WorldServer extends World implements IThreadListener
```

## Constructors

- `public WorldServer( MinecraftServer server, ISaveHandler saveHandlerIn, WorldInfo info, int dimensionId, Profiler profilerIn)`

## Methods

- `public static void fillChestHook()`
- `public World init()`
- `public void tick()`
- `public BiomeGenBase.SpawnListEntry getSpawnListEntryForTypeAt( EnumCreatureType creatureType, BlockPos pos)`
- `public boolean canCreatureTypeSpawnHere( EnumCreatureType creatureType, BiomeGenBase.SpawnListEntry spawnListEntry, BlockPos pos)`
- `public void updateAllPlayersSleepingFlag()`
- `protected void wakeAllPlayers()`
- `public boolean areAllPlayersAsleep()`
- `public void setInitialSpawnLocation()`
- `protected void updateBlocks()`
- `protected BlockPos adjustPosToNearbyEntity( BlockPos pos)`
- `public boolean isBlockTickPending( BlockPos pos, Block blockType)`
- `public void scheduleUpdate( BlockPos pos, Block blockIn, int delay)`
- `public void updateBlockTick( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void scheduleBlockUpdate( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void updateEntities()`
- `public void resetUpdateEntityTick()`
- `public boolean tickUpdates(boolean p_72955_1_)`
- `public java.util.List< NextTickListEntry > getPendingBlockUpdates( Chunk chunkIn, boolean p_72920_2_)`
- `public java.util.List< NextTickListEntry > func_175712_a( StructureBoundingBox structureBB, boolean p_175712_2_)`
- `public void updateEntityWithOptionalForce( Entity entityIn, boolean forceUpdate)`
- `protected IChunkProvider createChunkProvider()`
- `public java.util.List< TileEntity > getTileEntitiesIn(int minX, int minY, int minZ, int maxX, int maxY, int maxZ)`
- `public boolean isBlockModifiable( EntityPlayer player, BlockPos pos)`
- `public boolean canMineBlockBody( EntityPlayer player, BlockPos pos)`
- `public void initialize( WorldSettings settings)`
- `protected void createBonusChest()`
- `public BlockPos getSpawnCoordinate()`
- `public void saveAllChunks(boolean p_73044_1_, IProgressUpdate progressCallback) throws MinecraftException`
- `public void saveChunkData()`
- `protected void saveLevel() throws MinecraftException`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public boolean addWeatherEffect( Entity entityIn)`
- `public void setEntityState( Entity entityIn, byte state)`
- `public Explosion newExplosion( Entity entityIn, double x, double y, double z, float strength, boolean isFlaming, boolean isSmoking)`
- `public void addBlockEvent( BlockPos pos, Block blockIn, int eventID, int eventParam)`
- `public void flush()`
- `protected void updateWeather()`
- `protected int getRenderDistanceChunks()`
- `public MinecraftServer getMinecraftServer()`
- `public EntityTracker getEntityTracker()`
- `public PlayerManager getPlayerManager()`
- `public Teleporter getDefaultTeleporter()`
- `public void spawnParticle( EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, int numberOfParticles, double p_175739_9_, double p_175739_11_, double p_175739_13_, double p_175739_15_, int... p_175739_17_)`
- `public void spawnParticle( EnumParticleTypes particleType, boolean longDistance, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... p_180505_18_)`
- `public Entity getEntityFromUuid(java.util.UUID uuid)`
- `public <any> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `public boolean isCallingFromMinecraftThread()`
- `public java.io.File getChunkSaveLocation()`

## Description

Whether level saving is disabled or not