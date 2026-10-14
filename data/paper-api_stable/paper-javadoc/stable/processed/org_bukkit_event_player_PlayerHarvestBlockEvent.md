---
title: "org.bukkit.event.player.PlayerHarvestBlockEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerHarvestBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerHarvestBlockEvent**
`public class PlayerHarvestBlockEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerHarvestBlockEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block harvestedBlock, @NotNull @NotNull EquipmentSlot hand, @NotNull @NotNull List<ItemStack> itemsHarvested)`
- `@Internal @Deprecated(since="1.19.2", forRemoval=true) public PlayerHarvestBlockEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block harvestedBlock, @NotNull @NotNull List<ItemStack> itemsHarvested)`
- `@NotNull public @NotNull Block getHarvestedBlock()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull List<ItemStack> getItemsHarvested()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
