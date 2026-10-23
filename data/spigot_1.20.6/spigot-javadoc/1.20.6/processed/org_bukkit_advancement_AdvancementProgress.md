---
title: "org.bukkit.advancement.AdvancementProgress"
package: "org.bukkit.advancement"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.advancement.AdvancementProgress`
- `public abstract org.bukkit.advancement.Advancement getAdvancement()`
- `public abstract boolean isDone()`
- `public abstract boolean awardCriteria(java.lang.String)`
- `public abstract boolean revokeCriteria(java.lang.String)`
- `public abstract java.util.Date getDateAwarded(java.lang.String)`
- `public abstract java.util.Collection<java.lang.String> getRemainingCriteria()`
- `public abstract java.util.Collection<java.lang.String> getAwardedCriteria()`
