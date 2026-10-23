---
title: "org.bukkit.conversations.InactivityConversationCanceller"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.conversations.InactivityConversationCanceller implements org.bukkit.conversations.ConversationCanceller`
- `protected org.bukkit.plugin.Plugin plugin`
- `protected int timeoutSeconds`
- `protected org.bukkit.conversations.Conversation conversation`
- `public org.bukkit.conversations.InactivityConversationCanceller(org.bukkit.plugin.Plugin, int)`
- `public void setConversation(org.bukkit.conversations.Conversation)`
- `public boolean cancelBasedOnInput(org.bukkit.conversations.ConversationContext, java.lang.String)`
- `public org.bukkit.conversations.ConversationCanceller clone()`
- `protected void cancelling(org.bukkit.conversations.Conversation)`
- `public java.lang.Object clone() throws java.lang.CloneNotSupportedException`
