---
title: "org.bukkit.command.Command"
package: "org.bukkit.command"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/command/Command.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Command**
`public abstract class Command extends Object`
- `protected String description`
- `protected String usageMessage`
- `public CustomTimingsHandler timings`
- `protected Command(@NotNull String name)`
- `protected Command(@NotNull String name, @NotNull String description, @NotNull String usageMessage, @NotNull List<String> aliases)`
- `public abstract boolean execute(@NotNull CommandSender sender, @NotNull String commandLabel, @NotNull String[] args)`
- `@NotNull public List<String> tabComplete(@NotNull CommandSender sender, @NotNull String alias, @NotNull String[] args) throws IllegalArgumentException`
- `@NotNull public List<String> tabComplete(@NotNull CommandSender sender, @NotNull String alias, @NotNull String[] args, @Nullable Location location) throws IllegalArgumentException`
- `@NotNull public String getName()`
- `public boolean setName(@NotNull String name)`
- `@Nullable public String getPermission()`
- `public void setPermission(@Nullable String permission)`
- `public boolean testPermission(@NotNull CommandSender target)`
- `public boolean testPermissionSilent(@NotNull CommandSender target)`
- `@NotNull public String getLabel()`
- `public boolean setLabel(@NotNull String name)`
- `public boolean register(@NotNull CommandMap commandMap)`
- `public boolean unregister(@NotNull CommandMap commandMap)`
- `public boolean isRegistered()`
- `@NotNull public List<String> getAliases()`
- `@Deprecated(since="1.20.4") @Nullable public String getPermissionMessage()`
- `@NotNull public String getDescription()`
- `@NotNull public String getUsage()`
- `@NotNull public Command setAliases(@NotNull List<String> aliases)`
- `@NotNull public Command setDescription(@NotNull String description)`
- `@Deprecated(since="1.20.4") @NotNull public Command setPermissionMessage(@Nullable String permissionMessage)`
- `@NotNull public Command setUsage(@NotNull String usage)`
- `public static void broadcastCommandMessage(@NotNull CommandSender source, @NotNull String message)`
- `public static void broadcastCommandMessage(@NotNull CommandSender source, @NotNull String message, boolean sendToSource)`
- `public String toString()`
