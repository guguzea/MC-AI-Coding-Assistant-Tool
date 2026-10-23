---
title: "org.bukkit.event.entity.PlayerDeathEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.entity.PlayerDeathEvent extends org.bukkit.event.entity.EntityDeathEvent`
- `public org.bukkit.event.entity.PlayerDeathEvent(org.bukkit.entity.Player, org.bukkit.damage.DamageSource, java.util.List<org.bukkit.inventory.ItemStack>, int, java.lang.String)`
- `public org.bukkit.event.entity.PlayerDeathEvent(org.bukkit.entity.Player, org.bukkit.damage.DamageSource, java.util.List<org.bukkit.inventory.ItemStack>, int, int, java.lang.String)`
- `public org.bukkit.event.entity.PlayerDeathEvent(org.bukkit.entity.Player, org.bukkit.damage.DamageSource, java.util.List<org.bukkit.inventory.ItemStack>, int, int, int, int, java.lang.String)`
- `public org.bukkit.entity.Player getEntity()`
- `public void setDeathMessage(java.lang.String)`
- `public java.lang.String getDeathMessage()`
- `public int getNewExp()`
- `public void setNewExp(int)`
- `public int getNewLevel()`
- `public void setNewLevel(int)`
- `public int getNewTotalExp()`
- `public void setNewTotalExp(int)`
- `public boolean getKeepLevel()`
- `public void setKeepLevel(boolean)`
- `public void setKeepInventory(boolean)`
- `public boolean getKeepInventory()`
- `public org.bukkit.entity.LivingEntity getEntity()`
- `public org.bukkit.entity.Entity getEntity()`
