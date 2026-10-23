---
title: "org.bukkit.help.IndexHelpTopic"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/help/IndexHelpTopic.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `protected String permission`
- `protected String preamble`
- `protected Collection<HelpTopic> allTopics`
- `public IndexHelpTopic(@NotNull @NotNull String name, @Nullable @Nullable String shortText, @Nullable @Nullable String permission, @NotNull @NotNull Collection<HelpTopic> topics)`
- `public IndexHelpTopic(@NotNull @NotNull String name, @Nullable @Nullable String shortText, @Nullable @Nullable String permission, @NotNull @NotNull Collection<HelpTopic> topics, @Nullable @Nullable String preamble)`
- `protected void setTopicsCollection(@NotNull @NotNull Collection<HelpTopic> topics)`
- `public boolean canSee(@NotNull @NotNull CommandSender sender)`
- `public void amendCanSee(@Nullable @Nullable String amendedPermission)`
- `@NotNull public @NotNull String getFullText(@NotNull @NotNull CommandSender sender)`
- `@NotNull protected @NotNull String buildPreamble(@NotNull @NotNull CommandSender sender)`
- `@NotNull protected @NotNull String buildIndexLine(@NotNull @NotNull CommandSender sender, @NotNull @NotNull HelpTopic topic)`
