---
title: "com.destroystokyo.paper.event.player.PlayerAdvancementCriterionGrantEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerAdvancementCriterionGrantEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerAdvancementCriterionGrantEvent**
`@NullMarked public class PlayerAdvancementCriterionGrantEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerAdvancementCriterionGrantEvent(Player player, Advancement advancement, String criterion)`
- `public Advancement getAdvancement()`
- `public String getCriterion()`
- `public AdvancementProgress getAdvancementProgress()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
