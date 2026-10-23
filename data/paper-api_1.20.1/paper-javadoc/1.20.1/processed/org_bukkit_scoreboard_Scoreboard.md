---
title: "org.bukkit.scoreboard.Scoreboard"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/scoreboard/Scoreboard.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated @NotNull @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull String criteria)`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @Nullable Component displayName)`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @Nullable Component displayName, @NotNull @NotNull RenderType renderType) throws IllegalArgumentException`
- `@NotNull @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull Criteria criteria, @Nullable Component displayName) throws IllegalArgumentException`
- `@NotNull @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull Criteria criteria, @Nullable Component displayName, @NotNull @NotNull RenderType renderType) throws IllegalArgumentException`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @NotNull @NotNull String displayName)`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @NotNull @NotNull String displayName, @NotNull @NotNull RenderType renderType)`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull Criteria criteria, @NotNull @NotNull String displayName)`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective(@NotNull @NotNull String name, @NotNull @NotNull Criteria criteria, @NotNull @NotNull String displayName, @NotNull @NotNull RenderType renderType)`
- `@Nullable @Nullable Objective getObjective(@NotNull @NotNull String name)`
- `@Deprecated @NotNull @NotNull Set<Objective> getObjectivesByCriteria(@NotNull @NotNull String criteria)`
- `@NotNull @NotNull Set<Objective> getObjectivesByCriteria(@NotNull @NotNull Criteria criteria)`
- `@NotNull @NotNull Set<Objective> getObjectives()`
- `@Nullable @Nullable Objective getObjective(@NotNull @NotNull DisplaySlot slot)`
- `@NotNull @NotNull Set<Score> getScores(@NotNull @NotNull OfflinePlayer player)`
- `@NotNull @NotNull Set<Score> getScores(@NotNull @NotNull String entry)`
- `void resetScores(@NotNull @NotNull OfflinePlayer player)`
- `void resetScores(@NotNull @NotNull String entry)`
- `@Nullable @Nullable Team getPlayerTeam(@NotNull @NotNull OfflinePlayer player)`
- `@Nullable @Nullable Team getEntryTeam(@NotNull @NotNull String entry)`
- `@Nullable @Nullable Team getTeam(@NotNull @NotNull String teamName)`
- `@NotNull @NotNull Set<Team> getTeams()`
- `@NotNull @NotNull Team registerNewTeam(@NotNull @NotNull String name)`
- `@Deprecated @NotNull @NotNull Set<OfflinePlayer> getPlayers()`
- `@NotNull @NotNull Set<String> getEntries()`
- `void clearSlot(@NotNull @NotNull DisplaySlot slot)`
- `@NotNull @NotNull Set<Score> getScoresFor(@NotNull Entity entity) throws IllegalArgumentException`
- `void resetScoresFor(@NotNull Entity entity) throws IllegalArgumentException`
- `@Nullable @Nullable Team getEntityTeam(@NotNull Entity entity) throws IllegalArgumentException`
