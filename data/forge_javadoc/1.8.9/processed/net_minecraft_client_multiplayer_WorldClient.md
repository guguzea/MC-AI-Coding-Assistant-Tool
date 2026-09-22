# WorldClient

**Inheritance:** java.lang.Object → net.minecraft.world.World → net.minecraft.client.multiplayer.WorldClient

## Class signature

```java
public class WorldClient extends World
```

## Methods

- `void addEntityToWorld(int p_73027_1_, Entity p_73027_2_)` — Add an ID to Entity mapping to entityHashSet
- `CrashReportCategory addWorldInfoToCrashReport(CrashReport report)` — Adds some basic stats of the world to the given crash report.
- `protected IChunkProvider createChunkProvider()` — Creates the chunk provider for this world.
- `void doPreChunk(int p_73025_1_, int p_73025_2_, boolean p_73025_3_)`
- `void doVoidFogParticles(int p_73029_1_, int p_73029_2_, int p_73029_3_)`
- `Entity getEntityByID(int id)` — Returns the Entity with the given ID, or null if it doesn't exist in this World.
- `protected int getRenderDistanceChunks()`
- `void invalidateBlockReceiveRegion(int p_73031_1_, int p_73031_2_, int p_73031_3_, int p_73031_4_, int p_73031_5_, int p_73031_6_)` — Invalidates an AABB region of blocks from the receive queue, in the event that the block has been modified client-side in the intervening 80 receive ticks.
- `boolean invalidateRegionAndSetBlock(BlockPos p_180503_1_, IBlockState p_180503_2_)`
- `void makeFireworks(double x, double y, double z, double motionX, double motionY, double motionZ, NBTTagCompound compund)`
- `void onEntityAdded(Entity entityIn)`
- `void onEntityRemoved(Entity entityIn)`
- `void playSound(double x, double y, double z, java.lang.String soundName, float volume, float pitch, boolean distanceDelay)` — par8 is loudness, all pars passed to minecraftInstance.sndManager.playSound
- `void playSoundAtPos(BlockPos p_175731_1_, java.lang.String p_175731_2_, float p_175731_3_, float p_175731_4_, boolean p_175731_5_)` — Plays a sound at the specified position.
- `void removeAllEntities()` — also releases skins.
- `void removeEntity(Entity entityIn)` — Schedule the entity for removal during the next tick.
- `Entity removeEntityFromWorld(int p_73028_1_)`
- `void sendQuittingDisconnectingPacket()` — If on MP, sends a quitting packet.
- `void setWorldScoreboard(Scoreboard p_96443_1_)`
- `void setWorldTime(long time)` — Sets the world time.
- `boolean spawnEntityInWorld(Entity entityIn)` — Called when an entity is spawned in the world.
- `void tick()` — Runs a single tick for the world
- `protected void updateBlocks()`
- `protected void updateWeather()` — Updates all weather states.

## Fields

- `WorldClient`