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
- `protected void readTeams( NBTTagList p_96498_1_)`
- `protected void func_96502_a( ScorePlayerTeam p_96502_1_, NBTTagList p_96502_2_)`
- `protected void readDisplayConfig( NBTTagCompound p_96504_1_)`
- `protected void readObjectives( NBTTagList nbt)`
- `protected void readScores( NBTTagList nbt)`
- `public void writeToNBT( NBTTagCompound nbt)`
- `protected NBTTagList func_96496_a()`
- `protected void func_96497_d( NBTTagCompound p_96497_1_)`
- `protected NBTTagList objectivesToNbt()`
- `protected NBTTagList scoresToNbt()`

## Description

reads in data from the NBTTagCompound into this MapDataBase