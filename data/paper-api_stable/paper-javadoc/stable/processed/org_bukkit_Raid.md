---
title: "org.bukkit.Raid"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/Raid.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Raid**
`@NullMarked public interface Raid extends PersistentDataHolder`
- `boolean isStarted()`
- `long getActiveTicks()`
- `int getBadOmenLevel()`
- `void setBadOmenLevel(int badOmenLevel)`
- `Location getLocation()`
- `Raid.RaidStatus getStatus()`
- `int getSpawnedGroups()`
- `int getTotalGroups()`
- `int getTotalWaves()`
- `void setTotalWaves(int totalWaves)`
- `float getTotalHealth()`
- `Set<UUID> getHeroes()`
- `List<Raider> getRaiders()`
- `@Deprecated(forRemoval=true, since="1.21.5") int getId()`
- `BossBar getBossBar()`
