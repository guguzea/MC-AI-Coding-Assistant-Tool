---
title: "org.bukkit.event.player.PlayerArmorStandManipulateEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
