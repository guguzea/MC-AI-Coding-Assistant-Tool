---
title: "org.bukkit.conversations.InactivityConversationCanceller"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/InactivityConversationCanceller.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class InactivityConversationCanceller**
`public class InactivityConversationCanceller extends Object implements ConversationCanceller`
- `protected Plugin plugin`
- `protected int timeoutSeconds`
- `protected Conversation conversation`
- `public InactivityConversationCanceller(@NotNull Plugin plugin, int timeoutSeconds)`
- `public void setConversation(@NotNull Conversation conversation)`
- `public boolean cancelBasedOnInput(@NotNull ConversationContext context, @NotNull String input)`
- `@NotNull public ConversationCanceller clone()`
- `protected void cancelling(@NotNull Conversation conversation)`
