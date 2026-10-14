---
title: "org.bukkit.event.server.TabCompleteEvent"
package: "org.bukkit.event.server"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/server/TabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class TabCompleteEvent**
`public class TabCompleteEvent extends Event implements Cancellable`
- `public TabCompleteEvent(@NotNull CommandSender sender, @NotNull String buffer, @NotNull List<String> completions)`
- `@NotNull public CommandSender getSender()`
- `@NotNull public String getBuffer()`
- `@NotNull public List<String> getCompletions()`
- `public void setCompletions(@NotNull List<String> completions)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
