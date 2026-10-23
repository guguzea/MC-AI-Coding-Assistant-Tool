---
title: "org.bukkit.event.server.TabCompleteEvent"
package: "org.bukkit.event.server"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.server.TabCompleteEvent extends org.bukkit.event.Event implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.server.TabCompleteEvent(org.bukkit.command.CommandSender, java.lang.String, java.util.List<java.lang.String>)`
- `public org.bukkit.command.CommandSender getSender()`
- `public java.lang.String getBuffer()`
- `public java.util.List<java.lang.String> getCompletions()`
- `public void setCompletions(java.util.List<java.lang.String>)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
