# WorldClient

**Inheritance:** java.lang.Object → net.minecraft.world.World → net.minecraft.client.multiplayer.WorldClient

## Class signature

```java
public class WorldClient extends World
```

## Methods

- `void addEntityToWorld(int p_73027_1_, Entity p_73027_2_)`
- `CrashReportCategory addWorldInfoToCrashReport(CrashReport p_72914_1_)`
- `protected IChunkProvider createChunkProvider()`
- `void doPreChunk(int p_73025_1_, int p_73025_2_, boolean p_73025_3_)`
- `void doVoidFogParticles(int p_73029_1_, int p_73029_2_, int p_73029_3_)`
- `protected void func_147456_g()`
- `boolean func_147492_c(int p_147492_1_, int p_147492_2_, int p_147492_3_, Block p_147492_4_, int p_147492_5_)`
- `protected int func_152379_p()`
- `Entity getEntityByID(int p_73045_1_)`
- `void invalidateBlockReceiveRegion(int p_73031_1_, int p_73031_2_, int p_73031_3_, int p_73031_4_, int p_73031_5_, int p_73031_6_)`
- `void makeFireworks(double p_92088_1_, double p_92088_3_, double p_92088_5_, double p_92088_7_, double p_92088_9_, double p_92088_11_, NBTTagCompound p_92088_13_)`
- `void onEntityAdded(Entity p_72923_1_)`
- `void onEntityRemoved(Entity p_72847_1_)`
- `void playSound(double p_72980_1_, double p_72980_3_, double p_72980_5_, java.lang.String p_72980_7_, float p_72980_8_, float p_72980_9_, boolean p_72980_10_)`
- `void removeAllEntities()`
- `void removeEntity(Entity p_72900_1_)`
- `Entity removeEntityFromWorld(int p_73028_1_)`
- `void sendQuittingDisconnectingPacket()`
- `void setWorldScoreboard(Scoreboard p_96443_1_)`
- `void setWorldTime(long p_72877_1_)`
- `boolean spawnEntityInWorld(Entity p_72838_1_)`
- `void tick()`
- `protected void updateWeather()`

## Fields

- `WorldClient`