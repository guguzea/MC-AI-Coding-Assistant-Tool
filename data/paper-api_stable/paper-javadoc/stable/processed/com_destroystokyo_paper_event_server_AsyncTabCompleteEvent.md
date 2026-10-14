---
title: "com.destroystokyo.paper.event.server.AsyncTabCompleteEvent"
package: "com.destroystokyo.paper.event.server"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/server/AsyncTabCompleteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AsyncTabCompleteEvent**
`@NullMarked public class AsyncTabCompleteEvent extends Event implements Cancellable`
- `@Internal public AsyncTabCompleteEvent(CommandSender sender, String buffer, boolean isCommand, @Nullable Location loc)`
- `@Deprecated @Internal public AsyncTabCompleteEvent(CommandSender sender, List<String> completions, String buffer, boolean isCommand, @Nullable Location loc)`
- `public CommandSender getSender()`
- `public List<String> getCompletions()`
- `public void setCompletions(List<String> completions)`
- `public List<AsyncTabCompleteEvent.Completion> completions()`
- `public void completions(List<AsyncTabCompleteEvent.Completion> newCompletions)`
- `public String getBuffer()`
- `public boolean isCommand()`
- `public @Nullable Location getLocation()`
- `public boolean isHandled()`
- `public void setHandled(boolean handled)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
