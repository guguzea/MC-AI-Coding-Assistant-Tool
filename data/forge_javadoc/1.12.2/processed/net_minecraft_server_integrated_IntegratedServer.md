# IntegratedServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer → net.minecraft.server.integrated.IntegratedServer

## Class signature

```java
public class IntegratedServer extends MinecraftServer
```

## Methods

- `CrashReport addServerInfoToCrashReport(CrashReport report)`
- `void addServerStatsToSnooper(Snooper playerSnooper)`
- `boolean canStructuresSpawn()`
- `ServerCommandManager createCommandManager()`
- `void finalTick(CrashReport report)`
- `java.io.File getDataDirectory()`
- `EnumDifficulty getDifficulty()`
- `GameType getGameType()`
- `int getOpPermissionLevel()`
- `boolean getPublic()`
- `boolean init()`
- `void initiateShutdown()`
- `boolean isCommandBlockEnabled()`
- `boolean isDedicatedServer()`
- `boolean isHardcore()`
- `boolean isSnooperEnabled()`
- `void loadAllWorlds(java.lang.String saveName, java.lang.String worldNameIn, long seed, WorldType type, java.lang.String generatorOptions)`
- `void saveAllWorlds(boolean isSilent)`
- `void setDifficultyForAllWorlds(EnumDifficulty difficulty)`
- `void setGameType(GameType gameMode)`
- `java.lang.String shareToLAN(GameType type, boolean allowCheats)`
- `boolean shouldBroadcastConsoleToOps()`
- `boolean shouldBroadcastRconToOps()`
- `boolean shouldUseNativeTransport()`
- `void stopServer()`
- `void tick()`

## Fields

- `IntegratedServer`