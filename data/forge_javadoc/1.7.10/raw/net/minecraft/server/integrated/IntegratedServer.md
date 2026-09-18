---
title: "IntegratedServer"
description: "public class IntegratedServer extends MinecraftServer"
package: "net/minecraft/server/integrated"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/server/integrated/IntegratedServer.html"
sourceType: javadoc
---

# IntegratedServer

## Class signature

```java
public class IntegratedServer extends MinecraftServer
```

## Constructors

- `public IntegratedServer( Minecraft p_i1317_1_, java.lang.String p_i1317_2_, java.lang.String p_i1317_3_, WorldSettings p_i1317_4_)`

## Methods

- `protected void loadAllWorlds(java.lang.String p_71247_1_, java.lang.String p_71247_2_, long p_71247_3_, WorldType p_71247_5_, java.lang.String p_71247_6_)`
- `protected boolean startServer() throws java.io.IOException`
- `public void tick()`
- `public boolean canStructuresSpawn()`
- `public WorldSettings.GameType getGameType()`
- `public EnumDifficulty func_147135_j()`
- `public boolean isHardcore()`
- `public boolean func_152363_m()`
- `protected java.io.File getDataDirectory()`
- `public boolean isDedicatedServer()`
- `protected void finalTick( CrashReport p_71228_1_)`
- `public CrashReport addServerInfoToCrashReport( CrashReport p_71230_1_)`
- `public void addServerStatsToSnooper( PlayerUsageSnooper p_70000_1_)`
- `public boolean isSnooperEnabled()`
- `public java.lang.String shareToLAN( WorldSettings.GameType p_71206_1_, boolean p_71206_2_)`
- `public void stopServer()`
- `public void initiateShutdown()`
- `public boolean getPublic()`
- `public void setGameType( WorldSettings.GameType p_71235_1_)`
- `public boolean isCommandBlockEnabled()`
- `public int getOpPermissionLevel()`
