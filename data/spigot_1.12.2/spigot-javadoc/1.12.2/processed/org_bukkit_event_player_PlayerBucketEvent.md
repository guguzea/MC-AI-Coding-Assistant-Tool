---
title: "org.bukkit.event.player.PlayerBucketEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public abstract class org.bukkit.event.player.PlayerBucketEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerBucketEvent(org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.Material, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.Material getBucket()`
- `public org.bukkit.inventory.ItemStack getItemStack()`
- `public void setItemStack(org.bukkit.inventory.ItemStack)`
- `public org.bukkit.block.Block getBlockClicked()`
- `public org.bukkit.block.BlockFace getBlockFace()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
