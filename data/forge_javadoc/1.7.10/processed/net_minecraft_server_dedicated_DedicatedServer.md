# DedicatedServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer → net.minecraft.server.dedicated.DedicatedServer

## Class signature

```java
public class DedicatedServer extends MinecraftServer implements IServer
```

## Constructors

- `DedicatedServer(java.io.File p_i1508_1_)`

## Methods

- `void addPendingCommand(java.lang.String p_71331_1_, ICommandSender p_71331_2_)`
- `CrashReport addServerInfoToCrashReport(CrashReport p_71230_1_)`
- `void addServerStatsToSnooper(PlayerUsageSnooper p_70000_1_)`
- `boolean allowSpawnMonsters()`
- `boolean canStructuresSpawn()`
- `void executePendingCommands()`
- `protected void finalTick(CrashReport p_71228_1_)`
- `void func_143006_e(int p_143006_1_)`
- `EnumDifficulty func_147135_j()`
- `boolean func_147136_ar()`
- `boolean func_152363_m()`
- `protected boolean func_152368_aE()`
- `boolean getAllowNether()`
- `boolean getBooleanProperty(java.lang.String p_71332_1_, boolean p_71332_2_)`
- `DedicatedPlayerList getConfigurationManager()`
- `WorldSettings.GameType getGameType()`
- `boolean getGuiEnabled()`
- `int getIntProperty(java.lang.String p_71327_1_, int p_71327_2_)`
- `int getOpPermissionLevel()`
- `java.lang.String getSettingsFilename()`
- `int getSpawnProtectionSize()`
- `java.lang.String getStringProperty(java.lang.String p_71330_1_, java.lang.String p_71330_2_)`
- `boolean isBlockProtected(World p_96290_1_, int p_96290_2_, int p_96290_3_, int p_96290_4_, EntityPlayer p_96290_5_)`
- `boolean isCommandBlockEnabled()`
- `boolean isDedicatedServer()`
- `boolean isHardcore()`
- `boolean isSnooperEnabled()`
- `void saveProperties()`
- `void setGuiEnabled()`
- `void setProperty(java.lang.String p_71328_1_, java.lang.Object p_71328_2_)`
- `java.lang.String shareToLAN(WorldSettings.GameType p_71206_1_, boolean p_71206_2_)`
- `protected boolean startServer()`
- `protected void systemExitNow()`
- `void updateTimeLightAndEntities()`

## Fields

- `static boolean allowPlayerLogins`
- `java.util.List pendingCommandList`