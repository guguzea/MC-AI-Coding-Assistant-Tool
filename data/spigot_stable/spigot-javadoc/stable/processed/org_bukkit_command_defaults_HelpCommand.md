---
title: "org.bukkit.command.defaults.HelpCommand"
package: "org.bukkit.command.defaults"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/command/defaults/HelpCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class HelpCommand**
`public class HelpCommand extends BukkitCommand`
- `public HelpCommand()`
- `public boolean execute(@NotNull CommandSender sender, @NotNull String currentAlias, @NotNull String[] args)`
- `@NotNull public List<String> tabComplete(@NotNull CommandSender sender, @NotNull String alias, @NotNull String[] args)`
- `@Nullable protected HelpTopic findPossibleMatches(@NotNull String searchString)`
- `protected static int damerauLevenshteinDistance(@Nullable String s1, @Nullable String s2)`
