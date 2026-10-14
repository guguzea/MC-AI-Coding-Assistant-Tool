---
title: "org.bukkit.conversations.Conversable"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/26.3/org/bukkit/conversations/Conversable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Conversable**
`@Deprecated(forRemoval=true) public interface Conversable`
- `boolean isConversing()`
- `void acceptConversationInput(@NotNull @NotNull String input)`
- `boolean beginConversation(@NotNull @NotNull Conversation conversation)`
- `void abandonConversation(@NotNull @NotNull Conversation conversation)`
- `void abandonConversation(@NotNull @NotNull Conversation conversation, @NotNull @NotNull ConversationAbandonedEvent details)`
- `@Obsolete void sendRawMessage(@NotNull @NotNull String message)`
- `@Deprecated void sendRawMessage(@Nullable @Nullable UUID sender, @NotNull @NotNull String message)`
