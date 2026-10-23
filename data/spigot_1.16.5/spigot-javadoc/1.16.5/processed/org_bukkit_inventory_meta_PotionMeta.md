---
title: "org.bukkit.inventory.meta.PotionMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.inventory.meta.PotionMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract void setBasePotionData(org.bukkit.potion.PotionData)`
- `public abstract org.bukkit.potion.PotionData getBasePotionData()`
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
- `public default java.lang.Object clone() throws java.lang.CloneNotSupportedException`
