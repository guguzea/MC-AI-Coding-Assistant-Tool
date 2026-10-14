---
title: "org.bukkit.Raid"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Raid.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Raid**
`public interface Raid`
- `boolean isStarted()`
- `void stopRaid(boolean removeSpawnedRaiders)`
- `long getActiveTicks()`
- `int getBadOmenLevel()`
- `void setBadOmenLevel(int badOmenLevel)`
- `@NotNull Location getLocation()`
- `@NotNull Raid.RaidStatus getStatus()`
- `int getSpawnedGroups()`
- `int getTotalGroups()`
- `int getTotalWaves()`
- `void setTotalWaves(int waves)`
- `float getTotalHealth()`
- `@NotNull Set<UUID> getHeroes()`
- `@NotNull List<Raider> getRaiders()`
