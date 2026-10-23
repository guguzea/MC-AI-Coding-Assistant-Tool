---
title: "org.bukkit.plugin.java.JavaPluginLoader"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/plugin/java/JavaPluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public JavaPluginLoader(@NotNull @NotNull Server instance)`
- `@NotNull public @NotNull Plugin loadPlugin(@NotNull @NotNull File file) throws InvalidPluginException`
- `@NotNull public @NotNull PluginDescriptionFile getPluginDescription(@NotNull @NotNull File file) throws InvalidDescriptionException`
- `@NotNull public @NotNull Pattern[] getPluginFileFilters()`
- `@NotNull public @NotNull Map<Class<? extends Event>,Set<RegisteredListener>> createRegisteredListeners(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `public void enablePlugin(@NotNull @NotNull Plugin plugin)`
- `public void disablePlugin(@NotNull @NotNull Plugin plugin)`
