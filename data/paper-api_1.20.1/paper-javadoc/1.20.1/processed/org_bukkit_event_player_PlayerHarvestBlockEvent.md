---
title: "org.bukkit.event.player.PlayerHarvestBlockEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerHarvestBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerHarvestBlockEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block harvestedBlock, @NotNull @NotNull EquipmentSlot hand, @NotNull @NotNull List<ItemStack> itemsHarvested)`
- `@Deprecated public PlayerHarvestBlockEvent(@NotNull @NotNull Player player, @NotNull @NotNull Block harvestedBlock, @NotNull @NotNull List<ItemStack> itemsHarvested)`
- `@NotNull public @NotNull Block getHarvestedBlock()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull List<ItemStack> getItemsHarvested()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
