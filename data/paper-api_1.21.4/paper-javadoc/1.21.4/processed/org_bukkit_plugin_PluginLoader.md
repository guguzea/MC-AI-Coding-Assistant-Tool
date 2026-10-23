---
title: "org.bukkit.plugin.PluginLoader"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/plugin/PluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Plugin loadPlugin(@NotNull @NotNull File file) throws InvalidPluginException, UnknownDependencyException`
- `@NotNull @NotNull PluginDescriptionFile getPluginDescription(@NotNull @NotNull File file) throws InvalidDescriptionException`
- `@NotNull @NotNull Pattern[] getPluginFileFilters()`
- `@NotNull @NotNull Map<Class<? extends Event>,Set<RegisteredListener>> createRegisteredListeners(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `void enablePlugin(@NotNull @NotNull Plugin plugin)`
- `void disablePlugin(@NotNull @NotNull Plugin plugin)`
