---
title: "org.bukkit.command.PluginCommand"
package: "org.bukkit.command"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/command/PluginCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PluginCommand**
`public final class PluginCommand extends Command implements PluginIdentifiableCommand`
- `protected PluginCommand(@NotNull String name, @NotNull Plugin owner)`
- `public boolean execute(@NotNull CommandSender sender, @NotNull String commandLabel, @NotNull String[] args)`
- `public void setExecutor(@Nullable CommandExecutor executor)`
- `@NotNull public CommandExecutor getExecutor()`
- `public void setTabCompleter(@Nullable TabCompleter completer)`
- `@Nullable public TabCompleter getTabCompleter()`
- `@NotNull public Plugin getPlugin()`
- `@NotNull public List<String> tabComplete(@NotNull CommandSender sender, @NotNull String alias, @NotNull String[] args) throws CommandException, IllegalArgumentException`
- `public String toString()`
