---
title: "org.bukkit.conversations.Conversation"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/conversations/Conversation.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `protected Prompt currentPrompt`
- `protected ConversationContext context`
- `protected boolean modal`
- `protected boolean localEchoEnabled`
- `protected ConversationPrefix prefix`
- `protected List<ConversationCanceller> cancellers`
- `protected List<ConversationAbandonedListener> abandonedListeners`
- `public Conversation(@Nullable @Nullable Plugin plugin, @NotNull @NotNull Conversable forWhom, @Nullable @Nullable Prompt firstPrompt)`
- `public Conversation(@Nullable @Nullable Plugin plugin, @NotNull @NotNull Conversable forWhom, @Nullable @Nullable Prompt firstPrompt, @NotNull @NotNull Map<Object,Object> initialSessionData)`
- `@NotNull public @NotNull Conversable getForWhom()`
- `public boolean isModal()`
- `public boolean isLocalEchoEnabled()`
- `public void setLocalEchoEnabled(boolean localEchoEnabled)`
- `@NotNull public @NotNull ConversationPrefix getPrefix()`
- `@NotNull public @NotNull List<ConversationCanceller> getCancellers()`
- `@NotNull public @NotNull ConversationContext getContext()`
- `public void begin()`
- `@NotNull public @NotNull Conversation.ConversationState getState()`
- `public void acceptInput(@NotNull @NotNull String input)`
- `public void addConversationAbandonedListener(@NotNull @NotNull ConversationAbandonedListener listener)`
- `public void removeConversationAbandonedListener(@NotNull @NotNull ConversationAbandonedListener listener)`
- `public void abandon()`
- `public void abandon(@NotNull @NotNull ConversationAbandonedEvent details)`
- `public void outputNextPrompt()`
