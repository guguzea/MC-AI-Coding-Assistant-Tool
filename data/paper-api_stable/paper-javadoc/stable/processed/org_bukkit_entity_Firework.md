---
title: "org.bukkit.entity.Firework"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Firework.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Firework**
`@NullMarked public interface Firework extends Projectile`
- `@Obsolete FireworkMeta getFireworkMeta()`
- `@Obsolete void setFireworkMeta(FireworkMeta meta)`
- `boolean setAttachedTo(@Nullable LivingEntity entity)`
- `@Nullable LivingEntity getAttachedTo()`
- `@Deprecated(forRemoval=true, since="1.18.2") boolean setLife(int ticks)`
- `@Deprecated(forRemoval=true, since="1.18.2") default int getLife()`
- `@Deprecated(forRemoval=true, since="1.18.2") boolean setMaxLife(int ticks)`
- `@Deprecated(forRemoval=true, since="1.18.2") default int getMaxLife()`
- `void detonate()`
- `boolean isDetonated()`
- `boolean isShotAtAngle()`
- `void setShotAtAngle(boolean shotAtAngle)`
- `@Nullable UUID getSpawningEntity()`
- `@Deprecated(since="1.18.2") default @Nullable LivingEntity getBoostedEntity()`
- `ItemStack getItem()`
- `void setItem(@Nullable ItemStack itemStack)`
- `int getTicksFlown()`
- `void setTicksFlown(int ticks)`
- `int getTicksToDetonate()`
- `void setTicksToDetonate(int ticks)`
