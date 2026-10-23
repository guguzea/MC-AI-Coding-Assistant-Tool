---
title: "org.bukkit.event.player.PlayerTeleportEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerTeleportEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `@Experimental public PlayerTeleportEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause, @NotNull Set<@NotNull TeleportFlag.Relative> teleportFlagSet)`
- `@NotNull public @NotNull PlayerTeleportEvent.TeleportCause getCause()`
- `@Deprecated(forRemoval=true) public boolean willDismountPlayer()`
- `@Experimental @NotNull public Set<@NotNull TeleportFlag.Relative> getRelativeTeleportationFlags()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
