---
title: "org.bukkit.permissions.Permissible"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/26.3/org/bukkit/permissions/Permissible.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Permissible**
`public interface Permissible extends ServerOperator`
- `boolean isPermissionSet(@NotNull @NotNull String name)`
- `boolean isPermissionSet(@NotNull @NotNull Permission perm)`
- `boolean hasPermission(@NotNull @NotNull String name)`
- `boolean hasPermission(@NotNull @NotNull Permission perm)`
- `@NotNull @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value)`
- `@NotNull @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin)`
- `@Nullable @Nullable PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value, int ticks)`
- `@Nullable @Nullable PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, int ticks)`
- `void removeAttachment(@NotNull @NotNull PermissionAttachment attachment)`
- `void recalculatePermissions()`
- `@NotNull @NotNull Set<PermissionAttachmentInfo> getEffectivePermissions()`
- `default @NotNull TriState permissionValue(@NotNull @NotNull Permission permission)`
- `default @NotNull TriState permissionValue(@NotNull @NotNull String permission)`
