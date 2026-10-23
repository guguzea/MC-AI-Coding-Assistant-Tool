---
title: "org.bukkit.event.inventory.BrewEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.inventory.BrewEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.inventory.BrewEvent(org.bukkit.block.Block, org.bukkit.inventory.BrewerInventory, java.util.List<org.bukkit.inventory.ItemStack>, int)`
- `public org.bukkit.inventory.BrewerInventory getContents()`
- `public int getFuelLevel()`
- `public java.util.List<org.bukkit.inventory.ItemStack> getResults()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
