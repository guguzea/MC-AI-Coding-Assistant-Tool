---
title: "IntegratedServer"
description: "public class IntegratedServer extends MinecraftServer"
package: "net/minecraft/server/integrated"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/integrated/IntegratedServer.html"
sourceType: javadoc
---

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
- `ServerCommandManager createNewCommandManager()`
- `void finalTick(CrashReport report)`
- `java.io.File getDataDirectory()`
- `EnumDifficulty getDifficulty()`
- `GameType getGameType()`
- `int getOpPermissionLevel()`
- `boolean getPublic()`
- `void initiateShutdown()`
- `boolean isCommandBlockEnabled()`
- `boolean isDedicatedServer()`
- `boolean isHardcore()`
- `boolean isSnooperEnabled()`
- `void loadAllWorlds(java.lang.String saveName, java.lang.String worldNameIn, long seed, WorldType type, java.lang.String generatorOptions)`
- `void reloadLootTables()`
- `void saveAllWorlds(boolean isSilent)`
- `void setDifficultyForAllWorlds(EnumDifficulty difficulty)`
- `void setGameType(GameType gameMode)`
- `java.lang.String shareToLAN(GameType type, boolean allowCheats)`
- `boolean shouldBroadcastConsoleToOps()`
- `boolean shouldBroadcastRconToOps()`
- `boolean shouldUseNativeTransport()`
- `boolean startServer()`
- `void stopServer()`
- `void tick()`

## Fields

- `IntegratedServer`
