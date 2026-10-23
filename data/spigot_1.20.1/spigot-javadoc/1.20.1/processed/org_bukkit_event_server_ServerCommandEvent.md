---
title: "org.bukkit.event.server.ServerCommandEvent"
package: "org.bukkit.event.server"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.server.ServerCommandEvent extends org.bukkit.event.server.ServerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.server.ServerCommandEvent(org.bukkit.command.CommandSender, java.lang.String)`
- `public java.lang.String getCommand()`
- `public void setCommand(java.lang.String)`
- `public org.bukkit.command.CommandSender getSender()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
