---
title: "io.papermc.paper.plugin.provider.classloader.PaperClassLoaderStorage"
package: "io.papermc.paper.plugin.provider.classloader"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/plugin/provider/classloader/PaperClassLoaderStorage.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PaperClassLoaderStorage**
`@Internal public interface PaperClassLoaderStorage`
- `static PaperClassLoaderStorage instance()`
- `PluginClassLoaderGroup registerSpigotGroup(PluginClassLoader pluginClassLoader)`
- `PluginClassLoaderGroup registerOpenGroup(ConfiguredPluginClassLoader classLoader)`
- `PluginClassLoaderGroup registerAccessBackedGroup(ConfiguredPluginClassLoader classLoader, ClassLoaderAccess access)`
- `void unregisterClassloader(ConfiguredPluginClassLoader configuredPluginClassLoader)`
- `boolean registerUnsafePlugin(ConfiguredPluginClassLoader pluginLoader)`
