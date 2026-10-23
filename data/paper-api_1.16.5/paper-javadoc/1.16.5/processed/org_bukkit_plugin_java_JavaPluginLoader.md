---
title: "org.bukkit.plugin.java.JavaPluginLoader"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/java/JavaPluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public JavaPluginLoader&#8203;(@NotNull @NotNull Server instance)`
- `@NotNull public @NotNull Plugin loadPlugin&#8203;(@NotNull @NotNull File file) throws InvalidPluginException`
- `@NotNull public @NotNull PluginDescriptionFile getPluginDescription&#8203;(@NotNull @NotNull File file) throws InvalidDescriptionException`
- `@NotNull public @NotNull Pattern[] getPluginFileFilters()`
- `@NotNull public @NotNull Map<Class<? extends Event>,&#8203;Set<RegisteredListener>> createRegisteredListeners&#8203;(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `public void enablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `public void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin)`
- `public void disablePlugin&#8203;(@NotNull @NotNull Plugin plugin, boolean closeClassloader)`
