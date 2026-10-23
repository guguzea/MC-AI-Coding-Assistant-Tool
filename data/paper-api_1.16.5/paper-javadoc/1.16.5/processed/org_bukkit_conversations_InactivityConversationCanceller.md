---
title: "org.bukkit.conversations.InactivityConversationCanceller"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/conversations/InactivityConversationCanceller.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected Plugin plugin`
- `protected int timeoutSeconds`
- `protected Conversation conversation`
- `public InactivityConversationCanceller&#8203;(@NotNull @NotNull Plugin plugin, int timeoutSeconds)`
- `public void setConversation&#8203;(@NotNull @NotNull Conversation conversation)`
- `public boolean cancelBasedOnInput&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@NotNull public @NotNull ConversationCanceller clone()`
- `protected void cancelling&#8203;(@NotNull @NotNull Conversation conversation)`
