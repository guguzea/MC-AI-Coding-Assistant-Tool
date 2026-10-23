---
title: "org.bukkit.event.block.BlockPlaceEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/block/BlockPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `protected boolean cancel`
- `protected boolean canBuild`
- `protected Block placedAgainst`
- `protected BlockState replacedBlockState`
- `protected ItemStack itemInHand`
- `protected Player player`
- `protected EquipmentSlot hand`
- `@Deprecated public BlockPlaceEvent(@NotNull @NotNull Block placedBlock, @NotNull @NotNull BlockState replacedBlockState, @NotNull @NotNull Block placedAgainst, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild)`
- `public BlockPlaceEvent(@NotNull @NotNull Block placedBlock, @NotNull @NotNull BlockState replacedBlockState, @NotNull @NotNull Block placedAgainst, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild, @NotNull @NotNull EquipmentSlot hand)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull Block getBlockPlaced()`
- `@NotNull public @NotNull BlockState getBlockReplacedState()`
- `@NotNull public @NotNull Block getBlockAgainst()`
- `@NotNull public @NotNull ItemStack getItemInHand()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean canBuild()`
- `public void setBuild(boolean canBuild)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
