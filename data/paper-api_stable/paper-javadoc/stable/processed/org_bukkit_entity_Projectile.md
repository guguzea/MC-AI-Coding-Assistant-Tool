---
title: "org.bukkit.entity.Projectile"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Projectile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Projectile**
`public interface Projectile extends Entity`
- `@Nullable @Nullable ProjectileSource getShooter()`
- `void setShooter(@Nullable @Nullable ProjectileSource source)`
- `@Deprecated(since="1.20.2", forRemoval=true) boolean doesBounce()`
- `@Deprecated(since="1.20.2", forRemoval=true) void setBounce(boolean doesBounce)`
- `boolean hasLeftShooter()`
- `void setHasLeftShooter(boolean leftShooter)`
- `boolean hasBeenShot()`
- `void setHasBeenShot(boolean beenShot)`
- `boolean canHitEntity(@NotNull @NotNull Entity entity)`
- `void hitEntity(@NotNull @NotNull Entity entity)`
- `void hitEntity(@NotNull @NotNull Entity entity, @NotNull Vector vector)`
- `@Nullable UUID getOwnerUniqueId()`
