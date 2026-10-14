---
title: "org.bukkit.conversations.ConversationFactory"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/ConversationFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ConversationFactory**
`public class ConversationFactory extends Object`
- `protected Plugin plugin`
- `protected boolean isModal`
- `protected boolean localEchoEnabled`
- `protected ConversationPrefix prefix`
- `protected Prompt firstPrompt`
- `protected Map<Object,Object> initialSessionData`
- `protected String playerOnlyMessage`
- `protected List<ConversationCanceller> cancellers`
- `protected List<ConversationAbandonedListener> abandonedListeners`
- `public ConversationFactory(@NotNull Plugin plugin)`
- `@NotNull public ConversationFactory withModality(boolean modal)`
- `@NotNull public ConversationFactory withLocalEcho(boolean localEchoEnabled)`
- `@NotNull public ConversationFactory withPrefix(@NotNull ConversationPrefix prefix)`
- `@NotNull public ConversationFactory withTimeout(int timeoutSeconds)`
- `@NotNull public ConversationFactory withFirstPrompt(@Nullable Prompt firstPrompt)`
- `@NotNull public ConversationFactory withInitialSessionData(@NotNull Map<Object,Object> initialSessionData)`
- `@NotNull public ConversationFactory withEscapeSequence(@NotNull String escapeSequence)`
- `@NotNull public ConversationFactory withConversationCanceller(@NotNull ConversationCanceller canceller)`
- `@NotNull public ConversationFactory thatExcludesNonPlayersWithMessage(@Nullable String playerOnlyMessage)`
- `@NotNull public ConversationFactory addConversationAbandonedListener(@NotNull ConversationAbandonedListener listener)`
- `@NotNull public Conversation buildConversation(@NotNull Conversable forWhom)`
