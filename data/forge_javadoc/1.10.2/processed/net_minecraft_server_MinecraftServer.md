# MinecraftServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer

## Class signature

```java
public abstract class MinecraftServer extends java.lang.Object implements java.lang.Runnable, ICommandSender, IThreadListener, ISnooperInfo
```

## Constructors

- `MinecraftServer(java.io.File anvilFileIn, java.net.Proxy proxyIn, DataFixer dataFixerIn, com.mojang.authlib.yggdrasil.YggdrasilAuthenticationService authServiceIn, com.mojang.authlib.minecraft.MinecraftSessionService sessionServiceIn, com.mojang.authlib.GameProfileRepository profileRepoIn, PlayerProfileCache profileCacheIn)`

## Methods

- `void addChatMessage(ITextComponent component)`
- `com.google.common.util.concurrent.ListenableFuture<java.lang.Object> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `CrashReport addServerInfoToCrashReport(CrashReport report)`
- `void addServerStatsToSnooper(Snooper playerSnooper)`
- `void addServerTypeToSnooper(Snooper playerSnooper)`
- `boolean allowSpawnMonsters()`
- `void applyServerIconToResponse(ServerStatusResponse response)`
- `<V> com.google.common.util.concurrent.ListenableFuture<V> callFromMainThread(java.util.concurrent.Callable<V> callable)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `void canCreateBonusChest(boolean enable)`
- `abstract boolean canStructuresSpawn()`
- `protected void clearCurrentTask()`
- `void convertMapIfNeeded(java.lang.String worldNameIn)`
- `ServerCommandManager createNewCommandManager()`
- `void enableProfiling()`
- `void finalTick(CrashReport report)`
- `ISaveFormat getActiveAnvilConverter()`
- `boolean getAllowNether()`
- `java.lang.String[] getAllUsernames()`
- `int getBuildLimit()`
- `boolean getCanSpawnAnimals()`
- `boolean getCanSpawnNPCs()`
- `ICommandManager getCommandManager()`
- `Entity getCommandSenderEntity()`
- `int getCurrentPlayerCount()`
- `long getCurrentTime()`
- `static long getCurrentTimeMillis()`
- `java.io.File getDataDirectory()`
- `DataFixer getDataFixer()`
- `abstract EnumDifficulty getDifficulty()`
- `ITextComponent getDisplayName()`
- `Entity getEntityFromUuid(java.util.UUID uuid)`
- `World getEntityWorld()`
- `java.io.File getFile(java.lang.String fileName)`
- `java.lang.String getFolderName()`
- `boolean getForceGamemode()`
- `com.mojang.authlib.GameProfileRepository getGameProfileRepository()`
- `com.mojang.authlib.GameProfile[] getGameProfiles()`
- `abstract GameType getGameType()`
- `boolean getGuiEnabled()`
- `java.security.KeyPair getKeyPair()`
- `int getMaxPlayerIdleMinutes()`
- `int getMaxPlayers()`
- `int getMaxWorldSize()`
- `com.mojang.authlib.minecraft.MinecraftSessionService getMinecraftSessionService()`
- `java.lang.String getMinecraftVersion()`
- `java.lang.String getMOTD()`
- `java.lang.String getName()`
- `int getNetworkCompressionThreshold()`
- `NetworkSystem getNetworkSystem()`
- `abstract int getOpPermissionLevel()`
- `PlayerList getPlayerList()`
- `PlayerProfileCache getPlayerProfileCache()`
- `Snooper getPlayerUsageSnooper()`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
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
- `java.io.File getWorldIconFile()`
- `java.lang.String getWorldName()`
- `void initialWorldChunkLoad()`
- `void initiateShutdown()`
- `boolean isAnnouncingPlayerAchievements()`
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
- `void run()`
- `void saveAllWorlds(boolean isSilent)`
- `boolean sendCommandFeedback()`
- `boolean serverIsInRunLoop()`
- `void setAllowFlight(boolean allow)`
- `void setAllowPvp(boolean allowPvp)`
- `void setBuildLimit(int maxBuildHeight)`
- `void setCanSpawnAnimals(boolean spawnAnimals)`
- `void setCanSpawnNPCs(boolean spawnNpcs)`
- `void setCommandStat(CommandResultStats.Type type, int amount)`
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
- `abstract boolean startServer()`
- `void startServerThread()`
- `void stopServer()`
- `void systemExitNow()`
- `void tick()`
- `void updateTimeLightAndEntities()`
- `WorldServer worldServerForDimension(int dimension)`

## Fields

- `ICommandManager commandManager`
- `java.lang.String currentTask`
- `java.util.Queue<java.util.concurrent.FutureTask<?>> futureTaskQueue`
- `int percentDone`
- `protected java.net.Proxy serverProxy`
- `Profiler theProfiler`
- `long[] tickTimeArray`
- `static java.io.File USER_CACHE_FILE`
- `WorldServer [] worldServers`
- `java.util.Hashtable<java.lang.Integer, long[]> worldTickTimes`