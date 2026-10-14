---
title: "org.bukkit.event.player.PlayerBedLeaveEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerBedLeaveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerBedLeaveEvent**
`public class PlayerBedLeaveEvent extends PlayerEvent implements Cancellable`
- `public PlayerBedLeaveEvent(@NotNull Player who, @NotNull Block bed, boolean setBedSpawn)`
- `@NotNull public Block getBed()`
- `public boolean shouldSetSpawnLocation()`
- `public void setSpawnLocation(boolean setBedSpawn)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
