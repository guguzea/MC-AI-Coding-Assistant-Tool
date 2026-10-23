---
title: "org.bukkit.permissions.PermissibleBase"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
