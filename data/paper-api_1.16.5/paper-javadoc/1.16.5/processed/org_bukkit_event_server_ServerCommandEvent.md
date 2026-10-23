---
title: "org.bukkit.event.server.ServerCommandEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/server/ServerCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public ServerCommandEvent&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String command)`
- `@NotNull public @NotNull String getCommand()`
- `public void setCommand&#8203;(@NotNull @NotNull String message)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
