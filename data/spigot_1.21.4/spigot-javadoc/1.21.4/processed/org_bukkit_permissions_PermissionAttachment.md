---
title: "org.bukkit.permissions.PermissionAttachment"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
