---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public abstract class org.bukkit.conversations.ValidatingPrompt implements org.bukkit.conversations.Prompt`
- `public org.bukkit.conversations.ValidatingPrompt()`
- `public org.bukkit.conversations.Prompt acceptInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `public boolean blocksForInput(org.bukkit.conversations.ConversationContext)`
- `protected abstract boolean isInputValid(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected abstract org.bukkit.conversations.Prompt acceptValidatedInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected java.lang.String getFailedValidationText(org.bukkit.conversations.ConversationContext, java.lang.String)`
