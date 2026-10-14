---
title: "org.bukkit.event.entity.ProjectileHitEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/ProjectileHitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ProjectileHitEvent**
`public class ProjectileHitEvent extends EntityEvent implements Cancellable`
- `public ProjectileHitEvent(@NotNull Projectile projectile)`
- `public ProjectileHitEvent(@NotNull Projectile projectile, @Nullable Entity hitEntity)`
- `public ProjectileHitEvent(@NotNull Projectile projectile, @Nullable Block hitBlock)`
- `public ProjectileHitEvent(@NotNull Projectile projectile, @Nullable Entity hitEntity, @Nullable Block hitBlock)`
- `public ProjectileHitEvent(@NotNull Projectile projectile, @Nullable Entity hitEntity, @Nullable Block hitBlock, @Nullable BlockFace hitFace)`
- `@NotNull public Projectile getEntity()`
- `@Nullable public Block getHitBlock()`
- `@Nullable public BlockFace getHitBlockFace()`
- `@Nullable public Entity getHitEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
