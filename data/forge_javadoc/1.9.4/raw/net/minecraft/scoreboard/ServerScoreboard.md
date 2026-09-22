---
title: "ServerScoreboard"
description: "public class ServerScoreboard extends Scoreboard"
package: "net/minecraft/scoreboard"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/scoreboard/ServerScoreboard.html"
sourceType: javadoc
---

# ServerScoreboard

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Scoreboard → net.minecraft.scoreboard.ServerScoreboard

## Class signature

```java
public class ServerScoreboard extends Scoreboard
```

## Constructors

- `ServerScoreboard(MinecraftServer mcServer)`

## Methods

- `void addDirtyRunnable(java.lang.Runnable runnable)`
- `void addObjective(ScoreObjective objective)`
- `boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)`
- `void broadcastScoreUpdate(java.lang.String scoreName)`
- `void broadcastScoreUpdate(java.lang.String scoreName, ScoreObjective objective)`
- `void broadcastTeamCreated(ScorePlayerTeam playerTeam)`
- `void broadcastTeamInfoUpdate(ScorePlayerTeam playerTeam)`
- `void broadcastTeamRemove(ScorePlayerTeam playerTeam)`
- `java.util.List<Packet<?>> getCreatePackets(ScoreObjective objective)`
- `java.util.List<Packet<?>> getDestroyPackets(ScoreObjective p_96548_1_)`
- `int getObjectiveDisplaySlotCount(ScoreObjective p_96552_1_)`
- `protected void markSaveDataDirty()`
- `void onObjectiveDisplayNameChanged(ScoreObjective objective)`
- `void onScoreObjectiveAdded(ScoreObjective scoreObjectiveIn)`
- `void onScoreObjectiveRemoved(ScoreObjective objective)`
- `void onScoreUpdated(Score scoreIn)`
- `void removePlayerFromTeam(java.lang.String username, ScorePlayerTeam playerTeam)`
- `void sendDisplaySlotRemovalPackets(ScoreObjective p_96546_1_)`
- `void setObjectiveInDisplaySlot(int objectiveSlot, ScoreObjective objective)`
