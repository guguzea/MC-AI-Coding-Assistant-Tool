---
title: "Scoreboard"
description: "Adds a player to the given team"
package: "net/minecraft/scoreboard"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/Scoreboard.html"
sourceType: javadoc
---

# Scoreboard

## Class signature

```java
public class Scoreboard extends java.lang.Object
```

## Constructors

- `public Scoreboard()`

## Methods

- `public ScoreObjective getObjective(java.lang.String name)`
- `public ScoreObjective addScoreObjective(java.lang.String name, IScoreObjectiveCriteria criteria)`
- `public java.util.Collection< ScoreObjective > getObjectivesFromCriteria( IScoreObjectiveCriteria criteria)`
- `public boolean entityHasObjective(java.lang.String name, ScoreObjective p_178819_2_)`
- `public Score getValueFromObjective(java.lang.String name, ScoreObjective objective)`
- `public java.util.Collection< Score > getSortedScores( ScoreObjective objective)`
- `public java.util.Collection< ScoreObjective > getScoreObjectives()`
- `public java.util.Collection<java.lang.String> getObjectiveNames()`
- `public void removeObjectiveFromEntity(java.lang.String name, ScoreObjective objective)`
- `public java.util.Collection< Score > getScores()`
- `public java.util.Map< ScoreObjective , Score > getObjectivesForEntity(java.lang.String name)`
- `public void removeObjective( ScoreObjective p_96519_1_)`
- `public void setObjectiveInDisplaySlot(int p_96530_1_, ScoreObjective p_96530_2_)`
- `public ScoreObjective getObjectiveInDisplaySlot(int p_96539_1_)`
- `public ScorePlayerTeam getTeam(java.lang.String p_96508_1_)`
- `public ScorePlayerTeam createTeam(java.lang.String name)`
- `public void removeTeam( ScorePlayerTeam p_96511_1_)`
- `public boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)`
- `public boolean removePlayerFromTeams(java.lang.String p_96524_1_)`
- `public void removePlayerFromTeam(java.lang.String p_96512_1_, ScorePlayerTeam p_96512_2_)`
- `public java.util.Collection<java.lang.String> getTeamNames()`
- `public java.util.Collection< ScorePlayerTeam > getTeams()`
- `public ScorePlayerTeam getPlayersTeam(java.lang.String p_96509_1_)`
- `public void onScoreObjectiveAdded( ScoreObjective scoreObjectiveIn)`
- `public void onObjectiveDisplayNameChanged( ScoreObjective p_96532_1_)`
- `public void onScoreObjectiveRemoved( ScoreObjective p_96533_1_)`
- `public void func_96536_a( Score p_96536_1_)`
- `public void func_96516_a(java.lang.String p_96516_1_)`
- `public void func_178820_a(java.lang.String p_178820_1_, ScoreObjective p_178820_2_)`
- `public void broadcastTeamCreated( ScorePlayerTeam playerTeam)`
- `public void sendTeamUpdate( ScorePlayerTeam playerTeam)`
- `public void func_96513_c( ScorePlayerTeam playerTeam)`
- `public static java.lang.String getObjectiveDisplaySlot(int p_96517_0_)`
- `public static int getObjectiveDisplaySlotNumber(java.lang.String p_96537_0_)`
- `public static java.lang.String[] getDisplaySlotStrings()`
- `public void func_181140_a( Entity p_181140_1_)`

## Description

Adds a player to the given team
