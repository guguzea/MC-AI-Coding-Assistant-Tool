# ScoreboardSaveData

## Class signature

```java
public class ScoreboardSaveData extends WorldSavedData
```

## Constructors

- `public ScoreboardSaveData()`
- `public ScoreboardSaveData(java.lang.String name)`

## Methods

- `public void setScoreboard( Scoreboard scoreboardIn)`
- `public void readFromNBT( NBTTagCompound nbt)`
- `protected void readTeams( NBTTagList tagList)`
- `protected void loadTeamPlayers( ScorePlayerTeam playerTeam, NBTTagList tagList)`
- `protected void readDisplayConfig( NBTTagCompound compound)`
- `protected void readObjectives( NBTTagList nbt)`
- `protected void readScores( NBTTagList nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound p_189551_1_)`
- `protected NBTTagList teamsToNbt()`
- `protected void fillInDisplaySlots( NBTTagCompound compound)`
- `protected NBTTagList objectivesToNbt()`
- `protected NBTTagList scoresToNbt()`