---
title: "org.bukkit.advancement.AdvancementProgress"
package: "org.bukkit.advancement"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.advancement.AdvancementProgress`
- `public abstract org.bukkit.advancement.Advancement getAdvancement()`
- `public abstract boolean isDone()`
- `public abstract boolean awardCriteria(java.lang.String)`
- `public abstract boolean revokeCriteria(java.lang.String)`
- `public abstract java.util.Date getDateAwarded(java.lang.String)`
- `public abstract java.util.Collection<java.lang.String> getRemainingCriteria()`
- `public abstract java.util.Collection<java.lang.String> getAwardedCriteria()`
