---
title: "org.bukkit.event.player.PlayerPortalEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
