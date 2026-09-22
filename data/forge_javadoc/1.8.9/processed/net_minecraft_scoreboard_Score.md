# Score

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Score

## Class signature

```java
public class Score extends java.lang.Object
```

## Constructors

- `Score(Scoreboard theScoreboardIn, ScoreObjective theScoreObjectiveIn, java.lang.String scorePlayerNameIn)`

## Methods

- `void decreaseScore(int amount)`
- `void func_96648_a()`
- `void func_96651_a(java.util.List<EntityPlayer> p_96651_1_)`
- `ScoreObjective getObjective()`
- `java.lang.String getPlayerName()` — Returns the name of the player this score belongs to
- `int getScorePoints()`
- `Scoreboard getScoreScoreboard()`
- `void increseScore(int amount)`
- `boolean isLocked()`
- `void setLocked(boolean locked)`
- `void setScorePoints(int points)`

## Fields

- `static java.util.Comparator<Score> scoreComparator`