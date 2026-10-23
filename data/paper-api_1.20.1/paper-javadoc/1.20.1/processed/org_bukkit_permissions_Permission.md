---
title: "org.bukkit.permissions.Permission"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/permissions/Permission.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public static final PermissionDefault DEFAULT_PERMISSION`
- `public Permission(@NotNull @NotNull String name)`
- `public Permission(@NotNull @NotNull String name, @Nullable @Nullable String description)`
- `public Permission(@NotNull @NotNull String name, @Nullable @Nullable PermissionDefault defaultValue)`
- `public Permission(@NotNull @NotNull String name, @Nullable @Nullable String description, @Nullable @Nullable PermissionDefault defaultValue)`
- `public Permission(@NotNull @NotNull String name, @Nullable @Nullable Map<String,Boolean> children)`
- `public Permission(@NotNull @NotNull String name, @Nullable @Nullable String description, @Nullable @Nullable Map<String,Boolean> children)`
- `public Permission(@NotNull @NotNull String name, @Nullable @Nullable PermissionDefault defaultValue, @Nullable @Nullable Map<String,Boolean> children)`
- `public Permission(@NotNull @NotNull String name, @Nullable @Nullable String description, @Nullable @Nullable PermissionDefault defaultValue, @Nullable @Nullable Map<String,Boolean> children)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull Map<String,Boolean> getChildren()`
- `@NotNull public @NotNull PermissionDefault getDefault()`
- `public void setDefault(@NotNull @NotNull PermissionDefault value)`
- `@NotNull public @NotNull String getDescription()`
- `public void setDescription(@Nullable @Nullable String value)`
- `@NotNull public @NotNull Set<Permissible> getPermissibles()`
- `public void recalculatePermissibles()`
- `@NotNull public @NotNull Permission addParent(@NotNull @NotNull String name, boolean value)`
- `public void addParent(@NotNull @NotNull Permission perm, boolean value)`
- `@NotNull public static @NotNull List<Permission> loadPermissions(@NotNull @NotNull Map<?,?> data, @NotNull @NotNull String error, @Nullable @Nullable PermissionDefault def)`
- `@NotNull public static @NotNull Permission loadPermission(@NotNull @NotNull String name, @NotNull @NotNull Map<String,Object> data)`
- `@NotNull public static @NotNull Permission loadPermission(@NotNull @NotNull String name, @NotNull @NotNull Map<?,?> data, @Nullable @Nullable PermissionDefault def, @Nullable @Nullable List<Permission> output)`
