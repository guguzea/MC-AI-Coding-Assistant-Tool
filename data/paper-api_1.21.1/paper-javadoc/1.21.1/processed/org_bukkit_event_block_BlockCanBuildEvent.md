---
title: "org.bukkit.event.block.BlockCanBuildEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/block/BlockCanBuildEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `protected boolean buildable`
- `protected BlockData blockData`
- `@Deprecated public BlockCanBuildEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockData type, boolean canBuild)`
- `@Deprecated public BlockCanBuildEvent(@NotNull @NotNull Block block, @Nullable @Nullable Player player, @NotNull @NotNull BlockData type, boolean canBuild)`
- `@Internal public BlockCanBuildEvent(@NotNull @NotNull Block block, @Nullable @Nullable Player player, @NotNull @NotNull BlockData type, boolean canBuild, @NotNull EquipmentSlot hand)`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean isBuildable()`
- `public void setBuildable(boolean cancel)`
- `@NotNull public @NotNull Material getMaterial()`
- `@NotNull public @NotNull BlockData getBlockData()`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
