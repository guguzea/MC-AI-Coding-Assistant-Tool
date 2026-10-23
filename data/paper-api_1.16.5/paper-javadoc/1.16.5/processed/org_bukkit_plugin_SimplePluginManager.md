---
title: "org.bukkit.plugin.SimplePluginManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/SimplePluginManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public SimplePluginManager&#8203;(@NotNull @NotNull Server instance, @NotNull @NotNull SimpleCommandMap commandMap)`
- `@Nullable public @Nullable File pluginsDirectory()`
- `public void registerInterface&#8203;(@NotNull @NotNull Class<? extends PluginLoader> loader) throws IllegalArgumentException`
- `@NotNull public @NotNull Plugin[] loadPlugins&#8203;(@NotNull @NotNull File directory)`
- `@NotNull public @NotNull Plugin[] loadPlugins&#8203;(@NotNull @NotNull File directory, @NotNull @NotNull List<File> extraPluginJars)`
- `@Nullable public @Nullable Plugin loadPlugin&#8203;(@NotNull @NotNull File file) throws InvalidPluginException, UnknownDependencyException`
- `@Nullable public @Nullable Plugin getPlugin&#8203;(@NotNull @NotNull String name)`
- `@NotNull public @NotNull Plugin[] getPlugins()`
- `public boolean isPluginEnabled&#8203;(@NotNull @NotNull String name)`
- `public boolean isPluginEnabled&#8203;(@Nullable @Nullable Plugin plugin)`
- `public void enablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `public void disablePlugins()`
- `public void disablePlugins&#8203;(boolean closeClassloaders)`
- `public void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `public void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin, boolean closeClassloader)`
- `public void clearPlugins()`
- `public void callEvent&#8203;(@NotNull @NotNull Event event)`
- `public void registerEvents&#8203;(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `public void registerEvent&#8203;(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin)`
- `public void registerEvent&#8203;(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin, boolean ignoreCancelled)`
- `@Nullable public @Nullable Permission getPermission&#8203;(@NotNull @NotNull String name)`
- `public void addPermission&#8203;(@NotNull @NotNull Permission perm)`
- `@Deprecated public void addPermission&#8203;(@NotNull @NotNull Permission perm, boolean dirty)`
- `@NotNull public @NotNull Set<Permission> getDefaultPermissions&#8203;(boolean op)`
- `public void removePermission&#8203;(@NotNull @NotNull Permission perm)`
- `public void removePermission&#8203;(@NotNull @NotNull String name)`
- `public void recalculatePermissionDefaults&#8203;(@NotNull @NotNull Permission perm)`
- `@Deprecated public void dirtyPermissibles()`
- `public void subscribeToPermission&#8203;(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `public void unsubscribeFromPermission&#8203;(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `@NotNull public @NotNull Set<Permissible> getPermissionSubscriptions&#8203;(@NotNull @NotNull String permission)`
- `public void subscribeToDefaultPerms&#8203;(boolean op, @NotNull @NotNull Permissible permissible)`
- `public void unsubscribeFromDefaultPerms&#8203;(boolean op, @NotNull @NotNull Permissible permissible)`
- `@NotNull public @NotNull Set<Permissible> getDefaultPermSubscriptions&#8203;(boolean op)`
- `@NotNull public @NotNull Set<Permission> getPermissions()`
- `public boolean isTransitiveDepend&#8203;(@NotNull @NotNull PluginDescriptionFile plugin, @NotNull @NotNull PluginDescriptionFile depend)`
- `public boolean useTimings()`
- `public void useTimings&#8203;(boolean use)`
- `public void clearPermissions()`
