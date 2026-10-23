---
title: "org.bukkit.event.world.StructureGrowEvent"
package: "org.bukkit.event.world"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.world.StructureGrowEvent extends org.bukkit.event.world.WorldEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.world.StructureGrowEvent(org.bukkit.Location, org.bukkit.TreeType, boolean, org.bukkit.entity.Player, java.util.List<org.bukkit.block.BlockState>)`
- `public org.bukkit.Location getLocation()`
- `public org.bukkit.TreeType getSpecies()`
- `public boolean isFromBonemeal()`
- `public org.bukkit.entity.Player getPlayer()`
- `public java.util.List<org.bukkit.block.BlockState> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
