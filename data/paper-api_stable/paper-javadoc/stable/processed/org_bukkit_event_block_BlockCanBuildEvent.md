---
title: "org.bukkit.event.block.BlockCanBuildEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockCanBuildEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockCanBuildEvent**
`public class BlockCanBuildEvent extends BlockEvent`
- `protected BlockData blockData`
- `protected boolean buildable`
- `@Deprecated(since="1.13.2", forRemoval=true) @Internal public BlockCanBuildEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockData type, boolean canBuild)`
- `@Deprecated(forRemoval=true) @Internal public BlockCanBuildEvent(@NotNull @NotNull Block block, @Nullable @Nullable Player player, @NotNull @NotNull BlockData type, boolean canBuild)`
- `@Internal public BlockCanBuildEvent(@NotNull @NotNull Block block, @Nullable @Nullable Player player, @NotNull @NotNull BlockData type, boolean canBuild, @NotNull EquipmentSlot hand)`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull Material getMaterial()`
- `@NotNull public @NotNull BlockData getBlockData()`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean isBuildable()`
- `public void setBuildable(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
