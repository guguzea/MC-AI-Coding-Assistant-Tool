---
title: "org.bukkit.event.block.CrafterCraftEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.block.CrafterCraftEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.block.CrafterCraftEvent(org.bukkit.block.Block, org.bukkit.inventory.CraftingRecipe, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.event.block.CrafterCraftEvent(org.bukkit.block.Block, org.bukkit.inventory.CraftingRecipe, org.bukkit.inventory.ItemStack, java.util.List<org.bukkit.inventory.ItemStack>)`
- `public org.bukkit.inventory.ItemStack getResult()`
- `public void setResult(org.bukkit.inventory.ItemStack)`
- `public java.util.List<org.bukkit.inventory.ItemStack> getRemainingItems()`
- `public org.bukkit.inventory.CraftingRecipe getRecipe()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
