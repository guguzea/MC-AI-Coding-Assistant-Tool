---
title: "org.bukkit.event.entity.PlayerDeathEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.entity.PlayerDeathEvent extends org.bukkit.event.entity.EntityDeathEvent`
- `public org.bukkit.event.entity.PlayerDeathEvent(org.bukkit.entity.Player, java.util.List<org.bukkit.inventory.ItemStack>, int, java.lang.String)`
- `public org.bukkit.event.entity.PlayerDeathEvent(org.bukkit.entity.Player, java.util.List<org.bukkit.inventory.ItemStack>, int, int, java.lang.String)`
- `public org.bukkit.event.entity.PlayerDeathEvent(org.bukkit.entity.Player, java.util.List<org.bukkit.inventory.ItemStack>, int, int, int, int, java.lang.String)`
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
