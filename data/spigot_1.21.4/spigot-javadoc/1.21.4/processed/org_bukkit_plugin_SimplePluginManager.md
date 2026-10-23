---
title: "org.bukkit.plugin.SimplePluginManager"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public final class org.bukkit.plugin.SimplePluginManager implements org.bukkit.plugin.PluginManager`
- `public org.bukkit.plugin.SimplePluginManager(org.bukkit.Server, org.bukkit.command.SimpleCommandMap)`
- `public void registerInterface(java.lang.Class<? extends org.bukkit.plugin.PluginLoader>) throws java.lang.IllegalArgumentException`
- `public org.bukkit.plugin.Plugin[] loadPlugins(java.io.File)`
- `public org.bukkit.plugin.Plugin[] loadPlugins(java.io.File[])`
- `public synchronized org.bukkit.plugin.Plugin loadPlugin(java.io.File) throws org.bukkit.plugin.InvalidPluginException, org.bukkit.plugin.UnknownDependencyException`
- `public synchronized org.bukkit.plugin.Plugin getPlugin(java.lang.String)`
- `public synchronized org.bukkit.plugin.Plugin[] getPlugins()`
- `public boolean isPluginEnabled(java.lang.String)`
- `public boolean isPluginEnabled(org.bukkit.plugin.Plugin)`
- `public void enablePlugin(org.bukkit.plugin.Plugin)`
- `public void disablePlugins()`
- `public void disablePlugin(org.bukkit.plugin.Plugin)`
- `public void clearPlugins()`
- `public void callEvent(org.bukkit.event.Event)`
- `public void registerEvents(org.bukkit.event.Listener, org.bukkit.plugin.Plugin)`
- `public void registerEvent(java.lang.Class<? extends org.bukkit.event.Event>, org.bukkit.event.Listener, org.bukkit.event.EventPriority, org.bukkit.plugin.EventExecutor, org.bukkit.plugin.Plugin)`
- `public void registerEvent(java.lang.Class<? extends org.bukkit.event.Event>, org.bukkit.event.Listener, org.bukkit.event.EventPriority, org.bukkit.plugin.EventExecutor, org.bukkit.plugin.Plugin, boolean)`
- `public org.bukkit.permissions.Permission getPermission(java.lang.String)`
- `public void addPermission(org.bukkit.permissions.Permission)`
- `public void addPermission(org.bukkit.permissions.Permission, boolean)`
- `public java.util.Set<org.bukkit.permissions.Permission> getDefaultPermissions(boolean)`
- `public void removePermission(org.bukkit.permissions.Permission)`
- `public void removePermission(java.lang.String)`
- `public void recalculatePermissionDefaults(org.bukkit.permissions.Permission)`
- `public void dirtyPermissibles()`
- `public void subscribeToPermission(java.lang.String, org.bukkit.permissions.Permissible)`
- `public void unsubscribeFromPermission(java.lang.String, org.bukkit.permissions.Permissible)`
- `public java.util.Set<org.bukkit.permissions.Permissible> getPermissionSubscriptions(java.lang.String)`
- `public void subscribeToDefaultPerms(boolean, org.bukkit.permissions.Permissible)`
- `public void unsubscribeFromDefaultPerms(boolean, org.bukkit.permissions.Permissible)`
- `public java.util.Set<org.bukkit.permissions.Permissible> getDefaultPermSubscriptions(boolean)`
- `public java.util.Set<org.bukkit.permissions.Permission> getPermissions()`
- `public boolean isTransitiveDepend(org.bukkit.plugin.PluginDescriptionFile, org.bukkit.plugin.PluginDescriptionFile)`
- `public boolean useTimings()`
- `public void useTimings(boolean)`
