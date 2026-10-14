---
title: "org.bukkit.event.server.BroadcastMessageEvent"
package: "org.bukkit.event.server"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/server/BroadcastMessageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BroadcastMessageEvent**
`public class BroadcastMessageEvent extends ServerEvent implements Cancellable`
- `@Deprecated(since="1.14") public BroadcastMessageEvent(@NotNull String message, @NotNull Set<CommandSender> recipients)`
- `public BroadcastMessageEvent(boolean isAsync, @NotNull String message, @NotNull Set<CommandSender> recipients)`
- `@NotNull public String getMessage()`
- `public void setMessage(@NotNull String message)`
- `@NotNull public Set<CommandSender> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
