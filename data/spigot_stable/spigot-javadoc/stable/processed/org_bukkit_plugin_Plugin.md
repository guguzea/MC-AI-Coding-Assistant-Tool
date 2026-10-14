---
title: "org.bukkit.plugin.Plugin"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/Plugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Plugin**
`public interface Plugin extends TabExecutor`
- `@NotNull File getDataFolder()`
- `@NotNull PluginDescriptionFile getDescription()`
- `@NotNull FileConfiguration getConfig()`
- `@Nullable InputStream getResource(@NotNull String filename)`
- `void saveConfig()`
- `void saveDefaultConfig()`
- `void saveResource(@NotNull String resourcePath, boolean replace)`
- `void reloadConfig()`
- `@NotNull PluginLoader getPluginLoader()`
- `@NotNull Server getServer()`
- `boolean isEnabled()`
- `void onDisable()`
- `void onLoad()`
- `void onEnable()`
- `boolean isNaggable()`
- `void setNaggable(boolean canNag)`
- `@Nullable ChunkGenerator getDefaultWorldGenerator(@NotNull String worldName, @Nullable String id)`
- `@Nullable BiomeProvider getDefaultBiomeProvider(@NotNull String worldName, @Nullable String id)`
- `@NotNull Logger getLogger()`
- `@NotNull String getName()`
