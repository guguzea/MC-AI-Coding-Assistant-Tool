---
title: "org.bukkit.event.entity.EntityDeathEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
