---
title: "org.bukkit.event.server.ServerCommandEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/server/ServerCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public ServerCommandEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String command)`
- `@NotNull public @NotNull String getCommand()`
- `public void setCommand(@NotNull @NotNull String message)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
