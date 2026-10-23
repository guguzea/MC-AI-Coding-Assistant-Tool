---
title: "org.bukkit.entity.HumanEntity"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.entity.HumanEntity extends org.bukkit.entity.LivingEntity,org.bukkit.entity.AnimalTamer,org.bukkit.permissions.Permissible,org.bukkit.inventory.InventoryHolder`
- `public abstract java.lang.String getName()`
- `public abstract org.bukkit.inventory.PlayerInventory getInventory()`
- `public abstract org.bukkit.inventory.Inventory getEnderChest()`
- `public abstract org.bukkit.inventory.MainHand getMainHand()`
- `public abstract boolean setWindowProperty(org.bukkit.inventory.InventoryView$Property, int)`
- `public abstract org.bukkit.inventory.InventoryView getOpenInventory()`
- `public abstract org.bukkit.inventory.InventoryView openInventory(org.bukkit.inventory.Inventory)`
- `public abstract org.bukkit.inventory.InventoryView openWorkbench(org.bukkit.Location, boolean)`
- `public abstract org.bukkit.inventory.InventoryView openEnchanting(org.bukkit.Location, boolean)`
- `public abstract void openInventory(org.bukkit.inventory.InventoryView)`
- `public abstract org.bukkit.inventory.InventoryView openMerchant(org.bukkit.entity.Villager, boolean)`
- `public abstract org.bukkit.inventory.InventoryView openMerchant(org.bukkit.inventory.Merchant, boolean)`
- `public abstract void closeInventory()`
- `public abstract org.bukkit.inventory.ItemStack getItemInHand()`
- `public abstract void setItemInHand(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getItemOnCursor()`
- `public abstract void setItemOnCursor(org.bukkit.inventory.ItemStack)`
- `public abstract boolean hasCooldown(org.bukkit.Material)`
- `public abstract int getCooldown(org.bukkit.Material)`
- `public abstract void setCooldown(org.bukkit.Material, int)`
- `public abstract boolean isSleeping()`
- `public abstract int getSleepTicks()`
- `public abstract org.bukkit.GameMode getGameMode()`
- `public abstract void setGameMode(org.bukkit.GameMode)`
- `public abstract boolean isBlocking()`
- `public abstract boolean isHandRaised()`
- `public abstract int getExpToLevel()`
- `public abstract org.bukkit.entity.Entity getShoulderEntityLeft()`
- `public abstract void setShoulderEntityLeft(org.bukkit.entity.Entity)`
- `public abstract org.bukkit.entity.Entity getShoulderEntityRight()`
- `public abstract void setShoulderEntityRight(org.bukkit.entity.Entity)`
