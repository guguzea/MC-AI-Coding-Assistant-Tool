---
title: "org.bukkit.conversations.ConversationAbandonedEvent"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/26.3/org/bukkit/conversations/ConversationAbandonedEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ConversationAbandonedEvent**
`@Deprecated(forRemoval=true) public class ConversationAbandonedEvent extends EventObject`
- `public ConversationAbandonedEvent(@NotNull @NotNull Conversation conversation)`
- `public ConversationAbandonedEvent(@NotNull @NotNull Conversation conversation, @Nullable @Nullable ConversationCanceller canceller)`
- `@Nullable public @Nullable ConversationCanceller getCanceller()`
- `@NotNull public @NotNull ConversationContext getContext()`
- `public boolean gracefulExit()`
