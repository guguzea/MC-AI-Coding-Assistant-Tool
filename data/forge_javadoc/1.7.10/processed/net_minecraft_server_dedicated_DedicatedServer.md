# DedicatedServer

## Class signature

```java
public class DedicatedServer extends MinecraftServer implements IServer
```

## Constructors

- `public DedicatedServer(java.io.File p_i1508_1_)`

## Methods

- `protected boolean startServer() throws java.io.IOException`
- `public boolean canStructuresSpawn()`
- `public WorldSettings.GameType getGameType()`
- `public EnumDifficulty func_147135_j()`
- `public boolean isHardcore()`
- `protected void finalTick( CrashReport p_71228_1_)`
- `public CrashReport addServerInfoToCrashReport( CrashReport p_71230_1_)`
- `protected void systemExitNow()`
- `public void updateTimeLightAndEntities()`
- `public boolean getAllowNether()`
- `public boolean allowSpawnMonsters()`
- `public void addServerStatsToSnooper( PlayerUsageSnooper p_70000_1_)`
- `public boolean isSnooperEnabled()`
- `public void addPendingCommand(java.lang.String p_71331_1_, ICommandSender p_71331_2_)`
- `public void executePendingCommands()`
- `public boolean isDedicatedServer()`
- `public DedicatedPlayerList getConfigurationManager()`
- `public int getIntProperty(java.lang.String p_71327_1_, int p_71327_2_)`
- `public java.lang.String getStringProperty(java.lang.String p_71330_1_, java.lang.String p_71330_2_)`
- `public boolean getBooleanProperty(java.lang.String p_71332_1_, boolean p_71332_2_)`
- `public void setProperty(java.lang.String p_71328_1_, java.lang.Object p_71328_2_)`
- `public void saveProperties()`
- `public java.lang.String getSettingsFilename()`
- `public void setGuiEnabled()`
- `public boolean getGuiEnabled()`
- `public java.lang.String shareToLAN( WorldSettings.GameType p_71206_1_, boolean p_71206_2_)`
- `public boolean isCommandBlockEnabled()`
- `public int getSpawnProtectionSize()`
- `public boolean isBlockProtected( World p_96290_1_, int p_96290_2_, int p_96290_3_, int p_96290_4_, EntityPlayer p_96290_5_)`
- `public int getOpPermissionLevel()`
- `public void func_143006_e(int p_143006_1_)`
- `public boolean func_152363_m()`
- `public boolean func_147136_ar()`
- `protected boolean func_152368_aE() throws java.io.IOException`