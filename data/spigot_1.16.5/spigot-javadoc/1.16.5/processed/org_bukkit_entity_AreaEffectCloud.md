---
title: "org.bukkit.entity.AreaEffectCloud"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.entity.AreaEffectCloud extends org.bukkit.entity.Entity`
- `public abstract int getDuration()`
- `public abstract void setDuration(int)`
- `public abstract int getWaitTime()`
- `public abstract void setWaitTime(int)`
- `public abstract int getReapplicationDelay()`
- `public abstract void setReapplicationDelay(int)`
- `public abstract int getDurationOnUse()`
- `public abstract void setDurationOnUse(int)`
- `public abstract float getRadius()`
- `public abstract void setRadius(float)`
- `public abstract float getRadiusOnUse()`
- `public abstract void setRadiusOnUse(float)`
- `public abstract float getRadiusPerTick()`
- `public abstract void setRadiusPerTick(float)`
- `public abstract org.bukkit.Particle getParticle()`
- `public abstract void setParticle(org.bukkit.Particle)`
- `public abstract <T> void setParticle(org.bukkit.Particle, T)`
- `public abstract void setBasePotionData(org.bukkit.potion.PotionData)`
- `public abstract org.bukkit.potion.PotionData getBasePotionData()`
- `public abstract boolean hasCustomEffects()`
- `public abstract java.util.List<org.bukkit.potion.PotionEffect> getCustomEffects()`
- `public abstract boolean addCustomEffect(org.bukkit.potion.PotionEffect, boolean)`
- `public abstract boolean removeCustomEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract boolean hasCustomEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract void clearCustomEffects()`
- `public abstract org.bukkit.Color getColor()`
- `public abstract void setColor(org.bukkit.Color)`
- `public abstract org.bukkit.projectiles.ProjectileSource getSource()`
- `public abstract void setSource(org.bukkit.projectiles.ProjectileSource)`
