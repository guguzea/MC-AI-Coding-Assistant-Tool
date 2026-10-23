---
title: "org.bukkit.advancement.AdvancementProgress"
package: "org.bukkit.advancement"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.advancement.AdvancementProgress`
- `public abstract org.bukkit.advancement.Advancement getAdvancement()`
- `public abstract boolean isDone()`
- `public abstract boolean awardCriteria(java.lang.String)`
- `public abstract boolean revokeCriteria(java.lang.String)`
- `public abstract java.util.Date getDateAwarded(java.lang.String)`
- `public abstract java.util.Collection<java.lang.String> getRemainingCriteria()`
- `public abstract java.util.Collection<java.lang.String> getAwardedCriteria()`
