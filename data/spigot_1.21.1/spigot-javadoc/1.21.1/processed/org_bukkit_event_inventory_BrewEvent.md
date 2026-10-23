---
title: "org.bukkit.event.inventory.BrewEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
