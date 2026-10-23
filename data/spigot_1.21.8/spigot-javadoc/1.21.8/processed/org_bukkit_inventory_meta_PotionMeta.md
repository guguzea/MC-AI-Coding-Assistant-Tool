---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
- `public abstract boolean hasCustomName()`
- `public abstract java.lang.String getCustomName()`
- `public abstract void setCustomName(java.lang.String)`
- `public abstract boolean hasDurationScale()`
- `public abstract float getDurationScale()`
- `public abstract void setDurationScale(java.lang.Float)`
- `public abstract org.bukkit.inventory.meta.PotionMeta clone()`
- `public default org.bukkit.inventory.meta.ItemMeta clone()`
