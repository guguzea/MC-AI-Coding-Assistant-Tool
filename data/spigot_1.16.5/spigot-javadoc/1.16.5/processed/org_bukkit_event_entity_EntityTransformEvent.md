---
title: "org.bukkit.event.entity.EntityTransformEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.event.entity.EntityTransformEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityTransformEvent(org.bukkit.entity.Entity, java.util.List<org.bukkit.entity.Entity>, org.bukkit.event.entity.EntityTransformEvent$TransformReason)`
- `public org.bukkit.entity.Entity getTransformedEntity()`
- `public java.util.List<org.bukkit.entity.Entity> getTransformedEntities()`
- `public org.bukkit.event.entity.EntityTransformEvent$TransformReason getTransformReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
