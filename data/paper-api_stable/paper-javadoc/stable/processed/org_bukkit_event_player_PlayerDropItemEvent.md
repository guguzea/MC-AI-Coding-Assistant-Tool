---
title: "org.bukkit.event.player.PlayerDropItemEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerDropItemEvent**
`public class PlayerDropItemEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerDropItemEvent(@NotNull @NotNull Player player, @NotNull @NotNull Item drop)`
- `@NotNull public @NotNull Item getItemDrop()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
