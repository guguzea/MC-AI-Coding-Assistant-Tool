# WorldServer

## Class signature

```java
public class WorldServer extends World
```

## Constructors

- `public WorldServer( MinecraftServer p_i45284_1_, ISaveHandler p_i45284_2_, java.lang.String p_i45284_3_, int p_i45284_4_, WorldSettings p_i45284_5_, Profiler p_i45284_6_)`

## Methods

- `public void tick()`
- `public BiomeGenBase.SpawnListEntry spawnRandomCreature( EnumCreatureType p_73057_1_, int p_73057_2_, int p_73057_3_, int p_73057_4_)`
- `public void updateAllPlayersSleepingFlag()`
- `protected void wakeAllPlayers()`
- `public boolean areAllPlayersAsleep()`
- `public void setSpawnLocation()`
- `protected void func_147456_g()`
- `public boolean isBlockTickScheduledThisTick(int p_147477_1_, int p_147477_2_, int p_147477_3_, Block p_147477_4_)`
- `public void scheduleBlockUpdate(int p_147464_1_, int p_147464_2_, int p_147464_3_, Block p_147464_4_, int p_147464_5_)`
- `public void scheduleBlockUpdateWithPriority(int p_147454_1_, int p_147454_2_, int p_147454_3_, Block p_147454_4_, int p_147454_5_, int p_147454_6_)`
- `public void func_147446_b(int p_147446_1_, int p_147446_2_, int p_147446_3_, Block p_147446_4_, int p_147446_5_, int p_147446_6_)`
- `public void updateEntities()`
- `public void resetUpdateEntityTick()`
- `public boolean tickUpdates(boolean p_72955_1_)`
- `public java.util.List getPendingBlockUpdates( Chunk p_72920_1_, boolean p_72920_2_)`
- `public void updateEntityWithOptionalForce( Entity p_72866_1_, boolean p_72866_2_)`
- `protected IChunkProvider createChunkProvider()`
- `public java.util.List func_147486_a(int p_147486_1_, int p_147486_2_, int p_147486_3_, int p_147486_4_, int p_147486_5_, int p_147486_6_)`
- `public boolean canMineBlock( EntityPlayer p_72962_1_, int p_72962_2_, int p_72962_3_, int p_72962_4_)`
- `protected void initialize( WorldSettings p_72963_1_)`
- `protected void createSpawnPosition( WorldSettings p_73052_1_)`
- `protected void createBonusChest()`
- `public ChunkCoordinates getEntrancePortalLocation()`
- `public void saveAllChunks(boolean p_73044_1_, IProgressUpdate p_73044_2_) throws MinecraftException`
- `public void saveChunkData()`
- `protected void saveLevel() throws MinecraftException`
- `public void onEntityAdded( Entity p_72923_1_)`
- `public void onEntityRemoved( Entity p_72847_1_)`
- `public Entity getEntityByID(int p_73045_1_)`
- `public boolean addWeatherEffect( Entity p_72942_1_)`
- `public void setEntityState( Entity p_72960_1_, byte p_72960_2_)`
- `public Explosion newExplosion( Entity p_72885_1_, double p_72885_2_, double p_72885_4_, double p_72885_6_, float p_72885_8_, boolean p_72885_9_, boolean p_72885_10_)`
- `public void addBlockEvent(int p_147452_1_, int p_147452_2_, int p_147452_3_, Block p_147452_4_, int p_147452_5_, int p_147452_6_)`
- `public void flush()`
- `protected void updateWeather()`
- `protected int func_152379_p()`
- `public MinecraftServer func_73046_m()`
- `public EntityTracker getEntityTracker()`
- `public PlayerManager getPlayerManager()`
- `public Teleporter getDefaultTeleporter()`
- `public void func_147487_a(java.lang.String p_147487_1_, double p_147487_2_, double p_147487_4_, double p_147487_6_, int p_147487_8_, double p_147487_9_, double p_147487_11_, double p_147487_13_, double p_147487_15_)`