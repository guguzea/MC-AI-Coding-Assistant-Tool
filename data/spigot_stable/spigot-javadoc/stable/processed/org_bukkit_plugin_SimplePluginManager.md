---
title: "org.bukkit.plugin.SimplePluginManager"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/SimplePluginManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class SimplePluginManager**
`public final class SimplePluginManager extends Object implements PluginManager`
- `public SimplePluginManager(@NotNull Server instance, @NotNull SimpleCommandMap commandMap)`
- `public void registerInterface(@NotNull Class<? extends PluginLoader> loader) throws IllegalArgumentException`
- `@NotNull public Plugin[] loadPlugins(@NotNull File directory)`
- `@NotNull public Plugin[] loadPlugins(@NotNull File[] files)`
- `@Nullable public Plugin loadPlugin(@NotNull File file) throws InvalidPluginException, UnknownDependencyException`
- `@Nullable public Plugin getPlugin(@NotNull String name)`
- `@NotNull public Plugin[] getPlugins()`
- `public boolean isPluginEnabled(@NotNull String name)`
- `public boolean isPluginEnabled(@Nullable Plugin plugin)`
- `public void enablePlugin(@NotNull Plugin plugin)`
- `public void disablePlugins()`
- `public void disablePlugin(@NotNull Plugin plugin)`
- `public void clearPlugins()`
- `public void callEvent(@NotNull Event event)`
- `public void registerEvents(@NotNull Listener listener, @NotNull Plugin plugin)`
- `public void registerEvent(@NotNull Class<? extends Event> event, @NotNull Listener listener, @NotNull EventPriority priority, @NotNull EventExecutor executor, @NotNull Plugin plugin)`
- `public void registerEvent(@NotNull Class<? extends Event> event, @NotNull Listener listener, @NotNull EventPriority priority, @NotNull EventExecutor executor, @NotNull Plugin plugin, boolean ignoreCancelled)`
- `@Nullable public Permission getPermission(@NotNull String name)`
- `public void addPermission(@NotNull Permission perm)`
- `@Deprecated(since="1.12") public void addPermission(@NotNull Permission perm, boolean dirty)`
- `@NotNull public Set<Permission> getDefaultPermissions(boolean op)`
- `public void removePermission(@NotNull Permission perm)`
- `public void removePermission(@NotNull String name)`
- `public void recalculatePermissionDefaults(@NotNull Permission perm)`
- `@Deprecated(since="1.12") public void dirtyPermissibles()`
- `public void subscribeToPermission(@NotNull String permission, @NotNull Permissible permissible)`
- `public void unsubscribeFromPermission(@NotNull String permission, @NotNull Permissible permissible)`
- `@NotNull public Set<Permissible> getPermissionSubscriptions(@NotNull String permission)`
- `public void subscribeToDefaultPerms(boolean op, @NotNull Permissible permissible)`
- `public void unsubscribeFromDefaultPerms(boolean op, @NotNull Permissible permissible)`
- `@NotNull public Set<Permissible> getDefaultPermSubscriptions(boolean op)`
- `@NotNull public Set<Permission> getPermissions()`
- `public boolean isTransitiveDepend(@NotNull PluginDescriptionFile plugin, @NotNull PluginDescriptionFile depend)`
- `public boolean useTimings()`
- `public void useTimings(boolean use)`
