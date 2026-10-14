---
title: "com.destroystokyo.paper.event.player.PlayerUseUnknownEntityEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerUseUnknownEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerUseUnknownEntityEvent**
`@NullMarked public class PlayerUseUnknownEntityEvent extends PlayerEvent`
- `@Internal public PlayerUseUnknownEntityEvent(Player player, int entityId, boolean attack, EquipmentSlot hand, @Nullable Vector clickedPosition)`
- `public int getEntityId()`
- `public boolean isAttack()`
- `public EquipmentSlot getHand()`
- `public @Nullable Vector getClickedRelativePosition()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
