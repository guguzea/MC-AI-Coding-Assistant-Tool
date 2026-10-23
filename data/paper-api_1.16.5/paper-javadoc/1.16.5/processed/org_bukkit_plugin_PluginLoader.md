---
title: "org.bukkit.plugin.PluginLoader"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/PluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Plugin loadPlugin&#8203;(@NotNull @NotNull File file) throws InvalidPluginException, UnknownDependencyException`
- `@NotNull @NotNull PluginDescriptionFile getPluginDescription&#8203;(@NotNull @NotNull File file) throws InvalidDescriptionException`
- `@NotNull @NotNull Pattern[] getPluginFileFilters()`
- `@NotNull @NotNull Map<Class<? extends Event>,&#8203;Set<RegisteredListener>> createRegisteredListeners&#8203;(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `void enablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `default void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin, boolean closeClassloader)`
