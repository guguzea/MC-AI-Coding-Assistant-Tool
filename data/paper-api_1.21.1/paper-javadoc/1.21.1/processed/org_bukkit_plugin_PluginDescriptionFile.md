---
title: "org.bukkit.plugin.PluginDescriptionFile"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/plugin/PluginDescriptionFile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public PluginDescriptionFile(String rawName, String name, List<String> provides, String main, String classLoaderOf, List<String> depend, List<String> softDepend, List<String> loadBefore, String version, Map<String,Map<String,Object>> commands, String description, List<String> authors, List<String> contributors, String website, String prefix, PluginLoadOrder order, List<Permission> permissions, PermissionDefault defaultPerm, Set<PluginAwareness> awareness, String apiVersion, List<String> libraries)`
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
- `@NotNull public @NotNull Map<String,Map<String,Object>> getCommands()`
- `@NotNull public @NotNull List<Permission> getPermissions()`
- `@NotNull public @NotNull PermissionDefault getPermissionDefault()`
- `@NotNull public @NotNull Set<PluginAwareness> getAwareness()`
- `@NotNull public @NotNull String getFullName()`
- `@Nullable public @Nullable String getAPIVersion()`
- `@NotNull public @NotNull List<String> getLibraries()`
- `@Deprecated @Nullable public @Nullable String getClassLoaderOf()`
- `public void save(@NotNull @NotNull Writer writer)`
- `@Internal @NotNull public @NotNull String getRawName()`
