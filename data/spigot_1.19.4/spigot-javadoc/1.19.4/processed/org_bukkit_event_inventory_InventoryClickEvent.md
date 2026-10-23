---
title: "org.bukkit.event.inventory.InventoryClickEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.event.inventory.InventoryClickEvent extends org.bukkit.event.inventory.InventoryInteractEvent`
- `public org.bukkit.event.inventory.InventoryClickEvent(org.bukkit.inventory.InventoryView, org.bukkit.event.inventory.InventoryType$SlotType, int, org.bukkit.event.inventory.ClickType, org.bukkit.event.inventory.InventoryAction)`
- `public org.bukkit.event.inventory.InventoryClickEvent(org.bukkit.inventory.InventoryView, org.bukkit.event.inventory.InventoryType$SlotType, int, org.bukkit.event.inventory.ClickType, org.bukkit.event.inventory.InventoryAction, int)`
- `public org.bukkit.event.inventory.InventoryType$SlotType getSlotType()`
- `public org.bukkit.inventory.ItemStack getCursor()`
- `public org.bukkit.inventory.ItemStack getCurrentItem()`
- `public boolean isRightClick()`
- `public boolean isLeftClick()`
- `public boolean isShiftClick()`
- `public void setCursor(org.bukkit.inventory.ItemStack)`
- `public void setCurrentItem(org.bukkit.inventory.ItemStack)`
- `public org.bukkit.inventory.Inventory getClickedInventory()`
- `public int getSlot()`
- `public int getRawSlot()`
- `public int getHotbarButton()`
- `public org.bukkit.event.inventory.InventoryAction getAction()`
- `public org.bukkit.event.inventory.ClickType getClick()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
