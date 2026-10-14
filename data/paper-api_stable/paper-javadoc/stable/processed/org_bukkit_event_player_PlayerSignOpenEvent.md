---
title: "org.bukkit.event.player.PlayerSignOpenEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerSignOpenEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerSignOpenEvent**
`@Deprecated(forRemoval=true) public class PlayerSignOpenEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerSignOpenEvent(@NotNull @NotNull Player player, @NotNull @NotNull Sign sign, @NotNull @NotNull Side side, @NotNull @NotNull PlayerSignOpenEvent.Cause cause)`
- `@NotNull public @NotNull Sign getSign()`
- `@NotNull public @NotNull Side getSide()`
- `@NotNull public @NotNull PlayerSignOpenEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
