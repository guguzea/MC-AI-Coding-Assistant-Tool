---
title: "org.bukkit.event.entity.EntityTargetEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityTargetEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityTargetEvent**
`public class EntityTargetEvent extends EntityEvent implements Cancellable`
- `public EntityTargetEvent(@NotNull Entity entity, @Nullable Entity target, @NotNull EntityTargetEvent.TargetReason reason)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public EntityTargetEvent.TargetReason getReason()`
- `@Nullable public Entity getTarget()`
- `public void setTarget(@Nullable Entity target)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
