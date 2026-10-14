---
title: "io.papermc.paper.plugin.provider.classloader.PluginClassLoaderGroup"
package: "io.papermc.paper.plugin.provider.classloader"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/plugin/provider/classloader/PluginClassLoaderGroup.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PluginClassLoaderGroup**
`@NullMarked @Internal public interface PluginClassLoaderGroup`
- `@Nullable Class<?> getClassByName(String name, boolean resolve, ConfiguredPluginClassLoader requester)`
- `@Contract(mutates="this") void remove(ConfiguredPluginClassLoader configuredPluginClassLoader)`
- `@Contract(mutates="this") void add(ConfiguredPluginClassLoader configuredPluginClassLoader)`
- `ClassLoaderAccess getAccess()`
