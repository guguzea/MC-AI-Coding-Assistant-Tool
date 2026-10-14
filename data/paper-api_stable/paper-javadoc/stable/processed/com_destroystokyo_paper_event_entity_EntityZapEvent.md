---
title: "com.destroystokyo.paper.event.entity.EntityZapEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/entity/EntityZapEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityZapEvent**
`@NullMarked public class EntityZapEvent extends EntityTransformEvent implements Cancellable`
- `@Internal public EntityZapEvent(Entity entity, LightningStrike bolt, Entity replacementEntity)`
- `public LightningStrike getBolt()`
- `public Entity getReplacementEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
