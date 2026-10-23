---
title: "org.bukkit.permissions.PermissionAttachment"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
