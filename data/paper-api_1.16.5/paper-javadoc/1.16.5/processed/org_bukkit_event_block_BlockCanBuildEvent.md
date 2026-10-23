---
title: "org.bukkit.event.block.BlockCanBuildEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/BlockCanBuildEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected boolean buildable`
- `protected BlockData blockData`
- `@Deprecated public BlockCanBuildEvent&#8203;(@NotNull @NotNull Block block, @NotNull @NotNull BlockData type, boolean canBuild)`
- `public BlockCanBuildEvent&#8203;(@NotNull @NotNull Block block, @Nullable @Nullable Player player, @NotNull @NotNull BlockData type, boolean canBuild)`
- `public boolean isBuildable()`
- `public void setBuildable&#8203;(boolean cancel)`
- `@NotNull public @NotNull Material getMaterial()`
- `@NotNull public @NotNull BlockData getBlockData()`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
