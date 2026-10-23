---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.inventory.meta.PotionMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract void setBasePotionData(org.bukkit.potion.PotionData)`
- `public abstract org.bukkit.potion.PotionData getBasePotionData()`
- `public abstract void setBasePotionType(org.bukkit.potion.PotionType)`
- `public abstract org.bukkit.potion.PotionType getBasePotionType()`
- `public abstract boolean hasBasePotionType()`
- `public abstract boolean hasCustomEffects()`
- `public abstract java.util.List<org.bukkit.potion.PotionEffect> getCustomEffects()`
- `public abstract boolean addCustomEffect(org.bukkit.potion.PotionEffect, boolean)`
- `public abstract boolean removeCustomEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract boolean hasCustomEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract boolean setMainEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract boolean clearCustomEffects()`
- `public abstract boolean hasColor()`
- `public abstract org.bukkit.Color getColor()`
- `public abstract void setColor(org.bukkit.Color)`
- `public abstract org.bukkit.inventory.meta.PotionMeta clone()`
- `public default org.bukkit.inventory.meta.ItemMeta clone()`
