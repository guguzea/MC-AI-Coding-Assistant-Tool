---
title: "org.bukkit.plugin.java.JavaPlugin"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/plugin/java/JavaPlugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `protected ClassLoader getClassLoader()`
- `PluginCommand getCommand(String name)`
- `FileConfiguration getConfig()`
- `File getDataFolder()`
- `ChunkGenerator getDefaultWorldGenerator(String worldName, String id)`
- `PluginDescriptionFile getDescription()`
- `protected File getFile()`
- `Logger getLogger()`
- `static <T extends JavaPlugin>T getPlugin(Class<T> clazz)`
- `PluginLoader getPluginLoader()`
- `static JavaPlugin getProvidingPlugin(Class<?> clazz)`
- `InputStream getResource(String filename)`
- `Server getServer()`
- `protected Reader getTextResource(String file)`
- `boolean isEnabled()`
- `boolean isNaggable()`
- `boolean onCommand(CommandSender sender, Command command, String label, String[] args)`
- `void onDisable()`
- `void onEnable()`
- `void onLoad()`
- `List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args)`
- `void reloadConfig()`
- `void saveConfig()`
- `void saveDefaultConfig()`
- `void saveResource(String resourcePath, boolean replace)`
- `protected void setEnabled(boolean enabled)`
- `void setNaggable(boolean canNag)`
- `String toString()`
