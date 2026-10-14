---
title: "org.bukkit.event.block.BlockPlaceEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockPlaceEvent**
`public class BlockPlaceEvent extends BlockEvent implements Cancellable`
- `protected Block placedAgainst`
- `protected ItemStack itemInHand`
- `protected Player player`
- `protected BlockState replacedState`
- `protected boolean canBuild`
- `protected EquipmentSlot hand`
- `protected boolean cancelled`
- `@Internal @Deprecated(since="1.9", forRemoval=true) public BlockPlaceEvent(@NotNull @NotNull Block placedBlock, @NotNull @NotNull BlockState replacedState, @NotNull @NotNull Block placedAgainst, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild)`
- `@Internal public BlockPlaceEvent(@NotNull @NotNull Block placedBlock, @NotNull @NotNull BlockState replacedState, @NotNull @NotNull Block placedAgainst, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild, @NotNull @NotNull EquipmentSlot hand)`
- `@NotNull public @NotNull Block getBlockAgainst()`
- `@NotNull public @NotNull ItemStack getItemInHand()`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull Block getBlockPlaced()`
- `@NotNull public @NotNull BlockState getBlockReplacedState()`
- `public boolean canBuild()`
- `public void setBuild(boolean canBuild)`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
