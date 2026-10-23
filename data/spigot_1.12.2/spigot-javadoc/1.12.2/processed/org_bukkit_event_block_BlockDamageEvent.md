---
title: "org.bukkit.event.block.BlockDamageEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.block.BlockDamageEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.block.BlockDamageEvent(org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.inventory.ItemStack, boolean)`
- `public org.bukkit.entity.Player getPlayer()`
- `public boolean getInstaBreak()`
- `public void setInstaBreak(boolean)`
- `public org.bukkit.inventory.ItemStack getItemInHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
