---
title: "com.destroystokyo.paper.event.entity.WitchThrowPotionEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/entity/WitchThrowPotionEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WitchThrowPotionEvent**
`@NullMarked public class WitchThrowPotionEvent extends EntityEvent implements Cancellable`
- `@Internal public WitchThrowPotionEvent(Witch witch, LivingEntity target, @Nullable ItemStack potion)`
- `public Witch getEntity()`
- `public LivingEntity getTarget()`
- `public @Nullable ItemStack getPotion()`
- `public void setPotion(@Nullable ItemStack potion)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
