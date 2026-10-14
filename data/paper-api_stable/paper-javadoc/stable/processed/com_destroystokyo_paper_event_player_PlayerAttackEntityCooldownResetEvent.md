---
title: "com.destroystokyo.paper.event.player.PlayerAttackEntityCooldownResetEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerAttackEntityCooldownResetEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerAttackEntityCooldownResetEvent**
`@NullMarked @Deprecated(since="26.1", forRemoval=true) public class PlayerAttackEntityCooldownResetEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerAttackEntityCooldownResetEvent(Player player, Entity attackedEntity, float cooledAttackStrength)`
- `public float getCooledAttackStrength()`
- `public Entity getAttackedEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
