---
title: "org.bukkit.event.entity.ProjectileHitEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/ProjectileHitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public ProjectileHitEvent&#8203;(@NotNull @NotNull Projectile projectile)`
- `public ProjectileHitEvent&#8203;(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity)`
- `public ProjectileHitEvent&#8203;(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Block hitBlock)`
- `public ProjectileHitEvent&#8203;(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock)`
- `public ProjectileHitEvent&#8203;(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock, @Nullable @Nullable BlockFace hitFace)`
- `@NotNull public @NotNull Projectile getEntity()`
- `@Nullable public @Nullable Block getHitBlock()`
- `@Nullable public @Nullable BlockFace getHitBlockFace()`
- `@Nullable public @Nullable Entity getHitEntity()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
