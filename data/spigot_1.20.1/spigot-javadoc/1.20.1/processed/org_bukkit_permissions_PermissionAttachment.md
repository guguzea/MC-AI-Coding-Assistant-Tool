---
title: "org.bukkit.permissions.PermissionAttachment"
package: "org.bukkit.permissions"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.permissions.PermissionAttachment`
- `public org.bukkit.permissions.PermissionAttachment(org.bukkit.plugin.Plugin, org.bukkit.permissions.Permissible)`
- `public org.bukkit.plugin.Plugin getPlugin()`
- `public void setRemovalCallback(org.bukkit.permissions.PermissionRemovedExecutor)`
- `public org.bukkit.permissions.PermissionRemovedExecutor getRemovalCallback()`
- `public org.bukkit.permissions.Permissible getPermissible()`
- `public java.util.Map<java.lang.String, java.lang.Boolean> getPermissions()`
- `public void setPermission(java.lang.String, boolean)`
- `public void setPermission(org.bukkit.permissions.Permission, boolean)`
- `public void unsetPermission(java.lang.String)`
- `public void unsetPermission(org.bukkit.permissions.Permission)`
- `public boolean remove()`
