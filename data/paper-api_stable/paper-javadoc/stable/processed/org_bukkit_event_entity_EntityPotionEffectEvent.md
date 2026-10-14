---
title: "org.bukkit.event.entity.EntityPotionEffectEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityPotionEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityPotionEffectEvent**
`@NullMarked public class EntityPotionEffectEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityPotionEffectEvent(LivingEntity livingEntity, @Nullable PotionEffect oldEffect, @Nullable PotionEffect newEffect, @Nullable Entity entitySource, EntityPotionEffectEvent.Cause cause, EntityPotionEffectEvent.Action action, boolean override)`
- `public LivingEntity getEntity()`
- `public @Nullable PotionEffect getOldEffect()`
- `public @Nullable PotionEffect getNewEffect()`
- `public @Nullable Entity getSource()`
- `public EntityPotionEffectEvent.Cause getCause()`
- `public EntityPotionEffectEvent.Action getAction()`
- `public PotionEffectType getModifiedType()`
- `public boolean isOverride()`
- `public void setOverride(boolean override)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
