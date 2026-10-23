---
title: "org.bukkit.help.HelpTopic"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/help/HelpTopic.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `protected String name`
- `protected String shortText`
- `protected String fullText`
- `protected String amendedPermission`
- `public HelpTopic()`
- `public abstract boolean canSee(@NotNull @NotNull CommandSender player)`
- `public void amendCanSee(@Nullable @Nullable String amendedPermission)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull String getShortText()`
- `@NotNull public @NotNull String getFullText(@NotNull @NotNull CommandSender forWho)`
- `public void amendTopic(@Nullable @Nullable String amendedShortText, @Nullable @Nullable String amendedFullText)`
- `@NotNull protected @NotNull String applyAmendment(@NotNull @NotNull String baseText, @Nullable @Nullable String amendment)`
