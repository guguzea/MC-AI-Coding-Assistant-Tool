---
title: "org.bukkit.event.player.PlayerItemMendEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.event.player.PlayerItemMendEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerItemMendEvent(org.bukkit.entity.Player, org.bukkit.inventory.ItemStack, org.bukkit.inventory.EquipmentSlot, org.bukkit.entity.ExperienceOrb, int)`
- `public org.bukkit.event.player.PlayerItemMendEvent(org.bukkit.entity.Player, org.bukkit.inventory.ItemStack, org.bukkit.entity.ExperienceOrb, int)`
- `public org.bukkit.inventory.ItemStack getItem()`
- `public org.bukkit.inventory.EquipmentSlot getSlot()`
- `public org.bukkit.entity.ExperienceOrb getExperienceOrb()`
- `public int getRepairAmount()`
- `public void setRepairAmount(int)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
