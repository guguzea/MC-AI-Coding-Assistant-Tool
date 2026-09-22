---
title: "DedicatedServer"
description: "public class DedicatedServer extends MinecraftServer implements IServer"
package: "net/minecraft/server/dedicated"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/dedicated/DedicatedServer.html"
sourceType: javadoc
---

# DedicatedServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer → net.minecraft.server.dedicated.DedicatedServer

## Class signature

```java
public class DedicatedServer extends MinecraftServer implements IServer
```

## Constructors

- `DedicatedServer(java.io.File anvilFileIn, DataFixer dataFixerIn, YggdrasilAuthenticationService authServiceIn, MinecraftSessionService sessionServiceIn, GameProfileRepository profileRepoIn, PlayerProfileCache profileCacheIn)`

## Methods

- `void addPendingCommand(java.lang.String input, ICommandSender sender)`
- `CrashReport addServerInfoToCrashReport(CrashReport report)`
- `void addServerStatsToSnooper(Snooper playerSnooper)`
- `boolean allowSpawnMonsters()`
- `boolean canStructuresSpawn()`
- `protected boolean convertFiles()`
- `void executePendingCommands()`
- `boolean getAllowNether()`
- `boolean getBooleanProperty(java.lang.String key, boolean defaultValue)`
- `EnumDifficulty getDifficulty()`
- `GameType getGameType()`
- `boolean getGuiEnabled()`
- `java.lang.String getHostname()`
- `int getIntProperty(java.lang.String key, int defaultValue)`
- `long getMaxTickTime()`
- `int getMaxWorldSize()`
- `java.lang.String getMotd()`
- `int getNetworkCompressionThreshold()`
- `int getOpPermissionLevel()`
- `DedicatedPlayerList getPlayerList()`
- `java.lang.String getPlugins()`
- `int getPort()`
- `java.lang.String getSettingsFilename()`
- `int getSpawnProtectionSize()`
- `java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)`
- `java.lang.String handleRConCommand(java.lang.String command)`
- `boolean init()`
- `boolean isBlockProtected(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `boolean isCommandBlockEnabled()`
- `boolean isDedicatedServer()`
- `boolean isHardcore()`
- `boolean isSnooperEnabled()`
- `java.lang.String loadResourcePackSHA()`
- `void saveProperties()`
- `void sendMessage(ITextComponent message)`
- `void setGameType(GameType gameMode)`
- `void setGuiEnabled()`
- `void setPlayerIdleTimeout(int idleTimeout)`
- `void setProperty(java.lang.String key, java.lang.Object value)`
- `java.lang.String shareToLAN(GameType type, boolean allowCheats)`
- `boolean shouldBroadcastConsoleToOps()`
- `boolean shouldBroadcastRconToOps()`
- `boolean shouldUseNativeTransport()`
- `void systemExitNow()`
- `void updateTimeLightAndEntities()`

## Fields

- `static boolean allowPlayerLogins`
- `java.util.List<PendingCommand> pendingCommandList`
