---
title: "DedicatedServer"
description: "public class DedicatedServer extends MinecraftServer implements IServer"
package: "net/minecraft/server/dedicated"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/dedicated/DedicatedServer.html"
sourceType: javadoc
---

# DedicatedServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer → net.minecraft.server.dedicated.DedicatedServer

## Class signature

```java
public class DedicatedServer extends MinecraftServer implements IServer
```

## Constructors

- `DedicatedServer(java.io.File workDir)`

## Methods

- `void addChatMessage(IChatComponent message)` — Send a chat message to the CommandSender
- `void addPendingCommand(java.lang.String input, ICommandSender sender)`
- `CrashReport addServerInfoToCrashReport(CrashReport report)` — Adds the server info, including from theWorldServer, to the crash report.
- `void addServerStatsToSnooper(PlayerUsageSnooper playerSnooper)`
- `boolean allowSpawnMonsters()`
- `boolean canStructuresSpawn()`
- `protected boolean convertFiles()`
- `void executePendingCommands()`
- `protected void finalTick(CrashReport report)` — Called on exit from the main run() loop.
- `boolean getAllowNether()`
- `boolean getBooleanProperty(java.lang.String key, boolean defaultValue)` — Gets a boolean property.
- `DedicatedPlayerList getConfigurationManager()`
- `EnumDifficulty getDifficulty()` — Get the server's difficulty
- `WorldSettings.GameType getGameType()`
- `boolean getGuiEnabled()`
- `int getIntProperty(java.lang.String key, int defaultValue)` — Gets an integer property.
- `long getMaxTickTime()`
- `int getMaxWorldSize()`
- `int getNetworkCompressionTreshold()` — The compression treshold.
- `int getOpPermissionLevel()`
- `java.lang.String getPlugins()` — Used by RCon's Query in the form of "MajorServerMod 1.2.3: MyPlugin 1.3; AnotherPlugin 2.1; AndSoForth 1.0".
- `java.lang.String getSettingsFilename()` — Returns the filename where server properties are stored
- `int getSpawnProtectionSize()` — Return the spawn protection area's size.
- `java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)` — Gets a string property.
- `java.lang.String handleRConCommand(java.lang.String command)` — Handle a command received by an RCon instance
- `boolean isAnnouncingPlayerAchievements()`
- `boolean isBlockProtected(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `boolean isCommandBlockEnabled()` — Return whether command blocks are enabled.
- `boolean isDedicatedServer()`
- `boolean isHardcore()` — Defaults to false.
- `boolean isSnooperEnabled()` — Returns whether snooping is enabled or not.
- `void saveProperties()` — Saves all of the server properties to the properties file.
- `void setGameType(WorldSettings.GameType gameMode)` — Sets the game type for all worlds.
- `void setGuiEnabled()`
- `void setPlayerIdleTimeout(int idleTimeout)`
- `void setProperty(java.lang.String key, java.lang.Object value)` — Saves an Object with the given property name.
- `java.lang.String shareToLAN(WorldSettings.GameType type, boolean allowCheats)` — On dedicated does nothing.
- `boolean shouldBroadcastConsoleToOps()` — Get if console command events should be broadcast to ops
- `boolean shouldBroadcastRconToOps()` — Get if RCON command events should be broadcast to ops
- `boolean shouldUseNativeTransport()` — Get if native transport should be used.
- `protected boolean startServer()` — Initialises the server and starts it.
- `protected void systemExitNow()` — Directly calls System.exit(0), instantly killing the program.
- `void updateTimeLightAndEntities()`

## Fields

- `static boolean allowPlayerLogins`
- `java.util.List<ServerCommand> pendingCommandList`
