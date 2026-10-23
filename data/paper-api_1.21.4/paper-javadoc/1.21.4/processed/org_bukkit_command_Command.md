---
title: "org.bukkit.command.Command"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/command/Command.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `protected String description`
- `protected String usageMessage`
- `@Deprecated(forRemoval=true) public Timing timings`
- `protected Command(@NotNull @NotNull String name)`
- `protected Command(@NotNull @NotNull String name, @NotNull @NotNull String description, @NotNull @NotNull String usageMessage, @NotNull @NotNull List<String> aliases)`
- `@Deprecated(forRemoval=true) @NotNull public @NotNull String getTimingName()`
- `public abstract boolean execute(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLabel, @NotNull @NotNull String @NotNull [] args)`
- `@NotNull public @NotNull List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String @NotNull [] args) throws IllegalArgumentException`
- `@NotNull public @NotNull List<String> tabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String @NotNull [] args, @Nullable @Nullable Location location) throws IllegalArgumentException`
- `@NotNull public @NotNull String getName()`
- `public boolean setName(@NotNull @NotNull String name)`
- `@Nullable public @Nullable String getPermission()`
- `public void setPermission(@Nullable @Nullable String permission)`
- `public boolean testPermission(@NotNull @NotNull CommandSender target)`
- `public boolean testPermissionSilent(@NotNull @NotNull CommandSender target)`
- `@NotNull public @NotNull String getLabel()`
- `public boolean setLabel(@NotNull @NotNull String name)`
- `public boolean register(@NotNull @NotNull CommandMap commandMap)`
- `public boolean unregister(@NotNull @NotNull CommandMap commandMap)`
- `public boolean isRegistered()`
- `@NotNull public @NotNull List<String> getAliases()`
- `@Deprecated(since="1.20.4") @Nullable public @Nullable String getPermissionMessage()`
- `@NotNull public @NotNull String getDescription()`
- `@NotNull public @NotNull String getUsage()`
- `@NotNull public @NotNull Command setAliases(@NotNull @NotNull List<String> aliases)`
- `@NotNull public @NotNull Command setDescription(@NotNull @NotNull String description)`
- `@Deprecated(since="1.20.4") @NotNull public @NotNull Command setPermissionMessage(@Nullable @Nullable String permissionMessage)`
- `@NotNull public @NotNull Command setUsage(@NotNull @NotNull String usage)`
- `@Deprecated public @Nullable Component permissionMessage()`
- `@Deprecated public void permissionMessage(@Nullable Component permissionMessage)`
- `public static void broadcastCommandMessage(@NotNull @NotNull CommandSender source, @NotNull @NotNull String message)`
- `public static void broadcastCommandMessage(@NotNull @NotNull CommandSender source, @NotNull @NotNull String message, boolean sendToSource)`
- `public static void broadcastCommandMessage(@NotNull @NotNull CommandSender source, @NotNull Component message)`
- `public static void broadcastCommandMessage(@NotNull @NotNull CommandSender source, @NotNull Component message, boolean sendToSource)`
- `public String toString()`
- `@Internal public boolean canBeOverriden()`
