---
title: "org.bukkit.plugin.PluginDescriptionFile"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/PluginDescriptionFile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PluginDescriptionFile&#8203;(@NotNull @NotNull InputStream stream) throws InvalidDescriptionException`
- `public PluginDescriptionFile&#8203;(@NotNull @NotNull Reader reader) throws InvalidDescriptionException`
- `public PluginDescriptionFile&#8203;(@NotNull @NotNull String pluginName, @NotNull @NotNull String pluginVersion, @NotNull @NotNull String mainClass)`
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
- `@NotNull public @NotNull Map<String,&#8203;Map<String,&#8203;Object>> getCommands()`
- `@NotNull public @NotNull List<Permission> getPermissions()`
- `@NotNull public @NotNull PermissionDefault getPermissionDefault()`
- `@NotNull public @NotNull Set<PluginAwareness> getAwareness()`
- `@NotNull public @NotNull String getFullName()`
- `@Nullable public @Nullable String getAPIVersion()`
- `@NotNull public @NotNull List<String> getLibraries()`
- `@Deprecated @Nullable public @Nullable String getClassLoaderOf()`
- `public void save&#8203;(@NotNull @NotNull Writer writer)`
- `@Deprecated @NotNull public @NotNull String getRawName()`
