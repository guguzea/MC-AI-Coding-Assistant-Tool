---
title: "org.bukkit.event.entity.PotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/PotionSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PotionSplashEvent&#8203;(@NotNull @NotNull ThrownPotion potion, @NotNull @NotNull Map<LivingEntity,&#8203;Double> affectedEntities)`
- `@NotNull public @NotNull ThrownPotion getEntity()`
- `@NotNull public @NotNull ThrownPotion getPotion()`
- `@NotNull public @NotNull Collection<LivingEntity> getAffectedEntities()`
- `public double getIntensity&#8203;(@NotNull @NotNull LivingEntity entity)`
- `public void setIntensity&#8203;(@NotNull @NotNull LivingEntity entity, double intensity)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
