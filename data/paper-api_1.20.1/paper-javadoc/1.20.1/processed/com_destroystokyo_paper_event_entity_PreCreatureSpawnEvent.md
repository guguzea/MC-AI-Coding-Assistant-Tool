---
title: "com.destroystokyo.paper.event.entity.PreCreatureSpawnEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/entity/PreCreatureSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PreCreatureSpawnEvent(@NotNull @NotNull Location location, @NotNull @NotNull EntityType type, @NotNull CreatureSpawnEvent.SpawnReason reason)`
- `@NotNull public @NotNull Location getSpawnLocation()`
- `@NotNull public @NotNull EntityType getType()`
- `@NotNull public CreatureSpawnEvent.SpawnReason getReason()`
- `public boolean shouldAbortSpawn()`
- `public void setShouldAbortSpawn(boolean shouldAbortSpawn)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
