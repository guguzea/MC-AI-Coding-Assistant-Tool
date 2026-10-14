---
title: "org.bukkit.command.SimpleCommandMap"
package: "org.bukkit.command"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/command/SimpleCommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class SimpleCommandMap**
`public class SimpleCommandMap extends Object implements CommandMap`
- `protected final Map<String,Command> knownCommands`
- `public SimpleCommandMap(@NotNull Server server)`
- `public void setFallbackCommands()`
- `public void registerAll(@NotNull String fallbackPrefix, @NotNull List<Command> commands)`
- `public boolean register(@NotNull String fallbackPrefix, @NotNull Command command)`
- `public boolean register(@NotNull String label, @NotNull String fallbackPrefix, @NotNull Command command)`
- `public boolean dispatch(@NotNull CommandSender sender, @NotNull String commandLine) throws CommandException`
- `public void clearCommands()`
- `@Nullable public Command getCommand(@NotNull String name)`
- `@Nullable public List<String> tabComplete(@NotNull CommandSender sender, @NotNull String cmdLine)`
- `@Nullable public List<String> tabComplete(@NotNull CommandSender sender, @NotNull String cmdLine, @Nullable Location location)`
- `@NotNull public Collection<Command> getCommands()`
- `public void registerServerAliases()`
