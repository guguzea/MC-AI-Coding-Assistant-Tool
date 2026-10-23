---
title: "org.bukkit.event.block.BlockExplodeEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.block.BlockExplodeEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.block.BlockExplodeEvent(org.bukkit.block.Block, org.bukkit.block.BlockState, java.util.List<org.bukkit.block.Block>, float)`
- `public org.bukkit.event.block.BlockExplodeEvent(org.bukkit.block.Block, java.util.List<org.bukkit.block.Block>, float)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.block.BlockState getExplodedBlockState()`
- `public java.util.List<org.bukkit.block.Block> blockList()`
- `public float getYield()`
- `public void setYield(float)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
