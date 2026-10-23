---
title: "org.bukkit.scoreboard.Scoreboard"
package: "org.bukkit.scoreboard"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.scoreboard.Scoreboard`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, java.lang.String)`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, java.lang.String, java.lang.String)`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, java.lang.String, java.lang.String, org.bukkit.scoreboard.RenderType)`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, org.bukkit.scoreboard.Criteria, java.lang.String)`
- `public abstract org.bukkit.scoreboard.Objective registerNewObjective(java.lang.String, org.bukkit.scoreboard.Criteria, java.lang.String, org.bukkit.scoreboard.RenderType)`
- `public abstract org.bukkit.scoreboard.Objective getObjective(java.lang.String)`
- `public abstract java.util.Set<org.bukkit.scoreboard.Objective> getObjectivesByCriteria(java.lang.String)`
- `public abstract java.util.Set<org.bukkit.scoreboard.Objective> getObjectivesByCriteria(org.bukkit.scoreboard.Criteria)`
- `public abstract java.util.Set<org.bukkit.scoreboard.Objective> getObjectives()`
- `public abstract org.bukkit.scoreboard.Objective getObjective(org.bukkit.scoreboard.DisplaySlot)`
- `public abstract java.util.Set<org.bukkit.scoreboard.Score> getScores(org.bukkit.OfflinePlayer)`
- `public abstract java.util.Set<org.bukkit.scoreboard.Score> getScores(java.lang.String)`
- `public abstract void resetScores(org.bukkit.OfflinePlayer)`
- `public abstract void resetScores(java.lang.String)`
- `public abstract org.bukkit.scoreboard.Team getPlayerTeam(org.bukkit.OfflinePlayer)`
- `public abstract org.bukkit.scoreboard.Team getEntryTeam(java.lang.String)`
- `public abstract org.bukkit.scoreboard.Team getTeam(java.lang.String)`
- `public abstract java.util.Set<org.bukkit.scoreboard.Team> getTeams()`
- `public abstract org.bukkit.scoreboard.Team registerNewTeam(java.lang.String)`
- `public abstract java.util.Set<org.bukkit.OfflinePlayer> getPlayers()`
- `public abstract java.util.Set<java.lang.String> getEntries()`
- `public abstract void clearSlot(org.bukkit.scoreboard.DisplaySlot)`
