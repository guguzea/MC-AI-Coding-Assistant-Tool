---
title: "org.bukkit.entity.Projectile"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/entity/Projectile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

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
