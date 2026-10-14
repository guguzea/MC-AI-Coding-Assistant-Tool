---
title: "org.bukkit.event.entity.LingeringPotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/LingeringPotionSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class LingeringPotionSplashEvent**
`public class LingeringPotionSplashEvent extends ProjectileHitEvent implements Cancellable`
- `@Internal @Deprecated(since="1.20.2", forRemoval=true) public LingeringPotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @NotNull @NotNull AreaEffectCloud effectCloud)`
- `@Internal public LingeringPotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock, @Nullable @Nullable BlockFace hitFace, @NotNull @NotNull AreaEffectCloud effectCloud)`
- `@NotNull public @NotNull ThrownPotion getEntity()`
- `@NotNull public @NotNull AreaEffectCloud getAreaEffectCloud()`
- `public void allowsEmptyCreation(boolean allowEmptyAreaEffectCreation)`
- `public boolean allowsEmptyCreation()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
