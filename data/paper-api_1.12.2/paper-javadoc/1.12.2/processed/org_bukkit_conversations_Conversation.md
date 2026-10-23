---
title: "org.bukkit.conversations.Conversation"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/conversations/Conversation.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static class Conversation.ConversationState`
- `protected List<ConversationAbandonedListener> abandonedListeners`
- `protected List<ConversationCanceller> cancellers`
- `protected ConversationContext context`
- `protected Prompt currentPrompt`
- `protected boolean localEchoEnabled`
- `protected boolean modal`
- `protected ConversationPrefix prefix`
- `void abandon()`
- `void abandon(ConversationAbandonedEvent details)`
- `void acceptInput(String input)`
- `void addConversationAbandonedListener(ConversationAbandonedListener listener)`
- `void begin()`
- `List<ConversationCanceller> getCancellers()`
- `ConversationContext getContext()`
- `Conversable getForWhom()`
- `ConversationPrefix getPrefix()`
- `Conversation.ConversationState getState()`
- `boolean isLocalEchoEnabled()`
- `boolean isModal()`
- `void outputNextPrompt()`
- `void removeConversationAbandonedListener(ConversationAbandonedListener listener)`
- `void setLocalEchoEnabled(boolean localEchoEnabled)`
