---
title: "org.bukkit.event.player.PlayerTeleportEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerTeleportEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerTeleportEvent**
`public class PlayerTeleportEvent extends PlayerMoveEvent`
- `@Internal public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `@Internal public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `@Internal public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause, @NotNull @NotNull Set<TeleportFlag.Relative> teleportFlags)`
- `@NotNull public @NotNull PlayerTeleportEvent.TeleportCause getCause()`
- `@NotNull public @NotNull @Unmodifiable Set<TeleportFlag.Relative> getRelativeTeleportationFlags()`
- `@Deprecated(forRemoval=true) @Contract("-> true") public boolean willDismountPlayer()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
