---
title: "org.bukkit.entity.LivingEntity"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/entity/LivingEntity.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `boolean addPotionEffect(PotionEffect effect)`
- `boolean addPotionEffect(PotionEffect effect, boolean force)`
- `boolean addPotionEffects(Collection<PotionEffect> effects)`
- `ItemStack getActiveItem()`
- `Collection<PotionEffect> getActivePotionEffects()`
- `int getArrowsStuck()`
- `boolean getCanPickupItems()`
- `EntityEquipment getEquipment()`
- `double getEyeHeight()`
- `double getEyeHeight(boolean ignorePose)`
- `Location getEyeLocation()`
- `int getHandRaisedTime()`
- `int getItemUseRemainingTime()`
- `Player getKiller()`
- `double getLastDamage()`
- `List<Block> getLastTwoTargetBlocks(Set<Material> transparent, int maxDistance)`
- `Entity getLeashHolder()`
- `List<Block> getLineOfSight(Set<Material> transparent, int maxDistance)`
- `int getMaximumAir()`
- `int getMaximumNoDamageTicks()`
- `int getNoDamageTicks()`
- `PotionEffect getPotionEffect(PotionEffectType type)`
- `int getRemainingAir()`
- `boolean getRemoveWhenFarAway()`
- `int getShieldBlockingDelay()`
- `Block getTargetBlock(Set<Material> transparent, int maxDistance)`
- `boolean hasAI()`
- `boolean hasLineOfSight(Entity other)`
- `boolean hasPotionEffect(PotionEffectType type)`
- `boolean isCollidable()`
- `boolean isGliding()`
- `boolean isHandRaised()`
- `boolean isLeashed()`
- `void removePotionEffect(PotionEffectType type)`
- `void setAI(boolean ai)`
- `void setArrowsStuck(int arrows)`
- `void setCanPickupItems(boolean pickup)`
- `void setCollidable(boolean collidable)`
- `void setGliding(boolean gliding)`
- `void setKiller(Player killer)`
- `void setLastDamage(double damage)`
- `boolean setLeashHolder(Entity holder)`
- `void setMaximumAir(int ticks)`
- `void setMaximumNoDamageTicks(int ticks)`
- `void setNoDamageTicks(int ticks)`
- `void setRemainingAir(int ticks)`
- `void setRemoveWhenFarAway(boolean remove)`
- `void setShieldBlockingDelay(int delay)`
