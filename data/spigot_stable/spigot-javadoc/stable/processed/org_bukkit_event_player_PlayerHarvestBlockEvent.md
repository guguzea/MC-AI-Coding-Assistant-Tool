---
title: "org.bukkit.event.player.PlayerHarvestBlockEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerHarvestBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerHarvestBlockEvent**
`public class PlayerHarvestBlockEvent extends PlayerEvent implements Cancellable`
- `public PlayerHarvestBlockEvent(@NotNull Player player, @NotNull Block harvestedBlock, @NotNull EquipmentSlot hand, @NotNull List<ItemStack> itemsHarvested)`
- `@Deprecated(since="1.19.2") public PlayerHarvestBlockEvent(@NotNull Player player, @NotNull Block harvestedBlock, @NotNull List<ItemStack> itemsHarvested)`
- `@NotNull public Block getHarvestedBlock()`
- `@NotNull public EquipmentSlot getHand()`
- `@NotNull public List<ItemStack> getItemsHarvested()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
