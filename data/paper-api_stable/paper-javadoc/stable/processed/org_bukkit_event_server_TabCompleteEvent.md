---
title: "org.bukkit.event.server.TabCompleteEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/server/TabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class TabCompleteEvent**
`public class TabCompleteEvent extends Event implements Cancellable`
- `@Internal public TabCompleteEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String buffer, @NotNull @NotNull List<String> completions)`
- `@Internal public TabCompleteEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String buffer, @NotNull @NotNull List<String> completions, boolean isCommand, @Nullable @Nullable Location location)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull String getBuffer()`
- `@NotNull public @NotNull List<String> getCompletions()`
- `public void setCompletions(@NotNull @NotNull List<String> completions)`
- `public boolean isCommand()`
- `@Nullable public @Nullable Location getLocation()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
