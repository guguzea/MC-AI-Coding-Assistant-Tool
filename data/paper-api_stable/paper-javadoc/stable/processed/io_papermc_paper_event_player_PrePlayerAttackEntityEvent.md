---
title: "io.papermc.paper.event.player.PrePlayerAttackEntityEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PrePlayerAttackEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PrePlayerAttackEntityEvent**
`@NullMarked public class PrePlayerAttackEntityEvent extends PlayerEvent implements Cancellable`
- `@Internal public PrePlayerAttackEntityEvent(Player player, Entity attacked, boolean willAttack)`
- `public Entity getAttacked()`
- `public boolean willAttack()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
