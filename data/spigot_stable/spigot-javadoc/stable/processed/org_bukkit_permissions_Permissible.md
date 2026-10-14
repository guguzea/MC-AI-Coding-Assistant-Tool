---
title: "org.bukkit.permissions.Permissible"
package: "org.bukkit.permissions"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/permissions/Permissible.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Permissible**
`public interface Permissible extends ServerOperator`
- `boolean isPermissionSet(@NotNull String name)`
- `boolean isPermissionSet(@NotNull Permission perm)`
- `boolean hasPermission(@NotNull String name)`
- `boolean hasPermission(@NotNull Permission perm)`
- `@NotNull PermissionAttachment addAttachment(@NotNull Plugin plugin, @NotNull String name, boolean value)`
- `@NotNull PermissionAttachment addAttachment(@NotNull Plugin plugin)`
- `@Nullable PermissionAttachment addAttachment(@NotNull Plugin plugin, @NotNull String name, boolean value, int ticks)`
- `@Nullable PermissionAttachment addAttachment(@NotNull Plugin plugin, int ticks)`
- `void removeAttachment(@NotNull PermissionAttachment attachment)`
- `void recalculatePermissions()`
- `@NotNull Set<PermissionAttachmentInfo> getEffectivePermissions()`
