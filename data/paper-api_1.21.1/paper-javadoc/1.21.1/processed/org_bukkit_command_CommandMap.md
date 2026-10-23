---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/command/CommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `void registerAll(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull List<Command> commands)`
- `boolean register(@NotNull @NotNull String label, @NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `boolean register(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `boolean dispatch(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine) throws CommandException`
- `void clearCommands()`
- `@Nullable @Nullable Command getCommand(@NotNull @NotNull String name)`
- `@Nullable @Nullable List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine) throws IllegalArgumentException`
- `@Nullable @Nullable List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine, @Nullable @Nullable Location location) throws IllegalArgumentException`
- `@NotNull Map<String,Command> getKnownCommands()`
