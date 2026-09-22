# IntegratedServer

**Inheritance:** java.lang.Object → net.minecraft.server.MinecraftServer → net.minecraft.server.integrated.IntegratedServer

## Class signature

```java
public class IntegratedServer extends MinecraftServer
```

## Methods

- `CrashReport addServerInfoToCrashReport(CrashReport report)` — Adds the server info, including from theWorldServer, to the crash report.
- `void addServerStatsToSnooper(PlayerUsageSnooper playerSnooper)`
- `boolean canStructuresSpawn()`
- `protected ServerCommandManager createNewCommandManager()`
- `protected void finalTick(CrashReport report)` — Called on exit from the main run() loop.
- `java.io.File getDataDirectory()`
- `EnumDifficulty getDifficulty()` — Get the server's difficulty
- `WorldSettings.GameType getGameType()`
- `int getOpPermissionLevel()`
- `boolean getPublic()` — Returns true if this integrated server is open to LAN
- `void initiateShutdown()` — Sets the serverRunning variable to false, in order to get the server to shut down.
- `boolean isCommandBlockEnabled()` — Return whether command blocks are enabled.
- `boolean isDedicatedServer()`
- `boolean isHardcore()` — Defaults to false.
- `boolean isSnooperEnabled()` — Returns whether snooping is enabled or not.
- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long seed, WorldType type, java.lang.String p_71247_6_)`
- `void setDifficultyForAllWorlds(EnumDifficulty difficulty)`
- `void setGameType(WorldSettings.GameType gameMode)` — Sets the game type for all worlds.
- `void setStaticInstance()`
- `java.lang.String shareToLAN(WorldSettings.GameType type, boolean allowCheats)` — On dedicated does nothing.
- `boolean shouldBroadcastConsoleToOps()` — Get if console command events should be broadcast to ops
- `boolean shouldBroadcastRconToOps()` — Get if RCON command events should be broadcast to ops
- `boolean shouldUseNativeTransport()` — Get if native transport should be used.
- `protected boolean startServer()` — Initialises the server and starts it.
- `void stopServer()` — Saves all necessary data as preparation for stopping the server.
- `void tick()` — Main function called by run() every loop.

## Fields

- `IntegratedServer`
- `IntegratedServer`