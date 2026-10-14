---
title: "org.bukkit.event.player.PlayerPickupItemEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerPickupItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerPickupItemEvent**
`@Deprecated(since="1.12") public class PlayerPickupItemEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerPickupItemEvent(@NotNull @NotNull Player player, @NotNull @NotNull Item item, int remaining)`
- `@NotNull public @NotNull Item getItem()`
- `public int getRemaining()`
- `public void setFlyAtPlayer(boolean flyAtPlayer)`
- `public boolean getFlyAtPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
