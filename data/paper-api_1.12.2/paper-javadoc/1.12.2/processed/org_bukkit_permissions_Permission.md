---
title: "org.bukkit.permissions.Permission"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/permissions/Permission.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static PermissionDefault DEFAULT_PERMISSION`
- `Permission addParent(String name, boolean value)`
- `void addParent(Permission perm, boolean value)`
- `Map<String,Boolean> getChildren()`
- `PermissionDefault getDefault()`
- `String getDescription()`
- `String getName()`
- `Set<Permissible> getPermissibles()`
- `static Permission loadPermission(String name, Map<?,?> data, PermissionDefault def, List<Permission> output)`
- `static Permission loadPermission(String name, Map<String,Object> data)`
- `static List<Permission> loadPermissions(Map<?,?> data, String error, PermissionDefault def)`
- `void recalculatePermissibles()`
- `void setDefault(PermissionDefault value)`
- `void setDescription(String value)`
