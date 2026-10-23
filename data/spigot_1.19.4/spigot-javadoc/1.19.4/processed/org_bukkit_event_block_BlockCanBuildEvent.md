---
title: "org.bukkit.event.block.BlockCanBuildEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
