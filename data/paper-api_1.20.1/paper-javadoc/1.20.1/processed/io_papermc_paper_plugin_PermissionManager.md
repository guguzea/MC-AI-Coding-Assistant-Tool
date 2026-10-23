---
title: "io.papermc.paper.plugin.PermissionManager"
package: "io.papermc.paper.plugin"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/plugin/PermissionManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable Permission getPermission(@NotNull @NotNull String name)`
- `void addPermission(@NotNull @NotNull Permission perm)`
- `void removePermission(@NotNull @NotNull Permission perm)`
- `void removePermission(@NotNull @NotNull String name)`
- `@NotNull @NotNull Set<Permission> getDefaultPermissions(boolean op)`
- `void recalculatePermissionDefaults(@NotNull @NotNull Permission perm)`
- `void subscribeToPermission(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `void unsubscribeFromPermission(@NotNull @NotNull String permission, @NotNull @NotNull Permissible permissible)`
- `@NotNull @NotNull Set<Permissible> getPermissionSubscriptions(@NotNull @NotNull String permission)`
- `void subscribeToDefaultPerms(boolean op, @NotNull @NotNull Permissible permissible)`
- `void unsubscribeFromDefaultPerms(boolean op, @NotNull @NotNull Permissible permissible)`
- `@NotNull @NotNull Set<Permissible> getDefaultPermSubscriptions(boolean op)`
- `@NotNull @NotNull Set<Permission> getPermissions()`
- `void addPermissions(@NotNull @NotNull List<Permission> perm)`
- `void clearPermissions()`
