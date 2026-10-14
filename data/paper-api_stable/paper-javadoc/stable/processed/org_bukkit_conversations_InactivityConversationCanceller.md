---
title: "org.bukkit.conversations.InactivityConversationCanceller"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/26.3/org/bukkit/conversations/InactivityConversationCanceller.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class InactivityConversationCanceller**
`@Deprecated(forRemoval=true) public class InactivityConversationCanceller extends Object implements ConversationCanceller`
- `protected Plugin plugin`
- `protected int timeoutSeconds`
- `protected Conversation conversation`
- `public InactivityConversationCanceller(@NotNull @NotNull Plugin plugin, int timeoutSeconds)`
- `public void setConversation(@NotNull @NotNull Conversation conversation)`
- `public boolean cancelBasedOnInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@NotNull public @NotNull ConversationCanceller clone()`
- `protected void cancelling(@NotNull @NotNull Conversation conversation)`
