---
title: "org.bukkit.command.PluginCommand"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/26.3/org/bukkit/command/PluginCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PluginCommand**
`@Obsolete(since="26.3") public final class PluginCommand extends Command implements PluginIdentifiableCommand`
- `public boolean execute(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLabel, @NotNull @NotNull String[] args)`
- `public void setExecutor(@Nullable @Nullable CommandExecutor executor)`
- `@NotNull public @NotNull CommandExecutor getExecutor()`
- `public void setTabCompleter(@Nullable @Nullable TabCompleter completer)`
- `@Nullable public @Nullable TabCompleter getTabCompleter()`
- `@NotNull public @NotNull Plugin getPlugin()`
- `@NotNull public List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String[] args) throws CommandException, IllegalArgumentException`
- `public String toString()`
