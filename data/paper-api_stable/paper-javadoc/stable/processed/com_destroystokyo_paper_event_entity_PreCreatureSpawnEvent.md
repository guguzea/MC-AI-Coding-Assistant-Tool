---
title: "com.destroystokyo.paper.event.entity.PreCreatureSpawnEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/entity/PreCreatureSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PreCreatureSpawnEvent**
`@NullMarked public class PreCreatureSpawnEvent extends Event implements Cancellable`
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
