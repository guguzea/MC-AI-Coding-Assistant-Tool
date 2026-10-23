---
title: "org.bukkit.conversations.Conversable"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/conversations/Conversable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `boolean isConversing()`
- `void acceptConversationInput(@NotNull @NotNull String input)`
- `boolean beginConversation(@NotNull @NotNull Conversation conversation)`
- `void abandonConversation(@NotNull @NotNull Conversation conversation)`
- `void abandonConversation(@NotNull @NotNull Conversation conversation, @NotNull @NotNull ConversationAbandonedEvent details)`
- `@Obsolete void sendRawMessage(@NotNull @NotNull String message)`
- `@Deprecated void sendRawMessage(@Nullable @Nullable UUID sender, @NotNull @NotNull String message)`
