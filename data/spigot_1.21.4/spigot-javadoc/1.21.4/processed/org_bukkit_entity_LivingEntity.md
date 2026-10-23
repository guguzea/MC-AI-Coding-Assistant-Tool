---
title: "org.bukkit.entity.LivingEntity"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.entity.LivingEntity extends org.bukkit.attribute.Attributable,org.bukkit.entity.Damageable,org.bukkit.projectiles.ProjectileSource`
- `public abstract double getEyeHeight()`
- `public abstract double getEyeHeight(boolean)`
- `public abstract org.bukkit.Location getEyeLocation()`
- `public abstract java.util.List<org.bukkit.block.Block> getLineOfSight(java.util.Set<org.bukkit.Material>, int)`
- `public abstract org.bukkit.block.Block getTargetBlock(java.util.Set<org.bukkit.Material>, int)`
- `public abstract java.util.List<org.bukkit.block.Block> getLastTwoTargetBlocks(java.util.Set<org.bukkit.Material>, int)`
- `public abstract org.bukkit.block.Block getTargetBlockExact(int)`
- `public abstract org.bukkit.block.Block getTargetBlockExact(int, org.bukkit.FluidCollisionMode)`
- `public abstract org.bukkit.util.RayTraceResult rayTraceBlocks(double)`
- `public abstract org.bukkit.util.RayTraceResult rayTraceBlocks(double, org.bukkit.FluidCollisionMode)`
- `public abstract int getRemainingAir()`
- `public abstract void setRemainingAir(int)`
- `public abstract int getMaximumAir()`
- `public abstract void setMaximumAir(int)`
- `public abstract org.bukkit.inventory.ItemStack getItemInUse()`
- `public abstract int getItemInUseTicks()`
- `public abstract void setItemInUseTicks(int)`
- `public abstract int getArrowCooldown()`
- `public abstract void setArrowCooldown(int)`
- `public abstract int getArrowsInBody()`
- `public abstract void setArrowsInBody(int)`
- `public abstract int getMaximumNoDamageTicks()`
- `public abstract void setMaximumNoDamageTicks(int)`
- `public abstract double getLastDamage()`
- `public abstract void setLastDamage(double)`
- `public abstract int getNoDamageTicks()`
- `public abstract void setNoDamageTicks(int)`
- `public abstract int getNoActionTicks()`
- `public abstract void setNoActionTicks(int)`
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
- `public abstract boolean isSwimming()`
- `public abstract void setSwimming(boolean)`
- `public abstract boolean isRiptiding()`
- `public abstract void setRiptiding(boolean)`
- `public abstract boolean isSleeping()`
- `public abstract boolean isClimbing()`
- `public abstract void setAI(boolean)`
- `public abstract boolean hasAI()`
- `public abstract void attack(org.bukkit.entity.Entity)`
- `public abstract void swingMainHand()`
- `public abstract void swingOffHand()`
- `public abstract void playHurtAnimation(float)`
- `public abstract void setCollidable(boolean)`
- `public abstract boolean isCollidable()`
- `public abstract java.util.Set<java.util.UUID> getCollidableExemptions()`
- `public abstract <T> T getMemory(org.bukkit.entity.memory.MemoryKey<T>)`
- `public abstract <T> void setMemory(org.bukkit.entity.memory.MemoryKey<T>, T)`
- `public abstract org.bukkit.Sound getHurtSound()`
- `public abstract org.bukkit.Sound getDeathSound()`
- `public abstract org.bukkit.Sound getFallDamageSound(int)`
- `public abstract org.bukkit.Sound getFallDamageSoundSmall()`
- `public abstract org.bukkit.Sound getFallDamageSoundBig()`
- `public abstract org.bukkit.Sound getDrinkingSound(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.Sound getEatingSound(org.bukkit.inventory.ItemStack)`
- `public abstract boolean canBreatheUnderwater()`
- `public abstract org.bukkit.entity.EntityCategory getCategory()`
- `public abstract void setInvisible(boolean)`
- `public abstract boolean isInvisible()`
