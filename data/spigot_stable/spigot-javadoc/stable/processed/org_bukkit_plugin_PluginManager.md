---
title: "org.bukkit.plugin.PluginManager"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/PluginManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PluginManager**
`public interface PluginManager`
- `void registerInterface(@NotNull Class<? extends PluginLoader> loader) throws IllegalArgumentException`
- `@Nullable Plugin getPlugin(@NotNull String name)`
- `@NotNull Plugin[] getPlugins()`
- `boolean isPluginEnabled(@NotNull String name)`
- `@Contract("null -> false") boolean isPluginEnabled(@Nullable Plugin plugin)`
- `@Nullable Plugin loadPlugin(@NotNull File file) throws InvalidPluginException, InvalidDescriptionException, UnknownDependencyException`
- `@NotNull Plugin[] loadPlugins(@NotNull File directory)`
- `@NotNull Plugin[] loadPlugins(@NotNull File[] files)`
- `void disablePlugins()`
- `void clearPlugins()`
- `void callEvent(@NotNull Event event) throws IllegalStateException`
- `void registerEvents(@NotNull Listener listener, @NotNull Plugin plugin)`
- `void registerEvent(@NotNull Class<? extends Event> event, @NotNull Listener listener, @NotNull EventPriority priority, @NotNull EventExecutor executor, @NotNull Plugin plugin)`
- `void registerEvent(@NotNull Class<? extends Event> event, @NotNull Listener listener, @NotNull EventPriority priority, @NotNull EventExecutor executor, @NotNull Plugin plugin, boolean ignoreCancelled)`
- `void enablePlugin(@NotNull Plugin plugin)`
- `void disablePlugin(@NotNull Plugin plugin)`
- `@Nullable Permission getPermission(@NotNull String name)`
- `void addPermission(@NotNull Permission perm)`
- `void removePermission(@NotNull Permission perm)`
- `void removePermission(@NotNull String name)`
- `@NotNull Set<Permission> getDefaultPermissions(boolean op)`
- `void recalculatePermissionDefaults(@NotNull Permission perm)`
- `void subscribeToPermission(@NotNull String permission, @NotNull Permissible permissible)`
- `void unsubscribeFromPermission(@NotNull String permission, @NotNull Permissible permissible)`
- `@NotNull Set<Permissible> getPermissionSubscriptions(@NotNull String permission)`
- `void subscribeToDefaultPerms(boolean op, @NotNull Permissible permissible)`
- `void unsubscribeFromDefaultPerms(boolean op, @NotNull Permissible permissible)`
- `@NotNull Set<Permissible> getDefaultPermSubscriptions(boolean op)`
- `@NotNull Set<Permission> getPermissions()`
- `boolean useTimings()`
