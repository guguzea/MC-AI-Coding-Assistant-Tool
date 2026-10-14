---
title: "org.bukkit.event.player.PlayerTakeLecternBookEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerTakeLecternBookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerTakeLecternBookEvent**
`public class PlayerTakeLecternBookEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerTakeLecternBookEvent(@NotNull @NotNull Player player, @NotNull @NotNull Lectern lectern)`
- `@NotNull public @NotNull Lectern getLectern()`
- `@Nullable public @Nullable ItemStack getBook()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
