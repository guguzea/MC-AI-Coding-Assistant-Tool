---
title: "io.papermc.paper.event.entity.EntityEquipmentChangedEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityEquipmentChangedEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityEquipmentChangedEvent**
`@NullMarked public class EntityEquipmentChangedEvent extends EntityEvent`
- `@Internal public EntityEquipmentChangedEvent(LivingEntity entity, Map<EquipmentSlot, EntityEquipmentChangedEvent.EquipmentChange> equipmentChanges)`
- `public LivingEntity getEntity()`
- `public @Unmodifiable Map<EquipmentSlot, EntityEquipmentChangedEvent.EquipmentChange> getEquipmentChanges()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
