---
title: "org.bukkit.conversations.ConversationCanceller"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/26.3/org/bukkit/conversations/ConversationCanceller.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ConversationCanceller**
`@Deprecated(forRemoval=true) public interface ConversationCanceller extends Cloneable`
- `void setConversation(@NotNull @NotNull Conversation conversation)`
- `boolean cancelBasedOnInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@NotNull @NotNull ConversationCanceller clone()`
