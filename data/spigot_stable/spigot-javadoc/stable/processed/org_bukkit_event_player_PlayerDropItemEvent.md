---
title: "org.bukkit.event.player.PlayerDropItemEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerDropItemEvent**
`public class PlayerDropItemEvent extends PlayerEvent implements Cancellable`
- `public PlayerDropItemEvent(@NotNull Player player, @NotNull Item drop)`
- `@NotNull public Item getItemDrop()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
