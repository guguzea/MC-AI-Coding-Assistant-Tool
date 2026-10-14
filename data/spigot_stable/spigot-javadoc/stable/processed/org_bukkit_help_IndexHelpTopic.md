---
title: "org.bukkit.help.IndexHelpTopic"
package: "org.bukkit.help"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/help/IndexHelpTopic.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class IndexHelpTopic**
`public class IndexHelpTopic extends HelpTopic`
- `protected String permission`
- `protected String preamble`
- `protected Collection<HelpTopic> allTopics`
- `public IndexHelpTopic(@NotNull String name, @Nullable String shortText, @Nullable String permission, @NotNull Collection<HelpTopic> topics)`
- `public IndexHelpTopic(@NotNull String name, @Nullable String shortText, @Nullable String permission, @NotNull Collection<HelpTopic> topics, @Nullable String preamble)`
- `protected void setTopicsCollection(@NotNull Collection<HelpTopic> topics)`
- `public boolean canSee(@NotNull CommandSender sender)`
- `public void amendCanSee(@Nullable String amendedPermission)`
- `@NotNull public String getFullText(@NotNull CommandSender sender)`
- `@NotNull protected String buildPreamble(@NotNull CommandSender sender)`
- `@NotNull protected String buildIndexLine(@NotNull CommandSender sender, @NotNull HelpTopic topic)`
