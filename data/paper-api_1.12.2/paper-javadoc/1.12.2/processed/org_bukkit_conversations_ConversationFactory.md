---
title: "org.bukkit.conversations.ConversationFactory"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/conversations/ConversationFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `protected List<ConversationAbandonedListener> abandonedListeners`
- `protected List<ConversationCanceller> cancellers`
- `protected Prompt firstPrompt`
- `protected Map<Object,Object> initialSessionData`
- `protected boolean isModal`
- `protected boolean localEchoEnabled`
- `protected String playerOnlyMessage`
- `protected Plugin plugin`
- `protected ConversationPrefix prefix`
- `ConversationFactory addConversationAbandonedListener(ConversationAbandonedListener listener)`
- `Conversation buildConversation(Conversable forWhom)`
- `ConversationFactory thatExcludesNonPlayersWithMessage(String playerOnlyMessage)`
- `ConversationFactory withConversationCanceller(ConversationCanceller canceller)`
- `ConversationFactory withEscapeSequence(String escapeSequence)`
- `ConversationFactory withFirstPrompt(Prompt firstPrompt)`
- `ConversationFactory withInitialSessionData(Map<Object,Object> initialSessionData)`
- `ConversationFactory withLocalEcho(boolean localEchoEnabled)`
- `ConversationFactory withModality(boolean modal)`
- `ConversationFactory withPrefix(ConversationPrefix prefix)`
- `ConversationFactory withTimeout(int timeoutSeconds)`
