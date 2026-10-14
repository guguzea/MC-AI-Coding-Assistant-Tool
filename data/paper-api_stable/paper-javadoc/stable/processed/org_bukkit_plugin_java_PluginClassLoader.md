---
title: "org.bukkit.plugin.java.PluginClassLoader"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/java/PluginClassLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PluginClassLoader**
`@Internal public final class PluginClassLoader extends URLClassLoader implements ConfiguredPluginClassLoader`
- `public DependencyContext dependencyContext`
- `public URL getResource(String name)`
- `public Enumeration<URL> getResources(String name) throws IOException`
- `public Class<?> loadClass(@NotNull @NotNull String name, boolean resolve, boolean checkGlobal, boolean checkLibraries) throws ClassNotFoundException`
- `public PluginMeta getConfiguration()`
- `public void init(JavaPlugin plugin)`
- `public JavaPlugin getPlugin()`
- `protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException`
- `protected Class<?> findClass(String name) throws ClassNotFoundException`
- `public void close() throws IOException`
- `public void initialize(@NotNull @NotNull JavaPlugin javaPlugin)`
- `public String toString()`
- `@Nullable public PluginClassLoaderGroup getGroup()`
