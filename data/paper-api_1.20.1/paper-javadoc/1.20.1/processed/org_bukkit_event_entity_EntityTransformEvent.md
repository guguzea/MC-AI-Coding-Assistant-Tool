---
title: "org.bukkit.event.entity.EntityTransformEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityTransformEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityTransformEvent(@NotNull @NotNull Entity original, @NotNull @NotNull List<Entity> convertedList, @NotNull @NotNull EntityTransformEvent.TransformReason transformReason)`
- `@NotNull public @NotNull Entity getTransformedEntity()`
- `@NotNull public @NotNull List<Entity> getTransformedEntities()`
- `@NotNull public @NotNull EntityTransformEvent.TransformReason getTransformReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
