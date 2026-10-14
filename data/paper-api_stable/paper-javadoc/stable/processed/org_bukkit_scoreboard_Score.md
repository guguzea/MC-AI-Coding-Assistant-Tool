---
title: "org.bukkit.scoreboard.Score"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/26.3/org/bukkit/scoreboard/Score.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Score**
`public interface Score`
- `@Deprecated(since="1.7.8") @NotNull @NotNull OfflinePlayer getPlayer()`
- `@NotNull @NotNull String getEntry()`
- `@NotNull @NotNull Objective getObjective()`
- `int getScore()`
- `void setScore(int score)`
- `boolean isScoreSet()`
- `@Nullable @Nullable Scoreboard getScoreboard()`
- `void resetScore() throws IllegalStateException`
- `boolean isTriggerable()`
- `void setTriggerable(boolean triggerable)`
- `@Nullable Component customName()`
- `void customName(@Nullable Component customName)`
- `@Nullable NumberFormat numberFormat()`
- `void numberFormat(@Nullable NumberFormat format)`
