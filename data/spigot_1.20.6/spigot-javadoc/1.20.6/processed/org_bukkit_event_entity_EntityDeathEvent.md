---
title: "org.bukkit.event.entity.EntityDeathEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.entity.EntityDeathEvent extends org.bukkit.event.entity.EntityEvent`
- `public org.bukkit.event.entity.EntityDeathEvent(org.bukkit.entity.LivingEntity, org.bukkit.damage.DamageSource, java.util.List<org.bukkit.inventory.ItemStack>)`
- `public org.bukkit.event.entity.EntityDeathEvent(org.bukkit.entity.LivingEntity, org.bukkit.damage.DamageSource, java.util.List<org.bukkit.inventory.ItemStack>, int)`
- `public org.bukkit.entity.LivingEntity getEntity()`
- `public org.bukkit.damage.DamageSource getDamageSource()`
- `public int getDroppedExp()`
- `public void setDroppedExp(int)`
- `public java.util.List<org.bukkit.inventory.ItemStack> getDrops()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getEntity()`
