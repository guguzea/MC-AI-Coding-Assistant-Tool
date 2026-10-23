---
title: "org.bukkit.event.world.GenericGameEvent"
package: "org.bukkit.event.world"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
