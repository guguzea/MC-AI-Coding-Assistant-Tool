---
title: "org.bukkit.help.HelpTopic"
package: "org.bukkit.help"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/help/HelpTopic.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class HelpTopic**
`public abstract class HelpTopic extends Object`
- `protected String name`
- `protected String shortText`
- `protected String fullText`
- `protected String amendedPermission`
- `public HelpTopic()`
- `public abstract boolean canSee(@NotNull CommandSender player)`
- `public void amendCanSee(@Nullable String amendedPermission)`
- `@NotNull public String getName()`
- `@NotNull public String getShortText()`
- `@NotNull public String getFullText(@NotNull CommandSender forWho)`
- `public void amendTopic(@Nullable String amendedShortText, @Nullable String amendedFullText)`
- `@NotNull protected String applyAmendment(@NotNull String baseText, @Nullable String amendment)`
