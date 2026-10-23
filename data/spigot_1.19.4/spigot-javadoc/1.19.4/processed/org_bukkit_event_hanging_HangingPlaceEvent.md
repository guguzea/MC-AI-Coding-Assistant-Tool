---
title: "org.bukkit.event.hanging.HangingPlaceEvent"
package: "org.bukkit.event.hanging"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.event.hanging.HangingPlaceEvent extends org.bukkit.event.hanging.HangingEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.hanging.HangingPlaceEvent(org.bukkit.entity.Hanging, org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.event.hanging.HangingPlaceEvent(org.bukkit.entity.Hanging, org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.inventory.EquipmentSlot, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.entity.Player getPlayer()`
- `public org.bukkit.block.Block getBlock()`
- `public org.bukkit.block.BlockFace getBlockFace()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public org.bukkit.inventory.ItemStack getItemStack()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
