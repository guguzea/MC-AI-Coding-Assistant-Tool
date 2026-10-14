---
title: "io.papermc.paper.plugin.configuration.PluginMeta"
package: "io.papermc.paper.plugin.configuration"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/plugin/configuration/PluginMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PluginMeta**
`@NullMarked @NonExtendable public interface PluginMeta extends Namespaced`
- `String getName()`
- `default String getDisplayName()`
- `String getMainClass()`
- `PluginLoadOrder getLoadOrder()`
- `String getVersion()`
- `@Nullable String getLoggerPrefix()`
- `List<String> getPluginDependencies()`
- `List<String> getPluginSoftDependencies()`
- `List<String> getLoadBeforePlugins()`
- `List<String> getProvidedPlugins()`
- `List<String> getAuthors()`
- `List<String> getContributors()`
- `@Nullable String getDescription()`
- `@Nullable String getWebsite()`
- `List<Permission> getPermissions()`
- `PermissionDefault getPermissionDefault()`
- `@Nullable String getAPIVersion()`
- `@Namespace default String namespace()`
