---
title: "org.bukkit.event.entity.ProjectileHitEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/ProjectileHitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public ProjectileHitEvent(@NotNull @NotNull Projectile projectile)`
- `public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity)`
- `public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Block hitBlock)`
- `public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock)`
- `public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock, @Nullable @Nullable BlockFace hitFace)`
- `@NotNull public @NotNull Projectile getEntity()`
- `@Nullable public @Nullable Block getHitBlock()`
- `@Nullable public @Nullable BlockFace getHitBlockFace()`
- `@Nullable public @Nullable Entity getHitEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
