---
title: "org.bukkit.plugin.Plugin"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/plugin/Plugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `FileConfiguration getConfig()`
- `File getDataFolder()`
- `ChunkGenerator getDefaultWorldGenerator(String worldName, String id)`
- `PluginDescriptionFile getDescription()`
- `Logger getLogger()`
- `String getName()`
- `PluginLoader getPluginLoader()`
- `InputStream getResource(String filename)`
- `Server getServer()`
- `default org.slf4j.Logger getSLF4JLogger()`
- `boolean isEnabled()`
- `boolean isNaggable()`
- `void onDisable()`
- `void onEnable()`
- `void onLoad()`
- `void reloadConfig()`
- `void saveConfig()`
- `void saveDefaultConfig()`
- `void saveResource(String resourcePath, boolean replace)`
- `void setNaggable(boolean canNag)`
