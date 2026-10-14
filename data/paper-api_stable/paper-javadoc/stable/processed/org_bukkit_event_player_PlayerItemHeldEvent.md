---
title: "org.bukkit.event.player.PlayerItemHeldEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerItemHeldEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerItemHeldEvent**
`public class PlayerItemHeldEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerItemHeldEvent(@NotNull @NotNull Player player, int previous, int current)`
- `public int getPreviousSlot()`
- `public int getNewSlot()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
