# WorldServer

**Inheritance:** java.lang.Object → net.minecraft.world.World → net.minecraft.world.WorldServer

## Class signature

```java
public class WorldServer extends World implements IThreadListener
```

## Constructors

- `WorldServer(MinecraftServer server, ISaveHandler saveHandlerIn, WorldInfo info, int dimensionId, Profiler profilerIn)`

## Methods

- `void addBlockEvent(BlockPos pos, Block blockIn, int eventID, int eventParam)`
- `com.google.common.util.concurrent.ListenableFuture<java.lang.Object> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `boolean addWeatherEffect(Entity entityIn)`
- `protected BlockPos adjustPosToNearbyEntity(BlockPos pos)`
- `boolean areAllPlayersAsleep()`
- `boolean canCreatureTypeSpawnHere(EnumCreatureType creatureType, Biome.SpawnListEntry spawnListEntry, BlockPos pos)`
- `boolean canMineBlockBody(EntityPlayer player, BlockPos pos)`
- `protected void createBonusChest()`
- `protected IChunkProvider createChunkProvider()`
- `void flush()`
- `ChunkProviderServer getChunkProvider()`
- `java.io.File getChunkSaveLocation()`
- `Teleporter getDefaultTeleporter()`
- `Entity getEntityFromUuid(java.util.UUID uuid)`
- `EntityTracker getEntityTracker()`
- `MinecraftServer getMinecraftServer()`
- `java.util.List<NextTickListEntry> getPendingBlockUpdates(Chunk chunkIn, boolean p_72920_2_)`
- `java.util.List<NextTickListEntry> getPendingBlockUpdates(StructureBoundingBox structureBB, boolean p_175712_2_)`
- `PlayerChunkMap getPlayerChunkMap()`
- `BlockPos getSpawnCoordinate()`
- `Biome.SpawnListEntry getSpawnListEntryForTypeAt(EnumCreatureType creatureType, BlockPos pos)`
- `TemplateManager getStructureTemplateManager()`
- `World init()`
- `void initialize(WorldSettings settings)`
- `boolean isBlockModifiable(EntityPlayer player, BlockPos pos)`
- `boolean isBlockTickPending(BlockPos pos, Block blockType)`
- `boolean isCallingFromMinecraftThread()`
- `protected boolean isChunkLoaded(int x, int z, boolean allowEmpty)`
- `boolean isUpdateScheduled(BlockPos pos, Block blk)`
- `void loadEntities(java.util.Collection<Entity> entityCollection)`
- `Explosion newExplosion(Entity entityIn, double x, double y, double z, float strength, boolean isFlaming, boolean isSmoking)`
- `void onEntityAdded(Entity entityIn)`
- `void onEntityRemoved(Entity entityIn)`
- `protected void playerCheckLight()`
- `void resetUpdateEntityTick()`
- `void saveAllChunks(boolean p_73044_1_, IProgressUpdate progressCallback)`
- `void saveChunkData()`
- `protected void saveLevel()`
- `void scheduleBlockUpdate(BlockPos pos, Block blockIn, int delay, int priority)`
- `void scheduleUpdate(BlockPos pos, Block blockIn, int delay)`
- `void setEntityState(Entity entityIn, byte state)`
- `void setInitialSpawnLocation()`
- `boolean spawnEntityInWorld(Entity entityIn)`
- `void spawnParticle(EntityPlayerMP player, EnumParticleTypes particle, boolean longDistance, double x, double y, double z, int count, double xOffset, double yOffset, double zOffset, double speed, int... arguments)`
- `void spawnParticle(EnumParticleTypes particleType, boolean longDistance, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... particleArguments)`
- `void spawnParticle(EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... particleArguments)`
- `void tick()`
- `protected void tickPlayers()`
- `boolean tickUpdates(boolean p_72955_1_)`
- `void updateAllPlayersSleepingFlag()`
- `protected void updateBlocks()`
- `void updateBlockTick(BlockPos pos, Block blockIn, int delay, int priority)`
- `void updateEntities()`
- `void updateEntityWithOptionalForce(Entity entityIn, boolean forceUpdate)`
- `protected void updateWeather()`
- `protected void wakeAllPlayers()`

## Fields

- `java.util.List<Teleporter> customTeleporters`
- `boolean disableLevelSaving`
- `protected java.util.Set<ChunkPos> doneChunks` — Stores the recently processed (lighting) chunks
- `protected VillageSiege villageSiege`