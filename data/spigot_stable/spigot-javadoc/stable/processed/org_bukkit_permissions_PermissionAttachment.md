---
title: "org.bukkit.permissions.PermissionAttachment"
package: "org.bukkit.permissions"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/permissions/PermissionAttachment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PermissionAttachment**
`public class PermissionAttachment extends Object`
- `public PermissionAttachment(@NotNull Plugin plugin, @NotNull Permissible permissible)`
- `@NotNull public Plugin getPlugin()`
- `public void setRemovalCallback(@Nullable PermissionRemovedExecutor ex)`
- `@Nullable public PermissionRemovedExecutor getRemovalCallback()`
- `@NotNull public Permissible getPermissible()`
- `@NotNull public Map<String,Boolean> getPermissions()`
- `public void setPermission(@NotNull String name, boolean value)`
- `public void setPermission(@NotNull Permission perm, boolean value)`
- `public void unsetPermission(@NotNull String name)`
- `public void unsetPermission(@NotNull Permission perm)`
- `public boolean remove()`
