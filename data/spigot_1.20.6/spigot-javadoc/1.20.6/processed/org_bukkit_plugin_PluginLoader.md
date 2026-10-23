---
title: "org.bukkit.plugin.PluginLoader"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.plugin.PluginLoader`
- `public abstract org.bukkit.plugin.Plugin loadPlugin(java.io.File) throws org.bukkit.plugin.InvalidPluginException, org.bukkit.plugin.UnknownDependencyException`
- `public abstract org.bukkit.plugin.PluginDescriptionFile getPluginDescription(java.io.File) throws org.bukkit.plugin.InvalidDescriptionException`
- `public abstract java.util.regex.Pattern[] getPluginFileFilters()`
- `public abstract java.util.Map<java.lang.Class<? extends org.bukkit.event.Event>, java.util.Set<org.bukkit.plugin.RegisteredListener>> createRegisteredListeners(org.bukkit.event.Listener, org.bukkit.plugin.Plugin)`
- `public abstract void enablePlugin(org.bukkit.plugin.Plugin)`
- `public abstract void disablePlugin(org.bukkit.plugin.Plugin)`
