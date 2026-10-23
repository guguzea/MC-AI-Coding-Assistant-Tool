---
title: "org.bukkit.event.server.ServerCommandEvent"
package: "org.bukkit.event.server"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
