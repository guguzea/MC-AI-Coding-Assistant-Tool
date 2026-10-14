---
title: "org.bukkit.event.player.PlayerItemHeldEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerItemHeldEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerItemHeldEvent**
`public class PlayerItemHeldEvent extends PlayerEvent implements Cancellable`
- `public PlayerItemHeldEvent(@NotNull Player player, int previous, int current)`
- `public int getPreviousSlot()`
- `public int getNewSlot()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
