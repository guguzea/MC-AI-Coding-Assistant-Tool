---
title: "org.bukkit.conversations.Conversation"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.conversations.Conversation`
- `protected org.bukkit.conversations.Prompt currentPrompt`
- `protected org.bukkit.conversations.ConversationContext context`
- `protected boolean modal`
- `protected boolean localEchoEnabled`
- `protected org.bukkit.conversations.ConversationPrefix prefix`
- `protected java.util.List<org.bukkit.conversations.ConversationCanceller> cancellers`
- `protected java.util.List<org.bukkit.conversations.ConversationAbandonedListener> abandonedListeners`
- `public org.bukkit.conversations.Conversation(org.bukkit.plugin.Plugin, org.bukkit.conversations.Conversable, org.bukkit.conversations.Prompt)`
- `public org.bukkit.conversations.Conversation(org.bukkit.plugin.Plugin, org.bukkit.conversations.Conversable, org.bukkit.conversations.Prompt, java.util.Map<java.lang.Object, java.lang.Object>)`
- `public org.bukkit.conversations.Conversable getForWhom()`
- `public boolean isModal()`
- `public boolean isLocalEchoEnabled()`
- `public void setLocalEchoEnabled(boolean)`
- `public org.bukkit.conversations.ConversationPrefix getPrefix()`
- `public java.util.List<org.bukkit.conversations.ConversationCanceller> getCancellers()`
- `public org.bukkit.conversations.ConversationContext getContext()`
- `public void begin()`
- `public org.bukkit.conversations.Conversation$ConversationState getState()`
- `public void acceptInput(java.lang.String)`
- `public synchronized void addConversationAbandonedListener(org.bukkit.conversations.ConversationAbandonedListener)`
- `public synchronized void removeConversationAbandonedListener(org.bukkit.conversations.ConversationAbandonedListener)`
- `public void abandon()`
- `public synchronized void abandon(org.bukkit.conversations.ConversationAbandonedEvent)`
- `public void outputNextPrompt()`
