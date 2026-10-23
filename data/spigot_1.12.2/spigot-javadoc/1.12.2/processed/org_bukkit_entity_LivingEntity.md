---
title: "org.bukkit.entity.LivingEntity"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.entity.LivingEntity extends org.bukkit.attribute.Attributable,org.bukkit.entity.Entity,org.bukkit.entity.Damageable,org.bukkit.projectiles.ProjectileSource`
- `public abstract double getEyeHeight()`
- `public abstract double getEyeHeight(boolean)`
- `public abstract org.bukkit.Location getEyeLocation()`
- `public abstract java.util.List<org.bukkit.block.Block> getLineOfSight(java.util.Set<org.bukkit.Material>, int)`
- `public abstract org.bukkit.block.Block getTargetBlock(java.util.Set<org.bukkit.Material>, int)`
- `public abstract java.util.List<org.bukkit.block.Block> getLastTwoTargetBlocks(java.util.Set<org.bukkit.Material>, int)`
- `public abstract int getRemainingAir()`
- `public abstract void setRemainingAir(int)`
- `public abstract int getMaximumAir()`
- `public abstract void setMaximumAir(int)`
- `public abstract int getMaximumNoDamageTicks()`
- `public abstract void setMaximumNoDamageTicks(int)`
- `public abstract double getLastDamage()`
- `public abstract void setLastDamage(double)`
- `public abstract int getNoDamageTicks()`
- `public abstract void setNoDamageTicks(int)`
- `public abstract org.bukkit.entity.Player getKiller()`
- `public abstract boolean addPotionEffect(org.bukkit.potion.PotionEffect)`
- `public abstract boolean addPotionEffect(org.bukkit.potion.PotionEffect, boolean)`
- `public abstract boolean addPotionEffects(java.util.Collection<org.bukkit.potion.PotionEffect>)`
- `public abstract boolean hasPotionEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract org.bukkit.potion.PotionEffect getPotionEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract void removePotionEffect(org.bukkit.potion.PotionEffectType)`
- `public abstract java.util.Collection<org.bukkit.potion.PotionEffect> getActivePotionEffects()`
- `public abstract boolean hasLineOfSight(org.bukkit.entity.Entity)`
- `public abstract boolean getRemoveWhenFarAway()`
- `public abstract void setRemoveWhenFarAway(boolean)`
- `public abstract org.bukkit.inventory.EntityEquipment getEquipment()`
- `public abstract void setCanPickupItems(boolean)`
- `public abstract boolean getCanPickupItems()`
- `public abstract boolean isLeashed()`
- `public abstract org.bukkit.entity.Entity getLeashHolder() throws java.lang.IllegalStateException`
- `public abstract boolean setLeashHolder(org.bukkit.entity.Entity)`
- `public abstract boolean isGliding()`
- `public abstract void setGliding(boolean)`
- `public abstract void setAI(boolean)`
- `public abstract boolean hasAI()`
- `public abstract void setCollidable(boolean)`
- `public abstract boolean isCollidable()`
