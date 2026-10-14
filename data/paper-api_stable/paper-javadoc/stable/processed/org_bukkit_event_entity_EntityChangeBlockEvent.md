---
title: "org.bukkit.event.entity.EntityChangeBlockEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityChangeBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityChangeBlockEvent**
`public class EntityChangeBlockEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityChangeBlockEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Block block, @NotNull @NotNull BlockData to)`
- `@NotNull public @NotNull Block getBlock()`
- `@NotNull public @NotNull Material getTo()`
- `@NotNull public @NotNull BlockData getBlockData()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
