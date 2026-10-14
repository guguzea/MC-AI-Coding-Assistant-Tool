---
title: "org.bukkit.plugin.java.JavaPluginLoader"
package: "org.bukkit.plugin.java"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/java/JavaPluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class JavaPluginLoader**
`public final class JavaPluginLoader extends Object implements PluginLoader`
- `public static final CustomTimingsHandler pluginParentTimer`
- `@Deprecated(since="1.4.5") public JavaPluginLoader(@NotNull Server instance)`
- `@NotNull public Plugin loadPlugin(@NotNull File file) throws InvalidPluginException`
- `@NotNull public PluginDescriptionFile getPluginDescription(@NotNull File file) throws InvalidDescriptionException`
- `@NotNull public Pattern[] getPluginFileFilters()`
- `@NotNull public Map<Class<? extends Event>, Set<RegisteredListener>> createRegisteredListeners(@NotNull Listener listener, @NotNull Plugin plugin)`
- `public void enablePlugin(@NotNull Plugin plugin)`
- `public void disablePlugin(@NotNull Plugin plugin)`
