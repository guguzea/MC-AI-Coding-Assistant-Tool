---
title: "org.bukkit.event.entity.EntityExplodeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityExplodeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityExplodeEvent**
`public class EntityExplodeEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityExplodeEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location location, @NotNull @NotNull List<Block> blocks, float yield, @NotNull @NotNull ExplosionResult result)`
- `@NotNull public @NotNull ExplosionResult getExplosionResult()`
- `@NotNull public @NotNull List<Block> blockList()`
- `@NotNull public @NotNull Location getLocation()`
- `public float getYield()`
- `public void setYield(float yield)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
