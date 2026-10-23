---
title: "org.bukkit.command.defaults.HelpCommand"
package: "org.bukkit.command.defaults"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/command/defaults/HelpCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public HelpCommand()`
- `public boolean execute(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String currentAlias, @NotNull @NotNull String[] args)`
- `@NotNull public @NotNull List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String[] args)`
- `@Nullable protected @Nullable HelpTopic findPossibleMatches(@NotNull @NotNull String searchString)`
- `protected static int damerauLevenshteinDistance(@Nullable @Nullable String s1, @Nullable @Nullable String s2)`
