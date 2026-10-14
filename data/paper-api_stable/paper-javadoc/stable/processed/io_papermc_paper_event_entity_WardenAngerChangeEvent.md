---
title: "io.papermc.paper.event.entity.WardenAngerChangeEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/WardenAngerChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WardenAngerChangeEvent**
`@NullMarked public class WardenAngerChangeEvent extends EntityEvent implements Cancellable`
- `@Internal public WardenAngerChangeEvent(Warden warden, Entity target, int oldAnger, int newAnger)`
- `public Entity getTarget()`
- `public @Range(from=0L,to=150L) int getOldAnger()`
- `public @Range(from=0L,to=150L) int getNewAnger()`
- `public void setNewAnger(@Range(from=0L,to=150L) int newAnger)`
- `public Warden getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
