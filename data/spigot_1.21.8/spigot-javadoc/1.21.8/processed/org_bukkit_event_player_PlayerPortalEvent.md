---
title: "org.bukkit.event.player.PlayerPortalEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.player.PlayerPortalEvent extends org.bukkit.event.player.PlayerTeleportEvent`
- `public org.bukkit.event.player.PlayerPortalEvent(org.bukkit.entity.Player, org.bukkit.Location, org.bukkit.Location)`
- `public org.bukkit.event.player.PlayerPortalEvent(org.bukkit.entity.Player, org.bukkit.Location, org.bukkit.Location, org.bukkit.event.player.PlayerTeleportEvent$TeleportCause)`
- `public org.bukkit.event.player.PlayerPortalEvent(org.bukkit.entity.Player, org.bukkit.Location, org.bukkit.Location, org.bukkit.event.player.PlayerTeleportEvent$TeleportCause, int, boolean, int)`
- `public void setSearchRadius(int)`
- `public int getSearchRadius()`
- `public boolean getCanCreatePortal()`
- `public void setCanCreatePortal(boolean)`
- `public void setCreationRadius(int)`
- `public int getCreationRadius()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
