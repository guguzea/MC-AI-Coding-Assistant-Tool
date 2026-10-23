---
title: "org.bukkit.event.player.PlayerBedEnterEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.event.player.PlayerBedEnterEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerBedEnterEvent(org.bukkit.entity.Player, org.bukkit.block.Block, org.bukkit.event.player.PlayerBedEnterEvent$BedEnterResult)`
- `public org.bukkit.event.player.PlayerBedEnterEvent(org.bukkit.entity.Player, org.bukkit.block.Block)`
- `public org.bukkit.event.player.PlayerBedEnterEvent$BedEnterResult getBedEnterResult()`
- `public org.bukkit.event.Event$Result useBed()`
- `public void setUseBed(org.bukkit.event.Event$Result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.block.Block getBed()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
