---
title: "org.bukkit.conversations.NumericPrompt"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/NumericPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class NumericPrompt**
`public abstract class NumericPrompt extends ValidatingPrompt`
- `public NumericPrompt()`
- `protected boolean isInputValid(@NotNull ConversationContext context, @NotNull String input)`
- `protected boolean isNumberValid(@NotNull ConversationContext context, @NotNull Number input)`
- `@Nullable protected Prompt acceptValidatedInput(@NotNull ConversationContext context, @NotNull String input)`
- `@Nullable protected abstract Prompt acceptValidatedInput(@NotNull ConversationContext context, @NotNull Number input)`
- `@Nullable protected String getFailedValidationText(@NotNull ConversationContext context, @NotNull String invalidInput)`
- `@Nullable protected String getInputNotNumericText(@NotNull ConversationContext context, @NotNull String invalidInput)`
- `@Nullable protected String getFailedValidationText(@NotNull ConversationContext context, @NotNull Number invalidInput)`
