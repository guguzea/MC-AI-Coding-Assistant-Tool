---
title: "org.bukkit.plugin.Plugin"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.plugin.Plugin extends org.bukkit.command.TabExecutor`
- `public abstract java.io.File getDataFolder()`
- `public abstract org.bukkit.plugin.PluginDescriptionFile getDescription()`
- `public abstract org.bukkit.configuration.file.FileConfiguration getConfig()`
- `public abstract java.io.InputStream getResource(java.lang.String)`
- `public abstract void saveConfig()`
- `public abstract void saveDefaultConfig()`
- `public abstract void saveResource(java.lang.String, boolean)`
- `public abstract void reloadConfig()`
- `public abstract org.bukkit.plugin.PluginLoader getPluginLoader()`
- `public abstract org.bukkit.Server getServer()`
- `public abstract boolean isEnabled()`
- `public abstract void onDisable()`
- `public abstract void onLoad()`
- `public abstract void onEnable()`
- `public abstract boolean isNaggable()`
- `public abstract void setNaggable(boolean)`
- `public abstract org.bukkit.generator.ChunkGenerator getDefaultWorldGenerator(java.lang.String, java.lang.String)`
- `public abstract org.bukkit.generator.BiomeProvider getDefaultBiomeProvider(java.lang.String, java.lang.String)`
- `public abstract java.util.logging.Logger getLogger()`
- `public abstract java.lang.String getName()`
