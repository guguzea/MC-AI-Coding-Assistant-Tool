---
title: "org.bukkit.event.block.BlockFromToEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.block.BlockFromToEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `protected org.bukkit.block.Block to`
- `protected org.bukkit.block.BlockFace face`
- `protected boolean cancel`
- `public org.bukkit.event.block.BlockFromToEvent(org.bukkit.block.Block, org.bukkit.block.BlockFace)`
- `public org.bukkit.event.block.BlockFromToEvent(org.bukkit.block.Block, org.bukkit.block.Block)`
- `public org.bukkit.block.BlockFace getFace()`
- `public org.bukkit.block.Block getToBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
