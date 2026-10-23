---
title: "org.bukkit.conversations.NumericPrompt"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
