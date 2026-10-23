---
title: "org.bukkit.event.enchantment.EnchantItemEvent"
package: "org.bukkit.event.enchantment"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.enchantment.EnchantItemEvent extends org.bukkit.event.inventory.InventoryEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.enchantment.EnchantItemEvent(org.bukkit.entity.Player, org.bukkit.inventory.InventoryView, org.bukkit.block.Block, org.bukkit.inventory.ItemStack, int, java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer>, int)`
- `public org.bukkit.entity.Player getEnchanter()`
- `public org.bukkit.block.Block getEnchantBlock()`
- `public org.bukkit.inventory.ItemStack getItem()`
- `public int getExpLevelCost()`
- `public void setExpLevelCost(int)`
- `public java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer> getEnchantsToAdd()`
- `public int whichButton()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
