---
title: "org.bukkit.event.server.BroadcastMessageEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/server/BroadcastMessageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public BroadcastMessageEvent&#8203;(@NotNull @NotNull String message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@Deprecated public BroadcastMessageEvent&#8203;(boolean isAsync, @NotNull @NotNull String message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@Deprecated public BroadcastMessageEvent&#8203;(@NotNull Component message, @NotNull @NotNull Set<CommandSender> recipients)`
- `public BroadcastMessageEvent&#8203;(boolean isAsync, @NotNull Component message, @NotNull @NotNull Set<CommandSender> recipients)`
- `@NotNull public Component message()`
- `public void message&#8203;(@NotNull Component message)`
- `@NotNull @Deprecated public @NotNull String getMessage()`
- `@Deprecated public void setMessage&#8203;(@NotNull @NotNull String message)`
- `@NotNull public @NotNull Set<CommandSender> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
