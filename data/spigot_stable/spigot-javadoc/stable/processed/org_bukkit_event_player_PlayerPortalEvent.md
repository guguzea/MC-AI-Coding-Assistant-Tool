---
title: "org.bukkit.event.player.PlayerPortalEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerPortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerPortalEvent**
`public class PlayerPortalEvent extends PlayerTeleportEvent`
- `public PlayerPortalEvent(@NotNull Player player, @NotNull Location from, @Nullable Location to)`
- `public PlayerPortalEvent(@NotNull Player player, @NotNull Location from, @Nullable Location to, @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `public PlayerPortalEvent(@NotNull Player player, @NotNull Location from, @Nullable Location to, @NotNull PlayerTeleportEvent.TeleportCause cause, int getSearchRadius, boolean canCreatePortal, int creationRadius)`
- `public void setSearchRadius(int searchRadius)`
- `public int getSearchRadius()`
- `public boolean getCanCreatePortal()`
- `public void setCanCreatePortal(boolean canCreatePortal)`
- `public void setCreationRadius(int creationRadius)`
- `public int getCreationRadius()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
