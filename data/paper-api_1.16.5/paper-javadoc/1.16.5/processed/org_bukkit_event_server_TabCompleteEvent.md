---
title: "org.bukkit.event.server.TabCompleteEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/server/TabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public TabCompleteEvent&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String buffer, @NotNull @NotNull List<String> completions)`
- `public TabCompleteEvent&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String buffer, @NotNull @NotNull List<String> completions, boolean isCommand, @Nullable Location location)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull String getBuffer()`
- `@NotNull public @NotNull List<String> getCompletions()`
- `public boolean isCommand()`
- `@Nullable public Location getLocation()`
- `public void setCompletions&#8203;(@NotNull @NotNull List<String> completions)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
