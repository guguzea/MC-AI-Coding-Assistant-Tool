---
title: "org.bukkit.conversations.Conversation"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/Conversation.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Conversation**
`public class Conversation extends Object`
- `protected Prompt currentPrompt`
- `protected ConversationContext context`
- `protected boolean modal`
- `protected boolean localEchoEnabled`
- `protected ConversationPrefix prefix`
- `protected List<ConversationCanceller> cancellers`
- `protected List<ConversationAbandonedListener> abandonedListeners`
- `public Conversation(@Nullable Plugin plugin, @NotNull Conversable forWhom, @Nullable Prompt firstPrompt)`
- `public Conversation(@Nullable Plugin plugin, @NotNull Conversable forWhom, @Nullable Prompt firstPrompt, @NotNull Map<Object,Object> initialSessionData)`
- `@NotNull public Conversable getForWhom()`
- `public boolean isModal()`
- `public boolean isLocalEchoEnabled()`
- `public void setLocalEchoEnabled(boolean localEchoEnabled)`
- `@NotNull public ConversationPrefix getPrefix()`
- `@NotNull public List<ConversationCanceller> getCancellers()`
- `@NotNull public ConversationContext getContext()`
- `public void begin()`
- `@NotNull public Conversation.ConversationState getState()`
- `public void acceptInput(@NotNull String input)`
- `public void addConversationAbandonedListener(@NotNull ConversationAbandonedListener listener)`
- `public void removeConversationAbandonedListener(@NotNull ConversationAbandonedListener listener)`
- `public void abandon()`
- `public void abandon(@NotNull ConversationAbandonedEvent details)`
- `public void outputNextPrompt()`
