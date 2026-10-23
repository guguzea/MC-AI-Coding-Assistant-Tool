---
title: "org.bukkit.inventory.view.BeaconView"
package: "org.bukkit.inventory.view"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.inventory.view.BeaconView extends org.bukkit.inventory.InventoryView`
- `public abstract org.bukkit.inventory.BeaconInventory getTopInventory()`
- `public abstract int getTier()`
- `public abstract org.bukkit.potion.PotionEffectType getPrimaryEffect()`
- `public abstract org.bukkit.potion.PotionEffectType getSecondaryEffect()`
- `public abstract void setPrimaryEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract void setSecondaryEffect(org.bukkit.potion.PotionEffectType)`
- `public default org.bukkit.inventory.Inventory getTopInventory()`
