---
title: "org.bukkit.conversations.Prompt"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/Prompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Prompt**
`public interface Prompt extends Cloneable`
- `static final Prompt END_OF_CONVERSATION`
- `@NotNull String getPromptText(@NotNull ConversationContext context)`
- `boolean blocksForInput(@NotNull ConversationContext context)`
- `@Nullable Prompt acceptInput(@NotNull ConversationContext context, @Nullable String input)`
