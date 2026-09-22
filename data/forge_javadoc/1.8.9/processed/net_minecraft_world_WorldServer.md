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
- `<any> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `boolean addWeatherEffect(Entity entityIn)` — adds a lightning bolt to the list of lightning bolts in this world.
- `protected BlockPos adjustPosToNearbyEntity(BlockPos pos)`
- `boolean areAllPlayersAsleep()`
- `boolean canCreatureTypeSpawnHere(EnumCreatureType creatureType, BiomeGenBase.SpawnListEntry spawnListEntry, BlockPos pos)`
- `boolean canMineBlockBody(EntityPlayer player, BlockPos pos)`
- `protected void createBonusChest()` — Creates the bonus chest in the world.
- `protected IChunkProvider createChunkProvider()` — Creates the chunk provider for this world.
- `static void fillChestHook()`
- `void flush()` — Syncs all changes to disk and wait for completion.
- `java.util.List<NextTickListEntry> func_175712_a(StructureBoundingBox structureBB, boolean p_175712_2_)`
- `java.io.File getChunkSaveLocation()`
- `Teleporter getDefaultTeleporter()`
- `Entity getEntityFromUuid(java.util.UUID uuid)`
- `EntityTracker getEntityTracker()` — Gets the EntityTracker
- `MinecraftServer getMinecraftServer()`
- `java.util.List<NextTickListEntry> getPendingBlockUpdates(Chunk chunkIn, boolean p_72920_2_)`
- `PlayerManager getPlayerManager()`
- `protected int getRenderDistanceChunks()`
- `BlockPos getSpawnCoordinate()` — Returns null for anything other than the End
- `BiomeGenBase.SpawnListEntry getSpawnListEntryForTypeAt(EnumCreatureType creatureType, BlockPos pos)`
- `java.util.List<TileEntity> getTileEntitiesIn(int minX, int minY, int minZ, int maxX, int maxY, int maxZ)`
- `World init()`
- `void initialize(WorldSettings settings)`
- `boolean isBlockModifiable(EntityPlayer player, BlockPos pos)`
- `boolean isBlockTickPending(BlockPos pos, Block blockType)`
- `boolean isCallingFromMinecraftThread()`
- `Explosion newExplosion(Entity entityIn, double x, double y, double z, float strength, boolean isFlaming, boolean isSmoking)` — returns a new explosion.
- `void onEntityAdded(Entity entityIn)`
- `void onEntityRemoved(Entity entityIn)`
- `void resetUpdateEntityTick()` — Resets the updateEntityTick field to 0
- `void saveAllChunks(boolean p_73044_1_, IProgressUpdate progressCallback)` — Saves all chunks to disk while updating progress bar.
- `void saveChunkData()` — saves chunk data - currently only called during execution of the Save All command
- `protected void saveLevel()` — Saves the chunks to disk.
- `void scheduleBlockUpdate(BlockPos pos, Block blockIn, int delay, int priority)`
- `void scheduleUpdate(BlockPos pos, Block blockIn, int delay)`
- `void setEntityState(Entity entityIn, byte state)` — sends a Packet 38 (Entity Status) to all tracked players of that entity
- `void setInitialSpawnLocation()` — Sets a new spawn location by finding an uncovered block at a random (x,z) location in the chunk.
- `void spawnParticle(EnumParticleTypes particleType, boolean longDistance, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... p_180505_18_)` — Spawns the desired particle and sends the necessary packets to the relevant connected players.
- `void spawnParticle(EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, int numberOfParticles, double p_175739_9_, double p_175739_11_, double p_175739_13_, double p_175739_15_, int... p_175739_17_)` — Spawns the desired particle and sends the necessary packets to the relevant connected players.
- `void tick()` — Runs a single tick for the world
- `boolean tickUpdates(boolean p_72955_1_)` — Runs through the list of updates to run and ticks them
- `void updateAllPlayersSleepingFlag()` — Updates the flag that indicates whether or not all players in the world are sleeping.
- `protected void updateBlocks()`
- `void updateBlockTick(BlockPos pos, Block blockIn, int delay, int priority)`
- `void updateEntities()` — Updates (and cleans up) entities and tile entities
- `void updateEntityWithOptionalForce(Entity entityIn, boolean forceUpdate)` — Will update the entity in the world if the chunk the entity is in is currently loaded or its forced to update.
- `protected void updateWeather()` — Updates all weather states.
- `protected void wakeAllPlayers()`

## Fields

- `java.util.List<Teleporter> customTeleporters`
- `boolean disableLevelSaving` — Whether level saving is disabled or not
- `protected java.util.Set<ChunkCoordIntPair> doneChunks` — Stores the recently processed (lighting) chunks
- `ChunkProviderServer theChunkProviderServer`
- `protected VillageSiege villageSiege`