---
title: "DedicatedServer"
description: "public class DedicatedServer extends MinecraftServer implements IServer"
package: "net/minecraftforge/fml/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/dedicated/DedicatedServer.html"
sourceType: javadoc
---

# DedicatedServer

## Class signature

```java
public class DedicatedServer extends MinecraftServer implements IServer
```

## Constructors

- `public DedicatedServer(java.io.File anvilFileIn, DataFixer dataFixerIn, YggdrasilAuthenticationService authServiceIn, MinecraftSessionService sessionServiceIn, GameProfileRepository profileRepoIn, PlayerProfileCache profileCacheIn)`

## Methods

- `public boolean init() throws java.io.IOException`
- `public java.lang.String loadResourcePackSHA()`
- `public void setGameType( GameType gameMode)`
- `public boolean canStructuresSpawn()`
- `public GameType getGameType()`
- `public EnumDifficulty getDifficulty()`
- `public boolean isHardcore()`
- `public CrashReport addServerInfoToCrashReport( CrashReport report)`
- `public void systemExitNow()`
- `public void updateTimeLightAndEntities()`
- `public boolean getAllowNether()`
- `public boolean allowSpawnMonsters()`
- `public void addServerStatsToSnooper( Snooper playerSnooper)`
- `public boolean isSnooperEnabled()`
- `public void addPendingCommand(java.lang.String input, ICommandSender sender)`
- `public void executePendingCommands()`
- `public boolean isDedicatedServer()`
- `public boolean shouldUseNativeTransport()`
- `public DedicatedPlayerList getPlayerList()`
- `public int getIntProperty(java.lang.String key, int defaultValue)`
- `public java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)`
- `public boolean getBooleanProperty(java.lang.String key, boolean defaultValue)`
- `public void setProperty(java.lang.String key, java.lang.Object value)`
- `public void saveProperties()`
- `public java.lang.String getSettingsFilename()`
- `public java.lang.String getHostname()`
- `public int getPort()`
- `public java.lang.String getMotd()`
- `public void setGuiEnabled()`
- `public boolean getGuiEnabled()`
- `public java.lang.String shareToLAN( GameType type, boolean allowCheats)`
- `public boolean isCommandBlockEnabled()`
- `public int getSpawnProtectionSize()`
- `public boolean isBlockProtected( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public int getOpPermissionLevel()`
- `public void setPlayerIdleTimeout(int idleTimeout)`
- `public boolean shouldBroadcastRconToOps()`
- `public boolean shouldBroadcastConsoleToOps()`
- `public int getMaxWorldSize()`
- `public int getNetworkCompressionThreshold()`
- `public void sendMessage( ITextComponent message)`
- `protected boolean convertFiles() throws java.io.IOException`
- `public long getMaxTickTime()`
- `public java.lang.String getPlugins()`
- `public java.lang.String handleRConCommand(java.lang.String command)`
