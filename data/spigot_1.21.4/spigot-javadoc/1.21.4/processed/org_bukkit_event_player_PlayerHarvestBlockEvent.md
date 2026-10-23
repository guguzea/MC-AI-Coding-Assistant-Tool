---
title: "org.bukkit.event.player.PlayerHarvestBlockEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.player.PlayerHarvestBlockEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerHarvestBlockEvent(org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.inventory.EquipmentSlot, java.util.List<org.bukkit.inventory.ItemStack>)`
- `public org.bukkit.event.player.PlayerHarvestBlockEvent(org.bukkit.entity.Player, org.bukkit.block.Block, java.util.List<org.bukkit.inventory.ItemStack>)`
- `public org.bukkit.block.Block getHarvestedBlock()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public java.util.List<org.bukkit.inventory.ItemStack> getItemsHarvested()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
