---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/conversations/ValidatingPrompt.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `Prompt acceptInput(ConversationContext context, String input)`
- `protected abstract Prompt acceptValidatedInput(ConversationContext context, String input)`
- `boolean blocksForInput(ConversationContext context)`
- `protected String getFailedValidationText(ConversationContext context, String invalidInput)`
- `protected abstract boolean isInputValid(ConversationContext context, String input)`
