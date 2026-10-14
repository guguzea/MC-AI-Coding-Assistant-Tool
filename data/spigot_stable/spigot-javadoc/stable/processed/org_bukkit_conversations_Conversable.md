---
title: "org.bukkit.conversations.Conversable"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/Conversable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Conversable**
`public interface Conversable`
- `boolean isConversing()`
- `void acceptConversationInput(@NotNull String input)`
- `boolean beginConversation(@NotNull Conversation conversation)`
- `void abandonConversation(@NotNull Conversation conversation)`
- `void abandonConversation(@NotNull Conversation conversation, @NotNull ConversationAbandonedEvent details)`
- `void sendRawMessage(@NotNull String message)`
- `void sendRawMessage(@Nullable UUID sender, @NotNull String message)`
