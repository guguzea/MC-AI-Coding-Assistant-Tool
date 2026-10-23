---
title: "org.bukkit.inventory.view.BeaconView"
package: "org.bukkit.inventory.view"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.inventory.view.BeaconView extends org.bukkit.inventory.InventoryView`
- `public abstract org.bukkit.inventory.BeaconInventory getTopInventory()`
- `public abstract int getTier()`
- `public abstract org.bukkit.potion.PotionEffectType getPrimaryEffect()`
- `public abstract org.bukkit.potion.PotionEffectType getSecondaryEffect()`
- `public abstract void setPrimaryEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract void setSecondaryEffect(org.bukkit.potion.PotionEffectType)`
- `public default org.bukkit.inventory.Inventory getTopInventory()`
