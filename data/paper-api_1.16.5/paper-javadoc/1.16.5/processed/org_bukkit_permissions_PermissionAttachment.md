---
title: "org.bukkit.permissions.PermissionAttachment"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/permissions/PermissionAttachment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PermissionAttachment&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Permissible permissible)`
- `@NotNull public @NotNull Plugin getPlugin()`
- `public void setRemovalCallback&#8203;(@Nullable @Nullable PermissionRemovedExecutor ex)`
- `@Nullable public @Nullable PermissionRemovedExecutor getRemovalCallback()`
- `@NotNull public @NotNull Permissible getPermissible()`
- `@NotNull public @NotNull Map<String,&#8203;Boolean> getPermissions()`
- `public void setPermission&#8203;(@NotNull @NotNull String name, boolean value)`
- `public void setPermission&#8203;(@NotNull @NotNull Permission perm, boolean value)`
- `public void unsetPermission&#8203;(@NotNull @NotNull String name)`
- `public void unsetPermission&#8203;(@NotNull @NotNull Permission perm)`
- `public boolean remove()`
