---
title: "WorldServer"
description: "public class WorldServer extends World"
package: "net/minecraft/world"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/WorldServer.html"
sourceType: javadoc
---

# WorldServer

**Inheritance:** java.lang.Object → net.minecraft.world.World → net.minecraft.world.WorldServer

## Class signature

```java
public class WorldServer extends World
```

## Constructors

- `WorldServer(MinecraftServer p_i45284_1_, ISaveHandler p_i45284_2_, java.lang.String p_i45284_3_, int p_i45284_4_, WorldSettings p_i45284_5_, Profiler p_i45284_6_)`

## Methods

- `void addBlockEvent(int p_147452_1_, int p_147452_2_, int p_147452_3_, Block p_147452_4_, int p_147452_5_, int p_147452_6_)`
- `boolean addWeatherEffect(Entity p_72942_1_)`
- `boolean areAllPlayersAsleep()`
- `boolean canMineBlock(EntityPlayer p_72962_1_, int p_72962_2_, int p_72962_3_, int p_72962_4_)`
- `protected void createBonusChest()`
- `protected IChunkProvider createChunkProvider()`
- `protected void createSpawnPosition(WorldSettings p_73052_1_)`
- `void flush()`
- `void func_147446_b(int p_147446_1_, int p_147446_2_, int p_147446_3_, Block p_147446_4_, int p_147446_5_, int p_147446_6_)`
- `protected void func_147456_g()`
- `java.util.List func_147486_a(int p_147486_1_, int p_147486_2_, int p_147486_3_, int p_147486_4_, int p_147486_5_, int p_147486_6_)`
- `void func_147487_a(java.lang.String p_147487_1_, double p_147487_2_, double p_147487_4_, double p_147487_6_, int p_147487_8_, double p_147487_9_, double p_147487_11_, double p_147487_13_, double p_147487_15_)`
- `protected int func_152379_p()`
- `MinecraftServer func_73046_m()`
- `Teleporter getDefaultTeleporter()`
- `Entity getEntityByID(int p_73045_1_)`
- `EntityTracker getEntityTracker()`
- `ChunkCoordinates getEntrancePortalLocation()`
- `java.util.List getPendingBlockUpdates(Chunk p_72920_1_, boolean p_72920_2_)`
- `PlayerManager getPlayerManager()`
- `protected void initialize(WorldSettings p_72963_1_)`
- `boolean isBlockTickScheduledThisTick(int p_147477_1_, int p_147477_2_, int p_147477_3_, Block p_147477_4_)`
- `Explosion newExplosion(Entity p_72885_1_, double p_72885_2_, double p_72885_4_, double p_72885_6_, float p_72885_8_, boolean p_72885_9_, boolean p_72885_10_)`
- `void onEntityAdded(Entity p_72923_1_)`
- `void onEntityRemoved(Entity p_72847_1_)`
- `void resetUpdateEntityTick()`
- `void saveAllChunks(boolean p_73044_1_, IProgressUpdate p_73044_2_)`
- `void saveChunkData()`
- `protected void saveLevel()`
- `void scheduleBlockUpdate(int p_147464_1_, int p_147464_2_, int p_147464_3_, Block p_147464_4_, int p_147464_5_)`
- `void scheduleBlockUpdateWithPriority(int p_147454_1_, int p_147454_2_, int p_147454_3_, Block p_147454_4_, int p_147454_5_, int p_147454_6_)`
- `void setEntityState(Entity p_72960_1_, byte p_72960_2_)`
- `void setSpawnLocation()`
- `BiomeGenBase.SpawnListEntry spawnRandomCreature(EnumCreatureType p_73057_1_, int p_73057_2_, int p_73057_3_, int p_73057_4_)`
- `void tick()`
- `boolean tickUpdates(boolean p_72955_1_)`
- `void updateAllPlayersSleepingFlag()`
- `void updateEntities()`
- `void updateEntityWithOptionalForce(Entity p_72866_1_, boolean p_72866_2_)`
- `protected void updateWeather()`
- `protected void wakeAllPlayers()`

## Fields

- `static WeightedRandomChestContent [] bonusChestContent`
- `boolean levelSaving`
- `ChunkProviderServer theChunkProviderServer`
