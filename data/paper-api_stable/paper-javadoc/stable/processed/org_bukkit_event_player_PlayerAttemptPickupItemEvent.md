---
title: "org.bukkit.event.player.PlayerAttemptPickupItemEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerAttemptPickupItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerAttemptPickupItemEvent**
`@NullMarked public class PlayerAttemptPickupItemEvent extends PlayerEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public PlayerAttemptPickupItemEvent(Player player, Item item)`
- `@Internal public PlayerAttemptPickupItemEvent(Player player, Item item, int remaining)`
- `public Item getItem()`
- `public int getRemaining()`
- `public void setFlyAtPlayer(boolean flyAtPlayer)`
- `public boolean getFlyAtPlayer()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
