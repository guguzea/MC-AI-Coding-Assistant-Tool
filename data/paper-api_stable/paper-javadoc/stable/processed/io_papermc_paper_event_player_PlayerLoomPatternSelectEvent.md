---
title: "io.papermc.paper.event.player.PlayerLoomPatternSelectEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerLoomPatternSelectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerLoomPatternSelectEvent**
`@NullMarked public class PlayerLoomPatternSelectEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerLoomPatternSelectEvent(Player player, LoomInventory loomInventory, PatternType patternType)`
- `public LoomInventory getLoomInventory()`
- `public PatternType getPatternType()`
- `public void setPatternType(PatternType patternType)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
