---
title: "org.bukkit.event.block.BlockDropItemEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockDropItemEvent**
`public class BlockDropItemEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockDropItemEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockState blockState, @NotNull @NotNull Player player, @NotNull @NotNull List<Item> items)`
- `@NotNull public @NotNull BlockState getBlockState()`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull List<Item> getItems()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
