---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/conversations/ValidatingPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public ValidatingPrompt()`
- `@Nullable public @Nullable Prompt acceptInput(@NotNull @NotNull ConversationContext context, @Nullable @Nullable String input)`
- `public boolean blocksForInput(@NotNull @NotNull ConversationContext context)`
- `protected abstract boolean isInputValid(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected abstract @Nullable Prompt acceptValidatedInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected @Nullable String getFailedValidationText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
