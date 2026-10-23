---
title: "org.bukkit.plugin.java.JavaPlugin"
package: "org.bukkit.plugin.java"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public abstract class org.bukkit.plugin.java.JavaPlugin extends org.bukkit.plugin.PluginBase`
- `public org.bukkit.plugin.java.JavaPlugin()`
- `protected org.bukkit.plugin.java.JavaPlugin(org.bukkit.plugin.java.JavaPluginLoader, org.bukkit.plugin.PluginDescriptionFile, java.io.File, java.io.File)`
- `public final java.io.File getDataFolder()`
- `public final org.bukkit.plugin.PluginLoader getPluginLoader()`
- `public final org.bukkit.Server getServer()`
- `public final boolean isEnabled()`
- `protected java.io.File getFile()`
- `public final org.bukkit.plugin.PluginDescriptionFile getDescription()`
- `public org.bukkit.configuration.file.FileConfiguration getConfig()`
- `protected final java.io.Reader getTextResource(java.lang.String)`
- `public void reloadConfig()`
- `public void saveConfig()`
- `public void saveDefaultConfig()`
- `public void saveResource(java.lang.String, boolean)`
- `public java.io.InputStream getResource(java.lang.String)`
- `protected final java.lang.ClassLoader getClassLoader()`
- `protected final void setEnabled(boolean)`
- `public boolean onCommand(org.bukkit.command.CommandSender, org.bukkit.command.Command, java.lang.String, java.lang.String[])`
- `public java.util.List<java.lang.String> onTabComplete(org.bukkit.command.CommandSender, org.bukkit.command.Command, java.lang.String, java.lang.String[])`
- `public org.bukkit.command.PluginCommand getCommand(java.lang.String)`
- `public void onLoad()`
- `public void onDisable()`
- `public void onEnable()`
- `public org.bukkit.generator.ChunkGenerator getDefaultWorldGenerator(java.lang.String, java.lang.String)`
- `public final boolean isNaggable()`
- `public final void setNaggable(boolean)`
- `public java.util.logging.Logger getLogger()`
- `public java.lang.String toString()`
- `public static <T extends org.bukkit.plugin.java.JavaPlugin> T getPlugin(java.lang.Class<T>)`
- `public static org.bukkit.plugin.java.JavaPlugin getProvidingPlugin(java.lang.Class<?>)`
