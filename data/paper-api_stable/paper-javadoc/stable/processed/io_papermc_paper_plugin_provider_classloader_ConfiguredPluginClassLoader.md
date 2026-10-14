---
title: "io.papermc.paper.plugin.provider.classloader.ConfiguredPluginClassLoader"
package: "io.papermc.paper.plugin.provider.classloader"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/plugin/provider/classloader/ConfiguredPluginClassLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ConfiguredPluginClassLoader**
`@NullMarked @Internal public interface ConfiguredPluginClassLoader extends Closeable`
- `PluginMeta getConfiguration()`
- `Class<?> loadClass(String name, boolean resolve, boolean checkGlobal, boolean checkLibraries) throws ClassNotFoundException`
- `void init(JavaPlugin plugin)`
- `@Nullable JavaPlugin getPlugin()`
- `@Nullable PluginClassLoaderGroup getGroup()`
