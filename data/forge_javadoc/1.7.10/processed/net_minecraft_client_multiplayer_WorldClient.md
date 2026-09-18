# WorldClient

## Class signature

```java
public class WorldClient extends World
```

## Constructors

- `public WorldClient( NetHandlerPlayClient p_i45063_1_, WorldSettings p_i45063_2_, int p_i45063_3_, EnumDifficulty p_i45063_4_, Profiler p_i45063_5_)`

## Methods

- `public void tick()`
- `public void invalidateBlockReceiveRegion(int p_73031_1_, int p_73031_2_, int p_73031_3_, int p_73031_4_, int p_73031_5_, int p_73031_6_)`
- `protected IChunkProvider createChunkProvider()`
- `protected void func_147456_g()`
- `public void doPreChunk(int p_73025_1_, int p_73025_2_, boolean p_73025_3_)`
- `public boolean spawnEntityInWorld( Entity p_72838_1_)`
- `public void removeEntity( Entity p_72900_1_)`
- `public void onEntityAdded( Entity p_72923_1_)`
- `public void onEntityRemoved( Entity p_72847_1_)`
- `public void addEntityToWorld(int p_73027_1_, Entity p_73027_2_)`
- `public Entity getEntityByID(int p_73045_1_)`
- `public Entity removeEntityFromWorld(int p_73028_1_)`
- `public boolean func_147492_c(int p_147492_1_, int p_147492_2_, int p_147492_3_, Block p_147492_4_, int p_147492_5_)`
- `public void sendQuittingDisconnectingPacket()`
- `protected void updateWeather()`
- `protected int func_152379_p()`
- `public void doVoidFogParticles(int p_73029_1_, int p_73029_2_, int p_73029_3_)`
- `public void removeAllEntities()`
- `public CrashReportCategory addWorldInfoToCrashReport( CrashReport p_72914_1_)`
- `public void playSound(double p_72980_1_, double p_72980_3_, double p_72980_5_, java.lang.String p_72980_7_, float p_72980_8_, float p_72980_9_, boolean p_72980_10_)`
- `public void makeFireworks(double p_92088_1_, double p_92088_3_, double p_92088_5_, double p_92088_7_, double p_92088_9_, double p_92088_11_, NBTTagCompound p_92088_13_)`
- `public void setWorldScoreboard( Scoreboard p_96443_1_)`
- `public void setWorldTime(long p_72877_1_)`