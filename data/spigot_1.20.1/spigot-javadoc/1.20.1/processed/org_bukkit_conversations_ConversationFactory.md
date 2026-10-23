---
title: "org.bukkit.conversations.ConversationFactory"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.conversations.ConversationFactory`
- `protected org.bukkit.plugin.Plugin plugin`
- `protected boolean isModal`
- `protected boolean localEchoEnabled`
- `protected org.bukkit.conversations.ConversationPrefix prefix`
- `protected org.bukkit.conversations.Prompt firstPrompt`
- `protected java.util.Map<java.lang.Object, java.lang.Object> initialSessionData`
- `protected java.lang.String playerOnlyMessage`
- `protected java.util.List<org.bukkit.conversations.ConversationCanceller> cancellers`
- `protected java.util.List<org.bukkit.conversations.ConversationAbandonedListener> abandonedListeners`
- `public org.bukkit.conversations.ConversationFactory(org.bukkit.plugin.Plugin)`
- `public org.bukkit.conversations.ConversationFactory withModality(boolean)`
- `public org.bukkit.conversations.ConversationFactory withLocalEcho(boolean)`
- `public org.bukkit.conversations.ConversationFactory withPrefix(org.bukkit.conversations.ConversationPrefix)`
- `public org.bukkit.conversations.ConversationFactory withTimeout(int)`
- `public org.bukkit.conversations.ConversationFactory withFirstPrompt(org.bukkit.conversations.Prompt)`
- `public org.bukkit.conversations.ConversationFactory withInitialSessionData(java.util.Map<java.lang.Object, java.lang.Object>)`
- `public org.bukkit.conversations.ConversationFactory withEscapeSequence(java.lang.String)`
- `public org.bukkit.conversations.ConversationFactory withConversationCanceller(org.bukkit.conversations.ConversationCanceller)`
- `public org.bukkit.conversations.ConversationFactory thatExcludesNonPlayersWithMessage(java.lang.String)`
- `public org.bukkit.conversations.ConversationFactory addConversationAbandonedListener(org.bukkit.conversations.ConversationAbandonedListener)`
- `public org.bukkit.conversations.Conversation buildConversation(org.bukkit.conversations.Conversable)`
