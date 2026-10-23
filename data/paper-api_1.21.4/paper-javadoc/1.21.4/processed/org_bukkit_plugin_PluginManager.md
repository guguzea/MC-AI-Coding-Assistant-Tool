---
title: "org.bukkit.plugin.PluginManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/plugin/PluginManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) void registerInterface(@NotNull @NotNull Class<? extends PluginLoader> loader) throws IllegalArgumentException`
- `@Nullable @Nullable Plugin getPlugin(@NotNull @NotNull String name)`
- `@NotNull @NotNull Plugin[] getPlugins()`
- `boolean isPluginEnabled(@NotNull @NotNull String name)`
- `@Contract("null -> false") boolean isPluginEnabled(@Nullable @Nullable Plugin plugin)`
- `@Nullable @Nullable Plugin loadPlugin(@NotNull @NotNull File file) throws InvalidPluginException, InvalidDescriptionException, UnknownDependencyException`
- `@NotNull @NotNull Plugin[] loadPlugins(@NotNull @NotNull File directory)`
- `@NotNull @NotNull Plugin[] loadPlugins(@NotNull @NotNull File[] files)`
- `void disablePlugins()`
- `void clearPlugins()`
- `void callEvent(@NotNull @NotNull Event event) throws IllegalStateException`
- `void registerEvents(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `void registerEvent(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin)`
- `void registerEvent(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin, boolean ignoreCancelled)`
- `void enablePlugin(@NotNull @NotNull Plugin plugin)`
- `void disablePlugin(@NotNull @NotNull Plugin plugin)`
- `@Nullable @Nullable Permission getPermission(@NotNull @NotNull String name)`
- `void addPermission(@NotNull @NotNull Permission perm)`
- `void removePermission(@NotNull @NotNull Permission perm)`
- `void removePermission(@NotNull @NotNull String name)`
- `@NotNull @NotNull Set<Permission> getDefaultPermissions(boolean op)`
- `void recalculatePermissionDefaults(@NotNull @NotNull Permission perm)`
- `void subscribeToPermission(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `void unsubscribeFromPermission(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `@NotNull @NotNull Set<Permissible> getPermissionSubscriptions(@NotNull @NotNull String permission)`
- `void subscribeToDefaultPerms(boolean op, @NotNull @NotNull Permissible permissible)`
- `void unsubscribeFromDefaultPerms(boolean op, @NotNull @NotNull Permissible permissible)`
- `@NotNull @NotNull Set<Permissible> getDefaultPermSubscriptions(boolean op)`
- `@NotNull @NotNull Set<Permission> getPermissions()`
- `boolean useTimings()`
- `@Internal boolean isTransitiveDependency(PluginMeta pluginMeta, PluginMeta dependencyConfig)`
- `@Experimental void overridePermissionManager(@NotNull @NotNull Plugin plugin, @Nullable PermissionManager permissionManager)`
