---
title: "org.bukkit.command.SimpleCommandMap"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/command/SimpleCommandMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `protected final Map<String,Command> knownCommands`
- `@Internal public SimpleCommandMap(@NotNull @NotNull Server server, Map<String,Command> backing)`
- `public void setFallbackCommands()`
- `public void registerAll(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull List<Command> commands)`
- `public boolean register(@NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `public boolean register(@NotNull @NotNull String label, @NotNull @NotNull String fallbackPrefix, @NotNull @NotNull Command command)`
- `public boolean dispatch(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLine) throws CommandException`
- `public void clearCommands()`
- `@Nullable public @Nullable Command getCommand(@NotNull @NotNull String name)`
- `@Nullable public @Nullable List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine)`
- `@Nullable public @Nullable List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String cmdLine, @Nullable @Nullable Location location)`
- `@NotNull public @NotNull Collection<Command> getCommands()`
- `public void registerServerAliases()`
- `@NotNull public @NotNull Map<String,Command> getKnownCommands()`
