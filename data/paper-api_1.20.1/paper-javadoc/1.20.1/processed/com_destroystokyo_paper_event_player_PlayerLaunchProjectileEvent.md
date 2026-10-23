---
title: "com.destroystokyo.paper.event.player.PlayerLaunchProjectileEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/player/PlayerLaunchProjectileEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerLaunchProjectileEvent(@NotNull @NotNull Player shooter, @NotNull @NotNull ItemStack itemStack, @NotNull @NotNull Projectile projectile)`
- `@NotNull public @NotNull Projectile getProjectile()`
- `@NotNull public @NotNull ItemStack getItemStack()`
- `public boolean shouldConsume()`
- `public void setShouldConsume(boolean consumeItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
