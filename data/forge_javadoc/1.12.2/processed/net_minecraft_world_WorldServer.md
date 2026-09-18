# WorldServer

## Class signature

```java
public class WorldServer extends World implements IThreadListener
```

## Constructors

- `public WorldServer( MinecraftServer server, ISaveHandler saveHandlerIn, WorldInfo info, int dimensionId, Profiler profilerIn)`

## Methods

- `public World init()`
- `public void tick()`
- `public Biome.SpawnListEntry getSpawnListEntryForTypeAt( EnumCreatureType creatureType, BlockPos pos)`
- `public boolean canCreatureTypeSpawnHere( EnumCreatureType creatureType, Biome.SpawnListEntry spawnListEntry, BlockPos pos)`
- `public void updateAllPlayersSleepingFlag()`
- `protected void wakeAllPlayers()`
- `public boolean areAllPlayersAsleep()`
- `public void setInitialSpawnLocation()`
- `protected boolean isChunkLoaded(int x, int z, boolean allowEmpty)`
- `protected void playerCheckLight()`
- `protected void updateBlocks()`
- `protected BlockPos adjustPosToNearbyEntity( BlockPos pos)`
- `public boolean isBlockTickPending( BlockPos pos, Block blockType)`
- `public boolean isUpdateScheduled( BlockPos pos, Block blk)`
- `public void scheduleUpdate( BlockPos pos, Block blockIn, int delay)`
- `public void updateBlockTick( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void scheduleBlockUpdate( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void updateEntities()`
- `protected void tickPlayers()`
- `public void resetUpdateEntityTick()`
- `public boolean tickUpdates(boolean runAllPending)`
- `public java.util.List< NextTickListEntry > getPendingBlockUpdates( Chunk chunkIn, boolean remove)`
- `public java.util.List< NextTickListEntry > getPendingBlockUpdates( StructureBoundingBox structureBB, boolean remove)`
- `public void updateEntityWithOptionalForce( Entity entityIn, boolean forceUpdate)`
- `protected IChunkProvider createChunkProvider()`
- `public boolean isBlockModifiable( EntityPlayer player, BlockPos pos)`
- `public boolean canMineBlockBody( EntityPlayer player, BlockPos pos)`
- `public void initialize( WorldSettings settings)`
- `protected void createBonusChest()`
- `public BlockPos getSpawnCoordinate()`
- `public void saveAllChunks(boolean all, IProgressUpdate progressCallback) throws MinecraftException`
- `public void flushToDisk()`
- `protected void saveLevel() throws MinecraftException`
- `public boolean spawnEntity( Entity entityIn)`
- `public void loadEntities(java.util.Collection< Entity > entityCollection)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public boolean addWeatherEffect( Entity entityIn)`
- `public void setEntityState( Entity entityIn, byte state)`
- `public ChunkProviderServer getChunkProvider()`
- `public Explosion newExplosion( Entity entityIn, double x, double y, double z, float strength, boolean isFlaming, boolean isSmoking)`
- `public void addBlockEvent( BlockPos pos, Block blockIn, int eventID, int eventParam)`
- `public void flush()`
- `protected void updateWeather()`
- `public MinecraftServer getMinecraftServer()`
- `public EntityTracker getEntityTracker()`
- `public PlayerChunkMap getPlayerChunkMap()`
- `public Teleporter getDefaultTeleporter()`
- `public TemplateManager getStructureTemplateManager()`
- `public void spawnParticle( EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... particleArguments)`
- `public void spawnParticle( EnumParticleTypes particleType, boolean longDistance, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... particleArguments)`
- `public void spawnParticle( EntityPlayerMP player, EnumParticleTypes particle, boolean longDistance, double x, double y, double z, int count, double xOffset, double yOffset, double zOffset, double speed, int... arguments)`
- `public Entity getEntityFromUuid(java.util.UUID uuid)`
- `public <any> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `public boolean isCallingFromMinecraftThread()`
- `public BlockPos findNearestStructure(java.lang.String p_190528_1_, BlockPos p_190528_2_, boolean p_190528_3_)`
- `public AdvancementManager getAdvancementManager()`
- `public FunctionManager getFunctionManager()`
- `public java.io.File getChunkSaveLocation()`

## Description

Stores the recently processed (lighting) chunks