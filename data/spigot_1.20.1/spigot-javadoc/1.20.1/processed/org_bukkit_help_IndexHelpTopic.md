---
title: "org.bukkit.help.IndexHelpTopic"
package: "org.bukkit.help"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.help.IndexHelpTopic extends org.bukkit.help.HelpTopic`
- `protected java.lang.String permission`
- `protected java.lang.String preamble`
- `protected java.util.Collection<org.bukkit.help.HelpTopic> allTopics`
- `public org.bukkit.help.IndexHelpTopic(java.lang.String, java.lang.String, java.lang.String, java.util.Collection<org.bukkit.help.HelpTopic>)`
- `public org.bukkit.help.IndexHelpTopic(java.lang.String, java.lang.String, java.lang.String, java.util.Collection<org.bukkit.help.HelpTopic>, java.lang.String)`
- `protected void setTopicsCollection(java.util.Collection<org.bukkit.help.HelpTopic>)`
- `public boolean canSee(org.bukkit.command.CommandSender)`
- `public void amendCanSee(java.lang.String)`
- `public java.lang.String getFullText(org.bukkit.command.CommandSender)`
- `protected java.lang.String buildPreamble(org.bukkit.command.CommandSender)`
- `protected java.lang.String buildIndexLine(org.bukkit.command.CommandSender, org.bukkit.help.HelpTopic)`
