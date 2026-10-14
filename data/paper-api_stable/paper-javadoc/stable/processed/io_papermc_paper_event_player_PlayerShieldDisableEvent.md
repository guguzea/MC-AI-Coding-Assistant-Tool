---
title: "io.papermc.paper.event.player.PlayerShieldDisableEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerShieldDisableEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerShieldDisableEvent**
`@NullMarked public class PlayerShieldDisableEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerShieldDisableEvent(Player player, Entity damager, int cooldown)`
- `public Entity getDamager()`
- `public int getCooldown()`
- `public void setCooldown(int cooldown)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
