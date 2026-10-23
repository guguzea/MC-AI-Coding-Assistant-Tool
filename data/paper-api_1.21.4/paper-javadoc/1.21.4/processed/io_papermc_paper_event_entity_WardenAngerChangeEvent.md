---
title: "io.papermc.paper.event.entity.WardenAngerChangeEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/entity/WardenAngerChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public WardenAngerChangeEvent(Warden warden, Entity target, int oldAnger, int newAnger)`
- `public Entity getTarget()`
- `public @org.jetbrains.annotations.Range(from=0L, to=150L) int getOldAnger()`
- `public @org.jetbrains.annotations.Range(from=0L, to=150L) int getNewAnger()`
- `public void setNewAnger(@org.jetbrains.annotations.Range(from=0L, to=150L) int newAnger)`
- `public Warden getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
