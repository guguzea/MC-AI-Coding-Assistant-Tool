---
title: "org.bukkit.permissions.PermissionAttachment"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.permissions.PermissionAttachment`
- `public org.bukkit.permissions.PermissionAttachment(org.bukkit.plugin.Plugin, org.bukkit.permissions.Permissible)`
- `public org.bukkit.plugin.Plugin getPlugin()`
- `public void setRemovalCallback(org.bukkit.permissions.PermissionRemovedExecutor)`
- `public org.bukkit.permissions.PermissionRemovedExecutor getRemovalCallback()`
- `public org.bukkit.permissions.Permissible getPermissible()`
- `public java.util.Map<java.lang.String, java.lang.Boolean> getPermissions()`
- `public void setPermission(java.lang.String, boolean)`
- `public void setPermission(org.bukkit.permissions.Permission, boolean)`
- `public void unsetPermission(java.lang.String)`
- `public void unsetPermission(org.bukkit.permissions.Permission)`
- `public boolean remove()`
