---
title: "org.bukkit.plugin.PluginDescriptionFile"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/PluginDescriptionFile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PluginDescriptionFile**
`public final class PluginDescriptionFile extends Object implements PluginMeta`
- `public PluginDescriptionFile(@NotNull @NotNull InputStream stream) throws InvalidDescriptionException`
- `public PluginDescriptionFile(@NotNull @NotNull Reader reader) throws InvalidDescriptionException`
- `public PluginDescriptionFile(@NotNull @NotNull String pluginName, @NotNull @NotNull String pluginVersion, @NotNull @NotNull String mainClass)`
- `@Internal @Nullable public @Nullable String getPaperPluginLoader()`
- `@NotNull public @NotNull String getMainClass()`
- `@NotNull public @NotNull PluginLoadOrder getLoadOrder()`
- `@Nullable public @Nullable String getLoggerPrefix()`
- `@NotNull public @NotNull List<String> getPluginDependencies()`
- `@NotNull public @NotNull List<String> getPluginSoftDependencies()`
- `@NotNull public @NotNull List<String> getLoadBeforePlugins()`
- `@NotNull public @NotNull List<String> getProvidedPlugins()`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull List<String> getProvides()`
- `@NotNull public @NotNull String getVersion()`
- `@NotNull public @NotNull String getMain()`
- `@Nullable public @Nullable String getDescription()`
- `@NotNull public @NotNull PluginLoadOrder getLoad()`
- `@NotNull public @NotNull List<String> getAuthors()`
- `@NotNull public @NotNull List<String> getContributors()`
- `@Nullable public @Nullable String getWebsite()`
- `@NotNull public @NotNull List<String> getDepend()`
- `@NotNull public @NotNull List<String> getSoftDepend()`
- `@NotNull public @NotNull List<String> getLoadBefore()`
- `@Nullable public @Nullable String getPrefix()`
- `@NotNull public @NotNull Map<String, Map<String,Object>> getCommands()`
- `@NotNull public @NotNull List<Permission> getPermissions()`
- `@NotNull public @NotNull PermissionDefault getPermissionDefault()`
- `@NotNull public @NotNull Set<PluginAwareness> getAwareness()`
- `@NotNull public @NotNull String getFullName()`
- `@Nullable public @Nullable String getAPIVersion()`
- `@NotNull public @NotNull List<String> getLibraries()`
- `@Deprecated(since="1.7.2", forRemoval=true) @Nullable public @Nullable String getClassLoaderOf()`
- `public void save(@NotNull @NotNull Writer writer)`
