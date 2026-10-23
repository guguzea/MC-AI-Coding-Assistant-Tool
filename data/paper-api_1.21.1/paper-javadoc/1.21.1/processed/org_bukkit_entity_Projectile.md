---
title: "org.bukkit.entity.Projectile"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/entity/Projectile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable ProjectileSource getShooter()`
- `void setShooter(@Nullable @Nullable ProjectileSource source)`
- `@Deprecated(forRemoval=true) boolean doesBounce()`
- `@Deprecated(forRemoval=true) void setBounce(boolean doesBounce)`
- `boolean hasLeftShooter()`
- `void setHasLeftShooter(boolean leftShooter)`
- `boolean hasBeenShot()`
- `void setHasBeenShot(boolean beenShot)`
- `boolean canHitEntity(@NotNull @NotNull Entity entity)`
- `void hitEntity(@NotNull @NotNull Entity entity)`
- `void hitEntity(@NotNull @NotNull Entity entity, @NotNull Vector vector)`
- `@Nullable UUID getOwnerUniqueId()`
