---
title: "org.bukkit.event.block.BlockPhysicsEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.block.BlockPhysicsEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.block.BlockPhysicsEvent(org.bukkit.block.Block, org.bukkit.block.data.BlockData)`
- `public org.bukkit.event.block.BlockPhysicsEvent(org.bukkit.block.Block, org.bukkit.block.data.BlockData, org.bukkit.block.Block)`
- `public org.bukkit.block.Block getSourceBlock()`
- `public org.bukkit.Material getChangedType()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
