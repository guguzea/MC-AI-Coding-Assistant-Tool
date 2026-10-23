---
title: "org.bukkit.permissions.Permission"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/permissions/Permission.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public static final PermissionDefault DEFAULT_PERMISSION`
- `public Permission&#8203;(@NotNull @NotNull String name)`
- `public Permission&#8203;(@NotNull @NotNull String name, @Nullable @Nullable String description)`
- `public Permission&#8203;(@NotNull @NotNull String name, @Nullable @Nullable PermissionDefault defaultValue)`
- `public Permission&#8203;(@NotNull @NotNull String name, @Nullable @Nullable String description, @Nullable @Nullable PermissionDefault defaultValue)`
- `public Permission&#8203;(@NotNull @NotNull String name, @Nullable @Nullable Map<String,&#8203;Boolean> children)`
- `public Permission&#8203;(@NotNull @NotNull String name, @Nullable @Nullable String description, @Nullable @Nullable Map<String,&#8203;Boolean> children)`
- `public Permission&#8203;(@NotNull @NotNull String name, @Nullable @Nullable PermissionDefault defaultValue, @Nullable @Nullable Map<String,&#8203;Boolean> children)`
- `public Permission&#8203;(@NotNull @NotNull String name, @Nullable @Nullable String description, @Nullable @Nullable PermissionDefault defaultValue, @Nullable @Nullable Map<String,&#8203;Boolean> children)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull Map<String,&#8203;Boolean> getChildren()`
- `@NotNull public @NotNull PermissionDefault getDefault()`
- `public void setDefault&#8203;(@NotNull @NotNull PermissionDefault value)`
- `@NotNull public @NotNull String getDescription()`
- `public void setDescription&#8203;(@Nullable @Nullable String value)`
- `@NotNull public @NotNull Set<Permissible> getPermissibles()`
- `public void recalculatePermissibles()`
- `@NotNull public @NotNull Permission addParent&#8203;(@NotNull @NotNull String name, boolean value)`
- `public void addParent&#8203;(@NotNull @NotNull Permission perm, boolean value)`
- `@NotNull public static @NotNull List<Permission> loadPermissions&#8203;(@NotNull @NotNull Map<?,&#8203;?> data, @NotNull @NotNull String error, @Nullable @Nullable PermissionDefault def)`
- `@NotNull public static @NotNull Permission loadPermission&#8203;(@NotNull @NotNull String name, @NotNull @NotNull Map<String,&#8203;Object> data)`
- `@NotNull public static @NotNull Permission loadPermission&#8203;(@NotNull @NotNull String name, @NotNull @NotNull Map<?,&#8203;?> data, @Nullable @Nullable PermissionDefault def, @Nullable @Nullable List<Permission> output)`
