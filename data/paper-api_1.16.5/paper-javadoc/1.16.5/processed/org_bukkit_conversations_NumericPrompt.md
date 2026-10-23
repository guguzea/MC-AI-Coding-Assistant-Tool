---
title: "org.bukkit.conversations.NumericPrompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/conversations/NumericPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public NumericPrompt()`
- `protected boolean isInputValid&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `protected boolean isNumberValid&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number input)`
- `@Nullable protected @Nullable Prompt acceptValidatedInput&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected abstract @Nullable Prompt acceptValidatedInput&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number input)`
- `@Nullable protected @Nullable String getFailedValidationText&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
- `@Nullable protected @Nullable String getInputNotNumericText&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
- `@Nullable protected @Nullable String getFailedValidationText&#8203;(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number invalidInput)`
