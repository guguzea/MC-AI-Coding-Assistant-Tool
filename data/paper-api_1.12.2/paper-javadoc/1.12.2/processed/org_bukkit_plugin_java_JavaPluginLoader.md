---
title: "org.bukkit.plugin.java.JavaPluginLoader"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/plugin/java/JavaPluginLoader.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `Map<Class<? extends Event>,Set<RegisteredListener>> createRegisteredListeners(Listener listener, Plugin plugin)`
- `void disablePlugin(Plugin plugin)`
- `void disablePlugin(Plugin plugin, boolean closeClassloader)`
- `void enablePlugin(Plugin plugin)`
- `PluginDescriptionFile getPluginDescription(File file)`
- `Pattern[] getPluginFileFilters()`
- `Plugin loadPlugin(File file)`
