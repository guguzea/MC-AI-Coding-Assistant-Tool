---
title: "org.bukkit.event.player.PlayerItemMendEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.player.PlayerItemMendEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerItemMendEvent(org.bukkit.entity.Player, org.bukkit.inventory.ItemStack, org.bukkit.entity.ExperienceOrb, int)`
- `public org.bukkit.inventory.ItemStack getItem()`
- `public org.bukkit.entity.ExperienceOrb getExperienceOrb()`
- `public int getRepairAmount()`
- `public void setRepairAmount(int)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
