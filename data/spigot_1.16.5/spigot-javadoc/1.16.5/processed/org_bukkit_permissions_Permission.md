---
title: "org.bukkit.permissions.Permission"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.permissions.Permission`
- `public static final org.bukkit.permissions.PermissionDefault DEFAULT_PERMISSION`
- `public org.bukkit.permissions.Permission(java.lang.String)`
- `public org.bukkit.permissions.Permission(java.lang.String, java.lang.String)`
- `public org.bukkit.permissions.Permission(java.lang.String, org.bukkit.permissions.PermissionDefault)`
- `public org.bukkit.permissions.Permission(java.lang.String, java.lang.String, org.bukkit.permissions.PermissionDefault)`
- `public org.bukkit.permissions.Permission(java.lang.String, java.util.Map<java.lang.String, java.lang.Boolean>)`
- `public org.bukkit.permissions.Permission(java.lang.String, java.lang.String, java.util.Map<java.lang.String, java.lang.Boolean>)`
- `public org.bukkit.permissions.Permission(java.lang.String, org.bukkit.permissions.PermissionDefault, java.util.Map<java.lang.String, java.lang.Boolean>)`
- `public org.bukkit.permissions.Permission(java.lang.String, java.lang.String, org.bukkit.permissions.PermissionDefault, java.util.Map<java.lang.String, java.lang.Boolean>)`
- `public java.lang.String getName()`
- `public java.util.Map<java.lang.String, java.lang.Boolean> getChildren()`
- `public org.bukkit.permissions.PermissionDefault getDefault()`
- `public void setDefault(org.bukkit.permissions.PermissionDefault)`
- `public java.lang.String getDescription()`
- `public void setDescription(java.lang.String)`
- `public java.util.Set<org.bukkit.permissions.Permissible> getPermissibles()`
- `public void recalculatePermissibles()`
- `public org.bukkit.permissions.Permission addParent(java.lang.String, boolean)`
- `public void addParent(org.bukkit.permissions.Permission, boolean)`
- `public static java.util.List<org.bukkit.permissions.Permission> loadPermissions(java.util.Map<?, ?>, java.lang.String, org.bukkit.permissions.PermissionDefault)`
- `public static org.bukkit.permissions.Permission loadPermission(java.lang.String, java.util.Map<java.lang.String, java.lang.Object>)`
- `public static org.bukkit.permissions.Permission loadPermission(java.lang.String, java.util.Map<?, ?>, org.bukkit.permissions.PermissionDefault, java.util.List<org.bukkit.permissions.Permission>)`
