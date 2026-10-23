---
title: "org.bukkit.event.entity.VillagerCareerChangeEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.event.entity.VillagerCareerChangeEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.VillagerCareerChangeEvent(org.bukkit.entity.Villager, org.bukkit.entity.Villager$Profession, org.bukkit.event.entity.VillagerCareerChangeEvent$ChangeReason)`
- `public org.bukkit.entity.Villager getEntity()`
- `public org.bukkit.entity.Villager$Profession getProfession()`
- `public void setProfession(org.bukkit.entity.Villager$Profession)`
- `public org.bukkit.event.entity.VillagerCareerChangeEvent$ChangeReason getReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getEntity()`
