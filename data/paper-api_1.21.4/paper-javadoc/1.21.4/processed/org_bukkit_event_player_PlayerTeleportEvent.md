---
title: "org.bukkit.event.player.PlayerTeleportEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerTeleportEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `@Internal public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause, @NotNull Set<@NotNull TeleportFlag.Relative> teleportFlagSet)`
- `@NotNull public @NotNull PlayerTeleportEvent.TeleportCause getCause()`
- `@Deprecated(forRemoval=true) public boolean willDismountPlayer()`
- `@NotNull public Set<@NotNull TeleportFlag.Relative> getRelativeTeleportationFlags()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
