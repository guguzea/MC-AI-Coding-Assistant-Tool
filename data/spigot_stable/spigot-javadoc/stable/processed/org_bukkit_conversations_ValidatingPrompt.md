---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/conversations/ValidatingPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ValidatingPrompt**
`public abstract class ValidatingPrompt extends Object implements Prompt`
- `public ValidatingPrompt()`
- `@Nullable public Prompt acceptInput(@NotNull ConversationContext context, @Nullable String input)`
- `public boolean blocksForInput(@NotNull ConversationContext context)`
- `protected abstract boolean isInputValid(@NotNull ConversationContext context, @NotNull String input)`
- `@Nullable protected abstract Prompt acceptValidatedInput(@NotNull ConversationContext context, @NotNull String input)`
- `@Nullable protected String getFailedValidationText(@NotNull ConversationContext context, @NotNull String invalidInput)`
