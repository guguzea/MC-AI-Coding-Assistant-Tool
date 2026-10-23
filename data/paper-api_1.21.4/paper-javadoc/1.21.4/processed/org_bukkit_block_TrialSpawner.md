---
title: "org.bukkit.block.TrialSpawner"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/block/TrialSpawner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `long getCooldownEnd()`
- `void setCooldownEnd(long ticks)`
- `long getNextSpawnAttempt()`
- `void setNextSpawnAttempt(long ticks)`
- `int getCooldownLength()`
- `void setCooldownLength(int ticks)`
- `int getRequiredPlayerRange()`
- `void setRequiredPlayerRange(int requiredPlayerRange)`
- `Collection<Player> getTrackedPlayers()`
- `boolean isTrackingPlayer(Player player)`
- `void startTrackingPlayer(Player player)`
- `void stopTrackingPlayer(Player player)`
- `Collection<Entity> getTrackedEntities()`
- `boolean isTrackingEntity(Entity entity)`
- `void startTrackingEntity(Entity entity)`
- `void stopTrackingEntity(Entity entity)`
- `boolean isOminous()`
- `void setOminous(boolean ominous)`
- `TrialSpawnerConfiguration getNormalConfiguration()`
- `TrialSpawnerConfiguration getOminousConfiguration()`
