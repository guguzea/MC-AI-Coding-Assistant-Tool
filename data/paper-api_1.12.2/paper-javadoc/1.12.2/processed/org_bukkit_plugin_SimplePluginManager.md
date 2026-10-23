---
title: "org.bukkit.plugin.SimplePluginManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/plugin/SimplePluginManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `void addPermission(Permission perm)`
- `void addPermission(Permission perm, boolean dirty)`
- `void callEvent(Event event)`
- `void clearPermissions()`
- `void clearPlugins()`
- `void dirtyPermissibles()`
- `void disablePlugin(Plugin plugin)`
- `void disablePlugin(Plugin plugin, boolean closeClassloader)`
- `void disablePlugins()`
- `void disablePlugins(boolean closeClassloaders)`
- `void enablePlugin(Plugin plugin)`
- `Set<Permission> getDefaultPermissions(boolean op)`
- `Set<Permissible> getDefaultPermSubscriptions(boolean op)`
- `Permission getPermission(String name)`
- `Set<Permission> getPermissions()`
- `Set<Permissible> getPermissionSubscriptions(String permission)`
- `Plugin getPlugin(String name)`
- `Plugin[] getPlugins()`
- `boolean isPluginEnabled(String name)`
- `boolean isPluginEnabled(Plugin plugin)`
- `Plugin loadPlugin(File file)`
- `Plugin[] loadPlugins(File directory)`
- `void recalculatePermissionDefaults(Permission perm)`
- `void registerEvent(Class<? extends Event> event, Listener listener, EventPriority priority, EventExecutor executor, Plugin plugin)`
- `void registerEvent(Class<? extends Event> event, Listener listener, EventPriority priority, EventExecutor executor, Plugin plugin, boolean ignoreCancelled)`
- `void registerEvents(Listener listener, Plugin plugin)`
- `void registerInterface(Class<? extends PluginLoader> loader)`
- `void removePermission(String name)`
- `void removePermission(Permission perm)`
- `void subscribeToDefaultPerms(boolean op, Permissible permissible)`
- `void subscribeToPermission(String permission, Permissible permissible)`
- `void unsubscribeFromDefaultPerms(boolean op, Permissible permissible)`
- `void unsubscribeFromPermission(String permission, Permissible permissible)`
- `boolean useTimings()`
- `void useTimings(boolean use)`
