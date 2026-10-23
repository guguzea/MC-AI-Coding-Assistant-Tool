---
title: "org.bukkit.event.entity.EntityBreedEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.entity.EntityBreedEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityBreedEvent(org.bukkit.entity.LivingEntity, org.bukkit.entity.LivingEntity, org.bukkit.entity.LivingEntity, org.bukkit.entity.LivingEntity, org.bukkit.inventory.ItemStack, int)`
- `public org.bukkit.entity.LivingEntity getEntity()`
- `public org.bukkit.entity.LivingEntity getMother()`
- `public org.bukkit.entity.LivingEntity getFather()`
- `public org.bukkit.entity.LivingEntity getBreeder()`
- `public org.bukkit.inventory.ItemStack getBredWith()`
- `public int getExperience()`
- `public void setExperience(int)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getEntity()`
