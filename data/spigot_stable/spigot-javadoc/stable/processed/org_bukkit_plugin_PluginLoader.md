---
title: "org.bukkit.plugin.PluginLoader"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/PluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PluginLoader**
`public interface PluginLoader`
- `@NotNull Plugin loadPlugin(@NotNull File file) throws InvalidPluginException, UnknownDependencyException`
- `@NotNull PluginDescriptionFile getPluginDescription(@NotNull File file) throws InvalidDescriptionException`
- `@NotNull Pattern[] getPluginFileFilters()`
- `@NotNull Map<Class<? extends Event>, Set<RegisteredListener>> createRegisteredListeners(@NotNull Listener listener, @NotNull Plugin plugin)`
- `void enablePlugin(@NotNull Plugin plugin)`
- `void disablePlugin(@NotNull Plugin plugin)`
