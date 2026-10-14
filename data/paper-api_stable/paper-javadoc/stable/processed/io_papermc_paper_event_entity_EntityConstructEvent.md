---
title: "io.papermc.paper.event.entity.EntityConstructEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityConstructEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityConstructEvent**
`@NullMarked public class EntityConstructEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityConstructEvent(Entity entity, List<Block> blocks)`
- `public @Unmodifiable List<Block> getBlocks()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
