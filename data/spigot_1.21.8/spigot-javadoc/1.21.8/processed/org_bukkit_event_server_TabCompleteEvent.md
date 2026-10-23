---
title: "org.bukkit.event.server.TabCompleteEvent"
package: "org.bukkit.event.server"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
