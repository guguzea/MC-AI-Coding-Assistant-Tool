---
title: "org.bukkit.plugin.Plugin"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/Plugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull File getDataFolder()`
- `@NotNull @NotNull PluginDescriptionFile getDescription()`
- `@NotNull @NotNull FileConfiguration getConfig()`
- `@Nullable @Nullable InputStream getResource&#8203;(@NotNull @NotNull String filename)`
- `void saveConfig()`
- `void saveDefaultConfig()`
- `void saveResource&#8203;(@NotNull @NotNull String resourcePath, boolean replace)`
- `void reloadConfig()`
- `@NotNull @NotNull PluginLoader getPluginLoader()`
- `@NotNull @NotNull Server getServer()`
- `boolean isEnabled()`
- `void onDisable()`
- `void onLoad()`
- `void onEnable()`
- `boolean isNaggable()`
- `void setNaggable&#8203;(boolean canNag)`
- `@Nullable @Nullable ChunkGenerator getDefaultWorldGenerator&#8203;(@NotNull @NotNull String worldName, @Nullable @Nullable String id)`
- `@NotNull @NotNull Logger getLogger()`
- `@NotNull default org.slf4j.Logger getSLF4JLogger()`
- `@NotNull @NotNull String getName()`
