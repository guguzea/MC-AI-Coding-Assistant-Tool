---
title: "org.bukkit.event.entity.EntityExplodeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/EntityExplodeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public EntityExplodeEvent(@NotNull @NotNull Entity what, @NotNull @NotNull Location location, @NotNull @NotNull List<Block> blocks, float yield, @NotNull @NotNull ExplosionResult result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull ExplosionResult getExplosionResult()`
- `@NotNull public @NotNull List<Block> blockList()`
- `@NotNull public @NotNull Location getLocation()`
- `public float getYield()`
- `public void setYield(float yield)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
