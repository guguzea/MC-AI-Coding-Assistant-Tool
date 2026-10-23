---
title: "org.bukkit.event.server.BroadcastMessageEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/server/BroadcastMessageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public BroadcastMessageEvent(@NotNull @NotNull String message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@Deprecated public BroadcastMessageEvent(boolean isAsync, @NotNull @NotNull String message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@Deprecated public BroadcastMessageEvent(@NotNull Component message, @NotNull @NotNull Set<CommandSender> recipients)`
- `public BroadcastMessageEvent(boolean isAsync, @NotNull Component message, @NotNull @NotNull Set<CommandSender> recipients)`
- `public @NotNull Component message()`
- `public void message(@NotNull Component message)`
- `@NotNull @Deprecated public @NotNull String getMessage()`
- `@Deprecated public void setMessage(@NotNull @NotNull String message)`
- `@NotNull public @NotNull Set<CommandSender> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
