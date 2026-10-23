---
title: "org.bukkit.scoreboard.Objective"
package: "org.bukkit.scoreboard"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.scoreboard.Objective`
- `public abstract java.lang.String getName() throws java.lang.IllegalStateException`
- `public abstract java.lang.String getDisplayName() throws java.lang.IllegalStateException`
- `public abstract void setDisplayName(java.lang.String) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract java.lang.String getCriteria() throws java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.Criteria getTrackedCriteria() throws java.lang.IllegalStateException`
- `public abstract boolean isModifiable() throws java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.Scoreboard getScoreboard()`
- `public abstract void unregister() throws java.lang.IllegalStateException`
- `public abstract void setDisplaySlot(org.bukkit.scoreboard.DisplaySlot) throws java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.DisplaySlot getDisplaySlot() throws java.lang.IllegalStateException`
- `public abstract void setRenderType(org.bukkit.scoreboard.RenderType) throws java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.RenderType getRenderType() throws java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.Score getScore(org.bukkit.OfflinePlayer) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.Score getScore(java.lang.String) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
