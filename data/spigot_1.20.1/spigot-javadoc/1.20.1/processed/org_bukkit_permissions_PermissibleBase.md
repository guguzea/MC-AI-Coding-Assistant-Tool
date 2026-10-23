---
title: "org.bukkit.permissions.PermissibleBase"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.permissions.PermissibleBase implements org.bukkit.permissions.Permissible`
- `public org.bukkit.permissions.PermissibleBase(org.bukkit.permissions.ServerOperator)`
- `public boolean isOp()`
- `public void setOp(boolean)`
- `public boolean isPermissionSet(java.lang.String)`
- `public boolean isPermissionSet(org.bukkit.permissions.Permission)`
- `public boolean hasPermission(java.lang.String)`
- `public boolean hasPermission(org.bukkit.permissions.Permission)`
- `public org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin, java.lang.String, boolean)`
- `public org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin)`
- `public void removeAttachment(org.bukkit.permissions.PermissionAttachment)`
- `public void recalculatePermissions()`
- `public synchronized void clearPermissions()`
- `public org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin, java.lang.String, boolean, int)`
- `public org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin, int)`
- `public java.util.Set<org.bukkit.permissions.PermissionAttachmentInfo> getEffectivePermissions()`
