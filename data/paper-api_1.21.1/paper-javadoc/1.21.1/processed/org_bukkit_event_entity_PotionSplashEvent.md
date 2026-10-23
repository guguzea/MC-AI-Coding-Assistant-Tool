---
title: "org.bukkit.event.entity.PotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/PotionSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `protected final Map<LivingEntity,Double> affectedEntities`
- `@Deprecated public PotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @NotNull @NotNull Map<LivingEntity,Double> affectedEntities)`
- `public PotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock, @Nullable @Nullable BlockFace hitFace, @NotNull @NotNull Map<LivingEntity,Double> affectedEntities)`
- `@NotNull public @NotNull ThrownPotion getEntity()`
- `@NotNull public @NotNull ThrownPotion getPotion()`
- `@NotNull public @NotNull Collection<LivingEntity> getAffectedEntities()`
- `public double getIntensity(@NotNull @NotNull LivingEntity entity)`
- `public void setIntensity(@NotNull @NotNull LivingEntity entity, double intensity)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
