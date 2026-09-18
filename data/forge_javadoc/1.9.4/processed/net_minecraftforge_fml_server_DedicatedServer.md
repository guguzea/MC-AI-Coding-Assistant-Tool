# DedicatedServer

## Class signature

```java
public class DedicatedServer extends MinecraftServer implements IServer
```

## Constructors

- `public DedicatedServer(java.io.File anvilFileIn, DataFixer dataFixerIn, com.mojang.authlib.yggdrasil.YggdrasilAuthenticationService authServiceIn, com.mojang.authlib.minecraft.MinecraftSessionService sessionServiceIn, com.mojang.authlib.GameProfileRepository profileRepoIn, PlayerProfileCache profileCacheIn)`

## Methods

- `protected boolean startServer() throws java.io.IOException`
- `public java.lang.String loadResourcePackSHA()`
- `public void setGameType( WorldSettings.GameType gameMode)`
- `public boolean canStructuresSpawn()`
- `public WorldSettings.GameType getGameType()`
- `public EnumDifficulty getDifficulty()`
- `public boolean isHardcore()`
- `protected void finalTick( CrashReport report)`
- `public CrashReport addServerInfoToCrashReport( CrashReport report)`
- `protected void systemExitNow()`
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
- `public java.lang.String shareToLAN( WorldSettings.GameType type, boolean allowCheats)`
- `public boolean isCommandBlockEnabled()`
- `public int getSpawnProtectionSize()`
- `public boolean isBlockProtected( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public int getOpPermissionLevel()`
- `public void setPlayerIdleTimeout(int idleTimeout)`
- `public boolean shouldBroadcastRconToOps()`
- `public boolean shouldBroadcastConsoleToOps()`
- `public boolean isAnnouncingPlayerAchievements()`
- `public int getMaxWorldSize()`
- `public int getNetworkCompressionThreshold()`
- `public void addChatMessage( ITextComponent message)`
- `protected boolean convertFiles() throws java.io.IOException`
- `public long getMaxTickTime()`
- `public java.lang.String getPlugins()`
- `public java.lang.String handleRConCommand(java.lang.String command)`