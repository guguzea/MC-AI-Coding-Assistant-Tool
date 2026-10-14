---
title: "org.bukkit.permissions.PermissionAttachment"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/26.3/org/bukkit/permissions/PermissionAttachment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PermissionAttachment**
`public class PermissionAttachment extends Object`
- `public PermissionAttachment(@NotNull @NotNull Plugin plugin, @NotNull @NotNull Permissible permissible)`
- `@NotNull public @NotNull Plugin getPlugin()`
- `public void setRemovalCallback(@Nullable @Nullable PermissionRemovedExecutor ex)`
- `@Nullable public @Nullable PermissionRemovedExecutor getRemovalCallback()`
- `@NotNull public @NotNull Permissible getPermissible()`
- `@NotNull public @NotNull Map<String,Boolean> getPermissions()`
- `public void setPermission(@NotNull @NotNull String name, boolean value)`
- `public void setPermission(@NotNull @NotNull Permission perm, boolean value)`
- `public void unsetPermission(@NotNull @NotNull String name)`
- `public void unsetPermission(@NotNull @NotNull Permission perm)`
- `public boolean remove()`
