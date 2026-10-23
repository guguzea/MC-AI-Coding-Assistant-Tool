---
title: "org.bukkit.event.entity.VillagerReputationChangeEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.entity.VillagerReputationChangeEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.VillagerReputationChangeEvent(org.bukkit.entity.Villager, java.util.UUID, org.bukkit.entity.Villager$ReputationEvent, org.bukkit.entity.Villager$ReputationType, int, int, int)`
- `public java.util.UUID getTargetUUID()`
- `public org.bukkit.entity.Entity getTarget()`
- `public org.bukkit.entity.Villager$ReputationEvent getReason()`
- `public org.bukkit.entity.Villager$ReputationType getReputationType()`
- `public int getOldValue()`
- `public int getNewValue()`
- `public void setNewValue(int)`
- `public int getMaxValue()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.entity.Villager getEntity()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getEntity()`
