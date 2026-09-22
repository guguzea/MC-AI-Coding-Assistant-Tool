---
title: "Scoreboard"
description: "public class Scoreboard extends java.lang.Object"
package: "net/minecraft/scoreboard"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/scoreboard/Scoreboard.html"
sourceType: javadoc
---

# Scoreboard

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Scoreboard

## Class signature

```java
public class Scoreboard extends java.lang.Object
```

## Constructors

- `Scoreboard()`

## Methods

- `boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)`
- `ScoreObjective addScoreObjective(java.lang.String name, IScoreCriteria criteria)`
- `void broadcastScoreUpdate(java.lang.String scoreName)`
- `void broadcastScoreUpdate(java.lang.String scoreName, ScoreObjective objective)`
- `void broadcastTeamCreated(ScorePlayerTeam playerTeam)`
- `void broadcastTeamInfoUpdate(ScorePlayerTeam playerTeam)`
- `void broadcastTeamRemove(ScorePlayerTeam playerTeam)`
- `ScorePlayerTeam createTeam(java.lang.String name)`
- `boolean entityHasObjective(java.lang.String name, ScoreObjective objective)`
- `static java.lang.String[] getDisplaySlotStrings()`
- `ScoreObjective getObjective(java.lang.String name)`
- `static java.lang.String getObjectiveDisplaySlot(int id)`
- `static int getObjectiveDisplaySlotNumber(java.lang.String name)`
- `ScoreObjective getObjectiveInDisplaySlot(int slotIn)`
- `java.util.Collection<java.lang.String> getObjectiveNames()`
- `java.util.Map<ScoreObjective, Score> getObjectivesForEntity(java.lang.String name)`
- `java.util.Collection<ScoreObjective> getObjectivesFromCriteria(IScoreCriteria criteria)`
- `Score getOrCreateScore(java.lang.String username, ScoreObjective objective)`
- `ScorePlayerTeam getPlayersTeam(java.lang.String username)`
- `java.util.Collection<ScoreObjective> getScoreObjectives()`
- `java.util.Collection<Score> getScores()`
- `java.util.Collection<Score> getSortedScores(ScoreObjective objective)`
- `ScorePlayerTeam getTeam(java.lang.String teamName)`
- `java.util.Collection<java.lang.String> getTeamNames()`
- `java.util.Collection<ScorePlayerTeam> getTeams()`
- `void onObjectiveDisplayNameChanged(ScoreObjective objective)`
- `void onScoreObjectiveAdded(ScoreObjective scoreObjectiveIn)`
- `void onScoreObjectiveRemoved(ScoreObjective objective)`
- `void onScoreUpdated(Score scoreIn)`
- `void removeEntity(Entity entityIn)`
- `void removeObjective(ScoreObjective objective)`
- `void removeObjectiveFromEntity(java.lang.String name, ScoreObjective objective)`
- `void removePlayerFromTeam(java.lang.String username, ScorePlayerTeam playerTeam)`
- `boolean removePlayerFromTeams(java.lang.String playerName)`
- `void removeTeam(ScorePlayerTeam playerTeam)`
- `void setObjectiveInDisplaySlot(int objectiveSlot, ScoreObjective objective)`
