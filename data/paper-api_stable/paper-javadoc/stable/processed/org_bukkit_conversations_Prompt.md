---
title: "org.bukkit.conversations.Prompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/26.3/org/bukkit/conversations/Prompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Prompt**
`@Deprecated(forRemoval=true) public interface Prompt extends Cloneable`
- `static final Prompt END_OF_CONVERSATION`
- `@NotNull @NotNull String getPromptText(@NotNull @NotNull ConversationContext context)`
- `boolean blocksForInput(@NotNull @NotNull ConversationContext context)`
- `@Nullable @Nullable Prompt acceptInput(@NotNull @NotNull ConversationContext context, @Nullable @Nullable String input)`
