---
title: "com.destroystokyo.paper.event.entity.PreCreatureSpawnEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/1.21.1/com/destroystokyo/paper/event/entity/PreCreatureSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public PreCreatureSpawnEvent(Location location, EntityType type, CreatureSpawnEvent.SpawnReason reason)`
- `public Location getSpawnLocation()`
- `public EntityType getType()`
- `public CreatureSpawnEvent.SpawnReason getReason()`
- `public boolean shouldAbortSpawn()`
- `public void setShouldAbortSpawn(boolean shouldAbortSpawn)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
