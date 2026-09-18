# IntegratedServer

## Class signature

```java
public class IntegratedServer extends MinecraftServer
```

## Constructors

- `public IntegratedServer( Minecraft mcIn)`
- `public IntegratedServer( Minecraft mcIn, java.lang.String folderName, java.lang.String worldName, WorldSettings settings)`

## Methods

- `protected ServerCommandManager createNewCommandManager()`
- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long seed, WorldType type, java.lang.String p_71247_6_)`
- `protected boolean startServer() throws java.io.IOException`
- `public void tick()`
- `public boolean canStructuresSpawn()`
- `public WorldSettings.GameType getGameType()`
- `public EnumDifficulty getDifficulty()`
- `public boolean isHardcore()`
- `public boolean shouldBroadcastRconToOps()`
- `public boolean shouldBroadcastConsoleToOps()`
- `public java.io.File getDataDirectory()`
- `public boolean isDedicatedServer()`
- `public boolean shouldUseNativeTransport()`
- `protected void finalTick( CrashReport report)`
- `public CrashReport addServerInfoToCrashReport( CrashReport report)`
- `public void setDifficultyForAllWorlds( EnumDifficulty difficulty)`
- `public void addServerStatsToSnooper( PlayerUsageSnooper playerSnooper)`
- `public boolean isSnooperEnabled()`
- `public java.lang.String shareToLAN( WorldSettings.GameType type, boolean allowCheats)`
- `public void stopServer()`
- `public void initiateShutdown()`
- `public void setStaticInstance()`
- `public boolean getPublic()`
- `public void setGameType( WorldSettings.GameType gameMode)`
- `public boolean isCommandBlockEnabled()`
- `public int getOpPermissionLevel()`

## Description

Adds the server info, including from theWorldServer, to the crash report.