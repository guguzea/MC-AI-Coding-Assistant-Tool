---
title: "org.bukkit.permissions.PermissibleBase"
package: "org.bukkit.permissions"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/permissions/PermissibleBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PermissibleBase**
`public class PermissibleBase extends Object implements Permissible`
- `public PermissibleBase(@Nullable ServerOperator opable)`
- `public boolean isOp()`
- `public void setOp(boolean value)`
- `public boolean isPermissionSet(@NotNull String name)`
- `public boolean isPermissionSet(@NotNull Permission perm)`
- `public boolean hasPermission(@NotNull String inName)`
- `public boolean hasPermission(@NotNull Permission perm)`
- `@NotNull public PermissionAttachment addAttachment(@NotNull Plugin plugin, @NotNull String name, boolean value)`
- `@NotNull public PermissionAttachment addAttachment(@NotNull Plugin plugin)`
- `public void removeAttachment(@NotNull PermissionAttachment attachment)`
- `public void recalculatePermissions()`
- `public void clearPermissions()`
- `@Nullable public PermissionAttachment addAttachment(@NotNull Plugin plugin, @NotNull String name, boolean value, int ticks)`
- `@Nullable public PermissionAttachment addAttachment(@NotNull Plugin plugin, int ticks)`
- `@NotNull public Set<PermissionAttachmentInfo> getEffectivePermissions()`
