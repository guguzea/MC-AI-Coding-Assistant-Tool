---
title: "org.bukkit.event.entity.EntityExplodeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityExplodeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityExplodeEvent**
`public class EntityExplodeEvent extends EntityEvent implements Cancellable`
- `public EntityExplodeEvent(@NotNull Entity what, @NotNull Location location, @NotNull List<Block> blocks, float yield, @NotNull ExplosionResult result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public ExplosionResult getExplosionResult()`
- `@NotNull public List<Block> blockList()`
- `@NotNull public Location getLocation()`
- `public float getYield()`
- `public void setYield(float yield)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
