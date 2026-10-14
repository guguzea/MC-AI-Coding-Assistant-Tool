---
title: "org.bukkit.event.player.PlayerSpawnChangeEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerSpawnChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerSpawnChangeEvent**
`public class PlayerSpawnChangeEvent extends PlayerEvent implements Cancellable`
- `public PlayerSpawnChangeEvent(@NotNull Player player, @Nullable Location newSpawn, boolean forced, @NotNull PlayerSpawnChangeEvent.Cause cause)`
- `@NotNull public PlayerSpawnChangeEvent.Cause getCause()`
- `public boolean isForced()`
- `public void setForced(boolean forced)`
- `@Nullable public Location getNewSpawn()`
- `public void setNewSpawn(@Nullable Location newSpawn)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
