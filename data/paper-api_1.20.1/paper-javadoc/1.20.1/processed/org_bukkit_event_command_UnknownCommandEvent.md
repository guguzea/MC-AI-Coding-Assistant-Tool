---
title: "org.bukkit.event.command.UnknownCommandEvent"
package: "org.bukkit.event.command"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/command/UnknownCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public UnknownCommandEvent(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLine, @Nullable @Nullable Component message)`
- `@NotNull public @NotNull CommandSender getSender()`
- `@NotNull public @NotNull String getCommandLine()`
- `@Nullable @Deprecated public @Nullable String getMessage()`
- `@Deprecated public void setMessage(@Nullable @Nullable String message)`
- `@Nullable @Contract(pure=true) public @Nullable Component message()`
- `public void message(@Nullable @Nullable Component message)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
