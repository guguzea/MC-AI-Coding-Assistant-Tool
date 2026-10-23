---
title: "com.destroystokyo.paper.event.server.AsyncTabCompleteEvent"
package: "com.destroystokyo.paper.event.server"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/server/AsyncTabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public AsyncTabCompleteEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String buffer, boolean isCommand, @Nullable @Nullable Location loc)`
- `@Deprecated public AsyncTabCompleteEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull List<String> completions, @NotNull @NotNull String buffer, boolean isCommand, @Nullable @Nullable Location loc)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull List<String> getCompletions()`
- `public void setCompletions(@NotNull @NotNull List<String> completions)`
- `@NotNull public @NotNull List<AsyncTabCompleteEvent.Completion> completions()`
- `public void completions(@NotNull @NotNull List<AsyncTabCompleteEvent.Completion> newCompletions)`
- `@NotNull public @NotNull String getBuffer()`
- `public boolean isCommand()`
- `@Nullable public @Nullable Location getLocation()`
- `public boolean isHandled()`
- `public void setHandled(boolean handled)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
