---
title: "org.bukkit.event.player.PlayerInteractEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.player.PlayerInteractEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `protected org.bukkit.inventory.ItemStack item`
- `protected org.bukkit.event.block.Action action`
- `protected org.bukkit.block.Block blockClicked`
- `protected org.bukkit.block.BlockFace blockFace`
- `public org.bukkit.event.player.PlayerInteractEvent(org.bukkit.entity.Player, org.bukkit.event.block.Action, org.bukkit.inventory.ItemStack, org.bukkit.block.Block, org.bukkit.block.BlockFace)`
- `public org.bukkit.event.player.PlayerInteractEvent(org.bukkit.entity.Player, org.bukkit.event.block.Action, org.bukkit.inventory.ItemStack, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.event.player.PlayerInteractEvent(org.bukkit.entity.Player, org.bukkit.event.block.Action, org.bukkit.inventory.ItemStack, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.inventory.EquipmentSlot, org.bukkit.util.Vector)`
- `public org.bukkit.event.block.Action getAction()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.inventory.ItemStack getItem()`
- `public org.bukkit.Material getMaterial()`
- `public boolean hasBlock()`
- `public boolean hasItem()`
- `public boolean isBlockInHand()`
- `public org.bukkit.block.Block getClickedBlock()`
- `public org.bukkit.block.BlockFace getBlockFace()`
- `public org.bukkit.event.Event$Result useInteractedBlock()`
- `public void setUseInteractedBlock(org.bukkit.event.Event$Result)`
- `public org.bukkit.event.Event$Result useItemInHand()`
- `public void setUseItemInHand(org.bukkit.event.Event$Result)`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public org.bukkit.util.Vector getClickedPosition()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
