---
title: "org.bukkit.event.block.BlockPistonExtendEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockPistonExtendEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockPistonExtendEvent**
`public class BlockPistonExtendEvent extends BlockPistonEvent`
- `@Internal @Deprecated(since="1.8", forRemoval=true) public BlockPistonExtendEvent(@NotNull @NotNull Block block, int length, @NotNull @NotNull BlockFace direction)`
- `@Internal public BlockPistonExtendEvent(@NotNull @NotNull Block block, @NotNull @NotNull List<Block> blocks, @NotNull @NotNull BlockFace direction)`
- `@Deprecated(since="1.8") public int getLength()`
- `@NotNull public @NotNull @Unmodifiable List<Block> getBlocks()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
