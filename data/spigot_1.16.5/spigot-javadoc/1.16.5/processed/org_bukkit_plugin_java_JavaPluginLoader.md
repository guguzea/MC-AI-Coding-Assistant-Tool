---
title: "org.bukkit.plugin.java.JavaPluginLoader"
package: "org.bukkit.plugin.java"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public final class org.bukkit.plugin.java.JavaPluginLoader implements org.bukkit.plugin.PluginLoader`
- `public static final org.spigotmc.CustomTimingsHandler pluginParentTimer`
- `public org.bukkit.plugin.java.JavaPluginLoader(org.bukkit.Server)`
- `public org.bukkit.plugin.Plugin loadPlugin(java.io.File) throws org.bukkit.plugin.InvalidPluginException`
- `public org.bukkit.plugin.PluginDescriptionFile getPluginDescription(java.io.File) throws org.bukkit.plugin.InvalidDescriptionException`
- `public java.util.regex.Pattern[] getPluginFileFilters()`
- `public java.util.Map<java.lang.Class<? extends org.bukkit.event.Event>, java.util.Set<org.bukkit.plugin.RegisteredListener>> createRegisteredListeners(org.bukkit.event.Listener, org.bukkit.plugin.Plugin)`
- `public void enablePlugin(org.bukkit.plugin.Plugin)`
- `public void disablePlugin(org.bukkit.plugin.Plugin)`
