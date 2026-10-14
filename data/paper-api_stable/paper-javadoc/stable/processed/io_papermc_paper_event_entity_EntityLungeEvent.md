---
title: "io.papermc.paper.event.entity.EntityLungeEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityLungeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityLungeEvent**
`@NullMarked public class EntityLungeEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityLungeEvent(LivingEntity entity, int lungePower)`
- `public int getLungePower()`
- `public void setLungePower(int lungePower)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
