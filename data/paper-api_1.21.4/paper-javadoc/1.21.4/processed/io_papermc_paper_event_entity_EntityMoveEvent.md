---
title: "io.papermc.paper.event.entity.EntityMoveEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/entity/EntityMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public EntityMoveEvent(LivingEntity entity, Location from, Location to)`
- `public LivingEntity getEntity()`
- `public Location getFrom()`
- `public void setFrom(Location from)`
- `public Location getTo()`
- `public void setTo(Location to)`
- `public boolean hasChangedPosition()`
- `public boolean hasExplicitlyChangedPosition()`
- `public boolean hasChangedBlock()`
- `public boolean hasExplicitlyChangedBlock()`
- `public boolean hasChangedOrientation()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
