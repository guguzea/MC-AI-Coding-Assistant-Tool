---
title: "org.bukkit.event.entity.EntityTargetBlockEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityTargetBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityTargetBlockEvent**
`@Experimental public class EntityTargetBlockEvent extends EntityEvent implements Cancellable`
- `public EntityTargetBlockEvent(@NotNull Entity entity, @Nullable Block target)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@Nullable public Block getTarget()`
- `public void setTarget(@Nullable Block target)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
