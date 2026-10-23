---
title: "org.bukkit.permissions.PermissibleBase"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
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
