---
title: "org.bukkit.event.player.PlayerSpawnChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerSpawnChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerSpawnChangeEvent**
`@Deprecated(forRemoval=true) public class PlayerSpawnChangeEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerSpawnChangeEvent(@NotNull @NotNull Player player, @Nullable @Nullable Location newSpawn, boolean forced, @NotNull @NotNull PlayerSpawnChangeEvent.Cause cause)`
- `@Nullable public @Nullable Location getNewSpawn()`
- `public void setNewSpawn(@Nullable @Nullable Location newSpawn)`
- `@NotNull public @NotNull PlayerSpawnChangeEvent.Cause getCause()`
- `public boolean isForced()`
- `public void setForced(boolean forced)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
