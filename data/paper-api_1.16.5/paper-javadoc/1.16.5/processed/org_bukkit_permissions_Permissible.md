---
title: "org.bukkit.permissions.Permissible"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/permissions/Permissible.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `boolean isPermissionSet&#8203;(@NotNull @NotNull String name)`
- `boolean isPermissionSet&#8203;(@NotNull @NotNull Permission perm)`
- `boolean hasPermission&#8203;(@NotNull @NotNull String name)`
- `boolean hasPermission&#8203;(@NotNull @NotNull Permission perm)`
- `@NotNull @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value)`
- `@NotNull @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin)`
- `@Nullable @Nullable PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value, int ticks)`
- `@Nullable @Nullable PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, int ticks)`
- `void removeAttachment&#8203;(@NotNull @NotNull PermissionAttachment attachment)`
- `void recalculatePermissions()`
- `@NotNull @NotNull Set<PermissionAttachmentInfo> getEffectivePermissions()`
