---
title: "org.bukkit.conversations.NumericPrompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/26.3/org/bukkit/conversations/NumericPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class NumericPrompt**
`@Deprecated(forRemoval=true) public abstract class NumericPrompt extends ValidatingPrompt`
- `public NumericPrompt()`
- `protected boolean isInputValid(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `protected boolean isNumberValid(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number input)`
- `@Nullable protected @Nullable Prompt acceptValidatedInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected abstract @Nullable Prompt acceptValidatedInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number input)`
- `@Nullable protected @Nullable String getFailedValidationText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
- `@Nullable protected @Nullable String getInputNotNumericText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
- `@Nullable protected @Nullable String getFailedValidationText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull Number invalidInput)`
