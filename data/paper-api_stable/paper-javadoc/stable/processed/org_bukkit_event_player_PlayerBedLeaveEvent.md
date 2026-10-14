---
title: "org.bukkit.event.player.PlayerBedLeaveEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerBedLeaveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerBedLeaveEvent**
`public class PlayerBedLeaveEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerBedLeaveEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block bed, boolean setBedSpawn)`
- `@NotNull public @NotNull Block getBed()`
- `@Deprecated(forRemoval=true) public boolean shouldSetSpawnLocation()`
- `@Deprecated(forRemoval=true) public void setSpawnLocation(boolean setBedSpawn)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
