---
title: "org.bukkit.inventory.meta.components.FoodComponent"
package: "org.bukkit.inventory.meta.components"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.inventory.meta.components.FoodComponent extends org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract int getNutrition()`
- `public abstract void setNutrition(int)`
- `public abstract float getSaturation()`
- `public abstract void setSaturation(float)`
- `public abstract boolean canAlwaysEat()`
- `public abstract void setCanAlwaysEat(boolean)`
- `public abstract float getEatSeconds()`
- `public abstract void setEatSeconds(float)`
- `public abstract java.util.List<org.bukkit.inventory.meta.components.FoodComponent$FoodEffect> getEffects()`
- `public abstract void setEffects(java.util.List<org.bukkit.inventory.meta.components.FoodComponent$FoodEffect>)`
- `public abstract org.bukkit.inventory.meta.components.FoodComponent$FoodEffect addEffect(org.bukkit.potion.PotionEffect, float)`
