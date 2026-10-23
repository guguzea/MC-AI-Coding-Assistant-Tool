---
title: "org.bukkit.event.enchantment.EnchantItemEvent"
package: "org.bukkit.event.enchantment"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.enchantment.EnchantItemEvent extends org.bukkit.event.inventory.InventoryEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.enchantment.EnchantItemEvent(org.bukkit.entity.Player, org.bukkit.inventory.InventoryView, org.bukkit.block.Block, org.bukkit.inventory.ItemStack, int, java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer>, org.bukkit.enchantments.Enchantment, int, int)`
- `public org.bukkit.entity.Player getEnchanter()`
- `public org.bukkit.block.Block getEnchantBlock()`
- `public org.bukkit.inventory.ItemStack getItem()`
- `public int getExpLevelCost()`
- `public void setExpLevelCost(int)`
- `public java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer> getEnchantsToAdd()`
- `public org.bukkit.enchantments.Enchantment getEnchantmentHint()`
- `public int getLevelHint()`
- `public int whichButton()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
