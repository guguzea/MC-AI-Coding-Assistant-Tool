---
title: "org.bukkit.event.server.BroadcastMessageEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/server/BroadcastMessageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BroadcastMessageEvent**
`public class BroadcastMessageEvent extends ServerEvent implements Cancellable`
- `@Internal @Deprecated(since="1.14", forRemoval=true) public BroadcastMessageEvent(@NotNull @NotNull String message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@Internal @Deprecated(forRemoval=true) public BroadcastMessageEvent(boolean isAsync, @NotNull @NotNull String message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@Internal @Deprecated(forRemoval=true) public BroadcastMessageEvent(@NotNull @NotNull Component message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@Internal public BroadcastMessageEvent(boolean isAsync, @NotNull @NotNull Component message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@NotNull public @NotNull Component message()`
- `public void message(@NotNull @NotNull Component message)`
- `@NotNull @Deprecated public @NotNull String getMessage()`
- `@Deprecated public void setMessage(@NotNull @NotNull String message)`
- `@NotNull public @NotNull Set<CommandSender> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
