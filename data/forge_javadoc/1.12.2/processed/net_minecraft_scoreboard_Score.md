# Score

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Score

## Class signature

```java
public class Score extends java.lang.Object
```

## Constructors

- `Score(Scoreboard scoreboard, ScoreObjective objective, java.lang.String playerName)`

## Methods

- `void decreaseScore(int amount)`
- `ScoreObjective getObjective()`
- `java.lang.String getPlayerName()`
- `int getScorePoints()`
- `Scoreboard getScoreScoreboard()`
- `void increaseScore(int amount)`
- `void incrementScore()`
- `boolean isLocked()`
- `void setLocked(boolean locked)`
- `void setScorePoints(int points)`

## Fields

- `static java.util.Comparator<Score> SCORE_COMPARATOR`