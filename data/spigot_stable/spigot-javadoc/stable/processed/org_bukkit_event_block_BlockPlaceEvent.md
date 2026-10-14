---
title: "org.bukkit.event.block.BlockPlaceEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockPlaceEvent**
`public class BlockPlaceEvent extends BlockEvent implements Cancellable`
- `protected boolean cancel`
- `protected boolean canBuild`
- `protected Block placedAgainst`
- `protected BlockState replacedBlockState`
- `protected ItemStack itemInHand`
- `protected Player player`
- `protected EquipmentSlot hand`
- `@Deprecated(since="1.9") public BlockPlaceEvent(@NotNull Block placedBlock, @NotNull BlockState replacedBlockState, @NotNull Block placedAgainst, @NotNull ItemStack itemInHand, @NotNull Player thePlayer, boolean canBuild)`
- `public BlockPlaceEvent(@NotNull Block placedBlock, @NotNull BlockState replacedBlockState, @NotNull Block placedAgainst, @NotNull ItemStack itemInHand, @NotNull Player thePlayer, boolean canBuild, @NotNull EquipmentSlot hand)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Player getPlayer()`
- `@NotNull public Block getBlockPlaced()`
- `@NotNull public BlockState getBlockReplacedState()`
- `@NotNull public Block getBlockAgainst()`
- `@NotNull public ItemStack getItemInHand()`
- `@NotNull public EquipmentSlot getHand()`
- `public boolean canBuild()`
- `public void setBuild(boolean canBuild)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
