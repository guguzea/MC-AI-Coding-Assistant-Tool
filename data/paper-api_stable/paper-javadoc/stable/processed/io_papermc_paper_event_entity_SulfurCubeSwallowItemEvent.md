---
title: "io.papermc.paper.event.entity.SulfurCubeSwallowItemEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/SulfurCubeSwallowItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class SulfurCubeSwallowItemEvent**
`@NullMarked public class SulfurCubeSwallowItemEvent extends EntityEvent implements Cancellable`
- `@Internal public SulfurCubeSwallowItemEvent(SulfurCube sulfurCube, Player player, ItemStack oldItem, ItemStack newItem)`
- `public Player getPlayer()`
- `public ItemStack getOldItem()`
- `public ItemStack getNewItem()`
- `public void setNewItem(ItemStack newItem)`
- `public SulfurCube getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
