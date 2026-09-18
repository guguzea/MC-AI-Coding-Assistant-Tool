# MinecraftServer

## Class signature

```java
public abstract class MinecraftServer extends java.lang.Object implements java.lang.Runnable, ICommandSender , IThreadListener , IPlayerUsage
```

## Constructors

- `public MinecraftServer(java.net.Proxy proxy, java.io.File workDir)`
- `public MinecraftServer(java.io.File workDir, java.net.Proxy proxy, java.io.File profileCacheDir)`

## Methods

- `protected ServerCommandManager createNewCommandManager()`
- `protected abstract boolean startServer() throws java.io.IOException`
- `protected void convertMapIfNeeded(java.lang.String worldNameIn)`
- `protected void setUserMessage(java.lang.String message)`
- `public java.lang.String getUserMessage()`
- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long seed, WorldType type, java.lang.String p_71247_6_)`
- `protected void initialWorldChunkLoad()`
- `protected void setResourcePackFromWorld(java.lang.String worldNameIn, ISaveHandler saveHandlerIn)`
- `public abstract boolean canStructuresSpawn()`
- `public abstract WorldSettings.GameType getGameType()`
- `public abstract EnumDifficulty getDifficulty()`
- `public abstract boolean isHardcore()`
- `public abstract int getOpPermissionLevel()`
- `public abstract boolean shouldBroadcastRconToOps()`
- `public abstract boolean shouldBroadcastConsoleToOps()`
- `protected void outputPercentRemaining(java.lang.String message, int percent)`
- `protected void clearCurrentTask()`
- `protected void saveAllWorlds(boolean dontLog)`
- `public void stopServer()`
- `public boolean isServerRunning()`
- `public void initiateShutdown()`
- `protected void setInstance()`
- `public void run()`
- `public java.io.File getDataDirectory()`
- `protected void finalTick( CrashReport report)`
- `protected void systemExitNow()`
- `public void tick()`
- `public void updateTimeLightAndEntities()`
- `public boolean getAllowNether()`
- `public void startServerThread()`
- `public java.io.File getFile(java.lang.String fileName)`
- `public void logWarning(java.lang.String msg)`
- `public WorldServer worldServerForDimension(int dimension)`
- `public java.lang.String getMinecraftVersion()`
- `public int getCurrentPlayerCount()`
- `public int getMaxPlayers()`
- `public java.lang.String[] getAllUsernames()`
- `public GameProfile[] getGameProfiles()`
- `public java.lang.String getServerModName()`
- `public CrashReport addServerInfoToCrashReport( CrashReport report)`
- `public java.util.List<java.lang.String> getTabCompletions( ICommandSender sender, java.lang.String input, BlockPos pos)`
- `public static MinecraftServer getServer()`
- `public boolean isAnvilFileSet()`
- `public java.lang.String getName()`
- `public void addChatMessage( IChatComponent component)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public ICommandManager getCommandManager()`
- `public java.security.KeyPair getKeyPair()`
- `public java.lang.String getServerOwner()`
- `public void setServerOwner(java.lang.String owner)`
- `public boolean isSinglePlayer()`
- `public java.lang.String getFolderName()`
- `public void setFolderName(java.lang.String name)`
- `public void setWorldName(java.lang.String p_71246_1_)`
- `public java.lang.String getWorldName()`
- `public void setKeyPair(java.security.KeyPair keyPair)`
- `public void setDifficultyForAllWorlds( EnumDifficulty difficulty)`
- `protected boolean allowSpawnMonsters()`
- `public boolean isDemo()`
- `public void setDemo(boolean demo)`
- `public void canCreateBonusChest(boolean enable)`
- `public ISaveFormat getActiveAnvilConverter()`
- `public void deleteWorldAndStopServer()`
- `public java.lang.String getResourcePackUrl()`
- `public java.lang.String getResourcePackHash()`
- `public void setResourcePack(java.lang.String url, java.lang.String hash)`
- `public void addServerStatsToSnooper( PlayerUsageSnooper playerSnooper)`
- `public void addServerTypeToSnooper( PlayerUsageSnooper playerSnooper)`
- `public boolean isSnooperEnabled()`
- `public abstract boolean isDedicatedServer()`
- `public boolean isServerInOnlineMode()`
- `public void setOnlineMode(boolean online)`
- `public boolean getCanSpawnAnimals()`
- `public void setCanSpawnAnimals(boolean spawnAnimals)`
- `public boolean getCanSpawnNPCs()`
- `public abstract boolean shouldUseNativeTransport()`
- `public void setCanSpawnNPCs(boolean spawnNpcs)`
- `public boolean isPVPEnabled()`
- `public void setAllowPvp(boolean allowPvp)`
- `public boolean isFlightAllowed()`
- `public void setAllowFlight(boolean allow)`
- `public abstract boolean isCommandBlockEnabled()`
- `public java.lang.String getMOTD()`
- `public void setMOTD(java.lang.String motdIn)`
- `public int getBuildLimit()`
- `public void setBuildLimit(int maxBuildHeight)`
- `public boolean isServerStopped()`
- `public ServerConfigurationManager getConfigurationManager()`
- `public void setConfigManager( ServerConfigurationManager configManager)`
- `public void setGameType( WorldSettings.GameType gameMode)`
- `public NetworkSystem getNetworkSystem()`
- `public boolean serverIsInRunLoop()`
- `public boolean getGuiEnabled()`
- `public abstract java.lang.String shareToLAN( WorldSettings.GameType type, boolean allowCheats)`
- `public int getTickCounter()`
- `public void enableProfiling()`
- `public PlayerUsageSnooper getPlayerUsageSnooper()`
- `public BlockPos getPosition()`
- `public Vec3 getPositionVector()`
- `public World getEntityWorld()`
- `public Entity getCommandSenderEntity()`
- `public int getSpawnProtectionSize()`
- `public boolean isBlockProtected( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public boolean getForceGamemode()`
- `public java.net.Proxy getServerProxy()`
- `public static long getCurrentTimeMillis()`
- `public int getMaxPlayerIdleMinutes()`
- `public void setPlayerIdleTimeout(int idleTimeout)`
- `public IChatComponent getDisplayName()`
- `public boolean isAnnouncingPlayerAchievements()`
- `public MinecraftSessionService getMinecraftSessionService()`
- `public GameProfileRepository getGameProfileRepository()`
- `public PlayerProfileCache getPlayerProfileCache()`
- `public ServerStatusResponse getServerStatusResponse()`
- `public void refreshStatusNextTick()`
- `public Entity getEntityFromUuid(java.util.UUID uuid)`
- `public boolean sendCommandFeedback()`
- `public void setCommandStat( CommandResultStats.Type type, int amount)`
- `public int getMaxWorldSize()`
- `public <V> <any> callFromMainThread(java.util.concurrent.Callable<V> callable)`

## Description

The task the server is currently working on(and will output on outputPercentRemaining).