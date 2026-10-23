---
title: "org.bukkit.plugin.PluginDescriptionFile"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public final class org.bukkit.plugin.PluginDescriptionFile`
- `public org.bukkit.plugin.PluginDescriptionFile(java.io.InputStream) throws org.bukkit.plugin.InvalidDescriptionException`
- `public org.bukkit.plugin.PluginDescriptionFile(java.io.Reader) throws org.bukkit.plugin.InvalidDescriptionException`
- `public org.bukkit.plugin.PluginDescriptionFile(java.lang.String, java.lang.String, java.lang.String)`
- `public java.lang.String getName()`
- `public java.util.List<java.lang.String> getProvides()`
- `public java.lang.String getVersion()`
- `public java.lang.String getMain()`
- `public java.lang.String getDescription()`
- `public org.bukkit.plugin.PluginLoadOrder getLoad()`
- `public java.util.List<java.lang.String> getAuthors()`
- `public java.util.List<java.lang.String> getContributors()`
- `public java.lang.String getWebsite()`
- `public java.util.List<java.lang.String> getDepend()`
- `public java.util.List<java.lang.String> getSoftDepend()`
- `public java.util.List<java.lang.String> getLoadBefore()`
- `public java.lang.String getPrefix()`
- `public java.util.Map<java.lang.String, java.util.Map<java.lang.String, java.lang.Object>> getCommands()`
- `public java.util.List<org.bukkit.permissions.Permission> getPermissions()`
- `public org.bukkit.permissions.PermissionDefault getPermissionDefault()`
- `public java.util.Set<org.bukkit.plugin.PluginAwareness> getAwareness()`
- `public java.lang.String getFullName()`
- `public java.lang.String getAPIVersion()`
- `public java.util.List<java.lang.String> getLibraries()`
- `public java.lang.String getClassLoaderOf()`
- `public void save(java.io.Writer)`
- `public java.lang.String getRawName()`
