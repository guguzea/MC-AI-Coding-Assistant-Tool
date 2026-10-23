---
title: "org.bukkit.event.block.BlockIgniteEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.block.BlockIgniteEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.block.BlockIgniteEvent(org.bukkit.block.Block, org.bukkit.event.block.BlockIgniteEvent$IgniteCause, org.bukkit.entity.Entity)`
- `public org.bukkit.event.block.BlockIgniteEvent(org.bukkit.block.Block, org.bukkit.event.block.BlockIgniteEvent$IgniteCause, org.bukkit.block.Block)`
- `public org.bukkit.event.block.BlockIgniteEvent(org.bukkit.block.Block, org.bukkit.event.block.BlockIgniteEvent$IgniteCause, org.bukkit.entity.Entity, org.bukkit.block.Block)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.block.BlockIgniteEvent$IgniteCause getCause()`
- `public org.bukkit.entity.Player getPlayer()`
- `public org.bukkit.entity.Entity getIgnitingEntity()`
- `public org.bukkit.block.Block getIgnitingBlock()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
