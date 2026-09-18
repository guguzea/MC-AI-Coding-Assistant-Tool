# Scoreboard

## Class signature

```java
public class Scoreboard extends java.lang.Object
```

## Constructors

- `public Scoreboard()`

## Methods

- `public ScoreObjective getObjective(java.lang.String name)`
- `public ScoreObjective addScoreObjective(java.lang.String name, IScoreCriteria criteria)`
- `public java.util.Collection< ScoreObjective > getObjectivesFromCriteria( IScoreCriteria criteria)`
- `public boolean entityHasObjective(java.lang.String name, ScoreObjective objective)`
- `public Score getOrCreateScore(java.lang.String username, ScoreObjective objective)`
- `public java.util.Collection< Score > getSortedScores( ScoreObjective objective)`
- `public java.util.Collection< ScoreObjective > getScoreObjectives()`
- `public java.util.Collection<java.lang.String> getObjectiveNames()`
- `public void removeObjectiveFromEntity(java.lang.String name, ScoreObjective objective)`
- `public java.util.Collection< Score > getScores()`
- `public java.util.Map< ScoreObjective , Score > getObjectivesForEntity(java.lang.String name)`
- `public void removeObjective( ScoreObjective objective)`
- `public void setObjectiveInDisplaySlot(int objectiveSlot, ScoreObjective objective)`
- `public ScoreObjective getObjectiveInDisplaySlot(int slotIn)`
- `public ScorePlayerTeam getTeam(java.lang.String teamName)`
- `public ScorePlayerTeam createTeam(java.lang.String name)`
- `public void removeTeam( ScorePlayerTeam playerTeam)`
- `public boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)`
- `public boolean removePlayerFromTeams(java.lang.String playerName)`
- `public void removePlayerFromTeam(java.lang.String username, ScorePlayerTeam playerTeam)`
- `public java.util.Collection<java.lang.String> getTeamNames()`
- `public java.util.Collection< ScorePlayerTeam > getTeams()`
- `public ScorePlayerTeam getPlayersTeam(java.lang.String username)`
- `public void onScoreObjectiveAdded( ScoreObjective scoreObjectiveIn)`
- `public void onObjectiveDisplayNameChanged( ScoreObjective objective)`
- `public void onScoreObjectiveRemoved( ScoreObjective objective)`
- `public void onScoreUpdated( Score scoreIn)`
- `public void broadcastScoreUpdate(java.lang.String scoreName)`
- `public void broadcastScoreUpdate(java.lang.String scoreName, ScoreObjective objective)`
- `public void broadcastTeamCreated( ScorePlayerTeam playerTeam)`
- `public void broadcastTeamInfoUpdate( ScorePlayerTeam playerTeam)`
- `public void broadcastTeamRemove( ScorePlayerTeam playerTeam)`
- `public static java.lang.String getObjectiveDisplaySlot(int id)`
- `public static int getObjectiveDisplaySlotNumber(java.lang.String name)`
- `public static java.lang.String[] getDisplaySlotStrings()`
- `public void removeEntity( Entity entityIn)`