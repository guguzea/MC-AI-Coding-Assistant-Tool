---
title: "org.bukkit.entity.Firework"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/entity/Firework.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull FireworkMeta getFireworkMeta()`
- `void setFireworkMeta(@NotNull @NotNull FireworkMeta meta)`
- `boolean setAttachedTo(@Nullable @Nullable LivingEntity entity)`
- `@Nullable @Nullable LivingEntity getAttachedTo()`
- `@Deprecated(forRemoval=true) boolean setLife(int ticks)`
- `@Deprecated(forRemoval=true) int getLife()`
- `@Deprecated(forRemoval=true) boolean setMaxLife(int ticks)`
- `@Deprecated(forRemoval=true) int getMaxLife()`
- `void detonate()`
- `boolean isDetonated()`
- `boolean isShotAtAngle()`
- `void setShotAtAngle(boolean shotAtAngle)`
- `@Nullable UUID getSpawningEntity()`
- `@Nullable @Deprecated default @Nullable LivingEntity getBoostedEntity()`
- `@NotNull ItemStack getItem()`
- `void setItem(@Nullable ItemStack itemStack)`
- `int getTicksFlown()`
- `void setTicksFlown(int ticks)`
- `int getTicksToDetonate()`
- `void setTicksToDetonate(int ticks)`
