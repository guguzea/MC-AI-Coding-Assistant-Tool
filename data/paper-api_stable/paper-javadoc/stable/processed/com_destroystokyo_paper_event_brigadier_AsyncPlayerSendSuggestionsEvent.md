---
title: "com.destroystokyo.paper.event.brigadier.AsyncPlayerSendSuggestionsEvent"
package: "com.destroystokyo.paper.event.brigadier"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/brigadier/AsyncPlayerSendSuggestionsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AsyncPlayerSendSuggestionsEvent**
`@NullMarked public class AsyncPlayerSendSuggestionsEvent extends PlayerEvent implements Cancellable`
- `@Internal public AsyncPlayerSendSuggestionsEvent(Player player, com.mojang.brigadier.suggestion.Suggestions suggestions, String buffer)`
- `public String getBuffer()`
- `public com.mojang.brigadier.suggestion.Suggestions getSuggestions()`
- `public void setSuggestions(com.mojang.brigadier.suggestion.Suggestions suggestions)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
