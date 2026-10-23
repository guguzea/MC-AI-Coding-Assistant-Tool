---
title: "org.bukkit.event.entity.EntityTransformEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/EntityTransformEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EntityTransformEvent&#8203;(@NotNull @NotNull Entity original, @NotNull @NotNull List<Entity> convertedList, @NotNull @NotNull EntityTransformEvent.TransformReason transformReason)`
- `@NotNull public @NotNull Entity getTransformedEntity()`
- `@NotNull public @NotNull List<Entity> getTransformedEntities()`
- `@NotNull public @NotNull EntityTransformEvent.TransformReason getTransformReason()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
