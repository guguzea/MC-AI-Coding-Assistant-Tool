---
title: "org.bukkit.permissions.PermissibleBase"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/permissions/PermissibleBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PermissibleBase&#8203;(@Nullable @Nullable ServerOperator opable)`
- `public boolean isOp()`
- `public void setOp&#8203;(boolean value)`
- `public boolean isPermissionSet&#8203;(@NotNull @NotNull String name)`
- `public boolean isPermissionSet&#8203;(@NotNull @NotNull Permission perm)`
- `public boolean hasPermission&#8203;(@NotNull @NotNull String inName)`
- `public boolean hasPermission&#8203;(@NotNull @NotNull Permission perm)`
- `@NotNull public @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value)`
- `@NotNull public @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin)`
- `public void removeAttachment&#8203;(@NotNull @NotNull PermissionAttachment attachment)`
- `public void recalculatePermissions()`
- `public void clearPermissions()`
- `@Nullable public @Nullable PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value, int ticks)`
- `@Nullable public @Nullable PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, int ticks)`
- `@NotNull public @NotNull Set<PermissionAttachmentInfo> getEffectivePermissions()`
