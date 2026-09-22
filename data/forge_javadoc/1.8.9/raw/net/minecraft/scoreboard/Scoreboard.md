---
title: "Scoreboard"
description: "public class Scoreboard extends java.lang.Object"
package: "net/minecraft/scoreboard"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/Scoreboard.html"
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

- `boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)` — Adds a player to the given team
- `ScoreObjective addScoreObjective(java.lang.String name, IScoreObjectiveCriteria criteria)` — Create and returns the score objective for the given name and ScoreCriteria
- `void broadcastTeamCreated(ScorePlayerTeam playerTeam)` — This packet will notify the players that this team is created, and that will register it on the client
- `ScorePlayerTeam createTeam(java.lang.String name)`
- `boolean entityHasObjective(java.lang.String name, ScoreObjective p_178819_2_)` — Returns if the entity has the given ScoreObjective
- `void func_178820_a(java.lang.String p_178820_1_, ScoreObjective p_178820_2_)`
- `void func_181140_a(Entity p_181140_1_)`
- `void func_96513_c(ScorePlayerTeam playerTeam)`
- `void func_96516_a(java.lang.String p_96516_1_)`
- `void func_96536_a(Score p_96536_1_)`
- `static java.lang.String[] getDisplaySlotStrings()`
- `ScoreObjective getObjective(java.lang.String name)` — Returns a ScoreObjective for the objective name
- `static java.lang.String getObjectiveDisplaySlot(int p_96517_0_)` — Returns 'list' for 0, 'sidebar' for 1, 'belowName for 2, otherwise null.
- `static int getObjectiveDisplaySlotNumber(java.lang.String p_96537_0_)` — Returns 0 for (case-insensitive) 'list', 1 for 'sidebar', 2 for 'belowName', otherwise -1.
- `ScoreObjective getObjectiveInDisplaySlot(int p_96539_1_)` — 0 is tab menu, 1 is sidebar, 2 is below name
- `java.util.Collection<java.lang.String> getObjectiveNames()`
- `java.util.Map<ScoreObjective, Score> getObjectivesForEntity(java.lang.String name)`
- `java.util.Collection<ScoreObjective> getObjectivesFromCriteria(IScoreObjectiveCriteria criteria)`
- `ScorePlayerTeam getPlayersTeam(java.lang.String p_96509_1_)` — Gets the ScorePlayerTeam object for the given username.
- `java.util.Collection<ScoreObjective> getScoreObjectives()`
- `java.util.Collection<Score> getScores()`
- `java.util.Collection<Score> getSortedScores(ScoreObjective objective)`
- `ScorePlayerTeam getTeam(java.lang.String p_96508_1_)` — Retrieve the ScorePlayerTeam instance identified by the passed team name
- `java.util.Collection<java.lang.String> getTeamNames()`
- `java.util.Collection<ScorePlayerTeam> getTeams()`
- `Score getValueFromObjective(java.lang.String name, ScoreObjective objective)` — Returns the value of the given objective for the given entity name
- `void onObjectiveDisplayNameChanged(ScoreObjective p_96532_1_)`
- `void onScoreObjectiveAdded(ScoreObjective scoreObjectiveIn)` — Called when a score objective is added
- `void onScoreObjectiveRemoved(ScoreObjective p_96533_1_)`
- `void removeObjective(ScoreObjective p_96519_1_)`
- `void removeObjectiveFromEntity(java.lang.String name, ScoreObjective objective)` — Remove the given ScoreObjective for the given Entity name.
- `void removePlayerFromTeam(java.lang.String p_96512_1_, ScorePlayerTeam p_96512_2_)` — Removes the given username from the given ScorePlayerTeam.
- `boolean removePlayerFromTeams(java.lang.String p_96524_1_)`
- `void removeTeam(ScorePlayerTeam p_96511_1_)` — Removes the team from the scoreboard, updates all player memberships and broadcasts the deletion to all players
- `void sendTeamUpdate(ScorePlayerTeam playerTeam)` — This packet will notify the players that this team is updated
- `void setObjectiveInDisplaySlot(int p_96530_1_, ScoreObjective p_96530_2_)` — 0 is tab menu, 1 is sidebar, 2 is below name
