---
title: "org.bukkit.entity.AbstractArrow"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/AbstractArrow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AbstractArrow**
`public interface AbstractArrow extends Projectile`
- `@Deprecated(since="1.21", forRemoval=true) int getKnockbackStrength()`
- `@Deprecated(since="1.21", forRemoval=true) void setKnockbackStrength(int knockbackStrength)`
- `double getDamage()`
- `void setDamage(double damage)`
- `int getPierceLevel()`
- `void setPierceLevel(int pierceLevel)`
- `boolean isCritical()`
- `void setCritical(boolean critical)`
- `boolean isInBlock()`
- `@Nullable @Deprecated(since="1.21.4") @Nullable Block getAttachedBlock()`
- `@NotNull @NotNull @Unmodifiable List<Block> getAttachedBlocks()`
- `@NotNull @NotNull AbstractArrow.PickupStatus getPickupStatus()`
- `void setPickupStatus(@NotNull @NotNull AbstractArrow.PickupStatus status)`
- `boolean isShotFromCrossbow()`
- `@Deprecated(since="1.21", forRemoval=true) void setShotFromCrossbow(boolean shotFromCrossbow)`
- `@NotNull @Deprecated(forRemoval=true, since="1.20.4") @NotNull ItemStack getItem()`
- `@Deprecated(forRemoval=true, since="1.20.4") void setItem(@NotNull @NotNull ItemStack item)`
- `@Nullable @Nullable ItemStack getWeapon()`
- `void setWeapon(@NotNull @NotNull ItemStack item)`
- `@Deprecated default AbstractArrow.PickupRule getPickupRule()`
- `@Deprecated default void setPickupRule(AbstractArrow.PickupRule rule)`
- `@NotNull @NotNull ItemStack getItemStack()`
- `void setItemStack(@NotNull @NotNull ItemStack stack)`
- `void setLifetimeTicks(int ticks)`
- `int getLifetimeTicks()`
- `@NotNull Sound getHitSound()`
- `void setHitSound(@NotNull Sound sound)`
- `void setShooter(@Nullable ProjectileSource source, boolean resetPickupStatus)`
