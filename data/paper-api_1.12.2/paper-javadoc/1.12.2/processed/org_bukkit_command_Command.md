---
title: "org.bukkit.command.Command"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/command/Command.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `protected String description`
- `Timing timings`
- `protected String usageMessage`
- `static void broadcastCommandMessage(CommandSender source, String message)`
- `static void broadcastCommandMessage(CommandSender source, String message, boolean sendToSource)`
- `abstract boolean execute(CommandSender sender, String commandLabel, String[] args)`
- `List<String> getAliases()`
- `String getDescription()`
- `String getLabel()`
- `String getName()`
- `String getPermission()`
- `String getPermissionMessage()`
- `String getTimingName()`
- `String getUsage()`
- `boolean isRegistered()`
- `boolean register(CommandMap commandMap)`
- `Command setAliases(List<String> aliases)`
- `Command setDescription(String description)`
- `boolean setLabel(String name)`
- `boolean setName(String name)`
- `void setPermission(String permission)`
- `Command setPermissionMessage(String permissionMessage)`
- `Command setUsage(String usage)`
- `List<String> tabComplete(CommandSender sender, String alias, String[] args)`
- `List<String> tabComplete(CommandSender sender, String alias, String[] args, Location location)`
- `boolean testPermission(CommandSender target)`
- `boolean testPermissionSilent(CommandSender target)`
- `String toString()`
- `boolean unregister(CommandMap commandMap)`
