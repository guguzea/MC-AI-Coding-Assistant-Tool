---
title: "org.bukkit.plugin.Plugin"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/plugin/Plugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull File getDataFolder()`
- `@NotNull default Path getDataPath()`
- `@Deprecated @NotNull @NotNull PluginDescriptionFile getDescription()`
- `@NotNull PluginMeta getPluginMeta()`
- `@NotNull @NotNull FileConfiguration getConfig()`
- `@Nullable @Nullable InputStream getResource(@NotNull @NotNull String filename)`
- `void saveConfig()`
- `void saveDefaultConfig()`
- `void saveResource(@NotNull @NotNull String resourcePath, boolean replace)`
- `void reloadConfig()`
- `@Deprecated(forRemoval=true) @NotNull @NotNull PluginLoader getPluginLoader()`
- `@NotNull @NotNull Server getServer()`
- `boolean isEnabled()`
- `void onDisable()`
- `void onLoad()`
- `void onEnable()`
- `boolean isNaggable()`
- `void setNaggable(boolean canNag)`
- `@Nullable @Nullable ChunkGenerator getDefaultWorldGenerator(@NotNull @NotNull String worldName, @Nullable @Nullable String id)`
- `@Nullable @Nullable BiomeProvider getDefaultBiomeProvider(@NotNull @NotNull String worldName, @Nullable @Nullable String id)`
- `@NotNull @NotNull Logger getLogger()`
- `@NotNull default ComponentLogger getComponentLogger()`
- `@NotNull default Logger getSLF4JLogger()`
- `@Deprecated @NotNull default Logger getLog4JLogger()`
- `@NotNull @NotNull String getName()`
- `@NotNull LifecycleEventManager<Plugin> getLifecycleManager()`
