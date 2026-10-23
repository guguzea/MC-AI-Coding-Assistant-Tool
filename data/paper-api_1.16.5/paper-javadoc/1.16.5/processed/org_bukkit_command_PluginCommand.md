---
title: "org.bukkit.command.PluginCommand"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/command/PluginCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected PluginCommand&#8203;(@NotNull @NotNull String name, @NotNull @NotNull Plugin owner)`
- `public boolean execute&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLabel, @NotNull @NotNull String[] args)`
- `public void setExecutor&#8203;(@Nullable @Nullable CommandExecutor executor)`
- `@NotNull public @NotNull CommandExecutor getExecutor()`
- `public void setTabCompleter&#8203;(@Nullable @Nullable TabCompleter completer)`
- `@Nullable public @Nullable TabCompleter getTabCompleter()`
- `@NotNull public @NotNull Plugin getPlugin()`
- `@NotNull public List<String> tabComplete&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String[] args) throws CommandException, IllegalArgumentException`
- `public String toString()`
