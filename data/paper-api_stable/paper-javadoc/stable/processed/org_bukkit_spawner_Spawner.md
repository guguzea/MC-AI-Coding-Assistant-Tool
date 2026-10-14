---
title: "org.bukkit.spawner.Spawner"
package: "org.bukkit.spawner"
source: https://jd.papermc.io/paper/26.3/org/bukkit/spawner/Spawner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Spawner**
`@NullMarked public interface Spawner extends BaseSpawner`
- `void setDelay(int delay)`
- `int getMinSpawnDelay()`
- `void setMinSpawnDelay(int delay)`
- `int getMaxSpawnDelay()`
- `void setMaxSpawnDelay(int delay)`
- `int getSpawnCount()`
- `void setSpawnCount(int spawnCount)`
- `int getMaxNearbyEntities()`
- `void setMaxNearbyEntities(int maxNearbyEntities)`
- `boolean isActivated()`
- `void resetTimer()`
- `void setSpawnedItem(ItemStack itemStack)`
