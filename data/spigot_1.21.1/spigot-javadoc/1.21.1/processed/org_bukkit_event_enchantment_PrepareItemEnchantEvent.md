---
title: "org.bukkit.event.enchantment.PrepareItemEnchantEvent"
package: "org.bukkit.event.enchantment"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.enchantment.PrepareItemEnchantEvent extends org.bukkit.event.inventory.InventoryEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.enchantment.PrepareItemEnchantEvent(org.bukkit.entity.Player, org.bukkit.inventory.view.EnchantmentView, org.bukkit.block.Block, org.bukkit.inventory.ItemStack, org.bukkit.enchantments.EnchantmentOffer[], int)`
- `public org.bukkit.entity.Player getEnchanter()`
- `public org.bukkit.block.Block getEnchantBlock()`
- `public org.bukkit.inventory.ItemStack getItem()`
- `public int[] getExpLevelCostsOffered()`
- `public org.bukkit.enchantments.EnchantmentOffer[] getOffers()`
- `public int getEnchantmentBonus()`
- `public org.bukkit.inventory.view.EnchantmentView getView()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.inventory.InventoryView getView()`
