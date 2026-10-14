---
title: "org.bukkit.event.player.PlayerPortalEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerPortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerPortalEvent**
`public class PlayerPortalEvent extends PlayerTeleportEvent`
- `@Internal public PlayerPortalEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `@Internal public PlayerPortalEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause)`
- `@Internal public PlayerPortalEvent(@NotNull @NotNull Player player, @NotNull @NotNull Location from, @Nullable @Nullable Location to, @NotNull @NotNull PlayerTeleportEvent.TeleportCause cause, int searchRadius, boolean canCreatePortal, int creationRadius)`
- `@NotNull public @NotNull Location getTo()`
- `public void setTo(@NotNull @NotNull Location to)`
- `public void setSearchRadius(int searchRadius)`
- `public int getSearchRadius()`
- `public boolean getCanCreatePortal()`
- `public void setCanCreatePortal(boolean canCreatePortal)`
- `public void setCreationRadius(int creationRadius)`
- `public int getCreationRadius()`
- `@Deprecated(forRemoval=true) public boolean willDismountPlayer()`
- `@Deprecated(forRemoval=true) @NotNull public @NotNull Set<TeleportFlag.Relative> getRelativeTeleportationFlags()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
