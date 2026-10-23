---
title: "org.bukkit.event.command.UnknownCommandEvent"
package: "org.bukkit.event.command"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/command/UnknownCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public UnknownCommandEvent(CommandSender sender, String commandLine, @Nullable Component message)`
- `public CommandSender getSender()`
- `public String getCommandLine()`
- `@Deprecated public @Nullable String getMessage()`
- `@Deprecated public void setMessage(@Nullable String message)`
- `@Contract(pure=true) public @Nullable Component message()`
- `public void message(@Nullable Component message)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
