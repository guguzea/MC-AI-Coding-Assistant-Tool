---
title: "org.bukkit.conversations.ConversationFactory"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/conversations/ConversationFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `protected Plugin plugin`
- `protected boolean isModal`
- `protected boolean localEchoEnabled`
- `protected ConversationPrefix prefix`
- `protected Prompt firstPrompt`
- `protected Map<Object,Object> initialSessionData`
- `protected String playerOnlyMessage`
- `protected List<ConversationCanceller> cancellers`
- `protected List<ConversationAbandonedListener> abandonedListeners`
- `public ConversationFactory(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull ConversationFactory withModality(boolean modal)`
- `@NotNull public @NotNull ConversationFactory withLocalEcho(boolean localEchoEnabled)`
- `@NotNull public @NotNull ConversationFactory withPrefix(@NotNull @NotNull ConversationPrefix prefix)`
- `@NotNull public @NotNull ConversationFactory withTimeout(int timeoutSeconds)`
- `@NotNull public @NotNull ConversationFactory withFirstPrompt(@Nullable @Nullable Prompt firstPrompt)`
- `@NotNull public @NotNull ConversationFactory withInitialSessionData(@NotNull @NotNull Map<Object,Object> initialSessionData)`
- `@NotNull public @NotNull ConversationFactory withEscapeSequence(@NotNull @NotNull String escapeSequence)`
- `@NotNull public @NotNull ConversationFactory withConversationCanceller(@NotNull @NotNull ConversationCanceller canceller)`
- `@NotNull public @NotNull ConversationFactory thatExcludesNonPlayersWithMessage(@Nullable @Nullable String playerOnlyMessage)`
- `@NotNull public @NotNull ConversationFactory addConversationAbandonedListener(@NotNull @NotNull ConversationAbandonedListener listener)`
- `@NotNull public @NotNull Conversation buildConversation(@NotNull @NotNull Conversable forWhom)`
