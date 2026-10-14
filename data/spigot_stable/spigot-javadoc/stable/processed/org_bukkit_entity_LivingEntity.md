---
title: "org.bukkit.entity.LivingEntity"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/LivingEntity.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface LivingEntity**
`public interface LivingEntity extends Attributable, Damageable, Leashable, ProjectileSource`
- `double getEyeHeight()`
- `double getEyeHeight(boolean ignorePose)`
- `@NotNull Location getEyeLocation()`
- `@NotNull List<Block> getLineOfSight(@Nullable Set<Material> transparent, int maxDistance)`
- `@NotNull Block getTargetBlock(@Nullable Set<Material> transparent, int maxDistance)`
- `@NotNull List<Block> getLastTwoTargetBlocks(@Nullable Set<Material> transparent, int maxDistance)`
- `@Nullable Block getTargetBlockExact(int maxDistance)`
- `@Nullable Block getTargetBlockExact(int maxDistance, @NotNull FluidCollisionMode fluidCollisionMode)`
- `@Nullable RayTraceResult rayTraceBlocks(double maxDistance)`
- `@Nullable RayTraceResult rayTraceBlocks(double maxDistance, @NotNull FluidCollisionMode fluidCollisionMode)`
- `int getRemainingAir()`
- `void setRemainingAir(int ticks)`
- `int getMaximumAir()`
- `void setMaximumAir(int ticks)`
- `@Nullable ItemStack getItemInUse()`
- `int getItemInUseTicks()`
- `void setItemInUseTicks(int ticks)`
- `int getArrowCooldown()`
- `void setArrowCooldown(int ticks)`
- `int getArrowsInBody()`
- `void setArrowsInBody(int count)`
- `int getMaximumNoDamageTicks()`
- `void setMaximumNoDamageTicks(int ticks)`
- `double getLastDamage()`
- `void setLastDamage(double damage)`
- `int getNoDamageTicks()`
- `void setNoDamageTicks(int ticks)`
- `int getNoActionTicks()`
- `void setNoActionTicks(int ticks)`
- `@Nullable Player getKiller()`
- `boolean addPotionEffect(@NotNull PotionEffect effect)`
- `@Deprecated(since="1.15.2") boolean addPotionEffect(@NotNull PotionEffect effect, boolean force)`
- `boolean addPotionEffects(@NotNull Collection<PotionEffect> effects)`
- `boolean hasPotionEffect(@NotNull PotionEffectType type)`
- `@Nullable PotionEffect getPotionEffect(@NotNull PotionEffectType type)`
- `void removePotionEffect(@NotNull PotionEffectType type)`
- `@NotNull Collection<PotionEffect> getActivePotionEffects()`
- `boolean hasLineOfSight(@NotNull Entity other)`
- `boolean getRemoveWhenFarAway()`
- `void setRemoveWhenFarAway(boolean remove)`
- `@Nullable EntityEquipment getEquipment()`
- `void setCanPickupItems(boolean pickup)`
- `boolean getCanPickupItems()`
- `boolean isGliding()`
- `void setGliding(boolean gliding)`
- `boolean isSwimming()`
- `void setSwimming(boolean swimming)`
- `boolean isRiptiding()`
- `void setRiptiding(boolean riptiding)`
- `boolean isSleeping()`
- `boolean isClimbing()`
- `void setAI(boolean ai)`
- `boolean hasAI()`
- `void attack(@NotNull Entity target)`
- `void swingMainHand()`
- `void swingOffHand()`
- `void playHurtAnimation(float yaw)`
- `void setCollidable(boolean collidable)`
- `boolean isCollidable()`
- `@NotNull Set<UUID> getCollidableExemptions()`
- `@Nullable <T> T getMemory(@NotNull MemoryKey<T> memoryKey)`
- `<T> void setMemory(@NotNull MemoryKey<T> memoryKey, @Nullable T memoryValue)`
- `@Nullable Sound getHurtSound()`
- `@Nullable Sound getDeathSound()`
- `@NotNull Sound getFallDamageSound(int fallHeight)`
- `@NotNull Sound getFallDamageSoundSmall()`
- `@NotNull Sound getFallDamageSoundBig()`
- `@NotNull Sound getDrinkingSound(@NotNull ItemStack itemStack)`
- `@NotNull Sound getEatingSound(@NotNull ItemStack itemStack)`
- `boolean canBreatheUnderwater()`
- `@NotNull @Deprecated(since="1.20.5") EntityCategory getCategory()`
- `void setInvisible(boolean invisible)`
- `boolean isInvisible()`
- `@Nullable Color getWaypointColor()`
- `void setWaypointColor(@Nullable Color color)`
- `@NotNull NamespacedKey getWaypointStyle()`
- `void setWaypointStyle(@Nullable NamespacedKey key)`
