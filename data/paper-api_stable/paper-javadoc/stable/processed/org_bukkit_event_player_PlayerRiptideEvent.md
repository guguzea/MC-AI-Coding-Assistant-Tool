---
title: "org.bukkit.event.player.PlayerRiptideEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerRiptideEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerRiptideEvent**
`public class PlayerRiptideEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerRiptideEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, @NotNull @NotNull Vector velocity)`
- `@Internal @Deprecated(since="1.20.4", forRemoval=true) public PlayerRiptideEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull Vector getVelocity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
