---
title: "org.bukkit.inventory.meta.components.consumable.ConsumableComponent"
package: "org.bukkit.inventory.meta.components.consumable"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.inventory.meta.components.consumable.ConsumableComponent extends org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract float getConsumeSeconds()`
- `public abstract void setConsumeSeconds(float)`
- `public abstract org.bukkit.inventory.meta.components.consumable.ConsumableComponent$Animation getAnimation()`
- `public abstract void setAnimation(org.bukkit.inventory.meta.components.consumable.ConsumableComponent$Animation)`
- `public abstract org.bukkit.Sound getSound()`
- `public abstract void setSound(org.bukkit.Sound)`
- `public abstract boolean hasConsumeParticles()`
- `public abstract void setConsumeParticles(boolean)`
- `public abstract java.util.List<org.bukkit.inventory.meta.components.consumable.effects.ConsumableEffect> getEffects()`
- `public abstract void setEffects(java.util.List<org.bukkit.inventory.meta.components.consumable.effects.ConsumableEffect>)`
- `public abstract org.bukkit.inventory.meta.components.consumable.effects.ConsumableEffect addEffect(org.bukkit.inventory.meta.components.consumable.effects.ConsumableEffect)`
