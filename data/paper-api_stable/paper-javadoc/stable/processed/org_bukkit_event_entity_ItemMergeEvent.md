---
title: "org.bukkit.event.entity.ItemMergeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/ItemMergeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ItemMergeEvent**
`public class ItemMergeEvent extends EntityEvent implements Cancellable`
- `@Internal public ItemMergeEvent(@NotNull @NotNull Item item, @NotNull @NotNull Item target)`
- `@NotNull public @NotNull Item getEntity()`
- `@NotNull public @NotNull Item getTarget()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
