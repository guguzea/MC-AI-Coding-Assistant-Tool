---
title: "org.bukkit.command.PluginCommand"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/command/PluginCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `boolean execute(CommandSender sender, String commandLabel, String[] args)`
- `CommandExecutor getExecutor()`
- `Plugin getPlugin()`
- `TabCompleter getTabCompleter()`
- `void setExecutor(CommandExecutor executor)`
- `void setTabCompleter(TabCompleter completer)`
- `List<String> tabComplete(CommandSender sender, String alias, String[] args)`
- `String toString()`
