---
title: "org.bukkit.entity.AbstractArrow"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/entity/AbstractArrow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `int getKnockbackStrength()`
- `void setKnockbackStrength(int knockbackStrength)`
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
- `void setShotFromCrossbow(boolean shotFromCrossbow)`
- `@NotNull ItemStack getItemStack()`
- `void setLifetimeTicks(int ticks)`
- `int getLifetimeTicks()`
- `@NotNull Sound getHitSound()`
- `void setHitSound(@NotNull Sound sound)`
- `void setNoPhysics(boolean noPhysics)`
- `boolean hasNoPhysics()`
- `@Deprecated default AbstractArrow.PickupRule getPickupRule()`
- `@Deprecated default void setPickupRule(AbstractArrow.PickupRule rule)`
