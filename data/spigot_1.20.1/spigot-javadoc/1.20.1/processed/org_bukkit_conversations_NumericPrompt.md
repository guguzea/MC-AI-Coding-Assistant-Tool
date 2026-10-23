---
title: "org.bukkit.conversations.NumericPrompt"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public abstract class org.bukkit.conversations.NumericPrompt extends org.bukkit.conversations.ValidatingPrompt`
- `public org.bukkit.conversations.NumericPrompt()`
- `protected boolean isInputValid(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected boolean isNumberValid(org.bukkit.conversations.ConversationContext, java.lang.Number)`
- `protected org.bukkit.conversations.Prompt acceptValidatedInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected abstract org.bukkit.conversations.Prompt acceptValidatedInput(org.bukkit.conversations.ConversationContext, java.lang.Number)`
- `protected java.lang.String getFailedValidationText(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected java.lang.String getInputNotNumericText(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected java.lang.String getFailedValidationText(org.bukkit.conversations.ConversationContext, java.lang.Number)`
