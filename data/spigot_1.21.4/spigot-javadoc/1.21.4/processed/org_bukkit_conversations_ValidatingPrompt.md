---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public abstract class org.bukkit.conversations.ValidatingPrompt implements org.bukkit.conversations.Prompt`
- `public org.bukkit.conversations.ValidatingPrompt()`
- `public org.bukkit.conversations.Prompt acceptInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `public boolean blocksForInput(org.bukkit.conversations.ConversationContext)`
- `protected abstract boolean isInputValid(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected abstract org.bukkit.conversations.Prompt acceptValidatedInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected java.lang.String getFailedValidationText(org.bukkit.conversations.ConversationContext, java.lang.String)`
