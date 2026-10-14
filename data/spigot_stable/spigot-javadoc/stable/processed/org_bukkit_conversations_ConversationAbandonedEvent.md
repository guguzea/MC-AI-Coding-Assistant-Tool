---
title: "org.bukkit.conversations.ConversationAbandonedEvent"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/ConversationAbandonedEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ConversationAbandonedEvent**
`public class ConversationAbandonedEvent extends EventObject`
- `public ConversationAbandonedEvent(@NotNull Conversation conversation)`
- `public ConversationAbandonedEvent(@NotNull Conversation conversation, @Nullable ConversationCanceller canceller)`
- `@Nullable public ConversationCanceller getCanceller()`
- `@NotNull public ConversationContext getContext()`
- `public boolean gracefulExit()`
