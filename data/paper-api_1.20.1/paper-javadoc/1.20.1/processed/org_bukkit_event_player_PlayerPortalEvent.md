---
title: "org.bukkit.event.player.PlayerPortalEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerPortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerPortalEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `public PlayerPortalEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `public PlayerPortalEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause, int getSearchRadius, boolean canCreatePortal, int creationRadius)`
- `@NotNull public @NotNull Location getTo()`
- `public void setTo(@NotNull @NotNull Location to)`
- `@Deprecated public boolean willDismountPlayer()`
- `@Deprecated @NotNull public Set<@NotNull TeleportFlag.Relative> getRelativeTeleportationFlags()`
- `public void setSearchRadius(int searchRadius)`
- `public int getSearchRadius()`
- `public boolean getCanCreatePortal()`
- `public void setCanCreatePortal(boolean canCreatePortal)`
- `public void setCreationRadius(int creationRadius)`
- `public int getCreationRadius()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
