---
title: "io.papermc.paper.event.entity.EntityDamageItemEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityDamageItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityDamageItemEvent**
`@NullMarked public class EntityDamageItemEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityDamageItemEvent(Entity entity, ItemStack item, int damage)`
- `public ItemStack getItem()`
- `public int getDamage()`
- `public void setDamage(int damage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
