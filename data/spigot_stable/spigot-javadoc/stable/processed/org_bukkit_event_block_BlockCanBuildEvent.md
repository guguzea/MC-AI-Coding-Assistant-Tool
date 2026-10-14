---
title: "org.bukkit.event.block.BlockCanBuildEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockCanBuildEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockCanBuildEvent**
`public class BlockCanBuildEvent extends BlockEvent`
- `protected boolean buildable`
- `protected BlockData blockData`
- `@Deprecated(since="1.13.2") public BlockCanBuildEvent(@NotNull Block block, @NotNull BlockData type, boolean canBuild)`
- `public BlockCanBuildEvent(@NotNull Block block, @Nullable Player player, @NotNull BlockData type, boolean canBuild)`
- `public boolean isBuildable()`
- `public void setBuildable(boolean cancel)`
- `@NotNull public Material getMaterial()`
- `@NotNull public BlockData getBlockData()`
- `@Nullable public Player getPlayer()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
