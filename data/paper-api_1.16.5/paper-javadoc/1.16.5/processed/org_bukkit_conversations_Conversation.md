---
title: "org.bukkit.conversations.Conversation"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/conversations/Conversation.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected Prompt currentPrompt`
- `protected ConversationContext context`
- `protected boolean modal`
- `protected boolean localEchoEnabled`
- `protected ConversationPrefix prefix`
- `protected List<ConversationCanceller> cancellers`
- `protected List<ConversationAbandonedListener> abandonedListeners`
- `public Conversation&#8203;(@Nullable @Nullable Plugin plugin, @NotNull @NotNull Conversable forWhom, @Nullable @Nullable Prompt firstPrompt)`
- `public Conversation&#8203;(@Nullable @Nullable Plugin plugin, @NotNull @NotNull Conversable forWhom, @Nullable @Nullable Prompt firstPrompt, @NotNull @NotNull Map<Object,&#8203;Object> initialSessionData)`
- `@NotNull public @NotNull Conversable getForWhom()`
- `public boolean isModal()`
- `public boolean isLocalEchoEnabled()`
- `public void setLocalEchoEnabled&#8203;(boolean localEchoEnabled)`
- `@NotNull public @NotNull ConversationPrefix getPrefix()`
- `@NotNull public @NotNull List<ConversationCanceller> getCancellers()`
- `@NotNull public @NotNull ConversationContext getContext()`
- `public void begin()`
- `@NotNull public @NotNull Conversation.ConversationState getState()`
- `public void acceptInput&#8203;(@NotNull @NotNull String input)`
- `public void addConversationAbandonedListener&#8203;(@NotNull @NotNull ConversationAbandonedListener listener)`
- `public void removeConversationAbandonedListener&#8203;(@NotNull @NotNull ConversationAbandonedListener listener)`
- `public void abandon()`
- `public void abandon&#8203;(@NotNull @NotNull ConversationAbandonedEvent details)`
- `public void outputNextPrompt()`
