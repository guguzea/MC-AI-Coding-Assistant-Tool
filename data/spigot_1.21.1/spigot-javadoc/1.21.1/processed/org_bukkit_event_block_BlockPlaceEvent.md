---
title: "org.bukkit.event.block.BlockPlaceEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.block.BlockPlaceEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `protected boolean cancel`
- `protected boolean canBuild`
- `protected org.bukkit.block.Block placedAgainst`
- `protected org.bukkit.block.BlockState replacedBlockState`
- `protected org.bukkit.inventory.ItemStack itemInHand`
- `protected org.bukkit.entity.Player player`
- `protected org.bukkit.inventory.EquipmentSlot hand`
- `public org.bukkit.event.block.BlockPlaceEvent(org.bukkit.block.Block, org.bukkit.block.BlockState, org.bukkit.block.Block, org.bukkit.inventory.ItemStack, org.bukkit.entity.Player, boolean)`
- `public org.bukkit.event.block.BlockPlaceEvent(org.bukkit.block.Block, org.bukkit.block.BlockState, org.bukkit.block.Block, org.bukkit.inventory.ItemStack, org.bukkit.entity.Player, boolean, org.bukkit.inventory.EquipmentSlot)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.entity.Player getPlayer()`
- `public org.bukkit.block.Block getBlockPlaced()`
- `public org.bukkit.block.BlockState getBlockReplacedState()`
- `public org.bukkit.block.Block getBlockAgainst()`
- `public org.bukkit.inventory.ItemStack getItemInHand()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public boolean canBuild()`
- `public void setBuild(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
