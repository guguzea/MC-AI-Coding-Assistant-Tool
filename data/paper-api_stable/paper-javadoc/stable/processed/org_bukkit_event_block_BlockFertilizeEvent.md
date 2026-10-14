---
title: "org.bukkit.event.block.BlockFertilizeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockFertilizeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockFertilizeEvent**
`public class BlockFertilizeEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockFertilizeEvent(@NotNull @NotNull Block block, @Nullable @Nullable Player player, @NotNull @NotNull List<BlockState> blocks)`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull List<BlockState> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
