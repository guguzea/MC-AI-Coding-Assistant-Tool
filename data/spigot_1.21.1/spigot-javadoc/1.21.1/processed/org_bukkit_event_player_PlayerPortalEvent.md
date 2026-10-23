---
title: "org.bukkit.event.player.PlayerPortalEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
