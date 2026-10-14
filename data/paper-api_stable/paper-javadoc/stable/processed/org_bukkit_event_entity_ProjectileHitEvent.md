---
title: "org.bukkit.event.entity.ProjectileHitEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/ProjectileHitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ProjectileHitEvent**
`public class ProjectileHitEvent extends EntityEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public ProjectileHitEvent(@NotNull @NotNull Projectile projectile)`
- `@Internal @Deprecated(forRemoval=true) public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity)`
- `@Internal @Deprecated(forRemoval=true) public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Block hitBlock)`
- `@Internal @Deprecated(forRemoval=true) public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock)`
- `@Internal public ProjectileHitEvent(@NotNull @NotNull Projectile projectile, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock, @Nullable @Nullable BlockFace hitFace)`
- `@NotNull public @NotNull Projectile getEntity()`
- `@Nullable public @Nullable Entity getHitEntity()`
- `@Nullable public @Nullable Block getHitBlock()`
- `@Nullable public @Nullable BlockFace getHitBlockFace()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
