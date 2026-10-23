---
title: "org.bukkit.event.player.PlayerBucketEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
