---
title: "org.bukkit.inventory.meta.components.consumable.ConsumableComponent"
package: "org.bukkit.inventory.meta.components.consumable"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
