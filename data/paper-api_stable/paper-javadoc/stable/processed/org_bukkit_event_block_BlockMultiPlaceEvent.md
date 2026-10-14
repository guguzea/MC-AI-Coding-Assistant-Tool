---
title: "org.bukkit.event.block.BlockMultiPlaceEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockMultiPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockMultiPlaceEvent**
`public class BlockMultiPlaceEvent extends BlockPlaceEvent`
- `@Internal @Deprecated(forRemoval=true) public BlockMultiPlaceEvent(@NotNull @NotNull List<BlockState> replacedStates, @NotNull @NotNull Block clicked, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild)`
- `@Internal public BlockMultiPlaceEvent(@NotNull @NotNull List<BlockState> replacedStates, @NotNull @NotNull Block clicked, @NotNull @NotNull ItemStack itemInHand, @NotNull @NotNull Player thePlayer, boolean canBuild, @NotNull EquipmentSlot hand)`
- `@NotNull public @NotNull List<BlockState> getReplacedBlockStates()`
