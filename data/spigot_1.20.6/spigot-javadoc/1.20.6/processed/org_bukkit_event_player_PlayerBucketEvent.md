---
title: "org.bukkit.event.player.PlayerBucketEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public abstract class org.bukkit.event.player.PlayerBucketEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerBucketEvent(org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.Material, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.event.player.PlayerBucketEvent(org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.Material, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.event.player.PlayerBucketEvent(org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.Material, org.bukkit.inventory.ItemStack, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.Material getBucket()`
- `public org.bukkit.inventory.ItemStack getItemStack()`
- `public void setItemStack(org.bukkit.inventory.ItemStack)`
- `public final org.bukkit.block.Block getBlock()`
- `public org.bukkit.block.Block getBlockClicked()`
- `public org.bukkit.block.BlockFace getBlockFace()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
