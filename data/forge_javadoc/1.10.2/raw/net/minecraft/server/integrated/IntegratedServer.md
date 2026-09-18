---
title: "IntegratedServer"
description: "public class IntegratedServer extends MinecraftServer"
package: "net/minecraft/server/integrated"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/integrated/IntegratedServer.html"
sourceType: javadoc
---

# IntegratedServer

## Class signature

```java
public class IntegratedServer extends MinecraftServer
```

## Constructors

- `public IntegratedServer( Minecraft clientIn, java.lang.String folderNameIn, java.lang.String worldNameIn, WorldSettings worldSettingsIn, com.mojang.authlib.yggdrasil.YggdrasilAuthenticationService authServiceIn, com.mojang.authlib.minecraft.MinecraftSessionService sessionServiceIn, com.mojang.authlib.GameProfileRepository profileRepoIn, PlayerProfileCache profileCacheIn)`

## Methods

- `public ServerCommandManager createNewCommandManager()`
- `public void loadAllWorlds(java.lang.String saveName, java.lang.String worldNameIn, long seed, WorldType type, java.lang.String generatorOptions)`
- `public boolean startServer() throws java.io.IOException`
- `public void tick()`
- `public boolean canStructuresSpawn()`
- `public GameType getGameType()`
- `public EnumDifficulty getDifficulty()`
- `public boolean isHardcore()`
- `public boolean shouldBroadcastRconToOps()`
- `public boolean shouldBroadcastConsoleToOps()`
- `public void saveAllWorlds(boolean isSilent)`
- `public java.io.File getDataDirectory()`
- `public boolean isDedicatedServer()`
- `public boolean shouldUseNativeTransport()`
- `public void finalTick( CrashReport report)`
- `public CrashReport addServerInfoToCrashReport( CrashReport report)`
- `public void setDifficultyForAllWorlds( EnumDifficulty difficulty)`
- `public void addServerStatsToSnooper( Snooper playerSnooper)`
- `public boolean isSnooperEnabled()`
- `public java.lang.String shareToLAN( GameType type, boolean allowCheats)`
- `public void stopServer()`
- `public void initiateShutdown()`
- `public boolean getPublic()`
- `public void setGameType( GameType gameMode)`
- `public boolean isCommandBlockEnabled()`
- `public int getOpPermissionLevel()`
- `public void reloadLootTables()`
