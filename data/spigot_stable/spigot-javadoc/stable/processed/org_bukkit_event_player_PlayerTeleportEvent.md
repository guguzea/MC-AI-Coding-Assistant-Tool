---
title: "org.bukkit.event.player.PlayerTeleportEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerTeleportEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerTeleportEvent**
`public class PlayerTeleportEvent extends PlayerMoveEvent`
- `public PlayerTeleportEvent(@NotNull Player player, @NotNull Location from, @Nullable Location to)`
- `public PlayerTeleportEvent(@NotNull Player player, @NotNull Location from, @Nullable Location to, @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `@NotNull public PlayerTeleportEvent.TeleportCause getCause()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
