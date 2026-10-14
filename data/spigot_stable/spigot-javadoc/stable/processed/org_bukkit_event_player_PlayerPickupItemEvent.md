---
title: "org.bukkit.event.player.PlayerPickupItemEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerPickupItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerPickupItemEvent**
`@Deprecated(since="1.12") public class PlayerPickupItemEvent extends PlayerEvent implements Cancellable`
- `public PlayerPickupItemEvent(@NotNull Player player, @NotNull Item item, int remaining)`
- `@NotNull public Item getItem()`
- `public int getRemaining()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
