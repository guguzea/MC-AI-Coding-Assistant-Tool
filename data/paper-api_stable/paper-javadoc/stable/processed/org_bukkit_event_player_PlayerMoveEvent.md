---
title: "org.bukkit.event.player.PlayerMoveEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerMoveEvent**
`public class PlayerMoveEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerMoveEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `@NotNull public @NotNull Location getFrom()`
- `public void setFrom(@NotNull @NotNull Location from)`
- `@NotNull public @NotNull Location getTo()`
- `public void setTo(@NotNull @NotNull Location to)`
- `public boolean hasChangedPosition()`
- `public boolean hasExplicitlyChangedPosition()`
- `public boolean hasChangedBlock()`
- `public boolean hasExplicitlyChangedBlock()`
- `public boolean hasChangedOrientation()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
