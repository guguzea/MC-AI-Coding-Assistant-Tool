---
title: "org.bukkit.event.entity.EntityPortalEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.entity.EntityPortalEvent extends org.bukkit.event.entity.EntityTeleportEvent`
- `protected boolean useTravelAgent`
- `protected org.bukkit.TravelAgent travelAgent`
- `public org.bukkit.event.entity.EntityPortalEvent(org.bukkit.entity.Entity, org.bukkit.Location, org.bukkit.Location, org.bukkit.TravelAgent)`
- `public void useTravelAgent(boolean)`
- `public boolean useTravelAgent()`
- `public org.bukkit.TravelAgent getPortalTravelAgent()`
- `public void setPortalTravelAgent(org.bukkit.TravelAgent)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
