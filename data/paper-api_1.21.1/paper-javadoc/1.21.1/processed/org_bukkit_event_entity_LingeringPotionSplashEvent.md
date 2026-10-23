---
title: "org.bukkit.event.entity.LingeringPotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/LingeringPotionSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public LingeringPotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @NotNull @NotNull AreaEffectCloud entity)`
- `public LingeringPotionSplashEvent(@NotNull @NotNull ThrownPotion potion, @Nullable @Nullable Entity hitEntity, @Nullable @Nullable Block hitBlock, @Nullable @Nullable BlockFace hitFace, @NotNull @NotNull AreaEffectCloud entity)`
- `@NotNull public @NotNull ThrownPotion getEntity()`
- `@NotNull public @NotNull AreaEffectCloud getAreaEffectCloud()`
- `public void allowsEmptyCreation(boolean allowEmptyAreaEffectCreation)`
- `public boolean allowsEmptyCreation()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
