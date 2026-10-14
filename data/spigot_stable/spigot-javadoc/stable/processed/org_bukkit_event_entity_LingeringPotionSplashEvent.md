---
title: "org.bukkit.event.entity.LingeringPotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/LingeringPotionSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class LingeringPotionSplashEvent**
`public class LingeringPotionSplashEvent extends ProjectileHitEvent implements Cancellable`
- `@Deprecated(since="1.20.2") public LingeringPotionSplashEvent(@NotNull ThrownPotion potion, @NotNull AreaEffectCloud entity)`
- `public LingeringPotionSplashEvent(@NotNull ThrownPotion potion, @Nullable Entity hitEntity, @Nullable Block hitBlock, @Nullable BlockFace hitFace, @NotNull AreaEffectCloud entity)`
- `@NotNull public ThrownPotion getEntity()`
- `@NotNull public AreaEffectCloud getAreaEffectCloud()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
