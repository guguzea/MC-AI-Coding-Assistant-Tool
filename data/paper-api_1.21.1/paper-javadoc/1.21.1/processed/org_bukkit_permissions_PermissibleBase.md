---
title: "org.bukkit.permissions.PermissibleBase"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/permissions/PermissibleBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public PermissibleBase(@Nullable @Nullable ServerOperator opable)`
- `public boolean isOp()`
- `public void setOp(boolean value)`
- `public boolean isPermissionSet(@NotNull @NotNull String name)`
- `public boolean isPermissionSet(@NotNull @NotNull Permission perm)`
- `public boolean hasPermission(@NotNull @NotNull String inName)`
- `public boolean hasPermission(@NotNull @NotNull Permission perm)`
- `@NotNull public @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value)`
- `@NotNull public @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin)`
- `public void removeAttachment(@NotNull @NotNull PermissionAttachment attachment)`
- `public void recalculatePermissions()`
- `public void clearPermissions()`
- `@Nullable public @Nullable PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value, int ticks)`
- `@Nullable public @Nullable PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, int ticks)`
- `@NotNull public @NotNull Set<PermissionAttachmentInfo> getEffectivePermissions()`
