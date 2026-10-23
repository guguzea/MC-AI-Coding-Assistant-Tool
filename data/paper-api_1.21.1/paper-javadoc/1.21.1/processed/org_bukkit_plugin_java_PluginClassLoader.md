---
title: "org.bukkit.plugin.java.PluginClassLoader"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/plugin/java/PluginClassLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public DependencyContext dependencyContext`
- `@Internal public PluginClassLoader(@Nullable @Nullable ClassLoader parent, @NotNull @NotNull PluginDescriptionFile description, @NotNull @NotNull File dataFolder, @NotNull @NotNull File file, @Nullable @Nullable ClassLoader libraryLoader, JarFile jarFile, DependencyContext dependencyContext) throws IOException, InvalidPluginException, MalformedURLException`
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
