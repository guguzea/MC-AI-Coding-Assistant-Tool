---
title: "org.bukkit.conversations.ConversationCanceller"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/ConversationCanceller.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ConversationCanceller**
`public interface ConversationCanceller extends Cloneable`
- `void setConversation(@NotNull Conversation conversation)`
- `boolean cancelBasedOnInput(@NotNull ConversationContext context, @NotNull String input)`
- `@NotNull ConversationCanceller clone()`
