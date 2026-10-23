---
title: "org.bukkit.conversations.InactivityConversationCanceller"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/conversations/InactivityConversationCanceller.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `protected Plugin plugin`
- `protected int timeoutSeconds`
- `protected Conversation conversation`
- `public InactivityConversationCanceller(@NotNull @NotNull Plugin plugin, int timeoutSeconds)`
- `public void setConversation(@NotNull @NotNull Conversation conversation)`
- `public boolean cancelBasedOnInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@NotNull public @NotNull ConversationCanceller clone()`
- `protected void cancelling(@NotNull @NotNull Conversation conversation)`
