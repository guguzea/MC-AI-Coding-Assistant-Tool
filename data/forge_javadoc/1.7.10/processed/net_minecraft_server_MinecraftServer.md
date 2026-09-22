# MinecraftServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer

## Class signature

```java
public abstract class MinecraftServer extends java.lang.Object implements ICommandSender, java.lang.Runnable, IPlayerUsage
```

## Constructors

- `MinecraftServer(java.io.File p_i45281_1_, java.net.Proxy p_i45281_2_)`

## Methods

- `void addChatMessage(IChatComponent p_145747_1_)`
- `CrashReport addServerInfoToCrashReport(CrashReport p_71230_1_)`
- `void addServerStatsToSnooper(PlayerUsageSnooper p_70000_1_)`
- `void addServerTypeToSnooper(PlayerUsageSnooper p_70001_1_)`
- `protected boolean allowSpawnMonsters()`
- `boolean canCommandSenderUseCommand(int p_70003_1_, java.lang.String p_70003_2_)`
- `void canCreateBonusChest(boolean p_71194_1_)`
- `abstract boolean canStructuresSpawn()`
- `protected void clearCurrentTask()`
- `protected void convertMapIfNeeded(java.lang.String p_71237_1_)`
- `void deleteWorldAndStopServer()`
- `void enableProfiling()`
- `protected void finalTick(CrashReport p_71228_1_)`
- `void func_143006_e(int p_143006_1_)`
- `int func_143007_ar()`
- `IChatComponent func_145748_c_()`
- `MinecraftSessionService func_147130_as()`
- `void func_147132_au()`
- `ServerStatusResponse func_147134_at()`
- `abstract EnumDifficulty func_147135_j()`
- `boolean func_147136_ar()`
- `NetworkSystem func_147137_ag()`
- `void func_147139_a(EnumDifficulty p_147139_1_)`
- `GameProfile[] func_152357_F()`
- `PlayerProfileCache func_152358_ax()`
- `GameProfileRepository func_152359_aw()`
- `void func_152361_a(ServerConfigurationManager p_152361_1_)`
- `abstract boolean func_152363_m()`
- `void func_155759_m(java.lang.String p_155759_1_)`
- `void func_82010_a(IUpdatePlayerListBox p_82010_1_)`
- `ISaveFormat getActiveAnvilConverter()`
- `boolean getAllowNether()`
- `java.lang.String[] getAllUsernames()`
- `int getBuildLimit()`
- `boolean getCanSpawnAnimals()`
- `boolean getCanSpawnNPCs()`
- `ICommandManager getCommandManager()`
- `java.lang.String getCommandSenderName()`
- `ServerConfigurationManager getConfigurationManager()`
- `int getCurrentPlayerCount()`
- `protected java.io.File getDataDirectory()`
- `World getEntityWorld()`
- `java.io.File getFile(java.lang.String p_71209_1_)`
- `java.lang.String getFolderName()`
- `boolean getForceGamemode()`
- `abstract WorldSettings.GameType getGameType()`
- `boolean getGuiEnabled()`
- `java.lang.String getHostname()`
- `java.security.KeyPair getKeyPair()`
- `int getMaxPlayers()`
- `java.lang.String getMinecraftVersion()`
- `java.lang.String getMotd()`
- `java.lang.String getMOTD()`
- `abstract int getOpPermissionLevel()`
- `ChunkCoordinates getPlayerCoordinates()`
- `PlayerUsageSnooper getPlayerUsageSnooper()`
- `java.lang.String getPlugins()`
- `int getPort()`
- `java.util.List getPossibleCompletions(ICommandSender p_71248_1_, java.lang.String p_71248_2_)`
- `static MinecraftServer getServer()`
- `java.lang.String getServerHostname()`
- `java.lang.String getServerModName()`
- `java.lang.String getServerOwner()`
- `int getServerPort()`
- `java.net.Proxy getServerProxy()`
- `int getSpawnProtectionSize()`
- `static long getSystemTimeMillis()`
- `java.lang.String getTexturePack()`
- `int getTickCounter()`
- `java.lang.String getUserMessage()`
- `java.lang.String getWorldName()`
- `java.lang.String handleRConCommand(java.lang.String p_71252_1_)`
- `protected void initialWorldChunkLoad()`
- `void initiateShutdown()`
- `boolean isBlockProtected(World p_96290_1_, int p_96290_2_, int p_96290_3_, int p_96290_4_, EntityPlayer p_96290_5_)`
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
- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long p_71247_3_, WorldType p_71247_5_, java.lang.String p_71247_6_)`
- `void logDebug(java.lang.String p_71198_1_)`
- `void logInfo(java.lang.String p_71244_1_)`
- `void logSevere(java.lang.String p_71201_1_)`
- `void logWarning(java.lang.String p_71236_1_)`
- `static void main(java.lang.String[] p_main_0_)`
- `protected void outputPercentRemaining(java.lang.String p_71216_1_, int p_71216_2_)`
- `void run()`
- `protected void saveAllWorlds(boolean p_71267_1_)`
- `boolean serverIsInRunLoop()`
- `void setAllowFlight(boolean p_71245_1_)`
- `void setAllowPvp(boolean p_71188_1_)`
- `void setBuildLimit(int p_71191_1_)`
- `void setCanSpawnAnimals(boolean p_71251_1_)`
- `void setCanSpawnNPCs(boolean p_71257_1_)`
- `void setDemo(boolean p_71204_1_)`
- `void setFolderName(java.lang.String p_71261_1_)`
- `void setForceGamemode(boolean p_104055_1_)`
- `void setGameType(WorldSettings.GameType p_71235_1_)`
- `void setHostname(java.lang.String p_71189_1_)`
- `void setKeyPair(java.security.KeyPair p_71253_1_)`
- `void setMOTD(java.lang.String p_71205_1_)`
- `void setOnlineMode(boolean p_71229_1_)`
- `void setServerOwner(java.lang.String p_71224_1_)`
- `void setServerPort(int p_71208_1_)`
- `protected void setUserMessage(java.lang.String p_71192_1_)`
- `void setWorldName(java.lang.String p_71246_1_)`
- `abstract java.lang.String shareToLAN(WorldSettings.GameType p_71206_1_, boolean p_71206_2_)`
- `protected abstract boolean startServer()`
- `void startServerThread()`
- `void stopServer()`
- `protected void systemExitNow()`
- `void tick()`
- `void updateTimeLightAndEntities()`
- `WorldServer worldServerForDimension(int p_71218_1_)`

## Fields

- `java.lang.String currentTask`
- `static java.io.File field_152367_a`
- `int percentDone`
- `protected java.net.Proxy serverProxy`
- `Profiler theProfiler`
- `long[] tickTimeArray`
- `long[][] timeOfLastDimensionTick`
- `WorldServer [] worldServers`