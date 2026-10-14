---
title: "org.bukkit.event.entity.PotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/PotionSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PotionSplashEvent**
`public class PotionSplashEvent extends ProjectileHitEvent implements Cancellable`
- `@Deprecated(since="1.20.2") public PotionSplashEvent(@NotNull ThrownPotion potion, @NotNull Map<LivingEntity, Double> affectedEntities)`
- `public PotionSplashEvent(@NotNull ThrownPotion potion, @Nullable Entity hitEntity, @Nullable Block hitBlock, @Nullable BlockFace hitFace, @NotNull Map<LivingEntity, Double> affectedEntities)`
- `@NotNull public ThrownPotion getEntity()`
- `@NotNull public ThrownPotion getPotion()`
- `@NotNull public Collection<LivingEntity> getAffectedEntities()`
- `public double getIntensity(@NotNull LivingEntity entity)`
- `public void setIntensity(@NotNull LivingEntity entity, double intensity)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
