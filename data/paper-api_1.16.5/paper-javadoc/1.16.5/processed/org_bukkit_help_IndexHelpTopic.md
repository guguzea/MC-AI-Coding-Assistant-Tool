---
title: "org.bukkit.help.IndexHelpTopic"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/help/IndexHelpTopic.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected String permission`
- `protected String preamble`
- `protected Collection<HelpTopic> allTopics`
- `public IndexHelpTopic&#8203;(@NotNull @NotNull String name, @Nullable @Nullable String shortText, @Nullable @Nullable String permission, @NotNull @NotNull Collection<HelpTopic> topics)`
- `public IndexHelpTopic&#8203;(@NotNull @NotNull String name, @Nullable @Nullable String shortText, @Nullable @Nullable String permission, @NotNull @NotNull Collection<HelpTopic> topics, @Nullable @Nullable String preamble)`
- `protected void setTopicsCollection&#8203;(@NotNull @NotNull Collection<HelpTopic> topics)`
- `public boolean canSee&#8203;(@NotNull @NotNull CommandSender sender)`
- `public void amendCanSee&#8203;(@Nullable @Nullable String amendedPermission)`
- `@NotNull public @NotNull String getFullText&#8203;(@NotNull @NotNull CommandSender sender)`
- `@NotNull protected @NotNull String buildPreamble&#8203;(@NotNull @NotNull CommandSender sender)`
- `@NotNull protected @NotNull String buildIndexLine&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull HelpTopic topic)`
