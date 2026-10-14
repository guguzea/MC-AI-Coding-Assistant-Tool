---
title: "org.bukkit.plugin.SimplePluginManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/SimplePluginManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class SimplePluginManager**
`@Deprecated(forRemoval=true) public final class SimplePluginManager extends Object implements PluginManager`
- `public final Map<String, Permission> permissions`
- `public final Map<Boolean, Set<Permission>> defaultPerms`
- `public final Map<String, Map<Permissible, Boolean>> permSubs`
- `public final Map<Boolean, Map<Permissible, Boolean>> defSubs`
- `public PluginManager paperPluginManager`
- `public SimplePluginManager(@NotNull @NotNull Server instance, @NotNull @NotNull SimpleCommandMap commandMap)`
- `public void registerInterface(@NotNull @NotNull Class<? extends PluginLoader> loader) throws IllegalArgumentException`
- `@NotNull public @NotNull Plugin[] loadPlugins(@NotNull @NotNull File directory)`
- `@NotNull public @NotNull Plugin[] loadPlugins(@NotNull @NotNull File directory, @NotNull @NotNull List<File> extraPluginJars)`
- `@NotNull public @NotNull Plugin[] loadPlugins(@NotNull @NotNull File[] files)`
- `@Nullable public @Nullable Plugin loadPlugin(@NotNull @NotNull File file) throws InvalidPluginException, UnknownDependencyException`
- `@Nullable public @Nullable Plugin getPlugin(@NotNull @NotNull String name)`
- `@NotNull public @NotNull Plugin[] getPlugins()`
- `public boolean isPluginEnabled(@NotNull @NotNull String name)`
- `public boolean isPluginEnabled(@Nullable @Nullable Plugin plugin)`
- `public void enablePlugin(@NotNull @NotNull Plugin plugin)`
- `public void disablePlugins()`
- `public void disablePlugin(@NotNull @NotNull Plugin plugin)`
- `public void clearPlugins()`
- `public void callEvent(@NotNull @NotNull Event event)`
- `public void registerEvents(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `public void registerEvent(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin)`
- `public void registerEvent(@NotNull @NotNull Class<? extends Event> event, @NotNull @NotNull Listener listener, @NotNull @NotNull EventPriority priority, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull Plugin plugin, boolean ignoreCancelled)`
- `@Nullable public @Nullable Permission getPermission(@NotNull @NotNull String name)`
- `public void addPermission(@NotNull @NotNull Permission perm)`
- `@Deprecated(since="1.12") public void addPermission(@NotNull @NotNull Permission perm, boolean dirty)`
- `@NotNull public @NotNull Set<Permission> getDefaultPermissions(boolean op)`
- `public void removePermission(@NotNull @NotNull Permission perm)`
- `public void removePermission(@NotNull @NotNull String name)`
- `public void recalculatePermissionDefaults(@NotNull @NotNull Permission perm)`
- `@Deprecated(since="1.12") public void dirtyPermissibles()`
- `public void subscribeToPermission(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `public void unsubscribeFromPermission(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `@NotNull public @NotNull Set<Permissible> getPermissionSubscriptions(@NotNull @NotNull String permission)`
- `public void subscribeToDefaultPerms(boolean op, @NotNull @NotNull Permissible permissible)`
- `public void unsubscribeFromDefaultPerms(boolean op, @NotNull @NotNull Permissible permissible)`
- `@NotNull public @NotNull Set<Permissible> getDefaultPermSubscriptions(boolean op)`
- `@NotNull public @NotNull Set<Permission> getPermissions()`
- `public boolean isTransitiveDepend(@NotNull @NotNull PluginDescriptionFile plugin, @NotNull @NotNull PluginDescriptionFile depend)`
- `public boolean useTimings()`
- `@Deprecated(forRemoval=true) public void useTimings(boolean use)`
- `public void clearPermissions()`
- `public boolean isTransitiveDependency(PluginMeta pluginMeta, PluginMeta dependencyConfig)`
- `public void overridePermissionManager(@NotNull @NotNull Plugin plugin, @Nullable PermissionManager permissionManager)`
- `public void addPermissions(@NotNull @NotNull List<Permission> perm)`
