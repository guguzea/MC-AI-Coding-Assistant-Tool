---
title: "org.bukkit.conversations.NumericPrompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/conversations/NumericPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public NumericPrompt()`
- `protected boolean isInputValid(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `protected boolean isNumberValid(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number input)`
- `@Nullable protected @Nullable Prompt acceptValidatedInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected abstract @Nullable Prompt acceptValidatedInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number input)`
- `@Nullable protected @Nullable String getFailedValidationText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
- `@Nullable protected @Nullable String getInputNotNumericText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
- `@Nullable protected @Nullable String getFailedValidationText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number invalidInput)`
