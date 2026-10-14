---
title: "org.bukkit.event.server.ServerCommandEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/server/ServerCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ServerCommandEvent**
`public class ServerCommandEvent extends ServerEvent implements Cancellable`
- `@Internal public ServerCommandEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String command)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull String getCommand()`
- `public void setCommand(@NotNull @NotNull String message)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
