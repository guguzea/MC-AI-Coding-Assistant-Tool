---
title: "io.papermc.paper.event.entity.EntityDyeEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityDyeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityDyeEvent**
`@NullMarked public class EntityDyeEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityDyeEvent(Entity entity, DyeColor dyeColor, @Nullable Player player)`
- `public DyeColor getColor()`
- `public void setColor(DyeColor dyeColor)`
- `public @Nullable Player getPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
