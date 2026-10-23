---
title: "org.bukkit.entity.AbstractArrow"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/entity/AbstractArrow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated int getKnockbackStrength()`
- `@Deprecated void setKnockbackStrength(int knockbackStrength)`
- `double getDamage()`
- `void setDamage(double damage)`
- `int getPierceLevel()`
- `void setPierceLevel(int pierceLevel)`
- `boolean isCritical()`
- `void setCritical(boolean critical)`
- `boolean isInBlock()`
- `@Nullable @Nullable Block getAttachedBlock()`
- `@NotNull @NotNull AbstractArrow.PickupStatus getPickupStatus()`
- `void setPickupStatus(@NotNull @NotNull AbstractArrow.PickupStatus status)`
- `boolean isShotFromCrossbow()`
- `@Deprecated void setShotFromCrossbow(boolean shotFromCrossbow)`
- `@NotNull @Experimental @Deprecated(forRemoval=true, since="1.20.4") @NotNull ItemStack getItem()`
- `@Experimental @Deprecated(forRemoval=true, since="1.20.4") void setItem(@NotNull @NotNull ItemStack item)`
- `@Nullable @Experimental @Nullable ItemStack getWeapon()`
- `@Experimental void setWeapon(@NotNull @NotNull ItemStack item)`
- `@Deprecated default AbstractArrow.PickupRule getPickupRule()`
- `@Deprecated default void setPickupRule(AbstractArrow.PickupRule rule)`
- `@NotNull @NotNull ItemStack getItemStack()`
- `void setItemStack(@NotNull @NotNull ItemStack stack)`
- `void setLifetimeTicks(int ticks)`
- `int getLifetimeTicks()`
- `@NotNull Sound getHitSound()`
- `void setHitSound(@NotNull Sound sound)`
- `void setShooter(@Nullable ProjectileSource source, boolean resetPickupStatus)`
