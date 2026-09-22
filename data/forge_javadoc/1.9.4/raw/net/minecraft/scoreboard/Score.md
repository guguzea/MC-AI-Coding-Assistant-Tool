---
title: "Score"
description: "public class Score extends java.lang.Object"
package: "net/minecraft/scoreboard"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/scoreboard/Score.html"
sourceType: javadoc
---

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
