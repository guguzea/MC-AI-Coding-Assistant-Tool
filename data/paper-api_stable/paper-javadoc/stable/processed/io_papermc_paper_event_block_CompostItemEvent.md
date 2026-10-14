---
title: "io.papermc.paper.event.block.CompostItemEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/block/CompostItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class CompostItemEvent**
`@NullMarked public class CompostItemEvent extends BlockEvent`
- `@Internal public CompostItemEvent(Block composter, ItemStack item, int raisedLevels)`
- `public ItemStack getItem()`
- `public boolean willRaiseLevel()`
- `@Deprecated(since="26.3", forRemoval=true) public void setWillRaiseLevel(boolean willRaiseLevel)`
- `public int getLevelsToRaise()`
- `public void setLevelsToRaise(int raisedLevels)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
