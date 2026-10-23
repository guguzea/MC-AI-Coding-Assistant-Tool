---
title: "io.papermc.paper.plugin.PermissionManager"
package: "io.papermc.paper.plugin"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/plugin/PermissionManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Nullable Permission getPermission(String name)`
- `void addPermission(Permission perm)`
- `void removePermission(Permission perm)`
- `void removePermission(String name)`
- `Set<Permission> getDefaultPermissions(boolean op)`
- `void recalculatePermissionDefaults(Permission perm)`
- `void subscribeToPermission(String permission, Permissible permissible)`
- `void unsubscribeFromPermission(String permission, Permissible permissible)`
- `Set<Permissible> getPermissionSubscriptions(String permission)`
- `void subscribeToDefaultPerms(boolean op, Permissible permissible)`
- `void unsubscribeFromDefaultPerms(boolean op, Permissible permissible)`
- `Set<Permissible> getDefaultPermSubscriptions(boolean op)`
- `Set<Permission> getPermissions()`
- `void addPermissions(List<Permission> perm)`
- `void clearPermissions()`
