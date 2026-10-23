---
title: "org.bukkit.command.SimpleCommandMap"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/command/SimpleCommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `protected Map<String,Command> knownCommands`
- `void clearCommands()`
- `boolean dispatch(CommandSender sender, String commandLine)`
- `Command getCommand(String name)`
- `Collection<Command> getCommands()`
- `Map<String,Command> getKnownCommands()`
- `boolean register(String label, String fallbackPrefix, Command command)`
- `boolean register(String fallbackPrefix, Command command)`
- `void registerAll(String fallbackPrefix, List<Command> commands)`
- `void registerServerAliases()`
- `void setFallbackCommands()`
- `List<String> tabComplete(CommandSender sender, String cmdLine)`
- `List<String> tabComplete(CommandSender sender, String cmdLine, Location location)`
