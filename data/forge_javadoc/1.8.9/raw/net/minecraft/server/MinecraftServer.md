---
title: "MinecraftServer"
description: "public abstract class MinecraftServer extends java.lang.Object implements java.lang.Runnable, ICommandSender, IThreadListener, IPlayerUsage"
package: "net/minecraft/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/MinecraftServer.html"
sourceType: javadoc
---

# MinecraftServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer

## Class signature

```java
public abstract class MinecraftServer extends java.lang.Object implements java.lang.Runnable, ICommandSender, IThreadListener, IPlayerUsage
```

## Constructors

- `MinecraftServer(java.io.File workDir, java.net.Proxy proxy, java.io.File profileCacheDir)`
- `MinecraftServer(java.net.Proxy proxy, java.io.File workDir)`

## Methods

- `void addChatMessage(IChatComponent component)` — Send a chat message to the CommandSender
- `<any> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `CrashReport addServerInfoToCrashReport(CrashReport report)` — Adds the server info, including from theWorldServer, to the crash report.
- `void addServerStatsToSnooper(PlayerUsageSnooper playerSnooper)`
- `void addServerTypeToSnooper(PlayerUsageSnooper playerSnooper)`
- `protected boolean allowSpawnMonsters()`
- `<V><any> callFromMainThread(java.util.concurrent.Callable<V> callable)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)` — Returns true if the CommandSender is allowed to execute the command, false if not
- `void canCreateBonusChest(boolean enable)`
- `abstract boolean canStructuresSpawn()`
- `protected void clearCurrentTask()` — Set current task to null and set its percentage to 0.
- `protected void convertMapIfNeeded(java.lang.String worldNameIn)`
- `protected ServerCommandManager createNewCommandManager()`
- `void deleteWorldAndStopServer()` — WARNING : directly calls getActiveAnvilConverter().deleteWorldDirectory(theWorldServer[0].getSaveHandler().getWorldDirectoryName());
- `void enableProfiling()`
- `protected void finalTick(CrashReport report)` — Called on exit from the main run() loop.
- `ISaveFormat getActiveAnvilConverter()`
- `boolean getAllowNether()`
- `java.lang.String[] getAllUsernames()` — Returns an array of the usernames of all the connected players.
- `int getBuildLimit()`
- `boolean getCanSpawnAnimals()`
- `boolean getCanSpawnNPCs()`
- `ICommandManager getCommandManager()`
- `Entity getCommandSenderEntity()` — Returns the entity associated with the command sender.
- `ServerConfigurationManager getConfigurationManager()`
- `int getCurrentPlayerCount()` — Returns the number of players currently on the server.
- `long getCurrentTime()`
- `static long getCurrentTimeMillis()`
- `java.io.File getDataDirectory()`
- `abstract EnumDifficulty getDifficulty()` — Get the server's difficulty
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `Entity getEntityFromUuid(java.util.UUID uuid)`
- `World getEntityWorld()` — Get the world, if available.
- `java.io.File getFile(java.lang.String fileName)` — Returns a File object from the specified string.
- `java.lang.String getFolderName()`
- `boolean getForceGamemode()`
- `GameProfileRepository getGameProfileRepository()`
- `GameProfile[] getGameProfiles()` — Returns an array of the GameProfiles of all the connected players
- `abstract WorldSettings.GameType getGameType()`
- `boolean getGuiEnabled()`
- `java.lang.String getHostname()` — Returns the server's hostname.
- `java.security.KeyPair getKeyPair()` — Gets KeyPair instanced in MinecraftServer.
- `int getMaxPlayerIdleMinutes()`
- `int getMaxPlayers()` — Returns the maximum number of players allowed on the server.
- `int getMaxWorldSize()`
- `MinecraftSessionService getMinecraftSessionService()`
- `java.lang.String getMinecraftVersion()` — Returns the server's Minecraft version as string.
- `java.lang.String getMotd()` — Returns the server message of the day
- `java.lang.String getMOTD()`
- `java.lang.String getName()` — Get the name of this object.
- `int getNetworkCompressionTreshold()` — The compression treshold.
- `NetworkSystem getNetworkSystem()`
- `abstract int getOpPermissionLevel()`
- `PlayerProfileCache getPlayerProfileCache()`
- `PlayerUsageSnooper getPlayerUsageSnooper()`
- `int getPort()` — Never used, but "getServerPort" is already taken.
- `BlockPos getPosition()` — Get the position in the world.
- `Vec3 getPositionVector()` — Get the position vector.
- `java.lang.String getResourcePackHash()`
- `java.lang.String getResourcePackUrl()`
- `static MinecraftServer getServer()` — Gets mcServer.
- `java.lang.String getServerHostname()` — "getHostname" is already taken, but both return the hostname.
- `java.lang.String getServerModName()`
- `java.lang.String getServerOwner()` — Returns the username of the server owner (for integrated servers)
- `int getServerPort()` — Gets serverPort.
- `java.net.Proxy getServerProxy()`
- `ServerStatusResponse getServerStatusResponse()`
- `java.lang.Thread getServerThread()`
- `int getSpawnProtectionSize()` — Return the spawn protection area's size.
- `java.util.List<java.lang.String> getTabCompletions(ICommandSender sender, java.lang.String input, BlockPos pos)`
- `int getTickCounter()`
- `java.lang.String getUserMessage()`
- `java.lang.String getWorldName()`
- `protected void initialWorldChunkLoad()`
- `void initiateShutdown()` — Sets the serverRunning variable to false, in order to get the server to shut down.
- `boolean isAnnouncingPlayerAchievements()`
- `boolean isAnvilFileSet()`
- `boolean isBlockProtected(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `boolean isCallingFromMinecraftThread()`
- `abstract boolean isCommandBlockEnabled()` — Return whether command blocks are enabled.
- `boolean isDebuggingEnabled()` — Returns true if debugging is enabled, false otherwise.
- `abstract boolean isDedicatedServer()`
- `boolean isDemo()` — Gets whether this is a demo or not.
- `boolean isFlightAllowed()`
- `abstract boolean isHardcore()` — Defaults to false.
- `boolean isPVPEnabled()`
- `boolean isServerInOnlineMode()`
- `boolean isServerRunning()`
- `boolean isServerStopped()`
- `boolean isSinglePlayer()`
- `boolean isSnooperEnabled()` — Returns whether snooping is enabled or not.
- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long seed, WorldType type, java.lang.String p_71247_6_)`
- `void logDebug(java.lang.String msg)` — If isDebuggingEnabled(), logs the message with a level of INFO.
- `void logInfo(java.lang.String msg)` — Logs the message with a level of INFO.
- `void logSevere(java.lang.String msg)` — Logs the error message with a level of SEVERE.
- `void logWarning(java.lang.String msg)` — Logs the message with a level of WARN.
- `static void main(java.lang.String[] p_main_0_)`
- `protected void outputPercentRemaining(java.lang.String message, int percent)` — Used to display a percent remaining given text and the percentage.
- `void refreshStatusNextTick()`
- `void registerTickable(ITickable tickable)`
- `void run()`
- `protected void saveAllWorlds(boolean dontLog)` — par1 indicates if a log message should be output.
- `boolean sendCommandFeedback()` — Returns true if the command sender should be sent feedback about executed commands
- `boolean serverIsInRunLoop()`
- `void setAllowFlight(boolean allow)`
- `void setAllowPvp(boolean allowPvp)`
- `void setBuildLimit(int maxBuildHeight)`
- `void setCanSpawnAnimals(boolean spawnAnimals)`
- `void setCanSpawnNPCs(boolean spawnNpcs)`
- `void setCommandStat(CommandResultStats.Type type, int amount)`
- `void setConfigManager(ServerConfigurationManager configManager)`
- `void setDemo(boolean demo)` — Sets whether this is a demo or not.
- `void setDifficultyForAllWorlds(EnumDifficulty difficulty)`
- `void setFolderName(java.lang.String name)`
- `void setForceGamemode(boolean force)`
- `void setGameType(WorldSettings.GameType gameMode)` — Sets the game type for all worlds.
- `void setHostname(java.lang.String host)`
- `protected void setInstance()`
- `void setKeyPair(java.security.KeyPair keyPair)`
- `void setMOTD(java.lang.String motdIn)`
- `void setOnlineMode(boolean online)`
- `void setPlayerIdleTimeout(int idleTimeout)`
- `void setResourcePack(java.lang.String url, java.lang.String hash)`
- `protected void setResourcePackFromWorld(java.lang.String worldNameIn, ISaveHandler saveHandlerIn)`
- `void setServerOwner(java.lang.String owner)` — Sets the username of the owner of this server (in the case of an integrated server)
- `void setServerPort(int port)`
- `protected void setUserMessage(java.lang.String message)` — Typically "menu.convertingLevel", "menu.loadingLevel" or others.
- `void setWorldName(java.lang.String p_71246_1_)`
- `abstract java.lang.String shareToLAN(WorldSettings.GameType type, boolean allowCheats)` — On dedicated does nothing.
- `abstract boolean shouldBroadcastConsoleToOps()` — Get if console command events should be broadcast to ops
- `abstract boolean shouldBroadcastRconToOps()` — Get if RCON command events should be broadcast to ops
- `abstract boolean shouldUseNativeTransport()` — Get if native transport should be used.
- `protected abstract boolean startServer()` — Initialises the server and starts it.
- `void startServerThread()`
- `void stopServer()` — Saves all necessary data as preparation for stopping the server.
- `protected void systemExitNow()` — Directly calls System.exit(0), instantly killing the program.
- `void tick()` — Main function called by run() every loop.
- `void updateTimeLightAndEntities()`
- `WorldServer worldServerForDimension(int dimension)` — Gets the worldServer by the given dimension.

## Fields

- `protected ICommandManager commandManager`
- `java.lang.String currentTask` — The task the server is currently working on(and will output on outputPercentRemaining).
- `protected java.util.Queue<java.util.concurrent.FutureTask<?>> futureTaskQueue`
- `int percentDone` — The percentage of the current task finished so far.
- `protected java.net.Proxy serverProxy`
- `Profiler theProfiler`
- `long[] tickTimeArray`
- `static java.io.File USER_CACHE_FILE`
- `WorldServer [] worldServers` — The server world instances.
- `java.util.Hashtable<java.lang.Integer, long[]> worldTickTimes`
