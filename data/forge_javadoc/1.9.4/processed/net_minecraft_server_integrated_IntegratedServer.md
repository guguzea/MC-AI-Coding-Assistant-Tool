# IntegratedServer

## Class signature

```java
public class IntegratedServer extends MinecraftServer
```

## Constructors

- `public IntegratedServer( Minecraft clientIn, java.lang.String folderNameIn, java.lang.String worldNameIn, WorldSettings worldSettingsIn, com.mojang.authlib.yggdrasil.YggdrasilAuthenticationService authServiceIn, com.mojang.authlib.minecraft.MinecraftSessionService sessionServiceIn, com.mojang.authlib.GameProfileRepository profileRepoIn, PlayerProfileCache profileCacheIn)`

## Methods

- `protected ServerCommandManager createNewCommandManager()`
- `protected void loadAllWorlds(java.lang.String saveName, java.lang.String worldNameIn, long seed, WorldType type, java.lang.String generatorOptions)`
- `protected boolean startServer() throws java.io.IOException`
- `public void tick()`
- `public boolean canStructuresSpawn()`
- `public WorldSettings.GameType getGameType()`
- `public EnumDifficulty getDifficulty()`
- `public boolean isHardcore()`
- `public boolean shouldBroadcastRconToOps()`
- `public boolean shouldBroadcastConsoleToOps()`
- `public void saveAllWorlds(boolean dontLog)`
- `public java.io.File getDataDirectory()`
- `public boolean isDedicatedServer()`
- `public boolean shouldUseNativeTransport()`
- `protected void finalTick( CrashReport report)`
- `public CrashReport addServerInfoToCrashReport( CrashReport report)`
- `public void setDifficultyForAllWorlds( EnumDifficulty difficulty)`
- `public void addServerStatsToSnooper( Snooper playerSnooper)`
- `public boolean isSnooperEnabled()`
- `public java.lang.String shareToLAN( WorldSettings.GameType type, boolean allowCheats)`
- `public void stopServer()`
- `public void initiateShutdown()`
- `public boolean getPublic()`
- `public void setGameType( WorldSettings.GameType gameMode)`
- `public boolean isCommandBlockEnabled()`
- `public int getOpPermissionLevel()`
- `public void reloadLootTables()`