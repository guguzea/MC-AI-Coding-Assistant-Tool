---
title: "org.bukkit.event.world.GenericGameEvent"
package: "org.bukkit.event.world"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.world.GenericGameEvent extends org.bukkit.event.world.WorldEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.world.GenericGameEvent(org.bukkit.GameEvent, org.bukkit.Location, org.bukkit.entity.Entity, int, boolean)`
- `public org.bukkit.GameEvent getEvent()`
- `public org.bukkit.Location getLocation()`
- `public org.bukkit.entity.Entity getEntity()`
- `public int getRadius()`
- `public void setRadius(int)`
- `public void setCancelled(boolean)`
- `public boolean isCancelled()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
