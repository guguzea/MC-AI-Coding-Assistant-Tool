---
title: "org.bukkit.command.Command"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/command/Command.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected String description`
- `protected String usageMessage`
- `public Timing timings`
- `protected Command&#8203;(@NotNull @NotNull String name)`
- `protected Command&#8203;(@NotNull @NotNull String name, @NotNull @NotNull String description, @NotNull @NotNull String usageMessage, @NotNull @NotNull List<String> aliases)`
- `@NotNull public @NotNull String getTimingName()`
- `public abstract boolean execute&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String commandLabel, @NotNull @NotNull String[] args)`
- `@NotNull public @NotNull List<String> tabComplete&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String[] args) throws IllegalArgumentException`
- `@NotNull public @NotNull List<String> tabComplete&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull String alias, @NotNull @NotNull String[] args, @Nullable @Nullable Location location) throws IllegalArgumentException`
- `@NotNull public @NotNull String getName()`
- `public boolean setName&#8203;(@NotNull @NotNull String name)`
- `@Nullable public @Nullable String getPermission()`
- `public void setPermission&#8203;(@Nullable @Nullable String permission)`
- `public boolean testPermission&#8203;(@NotNull @NotNull CommandSender target)`
- `public boolean testPermissionSilent&#8203;(@NotNull @NotNull CommandSender target)`
- `@NotNull public @NotNull String getLabel()`
- `public boolean setLabel&#8203;(@NotNull @NotNull String name)`
- `public boolean register&#8203;(@NotNull @NotNull CommandMap commandMap)`
- `public boolean unregister&#8203;(@NotNull @NotNull CommandMap commandMap)`
- `public boolean isRegistered()`
- `@NotNull public @NotNull List<String> getAliases()`
- `@Nullable public @Nullable String getPermissionMessage()`
- `@NotNull public @NotNull String getDescription()`
- `@NotNull public @NotNull String getUsage()`
- `@NotNull public @NotNull Command setAliases&#8203;(@NotNull @NotNull List<String> aliases)`
- `@NotNull public @NotNull Command setDescription&#8203;(@NotNull @NotNull String description)`
- `@NotNull public @NotNull Command setPermissionMessage&#8203;(@Nullable @Nullable String permissionMessage)`
- `@NotNull public @NotNull Command setUsage&#8203;(@NotNull @NotNull String usage)`
- `public static void broadcastCommandMessage&#8203;(@NotNull @NotNull CommandSender source, @NotNull @NotNull String message)`
- `public static void broadcastCommandMessage&#8203;(@NotNull @NotNull CommandSender source, @NotNull @NotNull String message, boolean sendToSource)`
- `public String toString()`
