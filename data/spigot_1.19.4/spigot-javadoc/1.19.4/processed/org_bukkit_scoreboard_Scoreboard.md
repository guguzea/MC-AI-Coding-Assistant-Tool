---
title: "org.bukkit.scoreboard.Scoreboard"
package: "org.bukkit.scoreboard"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.scoreboard.Scoreboard`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, java.lang.String, java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, java.lang.String, java.lang.String, org.bukkit.scoreboard.RenderType) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, org.bukkit.scoreboard.Criteria, java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, org.bukkit.scoreboard.Criteria, java.lang.String, org.bukkit.scoreboard.RenderType) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Objective getObjective(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.scoreboard.Objective> getObjectivesByCriteria(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.scoreboard.Objective> getObjectivesByCriteria(org.bukkit.scoreboard.Criteria) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.scoreboard.Objective> getObjectives()`
- `public abstract org.bukkit.scoreboard.Objective getObjective(org.bukkit.scoreboard.DisplaySlot) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.scoreboard.Score> getScores(org.bukkit.OfflinePlayer) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.scoreboard.Score> getScores(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract void resetScores(org.bukkit.OfflinePlayer) throws java.lang.IllegalArgumentException`
- `public abstract void resetScores(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Team getPlayerTeam(org.bukkit.OfflinePlayer) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Team getEntryTeam(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.scoreboard.Team getTeam(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.scoreboard.Team> getTeams()`
- `public abstract org.bukkit.scoreboard.Team registerNewTeam(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.OfflinePlayer> getPlayers()`
- `public abstract java.util.Set<java.lang.String> getEntries()`
- `public abstract void clearSlot(org.bukkit.scoreboard.DisplaySlot) throws java.lang.IllegalArgumentException`
