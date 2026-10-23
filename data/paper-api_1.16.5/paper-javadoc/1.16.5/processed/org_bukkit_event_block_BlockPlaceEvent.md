---
title: "org.bukkit.event.block.BlockPlaceEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/BlockPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected boolean cancel`
- `protected boolean canBuild`
- `protected Block placedAgainst`
- `protected BlockState replacedBlockState`
- `protected ItemStack itemInHand`
- `protected Player player`
- `protected EquipmentSlot hand`
- `@Deprecated public BlockPlaceEvent&#8203;(@NotNull @NotNull Block placedBlock, @NotNull @NotNull BlockState replacedBlockState, @NotNull @NotNull Block placedAgainst, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild)`
- `public BlockPlaceEvent&#8203;(@NotNull @NotNull Block placedBlock, @NotNull @NotNull BlockState replacedBlockState, @NotNull @NotNull Block placedAgainst, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild, @NotNull @NotNull EquipmentSlot hand)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull Block getBlockPlaced()`
- `@NotNull public @NotNull BlockState getBlockReplacedState()`
- `@NotNull public @NotNull Block getBlockAgainst()`
- `@NotNull public @NotNull ItemStack getItemInHand()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean canBuild()`
- `public void setBuild&#8203;(boolean canBuild)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
