---
title: "org.bukkit.command.PluginCommand"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/command/PluginCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public boolean execute(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLabel, @NotNull @NotNull String[] args)`
- `public void setExecutor(@Nullable @Nullable CommandExecutor executor)`
- `@NotNull public @NotNull CommandExecutor getExecutor()`
- `public void setTabCompleter(@Nullable @Nullable TabCompleter completer)`
- `@Nullable public @Nullable TabCompleter getTabCompleter()`
- `@NotNull public @NotNull Plugin getPlugin()`
- `@NotNull public List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String[] args) throws CommandException, IllegalArgumentException`
- `public String toString()`
