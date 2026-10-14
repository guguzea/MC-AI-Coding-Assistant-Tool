---
title: "org.bukkit.entity.Firework"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Firework.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Firework**
`public interface Firework extends Projectile`
- `@NotNull FireworkMeta getFireworkMeta()`
- `void setFireworkMeta(@NotNull FireworkMeta meta)`
- `boolean setAttachedTo(@Nullable LivingEntity entity)`
- `@Nullable LivingEntity getAttachedTo()`
- `boolean setLife(int ticks)`
- `int getLife()`
- `boolean setMaxLife(int ticks)`
- `int getMaxLife()`
- `void detonate()`
- `boolean isDetonated()`
- `boolean isShotAtAngle()`
- `void setShotAtAngle(boolean shotAtAngle)`
