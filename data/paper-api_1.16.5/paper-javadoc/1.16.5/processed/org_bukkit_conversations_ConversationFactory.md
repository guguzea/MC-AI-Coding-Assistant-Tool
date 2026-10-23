---
title: "org.bukkit.conversations.ConversationFactory"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/conversations/ConversationFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected Plugin plugin`
- `protected boolean isModal`
- `protected boolean localEchoEnabled`
- `protected ConversationPrefix prefix`
- `protected Prompt firstPrompt`
- `protected Map<Object,&#8203;Object> initialSessionData`
- `protected String playerOnlyMessage`
- `protected List<ConversationCanceller> cancellers`
- `protected List<ConversationAbandonedListener> abandonedListeners`
- `public ConversationFactory&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull ConversationFactory withModality&#8203;(boolean modal)`
- `@NotNull public @NotNull ConversationFactory withLocalEcho&#8203;(boolean localEchoEnabled)`
- `@NotNull public @NotNull ConversationFactory withPrefix&#8203;(@NotNull @NotNull ConversationPrefix prefix)`
- `@NotNull public @NotNull ConversationFactory withTimeout&#8203;(int timeoutSeconds)`
- `@NotNull public @NotNull ConversationFactory withFirstPrompt&#8203;(@Nullable @Nullable Prompt firstPrompt)`
- `@NotNull public @NotNull ConversationFactory withInitialSessionData&#8203;(@NotNull @NotNull Map<Object,&#8203;Object> initialSessionData)`
- `@NotNull public @NotNull ConversationFactory withEscapeSequence&#8203;(@NotNull @NotNull String escapeSequence)`
- `@NotNull public @NotNull ConversationFactory withConversationCanceller&#8203;(@NotNull @NotNull ConversationCanceller canceller)`
- `@NotNull public @NotNull ConversationFactory thatExcludesNonPlayersWithMessage&#8203;(@Nullable @Nullable String playerOnlyMessage)`
- `@NotNull public @NotNull ConversationFactory addConversationAbandonedListener&#8203;(@NotNull @NotNull ConversationAbandonedListener listener)`
- `@NotNull public @NotNull Conversation buildConversation&#8203;(@NotNull @NotNull Conversable forWhom)`
