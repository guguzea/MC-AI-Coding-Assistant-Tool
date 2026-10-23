---
title: "org.bukkit.permissions.PermissibleBase"
package: "org.bukkit.permissions"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/permissions/PermissibleBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `PermissionAttachment addAttachment(Plugin plugin)`
- `PermissionAttachment addAttachment(Plugin plugin, int ticks)`
- `PermissionAttachment addAttachment(Plugin plugin, String name, boolean value)`
- `PermissionAttachment addAttachment(Plugin plugin, String name, boolean value, int ticks)`
- `void clearPermissions()`
- `Set<PermissionAttachmentInfo> getEffectivePermissions()`
- `boolean hasPermission(String inName)`
- `boolean hasPermission(Permission perm)`
- `boolean isOp()`
- `boolean isPermissionSet(String name)`
- `boolean isPermissionSet(Permission perm)`
- `void recalculatePermissions()`
- `void removeAttachment(PermissionAttachment attachment)`
- `void setOp(boolean value)`
