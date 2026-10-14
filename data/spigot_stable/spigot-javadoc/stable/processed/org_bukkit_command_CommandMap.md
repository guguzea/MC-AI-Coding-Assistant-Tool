---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/command/CommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface CommandMap**
`public interface CommandMap`
- `void registerAll(@NotNull String fallbackPrefix, @NotNull List<Command> commands)`
- `boolean register(@NotNull String label, @NotNull String fallbackPrefix, @NotNull Command command)`
- `boolean register(@NotNull String fallbackPrefix, @NotNull Command command)`
- `boolean dispatch(@NotNull CommandSender sender, @NotNull String cmdLine) throws CommandException`
- `void clearCommands()`
- `@Nullable Command getCommand(@NotNull String name)`
- `@Nullable List<String> tabComplete(@NotNull CommandSender sender, @NotNull String cmdLine) throws IllegalArgumentException`
- `@Nullable List<String> tabComplete(@NotNull CommandSender sender, @NotNull String cmdLine, @Nullable Location location) throws IllegalArgumentException`
