---
title: "org.bukkit.conversations.ValidatingPrompt"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public abstract class org.bukkit.conversations.ValidatingPrompt implements org.bukkit.conversations.Prompt`
- `public org.bukkit.conversations.ValidatingPrompt()`
- `public org.bukkit.conversations.Prompt acceptInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `public boolean blocksForInput(org.bukkit.conversations.ConversationContext)`
- `protected abstract boolean isInputValid(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected abstract org.bukkit.conversations.Prompt acceptValidatedInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `protected java.lang.String getFailedValidationText(org.bukkit.conversations.ConversationContext, java.lang.String)`
