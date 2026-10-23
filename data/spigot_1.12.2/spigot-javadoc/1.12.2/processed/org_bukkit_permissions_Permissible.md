---
title: "org.bukkit.permissions.Permissible"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.permissions.Permissible extends org.bukkit.permissions.ServerOperator`
- `public abstract boolean isPermissionSet(java.lang.String)`
- `public abstract boolean isPermissionSet(org.bukkit.permissions.Permission)`
- `public abstract boolean hasPermission(java.lang.String)`
- `public abstract boolean hasPermission(org.bukkit.permissions.Permission)`
- `public abstract org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin, java.lang.String, boolean)`
- `public abstract org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin)`
- `public abstract org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin, java.lang.String, boolean, int)`
- `public abstract org.bukkit.permissions.PermissionAttachment addAttachment(org.bukkit.plugin.Plugin, int)`
- `public abstract void removeAttachment(org.bukkit.permissions.PermissionAttachment)`
- `public abstract void recalculatePermissions()`
- `public abstract java.util.Set<org.bukkit.permissions.PermissionAttachmentInfo> getEffectivePermissions()`
