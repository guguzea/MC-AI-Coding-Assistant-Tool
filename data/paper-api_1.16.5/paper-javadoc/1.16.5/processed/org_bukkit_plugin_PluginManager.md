---
title: "org.bukkit.plugin.PluginManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/PluginManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `void registerInterface&#8203;(@NotNull @NotNull Class<? extends PluginLoader> loader) throws IllegalArgumentException`
- `@Nullable @Nullable Plugin getPlugin&#8203;(@NotNull @NotNull String name)`
- `@NotNull @NotNull Plugin[] getPlugins()`
- `boolean isPluginEnabled&#8203;(@NotNull @NotNull String name)`
- `@Contract("null -> false") boolean isPluginEnabled&#8203;(@Nullable @Nullable Plugin plugin)`
- `@Nullable @Nullable Plugin loadPlugin&#8203;(@NotNull @NotNull File file) throws InvalidPluginException, InvalidDescriptionException, UnknownDependencyException`
- `@NotNull @NotNull Plugin[] loadPlugins&#8203;(@NotNull @NotNull File directory)`
- `void disablePlugins()`
- `void clearPlugins()`
- `void callEvent&#8203;(@NotNull @NotNull Event event) throws IllegalStateException`
- `void registerEvents&#8203;(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `void registerEvent&#8203;(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin)`
- `void registerEvent&#8203;(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin, boolean ignoreCancelled)`
- `void enablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin, boolean closeClassloader)`
- `@Nullable @Nullable Permission getPermission&#8203;(@NotNull @NotNull String name)`
- `void addPermission&#8203;(@NotNull @NotNull Permission perm)`
- `void removePermission&#8203;(@NotNull @NotNull Permission perm)`
- `void removePermission&#8203;(@NotNull @NotNull String name)`
- `@NotNull @NotNull Set<Permission> getDefaultPermissions&#8203;(boolean op)`
- `void recalculatePermissionDefaults&#8203;(@NotNull @NotNull Permission perm)`
- `void subscribeToPermission&#8203;(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `void unsubscribeFromPermission&#8203;(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `@NotNull @NotNull Set<Permissible> getPermissionSubscriptions&#8203;(@NotNull @NotNull String permission)`
- `void subscribeToDefaultPerms&#8203;(boolean op, @NotNull @NotNull Permissible permissible)`
- `void unsubscribeFromDefaultPerms&#8203;(boolean op, @NotNull @NotNull Permissible permissible)`
- `@NotNull @NotNull Set<Permissible> getDefaultPermSubscriptions&#8203;(boolean op)`
- `@NotNull @NotNull Set<Permission> getPermissions()`
- `boolean useTimings()`
