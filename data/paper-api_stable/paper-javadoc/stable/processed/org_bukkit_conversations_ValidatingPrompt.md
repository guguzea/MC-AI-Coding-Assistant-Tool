---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/26.3/org/bukkit/conversations/ValidatingPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ValidatingPrompt**
`@Deprecated(forRemoval=true) public abstract class ValidatingPrompt extends Object implements Prompt`
- `public ValidatingPrompt()`
- `@Nullable public @Nullable Prompt acceptInput(@NotNull @NotNull ConversationContext context, @Nullable @Nullable String input)`
- `public boolean blocksForInput(@NotNull @NotNull ConversationContext context)`
- `protected abstract boolean isInputValid(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected abstract @Nullable Prompt acceptValidatedInput(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String input)`
- `@Nullable protected @Nullable String getFailedValidationText(@NotNull @NotNull ConversationContext context, @NotNull @NotNull String invalidInput)`
