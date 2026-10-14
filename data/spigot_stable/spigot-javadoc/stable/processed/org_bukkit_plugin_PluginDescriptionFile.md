---
title: "org.bukkit.plugin.PluginDescriptionFile"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/PluginDescriptionFile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PluginDescriptionFile**
`public final class PluginDescriptionFile extends Object`
- `public PluginDescriptionFile(@NotNull InputStream stream) throws InvalidDescriptionException`
- `public PluginDescriptionFile(@NotNull Reader reader) throws InvalidDescriptionException`
- `public PluginDescriptionFile(@NotNull String pluginName, @NotNull String pluginVersion, @NotNull String mainClass)`
- `@NotNull public String getName()`
- `@NotNull public List<String> getProvides()`
- `@NotNull public String getVersion()`
- `@NotNull public String getMain()`
- `@Nullable public String getDescription()`
- `@NotNull public PluginLoadOrder getLoad()`
- `@NotNull public List<String> getAuthors()`
- `@NotNull public List<String> getContributors()`
- `@Nullable public String getWebsite()`
- `@NotNull public List<String> getDepend()`
- `@NotNull public List<String> getSoftDepend()`
- `@NotNull public List<String> getLoadBefore()`
- `@Nullable public String getPrefix()`
- `@NotNull public Map<String, Map<String,Object>> getCommands()`
- `@NotNull public List<Permission> getPermissions()`
- `@NotNull public PermissionDefault getPermissionDefault()`
- `@NotNull public Set<PluginAwareness> getAwareness()`
- `@NotNull public String getFullName()`
- `@Nullable public String getAPIVersion()`
- `@NotNull public List<String> getLibraries()`
- `@Deprecated(since="1.7.2") @Nullable public String getClassLoaderOf()`
- `public void save(@NotNull Writer writer)`
- `@Internal @NotNull public String getRawName()`
