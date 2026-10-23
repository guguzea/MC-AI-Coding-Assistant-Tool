---
title: "org.bukkit.event.player.PlayerSpawnChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerSpawnChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public PlayerSpawnChangeEvent(@NotNull @NotNull Player player, @Nullable @Nullable Location newSpawn, boolean forced, @NotNull @NotNull PlayerSpawnChangeEvent.Cause cause)`
- `@NotNull public @NotNull PlayerSpawnChangeEvent.Cause getCause()`
- `public boolean isForced()`
- `public void setForced(boolean forced)`
- `@Nullable public @Nullable Location getNewSpawn()`
- `public void setNewSpawn(@Nullable @Nullable Location newSpawn)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
