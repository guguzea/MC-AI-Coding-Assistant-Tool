---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/26.3/org/bukkit/command/CommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CommandMap**
`@Obsolete(since="26.3") public interface CommandMap`
- `void registerAll(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull List<Command> commands)`
- `boolean register(@NotNull @NotNull String label, @NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `boolean register(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `boolean dispatch(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine) throws CommandException`
- `void clearCommands()`
- `@Nullable @Nullable Command getCommand(@NotNull @NotNull String name)`
- `@Nullable @Nullable List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine) throws IllegalArgumentException`
- `@Nullable @Nullable List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine, @Nullable @Nullable Location location) throws IllegalArgumentException`
- `@NotNull Map<String,Command> getKnownCommands()`
