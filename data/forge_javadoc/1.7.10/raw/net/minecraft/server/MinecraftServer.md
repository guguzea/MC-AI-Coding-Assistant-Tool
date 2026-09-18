---
title: "MinecraftServer"
description: "public abstract class MinecraftServer extends java.lang.Object implements ICommandSender , java.lang.Runnable, IPlayerUsage"
package: "net/minecraft/server"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/server/MinecraftServer.html"
sourceType: javadoc
---

# MinecraftServer

## Class signature

```java
public abstract class MinecraftServer extends java.lang.Object implements ICommandSender , java.lang.Runnable, IPlayerUsage
```

## Constructors

- `public MinecraftServer(java.io.File p_i45281_1_, java.net.Proxy p_i45281_2_)`

## Methods

- `protected abstract boolean startServer() throws java.io.IOException`
- `protected void convertMapIfNeeded(java.lang.String p_71237_1_)`
- `protected void setUserMessage(java.lang.String p_71192_1_)`
- `public java.lang.String getUserMessage()`
- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long p_71247_3_, WorldType p_71247_5_, java.lang.String p_71247_6_)`
- `protected void initialWorldChunkLoad()`
- `public abstract boolean canStructuresSpawn()`
- `public abstract WorldSettings.GameType getGameType()`
- `public abstract EnumDifficulty func_147135_j()`
- `public abstract boolean isHardcore()`
- `public abstract int getOpPermissionLevel()`
- `public abstract boolean func_152363_m()`
- `protected void outputPercentRemaining(java.lang.String p_71216_1_, int p_71216_2_)`
- `protected void clearCurrentTask()`
- `protected void saveAllWorlds(boolean p_71267_1_)`
- `public void stopServer()`
- `public boolean isServerRunning()`
- `public void initiateShutdown()`
- `public void run()`
- `protected java.io.File getDataDirectory()`
- `protected void finalTick( CrashReport p_71228_1_)`
- `protected void systemExitNow()`
- `public void tick()`
- `public void updateTimeLightAndEntities()`
- `public boolean getAllowNether()`
- `public void startServerThread()`
- `public java.io.File getFile(java.lang.String p_71209_1_)`
- `public void logWarning(java.lang.String p_71236_1_)`
- `public WorldServer worldServerForDimension(int p_71218_1_)`
- `public java.lang.String getMinecraftVersion()`
- `public int getCurrentPlayerCount()`
- `public int getMaxPlayers()`
- `public java.lang.String[] getAllUsernames()`
- `public GameProfile[] func_152357_F()`
- `public java.lang.String getServerModName()`
- `public CrashReport addServerInfoToCrashReport( CrashReport p_71230_1_)`
- `public java.util.List getPossibleCompletions( ICommandSender p_71248_1_, java.lang.String p_71248_2_)`
- `public static MinecraftServer getServer()`
- `public java.lang.String getCommandSenderName()`
- `public void addChatMessage( IChatComponent p_145747_1_)`
- `public boolean canCommandSenderUseCommand(int p_70003_1_, java.lang.String p_70003_2_)`
- `public ICommandManager getCommandManager()`
- `public java.security.KeyPair getKeyPair()`
- `public java.lang.String getServerOwner()`
- `public void setServerOwner(java.lang.String p_71224_1_)`
- `public boolean isSinglePlayer()`
- `public java.lang.String getFolderName()`
- `public void setFolderName(java.lang.String p_71261_1_)`
- `public void setWorldName(java.lang.String p_71246_1_)`
- `public java.lang.String getWorldName()`
- `public void setKeyPair(java.security.KeyPair p_71253_1_)`
- `public void func_147139_a( EnumDifficulty p_147139_1_)`
- `protected boolean allowSpawnMonsters()`
- `public boolean isDemo()`
- `public void setDemo(boolean p_71204_1_)`
- `public void canCreateBonusChest(boolean p_71194_1_)`
- `public ISaveFormat getActiveAnvilConverter()`
- `public void deleteWorldAndStopServer()`
- `public java.lang.String getTexturePack()`
- `public void addServerStatsToSnooper( PlayerUsageSnooper p_70000_1_)`
- `public void addServerTypeToSnooper( PlayerUsageSnooper p_70001_1_)`
- `public boolean isSnooperEnabled()`
- `public abstract boolean isDedicatedServer()`
- `public boolean isServerInOnlineMode()`
- `public void setOnlineMode(boolean p_71229_1_)`
- `public boolean getCanSpawnAnimals()`
- `public void setCanSpawnAnimals(boolean p_71251_1_)`
- `public boolean getCanSpawnNPCs()`
- `public void setCanSpawnNPCs(boolean p_71257_1_)`
- `public boolean isPVPEnabled()`
- `public void setAllowPvp(boolean p_71188_1_)`
- `public boolean isFlightAllowed()`
- `public void setAllowFlight(boolean p_71245_1_)`
- `public abstract boolean isCommandBlockEnabled()`
- `public java.lang.String getMOTD()`
- `public void setMOTD(java.lang.String p_71205_1_)`
- `public int getBuildLimit()`
- `public void setBuildLimit(int p_71191_1_)`
- `public ServerConfigurationManager getConfigurationManager()`
- `public void func_152361_a( ServerConfigurationManager p_152361_1_)`
- `public void setGameType( WorldSettings.GameType p_71235_1_)`
- `public NetworkSystem func_147137_ag()`
- `public boolean serverIsInRunLoop()`
- `public boolean getGuiEnabled()`
- `public abstract java.lang.String shareToLAN( WorldSettings.GameType p_71206_1_, boolean p_71206_2_)`
- `public int getTickCounter()`
- `public void enableProfiling()`
- `public PlayerUsageSnooper getPlayerUsageSnooper()`
- `public ChunkCoordinates getPlayerCoordinates()`
- `public World getEntityWorld()`
- `public int getSpawnProtectionSize()`
- `public boolean isBlockProtected( World p_96290_1_, int p_96290_2_, int p_96290_3_, int p_96290_4_, EntityPlayer p_96290_5_)`
- `public boolean getForceGamemode()`
- `public java.net.Proxy getServerProxy()`
- `public static long getSystemTimeMillis()`
- `public int func_143007_ar()`
- `public void func_143006_e(int p_143006_1_)`
- `public IChatComponent func_145748_c_()`
- `public boolean func_147136_ar()`
- `public MinecraftSessionService func_147130_as()`
- `public GameProfileRepository func_152359_aw()`
- `public PlayerProfileCache func_152358_ax()`
- `public ServerStatusResponse func_147134_at()`
- `public void func_147132_au()`
- `public java.lang.String getServerHostname()`
- `public void setHostname(java.lang.String p_71189_1_)`
- `public void func_82010_a( IUpdatePlayerListBox p_82010_1_)`
- `public static void main(java.lang.String[] p_main_0_)`
- `public void logInfo(java.lang.String p_71244_1_)`
- `public java.lang.String getHostname()`
- `public int getPort()`
- `public java.lang.String getMotd()`
- `public java.lang.String getPlugins()`
- `public java.lang.String handleRConCommand(java.lang.String p_71252_1_)`
- `public boolean isDebuggingEnabled()`
- `public void logSevere(java.lang.String p_71201_1_)`
- `public void logDebug(java.lang.String p_71198_1_)`
- `public int getServerPort()`
- `public void setServerPort(int p_71208_1_)`
- `public void func_155759_m(java.lang.String p_155759_1_)`
