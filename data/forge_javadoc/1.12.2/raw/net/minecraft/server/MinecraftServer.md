---
title: "MinecraftServer"
description: "public abstract class MinecraftServer extends java.lang.Object implements ICommandSender, java.lang.Runnable, IThreadListener, ISnooperInfo"
package: "net/minecraft/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/MinecraftServer.html"
sourceType: javadoc
---

# MinecraftServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer

## Class signature

```java
public abstract class MinecraftServer extends java.lang.Object implements ICommandSender, java.lang.Runnable, IThreadListener, ISnooperInfo
```

## Constructors

- `MinecraftServer(java.io.File anvilFileIn, java.net.Proxy proxyIn, DataFixer dataFixerIn, YggdrasilAuthenticationService authServiceIn, MinecraftSessionService sessionServiceIn, GameProfileRepository profileRepoIn, PlayerProfileCache profileCacheIn)`

## Methods

- `<any> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `CrashReport addServerInfoToCrashReport(CrashReport report)`
- `void addServerStatsToSnooper(Snooper playerSnooper)`
- `void addServerTypeToSnooper(Snooper playerSnooper)`
- `boolean allowSpawnMonsters()`
- `void applyServerIconToResponse(ServerStatusResponse response)`
- `<V><any> callFromMainThread(java.util.concurrent.Callable<V> callable)`
- `void canCreateBonusChest(boolean enable)`
- `abstract boolean canStructuresSpawn()`
- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `protected void clearCurrentTask()`
- `void convertMapIfNeeded(java.lang.String worldNameIn)`
- `ServerCommandManager createCommandManager()`
- `void enableProfiling()`
- `void finalTick(CrashReport report)`
- `ISaveFormat getActiveAnvilConverter()`
- `AdvancementManager getAdvancementManager()`
- `boolean getAllowNether()`
- `int getBuildLimit()`
- `boolean getCanSpawnAnimals()`
- `boolean getCanSpawnNPCs()`
- `ICommandManager getCommandManager()`
- `int getCurrentPlayerCount()`
- `long getCurrentTime()`
- `static long getCurrentTimeMillis()`
- `java.io.File getDataDirectory()`
- `DataFixer getDataFixer()`
- `abstract EnumDifficulty getDifficulty()`
- `Entity getEntityFromUuid(java.util.UUID uuid)`
- `World getEntityWorld()`
- `java.io.File getFile(java.lang.String fileName)`
- `java.lang.String getFolderName()`
- `boolean getForceGamemode()`
- `FunctionManager getFunctionManager()`
- `GameProfileRepository getGameProfileRepository()`
- `abstract GameType getGameType()`
- `boolean getGuiEnabled()`
- `java.security.KeyPair getKeyPair()`
- `int getMaxPlayerIdleMinutes()`
- `int getMaxPlayers()`
- `int getMaxWorldSize()`
- `MinecraftSessionService getMinecraftSessionService()`
- `java.lang.String getMinecraftVersion()`
- `java.lang.String getMOTD()`
- `java.lang.String getName()`
- `int getNetworkCompressionThreshold()`
- `NetworkSystem getNetworkSystem()`
- `java.lang.String[] getOnlinePlayerNames()`
- `GameProfile[] getOnlinePlayerProfiles()`
- `abstract int getOpPermissionLevel()`
- `PlayerList getPlayerList()`
- `PlayerProfileCache getPlayerProfileCache()`
- `Snooper getPlayerUsageSnooper()`
- `boolean getPreventProxyConnections()`
- `java.lang.String getResourcePackHash()`
- `java.lang.String getResourcePackUrl()`
- `MinecraftServer getServer()`
- `java.lang.String getServerHostname()`
- `java.lang.String getServerModName()`
- `java.lang.String getServerOwner()`
- `int getServerPort()`
- `java.net.Proxy getServerProxy()`
- `ServerStatusResponse getServerStatusResponse()`
- `java.lang.Thread getServerThread()`
- `int getSpawnProtectionSize()`
- `int getSpawnRadius(WorldServer worldIn)`
- `java.util.List<java.lang.String> getTabCompletions(ICommandSender sender, java.lang.String input, BlockPos pos, boolean hasTargetBlock)`
- `int getTickCounter()`
- `java.lang.String getUserMessage()`
- `WorldServer getWorld(int dimension)`
- `java.io.File getWorldIconFile()`
- `java.lang.String getWorldName()`
- `abstract boolean init()`
- `void initialWorldChunkLoad()`
- `void initiateShutdown()`
- `boolean isAnvilFileSet()`
- `boolean isBlockProtected(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `boolean isCallingFromMinecraftThread()`
- `abstract boolean isCommandBlockEnabled()`
- `boolean isDebuggingEnabled()`
- `abstract boolean isDedicatedServer()`
- `boolean isDemo()`
- `boolean isFlightAllowed()`
- `abstract boolean isHardcore()`
- `boolean isPVPEnabled()`
- `boolean isServerInOnlineMode()`
- `boolean isServerRunning()`
- `boolean isServerStopped()`
- `boolean isSinglePlayer()`
- `boolean isSnooperEnabled()`
- `boolean isWorldIconSet()`
- `void loadAllWorlds(java.lang.String saveName, java.lang.String worldNameIn, long seed, WorldType type, java.lang.String generatorOptions)`
- `void logDebug(java.lang.String msg)`
- `void logInfo(java.lang.String msg)`
- `void logSevere(java.lang.String msg)`
- `void logWarning(java.lang.String msg)`
- `static void main(java.lang.String[] p_main_0_)`
- `protected void outputPercentRemaining(java.lang.String message, int percent)`
- `void refreshStatusNextTick()`
- `void registerTickable(ITickable tickable)`
- `void reload()`
- `void run()`
- `void saveAllWorlds(boolean isSilent)`
- `boolean sendCommandFeedback()`
- `void sendMessage(ITextComponent component)`
- `boolean serverIsInRunLoop()`
- `void setAllowFlight(boolean allow)`
- `void setAllowPvp(boolean allowPvp)`
- `void setBuildLimit(int maxBuildHeight)`
- `void setCanSpawnAnimals(boolean spawnAnimals)`
- `void setCanSpawnNPCs(boolean spawnNpcs)`
- `void setDemo(boolean demo)`
- `void setDifficultyForAllWorlds(EnumDifficulty difficulty)`
- `void setFolderName(java.lang.String name)`
- `void setForceGamemode(boolean force)`
- `void setGameType(GameType gameMode)`
- `void setHostname(java.lang.String host)`
- `void setKeyPair(java.security.KeyPair keyPair)`
- `void setMOTD(java.lang.String motdIn)`
- `void setOnlineMode(boolean online)`
- `void setPlayerIdleTimeout(int idleTimeout)`
- `void setPlayerList(PlayerList list)`
- `void setPreventProxyConnections(boolean p_190517_1_)`
- `void setResourcePack(java.lang.String url, java.lang.String hash)`
- `void setResourcePackFromWorld(java.lang.String worldNameIn, ISaveHandler saveHandlerIn)`
- `void setServerOwner(java.lang.String owner)`
- `void setServerPort(int port)`
- `protected void setUserMessage(java.lang.String message)`
- `void setWorldName(java.lang.String worldNameIn)`
- `abstract java.lang.String shareToLAN(GameType type, boolean allowCheats)`
- `abstract boolean shouldBroadcastConsoleToOps()`
- `abstract boolean shouldBroadcastRconToOps()`
- `abstract boolean shouldUseNativeTransport()`
- `void startServerThread()`
- `void stopServer()`
- `void systemExitNow()`
- `void tick()`
- `void updateTimeLightAndEntities()`

## Fields

- `ICommandManager commandManager`
- `java.lang.String currentTask`
- `protected long currentTime`
- `java.util.Queue<java.util.concurrent.FutureTask<?>> futureTaskQueue`
- `int percentDone`
- `Profiler profiler`
- `protected java.net.Proxy serverProxy`
- `long[] tickTimeArray`
- `static java.io.File USER_CACHE_FILE`
- `WorldServer [] worlds`
- `java.util.Hashtable<java.lang.Integer, long[]> worldTickTimes`
