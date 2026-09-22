# IntegratedServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer → net.minecraft.server.integrated.IntegratedServer

## Class signature

```java
public class IntegratedServer extends MinecraftServer
```

## Methods

- `CrashReport addServerInfoToCrashReport(CrashReport p_71230_1_)`
- `void addServerStatsToSnooper(PlayerUsageSnooper p_70000_1_)`
- `boolean canStructuresSpawn()`
- `protected void finalTick(CrashReport p_71228_1_)`
- `EnumDifficulty func_147135_j()`
- `boolean func_152363_m()`
- `protected java.io.File getDataDirectory()`
- `WorldSettings.GameType getGameType()`
- `int getOpPermissionLevel()`
- `boolean getPublic()`
- `void initiateShutdown()`
- `boolean isCommandBlockEnabled()`
- `boolean isDedicatedServer()`
- `boolean isHardcore()`
- `boolean isSnooperEnabled()`
- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long p_71247_3_, WorldType p_71247_5_, java.lang.String p_71247_6_)`
- `void setGameType(WorldSettings.GameType p_71235_1_)`
- `java.lang.String shareToLAN(WorldSettings.GameType p_71206_1_, boolean p_71206_2_)`
- `protected boolean startServer()`
- `void stopServer()`
- `void tick()`

## Fields

- `IntegratedServer`