---
title: "org.bukkit.event.server.TabCompleteEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/server/TabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public TabCompleteEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String buffer, @NotNull @NotNull List<String> completions)`
- `public TabCompleteEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String buffer, @NotNull @NotNull List<String> completions, boolean isCommand, @Nullable Location location)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull String getBuffer()`
- `@NotNull public @NotNull List<String> getCompletions()`
- `public boolean isCommand()`
- `@Nullable public Location getLocation()`
- `public void setCompletions(@NotNull @NotNull List<String> completions)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
