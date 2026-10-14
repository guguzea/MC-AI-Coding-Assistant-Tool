---
title: "org.bukkit.event.command.UnknownCommandEvent"
package: "org.bukkit.event.command"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/command/UnknownCommandEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class UnknownCommandEvent**
`@NullMarked public class UnknownCommandEvent extends Event`
- `@Internal public UnknownCommandEvent(CommandSourceStack commandSource, String commandLine, @Nullable Component message)`
- `public CommandSender getSender()`
- `public CommandSourceStack getCommandSource()`
- `public String getCommandLine()`
- `@Deprecated public @Nullable String getMessage()`
- `@Deprecated public void setMessage(@Nullable String message)`
- `@Contract(pure=true) public @Nullable Component message()`
- `public void message(@Nullable Component message)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
