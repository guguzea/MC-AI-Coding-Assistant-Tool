---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/command/CommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `void clearCommands()`
- `boolean dispatch(CommandSender sender, String cmdLine)`
- `Command getCommand(String name)`
- `Map<String,Command> getKnownCommands()`
- `boolean register(String label, String fallbackPrefix, Command command)`
- `boolean register(String fallbackPrefix, Command command)`
- `void registerAll(String fallbackPrefix, List<Command> commands)`
- `List<String> tabComplete(CommandSender sender, String cmdLine)`
- `List<String> tabComplete(CommandSender sender, String cmdLine, Location location)`
