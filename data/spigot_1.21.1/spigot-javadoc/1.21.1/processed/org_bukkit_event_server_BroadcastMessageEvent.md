---
title: "org.bukkit.event.server.BroadcastMessageEvent"
package: "org.bukkit.event.server"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.server.BroadcastMessageEvent extends org.bukkit.event.server.ServerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.server.BroadcastMessageEvent(java.lang.String, java.util.Set<org.bukkit.command.CommandSender>)`
- `public org.bukkit.event.server.BroadcastMessageEvent(boolean, java.lang.String, java.util.Set<org.bukkit.command.CommandSender>)`
- `public java.lang.String getMessage()`
- `public void setMessage(java.lang.String)`
- `public java.util.Set<org.bukkit.command.CommandSender> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
