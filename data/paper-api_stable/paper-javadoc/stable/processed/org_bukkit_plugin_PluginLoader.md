---
title: "org.bukkit.plugin.PluginLoader"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/PluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PluginLoader**
`@Deprecated(forRemoval=true) public interface PluginLoader`
- `@NotNull @NotNull Plugin loadPlugin(@NotNull @NotNull File file) throws InvalidPluginException, UnknownDependencyException`
- `@NotNull @NotNull PluginDescriptionFile getPluginDescription(@NotNull @NotNull File file) throws InvalidDescriptionException`
- `@NotNull @NotNull Pattern[] getPluginFileFilters()`
- `@NotNull @NotNull Map<Class<? extends Event>, Set<RegisteredListener>> createRegisteredListeners(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `void enablePlugin(@NotNull @NotNull Plugin plugin)`
- `void disablePlugin(@NotNull @NotNull Plugin plugin)`
