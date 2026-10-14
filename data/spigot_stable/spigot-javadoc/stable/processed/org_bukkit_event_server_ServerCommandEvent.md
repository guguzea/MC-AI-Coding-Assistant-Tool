---
title: "org.bukkit.event.server.ServerCommandEvent"
package: "org.bukkit.event.server"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/server/ServerCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ServerCommandEvent**
`public class ServerCommandEvent extends ServerEvent implements Cancellable`
- `public ServerCommandEvent(@NotNull CommandSender sender, @NotNull String command)`
- `@NotNull public String getCommand()`
- `public void setCommand(@NotNull String message)`
- `@NotNull public CommandSender getSender()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
