---
title: "org.bukkit.event.player.PlayerVelocityEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerVelocityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerVelocityEvent**
`public class PlayerVelocityEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerVelocityEvent(@NotNull @NotNull Player player, @NotNull @NotNull Vector velocity)`
- `@NotNull public @NotNull Vector getVelocity()`
- `public void setVelocity(@NotNull @NotNull Vector velocity)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
