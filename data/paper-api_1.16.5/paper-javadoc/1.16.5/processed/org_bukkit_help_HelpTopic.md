---
title: "org.bukkit.help.HelpTopic"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/help/HelpTopic.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected String name`
- `protected String shortText`
- `protected String fullText`
- `protected String amendedPermission`
- `public HelpTopic()`
- `public abstract boolean canSee&#8203;(@NotNull @NotNull CommandSender player)`
- `public void amendCanSee&#8203;(@Nullable @Nullable String amendedPermission)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull String getShortText()`
- `@NotNull public @NotNull String getFullText&#8203;(@NotNull @NotNull CommandSender forWho)`
- `public void amendTopic&#8203;(@Nullable @Nullable String amendedShortText, @Nullable @Nullable String amendedFullText)`
- `@NotNull protected @NotNull String applyAmendment&#8203;(@NotNull @NotNull String baseText, @Nullable @Nullable String amendment)`
