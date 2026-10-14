---
title: "io.papermc.paper.event.entity.EntityAttemptSmashAttackEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityAttemptSmashAttackEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityAttemptSmashAttackEvent**
`@NullMarked public class EntityAttemptSmashAttackEvent extends EntityEvent`
- `@Internal public EntityAttemptSmashAttackEvent(LivingEntity attacker, LivingEntity target, ItemStack weapon, boolean originalResult)`
- `public LivingEntity getTarget()`
- `public ItemStack getWeapon()`
- `public boolean getOriginalResult()`
- `public Event.Result getResult()`
- `public void setResult(Event.Result result)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
