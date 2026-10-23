---
title: "org.bukkit.scoreboard.Scoreboard"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/scoreboard/Scoreboard.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated @NotNull @NotNull Objective registerNewObjective&#8203;(@NotNull @NotNull String name, @NotNull @NotNull String criteria) throws IllegalArgumentException`
- `@NotNull @NotNull Objective registerNewObjective&#8203;(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @Nullable Component displayName) throws IllegalArgumentException`
- `@NotNull @NotNull Objective registerNewObjective&#8203;(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @Nullable Component displayName, @NotNull @NotNull RenderType renderType) throws IllegalArgumentException`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective&#8203;(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @NotNull @NotNull String displayName) throws IllegalArgumentException`
- `@NotNull @Deprecated @NotNull Objective registerNewObjective&#8203;(@NotNull @NotNull String name, @NotNull @NotNull String criteria, @NotNull @NotNull String displayName, @NotNull @NotNull RenderType renderType) throws IllegalArgumentException`
- `@Nullable @Nullable Objective getObjective&#8203;(@NotNull @NotNull String name) throws IllegalArgumentException`
- `@NotNull @NotNull Set<Objective> getObjectivesByCriteria&#8203;(@NotNull @NotNull String criteria) throws IllegalArgumentException`
- `@NotNull @NotNull Set<Objective> getObjectives()`
- `@Nullable @Nullable Objective getObjective&#8203;(@NotNull @NotNull DisplaySlot slot) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull Set<Score> getScores&#8203;(@NotNull @NotNull OfflinePlayer player) throws IllegalArgumentException`
- `@NotNull @NotNull Set<Score> getScores&#8203;(@NotNull @NotNull String entry) throws IllegalArgumentException`
- `@Deprecated void resetScores&#8203;(@NotNull @NotNull OfflinePlayer player) throws IllegalArgumentException`
- `void resetScores&#8203;(@NotNull @NotNull String entry) throws IllegalArgumentException`
- `@Deprecated @Nullable @Nullable Team getPlayerTeam&#8203;(@NotNull @NotNull OfflinePlayer player) throws IllegalArgumentException`
- `@Nullable @Nullable Team getEntryTeam&#8203;(@NotNull @NotNull String entry) throws IllegalArgumentException`
- `@Nullable @Nullable Team getTeam&#8203;(@NotNull @NotNull String teamName) throws IllegalArgumentException`
- `@NotNull @NotNull Set<Team> getTeams()`
- `@NotNull @NotNull Team registerNewTeam&#8203;(@NotNull @NotNull String name) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull Set<OfflinePlayer> getPlayers()`
- `@NotNull @NotNull Set<String> getEntries()`
- `void clearSlot&#8203;(@NotNull @NotNull DisplaySlot slot) throws IllegalArgumentException`
