---
title: "org.bukkit.event.entity.EntityPotionEffectEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityPotionEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityPotionEffectEvent**
`public class EntityPotionEffectEvent extends EntityEvent implements Cancellable`
- `@Contract("_, null, null, _, _, _ -> fail") public EntityPotionEffectEvent(@NotNull LivingEntity livingEntity, @Nullable PotionEffect oldEffect, @Nullable PotionEffect newEffect, @NotNull EntityPotionEffectEvent.Cause cause, @NotNull EntityPotionEffectEvent.Action action, boolean override)`
- `@Nullable public PotionEffect getOldEffect()`
- `@Nullable public PotionEffect getNewEffect()`
- `@NotNull public EntityPotionEffectEvent.Cause getCause()`
- `@NotNull public EntityPotionEffectEvent.Action getAction()`
- `@NotNull public PotionEffectType getModifiedType()`
- `public boolean isOverride()`
- `public void setOverride(boolean override)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
