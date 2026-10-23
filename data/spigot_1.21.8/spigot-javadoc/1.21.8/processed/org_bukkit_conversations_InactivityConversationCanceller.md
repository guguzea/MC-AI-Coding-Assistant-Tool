---
title: "org.bukkit.conversations.InactivityConversationCanceller"
package: "org.bukkit.conversations"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
