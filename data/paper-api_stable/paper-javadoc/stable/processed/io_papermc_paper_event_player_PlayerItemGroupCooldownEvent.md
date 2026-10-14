---
title: "io.papermc.paper.event.player.PlayerItemGroupCooldownEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerItemGroupCooldownEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerItemGroupCooldownEvent**
`@NullMarked public class PlayerItemGroupCooldownEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerItemGroupCooldownEvent(Player player, NamespacedKey cooldownGroup, int cooldown)`
- `public NamespacedKey getCooldownGroup()`
- `public int getCooldown()`
- `public void setCooldown(int cooldown)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
