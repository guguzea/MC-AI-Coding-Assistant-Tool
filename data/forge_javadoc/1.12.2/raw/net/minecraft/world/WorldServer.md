---
title: "WorldServer"
description: "public class WorldServer extends World implements IThreadListener"
package: "net/minecraft/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/WorldServer.html"
sourceType: javadoc
---

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
- `boolean addWeatherEffect(Entity entityIn)`
- `protected BlockPos adjustPosToNearbyEntity(BlockPos pos)`
- `boolean areAllPlayersAsleep()`
- `boolean canCreatureTypeSpawnHere(EnumCreatureType creatureType, Biome.SpawnListEntry spawnListEntry, BlockPos pos)`
- `boolean canMineBlockBody(EntityPlayer player, BlockPos pos)`
- `protected void createBonusChest()`
- `protected IChunkProvider createChunkProvider()`
- `BlockPos findNearestStructure(java.lang.String p_190528_1_, BlockPos p_190528_2_, boolean p_190528_3_)`
- `void flush()`
- `void flushToDisk()`
- `AdvancementManager getAdvancementManager()`
- `ChunkProviderServer getChunkProvider()`
- `java.io.File getChunkSaveLocation()`
- `Teleporter getDefaultTeleporter()`
- `Entity getEntityFromUuid(java.util.UUID uuid)`
- `EntityTracker getEntityTracker()`
- `FunctionManager getFunctionManager()`
- `MinecraftServer getMinecraftServer()`
- `java.util.List<NextTickListEntry> getPendingBlockUpdates(Chunk chunkIn, boolean remove)`
- `java.util.List<NextTickListEntry> getPendingBlockUpdates(StructureBoundingBox structureBB, boolean remove)`
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
- `void saveAllChunks(boolean all, IProgressUpdate progressCallback)`
- `protected void saveLevel()`
- `void scheduleBlockUpdate(BlockPos pos, Block blockIn, int delay, int priority)`
- `void scheduleUpdate(BlockPos pos, Block blockIn, int delay)`
- `void setEntityState(Entity entityIn, byte state)`
- `void setInitialSpawnLocation()`
- `boolean spawnEntity(Entity entityIn)`
- `void spawnParticle(EntityPlayerMP player, EnumParticleTypes particle, boolean longDistance, double x, double y, double z, int count, double xOffset, double yOffset, double zOffset, double speed, int... arguments)`
- `void spawnParticle(EnumParticleTypes particleType, boolean longDistance, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... particleArguments)`
- `void spawnParticle(EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, int numberOfParticles, double xOffset, double yOffset, double zOffset, double particleSpeed, int... particleArguments)`
- `void tick()`
- `protected void tickPlayers()`
- `boolean tickUpdates(boolean runAllPending)`
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
