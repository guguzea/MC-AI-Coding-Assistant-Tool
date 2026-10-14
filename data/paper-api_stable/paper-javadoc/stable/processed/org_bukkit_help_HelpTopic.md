---
title: "org.bukkit.help.HelpTopic"
package: "org.bukkit.help"
source: https://jd.papermc.io/paper/26.3/org/bukkit/help/HelpTopic.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class HelpTopic**
`public abstract class HelpTopic extends Object`
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
