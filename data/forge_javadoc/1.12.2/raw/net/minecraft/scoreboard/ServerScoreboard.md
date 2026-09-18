---
title: "ServerScoreboard"
description: "public class ServerScoreboard extends Scoreboard"
package: "net/minecraft/scoreboard"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/scoreboard/ServerScoreboard.html"
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

- `public void onScoreUpdated( Score scoreIn)`
- `public void broadcastScoreUpdate(java.lang.String scoreName)`
- `public void broadcastScoreUpdate(java.lang.String scoreName, ScoreObjective objective)`
- `public void setObjectiveInDisplaySlot(int objectiveSlot, ScoreObjective objective)`
- `public boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)`
- `public void removePlayerFromTeam(java.lang.String username, ScorePlayerTeam playerTeam)`
- `public void onScoreObjectiveAdded( ScoreObjective scoreObjectiveIn)`
- `public void onObjectiveDisplayNameChanged( ScoreObjective objective)`
- `public void onScoreObjectiveRemoved( ScoreObjective objective)`
- `public void broadcastTeamCreated( ScorePlayerTeam playerTeam)`
- `public void broadcastTeamInfoUpdate( ScorePlayerTeam playerTeam)`
- `public void broadcastTeamRemove( ScorePlayerTeam playerTeam)`
- `public void addDirtyRunnable(java.lang.Runnable runnable)`
- `protected void markSaveDataDirty()`
- `public java.util.List< Packet <?>> getCreatePackets( ScoreObjective objective)`
- `public void addObjective( ScoreObjective objective)`
- `public java.util.List< Packet <?>> getDestroyPackets( ScoreObjective p_96548_1_)`
- `public void sendDisplaySlotRemovalPackets( ScoreObjective p_96546_1_)`
- `public int getObjectiveDisplaySlotCount( ScoreObjective p_96552_1_)`
