---
title: "org.bukkit.event.player.PlayerTakeLecternBookEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerTakeLecternBookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerTakeLecternBookEvent**
`public class PlayerTakeLecternBookEvent extends PlayerEvent implements Cancellable`
- `public PlayerTakeLecternBookEvent(@NotNull Player who, @NotNull Lectern lectern)`
- `@NotNull public Lectern getLectern()`
- `@Nullable public ItemStack getBook()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
