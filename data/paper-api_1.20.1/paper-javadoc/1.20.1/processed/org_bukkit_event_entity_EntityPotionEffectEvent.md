---
title: "org.bukkit.event.entity.EntityPotionEffectEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityPotionEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Contract("_, null, null, _, _, _ -> fail") public EntityPotionEffectEvent(@NotNull @NotNull LivingEntity livingEntity, @Nullable @Nullable PotionEffect oldEffect, @Nullable @Nullable PotionEffect newEffect, @NotNull @NotNull EntityPotionEffectEvent.Cause cause, @NotNull @NotNull EntityPotionEffectEvent.Action action, boolean override)`
- `@Nullable public @Nullable PotionEffect getOldEffect()`
- `@Nullable public @Nullable PotionEffect getNewEffect()`
- `@NotNull public @NotNull EntityPotionEffectEvent.Cause getCause()`
- `@NotNull public @NotNull EntityPotionEffectEvent.Action getAction()`
- `@NotNull public @NotNull PotionEffectType getModifiedType()`
- `public boolean isOverride()`
- `public void setOverride(boolean override)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
