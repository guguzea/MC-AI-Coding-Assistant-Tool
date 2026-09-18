---
title: "ServerScoreboard"
description: "Adds a player to the given team"
package: "net/minecraft/scoreboard"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/ServerScoreboard.html"
sourceType: javadoc
---

# ServerScoreboard

## Class signature

```java
public class ServerScoreboard extends Scoreboard
```

## Constructors

- `public ServerScoreboard( MinecraftServer mcServer)`

## Methods

- `public void func_96536_a( Score p_96536_1_)`
- `public void func_96516_a(java.lang.String p_96516_1_)`
- `public void func_178820_a(java.lang.String p_178820_1_, ScoreObjective p_178820_2_)`
- `public void setObjectiveInDisplaySlot(int p_96530_1_, ScoreObjective p_96530_2_)`
- `public boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)`
- `public void removePlayerFromTeam(java.lang.String p_96512_1_, ScorePlayerTeam p_96512_2_)`
- `public void onScoreObjectiveAdded( ScoreObjective scoreObjectiveIn)`
- `public void onObjectiveDisplayNameChanged( ScoreObjective p_96532_1_)`
- `public void onScoreObjectiveRemoved( ScoreObjective p_96533_1_)`
- `public void broadcastTeamCreated( ScorePlayerTeam playerTeam)`
- `public void sendTeamUpdate( ScorePlayerTeam playerTeam)`
- `public void func_96513_c( ScorePlayerTeam playerTeam)`
- `public void func_96547_a( ScoreboardSaveData p_96547_1_)`
- `protected void markSaveDataDirty()`
- `public java.util.List< Packet > func_96550_d( ScoreObjective p_96550_1_)`
- `public void func_96549_e( ScoreObjective p_96549_1_)`
- `public java.util.List< Packet > func_96548_f( ScoreObjective p_96548_1_)`
- `public void sendDisplaySlotRemovalPackets( ScoreObjective p_96546_1_)`
- `public int func_96552_h( ScoreObjective p_96552_1_)`

## Description

Adds a player to the given team
