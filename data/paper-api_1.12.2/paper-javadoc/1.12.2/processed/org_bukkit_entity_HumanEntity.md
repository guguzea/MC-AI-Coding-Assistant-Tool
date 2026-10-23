---
title: "org.bukkit.entity.HumanEntity"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/entity/HumanEntity.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `void closeInventory()`
- `void closeInventory(InventoryCloseEvent.Reason reason)`
- `int getCooldown(Material material)`
- `Inventory getEnderChest()`
- `int getExpToLevel()`
- `GameMode getGameMode()`
- `PlayerInventory getInventory()`
- `ItemStack getItemInHand()`
- `ItemStack getItemOnCursor()`
- `MainHand getMainHand()`
- `String getName()`
- `InventoryView getOpenInventory()`
- `Entity getShoulderEntityLeft()`
- `Entity getShoulderEntityRight()`
- `int getSleepTicks()`
- `boolean hasCooldown(Material material)`
- `boolean isBlocking()`
- `boolean isHandRaised()`
- `boolean isSleeping()`
- `InventoryView openEnchanting(Location location, boolean force)`
- `InventoryView openInventory(Inventory inventory)`
- `void openInventory(InventoryView inventory)`
- `InventoryView openMerchant(Villager trader, boolean force)`
- `InventoryView openMerchant(Merchant merchant, boolean force)`
- `void openSign(Sign sign)`
- `InventoryView openWorkbench(Location location, boolean force)`
- `Entity releaseLeftShoulderEntity()`
- `Entity releaseRightShoulderEntity()`
- `void setCooldown(Material material, int ticks)`
- `void setGameMode(GameMode mode)`
- `void setItemInHand(ItemStack item)`
- `void setItemOnCursor(ItemStack item)`
- `void setShoulderEntityLeft(Entity entity)`
- `void setShoulderEntityRight(Entity entity)`
- `boolean setWindowProperty(InventoryView.Property prop, int value)`
