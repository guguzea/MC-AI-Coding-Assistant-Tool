---
title: "com.destroystokyo.paper.event.player.PlayerLaunchProjectileEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerLaunchProjectileEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerLaunchProjectileEvent**
`@NullMarked public class PlayerLaunchProjectileEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerLaunchProjectileEvent(Player shooter, ItemStack itemStack, Projectile projectile)`
- `public Projectile getProjectile()`
- `public ItemStack getItemStack()`
- `public boolean shouldConsume()`
- `public void setShouldConsume(boolean consumeItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
