---
title: "io.papermc.paper.event.entity.EntityFertilizeEggEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityFertilizeEggEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityFertilizeEggEvent**
`@NullMarked public class EntityFertilizeEggEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityFertilizeEggEvent(LivingEntity mother, LivingEntity father, @Nullable Player breeder, @Nullable ItemStack bredWith, int experience)`
- `public LivingEntity getEntity()`
- `public LivingEntity getMother()`
- `public LivingEntity getFather()`
- `public @Nullable Player getBreeder()`
- `public @Nullable ItemStack getBredWith()`
- `public int getExperience()`
- `public void setExperience(int experience)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
