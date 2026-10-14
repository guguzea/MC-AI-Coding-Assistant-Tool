---
title: "org.bukkit.scoreboard.Scoreboard"
package: "org.bukkit.scoreboard"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/scoreboard/Scoreboard.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Scoreboard**
`public interface Scoreboard`
- `@Deprecated(since="1.13") @NotNull Objective registerNewObjective(@NotNull String name, @NotNull String criteria)`
- `@Deprecated(since="1.20.5") @NotNull Objective registerNewObjective(@NotNull String name, @NotNull String criteria, @NotNull String displayName)`
- `@Deprecated(since="1.20.5") @NotNull Objective registerNewObjective(@NotNull String name, @NotNull String criteria, @NotNull String displayName, @NotNull RenderType renderType)`
- `@NotNull Objective registerNewObjective(@NotNull String name, @NotNull Criteria criteria, @NotNull String displayName)`
- `@NotNull Objective registerNewObjective(@NotNull String name, @NotNull Criteria criteria, @NotNull String displayName, @NotNull RenderType renderType)`
- `@Nullable Objective getObjective(@NotNull String name)`
- `@Deprecated(since="1.19.2") @NotNull Set<Objective> getObjectivesByCriteria(@NotNull String criteria)`
- `@NotNull Set<Objective> getObjectivesByCriteria(@NotNull Criteria criteria)`
- `@NotNull Set<Objective> getObjectives()`
- `@Nullable Objective getObjective(@NotNull DisplaySlot slot)`
- `@Deprecated(since="1.7.8") @NotNull Set<Score> getScores(@NotNull OfflinePlayer player)`
- `@NotNull Set<Score> getScores(@NotNull String entry)`
- `@Deprecated(since="1.7.8") void resetScores(@NotNull OfflinePlayer player)`
- `void resetScores(@NotNull String entry)`
- `@Deprecated(since="1.8.6") @Nullable Team getPlayerTeam(@NotNull OfflinePlayer player)`
- `@Nullable Team getEntryTeam(@NotNull String entry)`
- `@Nullable Team getTeam(@NotNull String teamName)`
- `@NotNull Set<Team> getTeams()`
- `@NotNull Team registerNewTeam(@NotNull String name)`
- `@Deprecated(since="1.7.8") @NotNull Set<OfflinePlayer> getPlayers()`
- `@NotNull Set<String> getEntries()`
- `void clearSlot(@NotNull DisplaySlot slot)`
