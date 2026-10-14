---
title: "org.bukkit.event.entity.PotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/PotionSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PotionSplashEvent**
`public class PotionSplashEvent extends ProjectileHitEvent implements Cancellable`
- `protected final Map<LivingEntity, Double> affectedEntities`
- `@Internal @Deprecated(since="1.20.2", forRemoval=true) public PotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @NotNull @NotNull Map<LivingEntity, Double> affectedEntities)`
- `@Internal public PotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock, @Nullable @Nullable BlockFace hitFace, @NotNull @NotNull Map<LivingEntity, Double> affectedEntities)`
- `@NotNull public @NotNull ThrownPotion getEntity()`
- `@NotNull public @NotNull ThrownPotion getPotion()`
- `@NotNull public @NotNull Collection<LivingEntity> getAffectedEntities()`
- `public double getIntensity(@NotNull @NotNull LivingEntity entity)`
- `public void setIntensity(@NotNull @NotNull LivingEntity entity, double intensity)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
