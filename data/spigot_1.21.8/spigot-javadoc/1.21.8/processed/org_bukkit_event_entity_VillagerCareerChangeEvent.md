---
title: "org.bukkit.event.entity.VillagerCareerChangeEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
