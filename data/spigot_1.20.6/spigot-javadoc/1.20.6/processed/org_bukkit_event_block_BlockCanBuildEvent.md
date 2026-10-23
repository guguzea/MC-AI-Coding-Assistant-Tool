---
title: "org.bukkit.event.block.BlockCanBuildEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.block.BlockCanBuildEvent extends org.bukkit.event.block.BlockEvent`
- `protected boolean buildable`
- `protected org.bukkit.block.data.BlockData blockData`
- `public org.bukkit.event.block.BlockCanBuildEvent(org.bukkit.block.Block, org.bukkit.block.data.BlockData, boolean)`
- `public org.bukkit.event.block.BlockCanBuildEvent(org.bukkit.block.Block, org.bukkit.entity.Player, org.bukkit.block.data.BlockData, boolean)`
- `public boolean isBuildable()`
- `public void setBuildable(boolean)`
- `public org.bukkit.Material getMaterial()`
- `public org.bukkit.block.data.BlockData getBlockData()`
- `public org.bukkit.entity.Player getPlayer()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
