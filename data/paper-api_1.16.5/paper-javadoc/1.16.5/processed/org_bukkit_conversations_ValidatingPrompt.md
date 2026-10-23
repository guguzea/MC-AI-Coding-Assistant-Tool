---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/conversations/ValidatingPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public ValidatingPrompt()`
- `@Nullable public @Nullable Prompt acceptInput&#8203;(@NotNull @NotNull ConversationContext context, @Nullable @Nullable String input)`
- `public boolean blocksForInput&#8203;(@NotNull @NotNull ConversationContext context)`
- `protected abstract boolean isInputValid&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected abstract @Nullable Prompt acceptValidatedInput&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected @Nullable String getFailedValidationText&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
