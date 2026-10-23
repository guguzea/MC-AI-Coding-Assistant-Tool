---
title: "org.bukkit.plugin.PluginLoader"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.plugin.PluginLoader`
- `public abstract org.bukkit.plugin.Plugin loadPlugin(java.io.File) throws org.bukkit.plugin.InvalidPluginException, org.bukkit.plugin.UnknownDependencyException`
- `public abstract org.bukkit.plugin.PluginDescriptionFile getPluginDescription(java.io.File) throws org.bukkit.plugin.InvalidDescriptionException`
- `public abstract java.util.regex.Pattern[] getPluginFileFilters()`
- `public abstract java.util.Map<java.lang.Class<? extends org.bukkit.event.Event>, java.util.Set<org.bukkit.plugin.RegisteredListener>> createRegisteredListeners(org.bukkit.event.Listener, org.bukkit.plugin.Plugin)`
- `public abstract void enablePlugin(org.bukkit.plugin.Plugin)`
- `public abstract void disablePlugin(org.bukkit.plugin.Plugin)`
