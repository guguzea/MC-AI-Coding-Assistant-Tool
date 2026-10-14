---
title: "org.bukkit.event.entity.EntityCombustEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityCombustEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityCombustEvent**
`public class EntityCombustEvent extends EntityEvent implements Cancellable`
- `@Deprecated(since="1.21") public EntityCombustEvent(@NotNull Entity combustee, int duration)`
- `public EntityCombustEvent(@NotNull Entity combustee, float duration)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public float getDuration()`
- `public void setDuration(float duration)`
- `@Deprecated(since="1.21", forRemoval=true) public void setDuration(int duration)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
