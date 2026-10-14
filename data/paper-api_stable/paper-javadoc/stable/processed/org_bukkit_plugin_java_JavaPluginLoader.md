---
title: "org.bukkit.plugin.java.JavaPluginLoader"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/java/JavaPluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class JavaPluginLoader**
`@Deprecated(forRemoval=true) public final class JavaPluginLoader extends Object implements PluginLoader`
- `@Deprecated(since="1.4.5") public JavaPluginLoader(@NotNull @NotNull Server instance)`
- `@NotNull public @NotNull Plugin loadPlugin(@NotNull @NotNull File file) throws InvalidPluginException`
- `@NotNull public @NotNull PluginDescriptionFile getPluginDescription(@NotNull @NotNull File file) throws InvalidDescriptionException`
- `@NotNull public @NotNull Pattern[] getPluginFileFilters()`
- `@NotNull public @NotNull Map<Class<? extends Event>, Set<RegisteredListener>> createRegisteredListeners(@NotNull @NotNull Listener listener, @NotNull @NotNull Plugin plugin)`
- `public void enablePlugin(@NotNull @NotNull Plugin plugin)`
- `public void disablePlugin(@NotNull @NotNull Plugin plugin)`
