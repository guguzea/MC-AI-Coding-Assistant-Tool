---
title: "org.bukkit.event.entity.EntityTargetEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityTargetEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityTargetEvent**
`public class EntityTargetEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityTargetEvent(@NotNull @NotNull Entity entity, @Nullable @Nullable Entity target, @NotNull @NotNull EntityTargetEvent.TargetReason reason)`
- `@NotNull public @NotNull EntityTargetEvent.TargetReason getReason()`
- `@Nullable public @Nullable Entity getTarget()`
- `public void setTarget(@Nullable @Nullable Entity target)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
