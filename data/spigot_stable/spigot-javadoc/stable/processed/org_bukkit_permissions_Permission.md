---
title: "org.bukkit.permissions.Permission"
package: "org.bukkit.permissions"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/permissions/Permission.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Permission**
`public class Permission extends Object`
- `public static final PermissionDefault DEFAULT_PERMISSION`
- `public Permission(@NotNull String name)`
- `public Permission(@NotNull String name, @Nullable String description)`
- `public Permission(@NotNull String name, @Nullable PermissionDefault defaultValue)`
- `public Permission(@NotNull String name, @Nullable String description, @Nullable PermissionDefault defaultValue)`
- `public Permission(@NotNull String name, @Nullable Map<String,Boolean> children)`
- `public Permission(@NotNull String name, @Nullable String description, @Nullable Map<String,Boolean> children)`
- `public Permission(@NotNull String name, @Nullable PermissionDefault defaultValue, @Nullable Map<String,Boolean> children)`
- `public Permission(@NotNull String name, @Nullable String description, @Nullable PermissionDefault defaultValue, @Nullable Map<String,Boolean> children)`
- `@NotNull public String getName()`
- `@NotNull public Map<String,Boolean> getChildren()`
- `@NotNull public PermissionDefault getDefault()`
- `public void setDefault(@NotNull PermissionDefault value)`
- `@NotNull public String getDescription()`
- `public void setDescription(@Nullable String value)`
- `@NotNull public Set<Permissible> getPermissibles()`
- `public void recalculatePermissibles()`
- `@NotNull public Permission addParent(@NotNull String name, boolean value)`
- `public void addParent(@NotNull Permission perm, boolean value)`
- `@NotNull public static List<Permission> loadPermissions(@NotNull Map<?,?> data, @NotNull String error, @Nullable PermissionDefault def)`
- `@NotNull public static Permission loadPermission(@NotNull String name, @NotNull Map<String,Object> data)`
- `@NotNull public static Permission loadPermission(@NotNull String name, @NotNull Map<?,?> data, @Nullable PermissionDefault def, @Nullable List<Permission> output)`
