---
title: "org.bukkit.event.entity.EntityCombustEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityCombustEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityCombustEvent**
`public class EntityCombustEvent extends EntityEvent implements Cancellable`
- `@Internal @Deprecated(since="1.21", forRemoval=true) public EntityCombustEvent(@NotNull @NotNull Entity combustee, int duration)`
- `@Internal public EntityCombustEvent(@NotNull @NotNull Entity combustee, float duration)`
- `public float getDuration()`
- `public void setDuration(float duration)`
- `@Deprecated(since="1.21", forRemoval=true) public void setDuration(int duration)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
