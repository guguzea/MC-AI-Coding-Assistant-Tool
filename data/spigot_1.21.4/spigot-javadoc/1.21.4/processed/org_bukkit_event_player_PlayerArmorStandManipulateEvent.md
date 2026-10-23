---
title: "org.bukkit.event.player.PlayerArmorStandManipulateEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.player.PlayerArmorStandManipulateEvent extends org.bukkit.event.player.PlayerInteractEntityEvent`
- `public org.bukkit.event.player.PlayerArmorStandManipulateEvent(org.bukkit.entity.Player, org.bukkit.entity.ArmorStand, org.bukkit.inventory.ItemStack, org.bukkit.inventory.ItemStack, org.bukkit.inventory.EquipmentSlot, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.event.player.PlayerArmorStandManipulateEvent(org.bukkit.entity.Player, org.bukkit.entity.ArmorStand, org.bukkit.inventory.ItemStack, org.bukkit.inventory.ItemStack, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.inventory.ItemStack getPlayerItem()`
- `public org.bukkit.inventory.ItemStack getArmorStandItem()`
- `public org.bukkit.inventory.EquipmentSlot getSlot()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public org.bukkit.entity.ArmorStand getRightClicked()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getRightClicked()`
