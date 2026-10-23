---
title: "org.bukkit.scoreboard.Scoreboard"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/scoreboard/Scoreboard.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `void clearSlot(DisplaySlot slot)`
- `Set<String> getEntries()`
- `Team getEntryTeam(String entry)`
- `Objective getObjective(String name)`
- `Objective getObjective(DisplaySlot slot)`
- `Set<Objective> getObjectives()`
- `Set<Objective> getObjectivesByCriteria(String criteria)`
- `Set<OfflinePlayer> getPlayers()`
- `Team getPlayerTeam(OfflinePlayer player)`
- `Set<Score> getScores(String entry)`
- `Set<Score> getScores(OfflinePlayer player)`
- `Team getTeam(String teamName)`
- `Set<Team> getTeams()`
- `Objective registerNewObjective(String name, String criteria)`
- `Team registerNewTeam(String name)`
- `void resetScores(String entry)`
- `void resetScores(OfflinePlayer player)`
