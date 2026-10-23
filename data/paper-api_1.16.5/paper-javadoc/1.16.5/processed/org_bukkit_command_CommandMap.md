---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/command/CommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `void registerAll&#8203;(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull List<Command> commands)`
- `boolean register&#8203;(@NotNull @NotNull String label, @NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `boolean register&#8203;(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `boolean dispatch&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine) throws CommandException`
- `void clearCommands()`
- `@Nullable @Nullable Command getCommand&#8203;(@NotNull @NotNull String name)`
- `@Nullable @Nullable List<String> tabComplete&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine) throws IllegalArgumentException`
- `@Nullable @Nullable List<String> tabComplete&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine, @Nullable @Nullable Location location) throws IllegalArgumentException`
- `@NotNull Map<String,&#8203;Command> getKnownCommands()`
