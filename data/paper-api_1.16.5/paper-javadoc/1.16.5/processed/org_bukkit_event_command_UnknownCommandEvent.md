---
title: "org.bukkit.event.command.UnknownCommandEvent"
package: "org.bukkit.event.command"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/command/UnknownCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public UnknownCommandEvent&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLine, @Nullable @Nullable String message)`
- `public UnknownCommandEvent&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLine, @Nullable @Nullable Component message)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull String getCommandLine()`
- `@Nullable @Deprecated public @Nullable String getMessage()`
- `@Deprecated public void setMessage&#8203;(@Nullable @Nullable String message)`
- `@Nullable public @Nullable Component message()`
- `public void message&#8203;(@Nullable @Nullable Component message)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
