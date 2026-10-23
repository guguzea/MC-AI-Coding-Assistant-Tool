---
title: "org.bukkit.inventory.PlayerInventory"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.inventory.PlayerInventory extends org.bukkit.inventory.Inventory`
- `public abstract org.bukkit.inventory.ItemStack[] getArmorContents()`
- `public abstract org.bukkit.inventory.ItemStack[] getExtraContents()`
- `public abstract org.bukkit.inventory.ItemStack getHelmet()`
- `public abstract org.bukkit.inventory.ItemStack getChestplate()`
- `public abstract org.bukkit.inventory.ItemStack getLeggings()`
- `public abstract org.bukkit.inventory.ItemStack getBoots()`
- `public abstract void setItem(int, org.bukkit.inventory.ItemStack)`
- `public abstract void setItem(org.bukkit.inventory.EquipmentSlot, org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getItem(org.bukkit.inventory.EquipmentSlot)`
- `public abstract void setArmorContents(org.bukkit.inventory.ItemStack[])`
- `public abstract void setExtraContents(org.bukkit.inventory.ItemStack[])`
- `public abstract void setHelmet(org.bukkit.inventory.ItemStack)`
- `public abstract void setChestplate(org.bukkit.inventory.ItemStack)`
- `public abstract void setLeggings(org.bukkit.inventory.ItemStack)`
- `public abstract void setBoots(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getItemInMainHand()`
- `public abstract void setItemInMainHand(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getItemInOffHand()`
- `public abstract void setItemInOffHand(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getItemInHand()`
- `public abstract void setItemInHand(org.bukkit.inventory.ItemStack)`
- `public abstract int getHeldItemSlot()`
- `public abstract void setHeldItemSlot(int)`
- `public abstract org.bukkit.entity.HumanEntity getHolder()`
- `public default org.bukkit.inventory.InventoryHolder getHolder()`
