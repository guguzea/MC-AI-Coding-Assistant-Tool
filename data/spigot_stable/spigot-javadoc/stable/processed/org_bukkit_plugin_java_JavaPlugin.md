---
title: "org.bukkit.plugin.java.JavaPlugin"
package: "org.bukkit.plugin.java"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/java/JavaPlugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class JavaPlugin**
`public abstract class JavaPlugin extends PluginBase`
- `public JavaPlugin()`
- `protected JavaPlugin(@NotNull JavaPluginLoader loader, @NotNull PluginDescriptionFile description, @NotNull File dataFolder, @NotNull File file)`
- `@NotNull public final File getDataFolder()`
- `@NotNull public final PluginLoader getPluginLoader()`
- `@NotNull public final Server getServer()`
- `public final boolean isEnabled()`
- `@NotNull protected File getFile()`
- `@NotNull public final PluginDescriptionFile getDescription()`
- `@NotNull public FileConfiguration getConfig()`
- `@Nullable protected final Reader getTextResource(@NotNull String file)`
- `public void reloadConfig()`
- `public void saveConfig()`
- `public void saveDefaultConfig()`
- `public void saveResource(@NotNull String resourcePath, boolean replace)`
- `@Nullable public InputStream getResource(@NotNull String filename)`
- `@NotNull protected final ClassLoader getClassLoader()`
- `protected final void setEnabled(boolean enabled)`
- `public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command, @NotNull String label, @NotNull String[] args)`
- `@Nullable public List<String> onTabComplete(@NotNull CommandSender sender, @NotNull Command command, @NotNull String alias, @NotNull String[] args)`
- `@Nullable public PluginCommand getCommand(@NotNull String name)`
- `public void onLoad()`
- `public void onDisable()`
- `public void onEnable()`
- `@Nullable public ChunkGenerator getDefaultWorldGenerator(@NotNull String worldName, @Nullable String id)`
- `@Nullable public BiomeProvider getDefaultBiomeProvider(@NotNull String worldName, @Nullable String id)`
- `public final boolean isNaggable()`
- `public final void setNaggable(boolean canNag)`
- `@NotNull public Logger getLogger()`
- `@NotNull public String toString()`
- `@NotNull public static <T extends JavaPlugin> T getPlugin(@NotNull Class<T> clazz)`
- `@NotNull public static JavaPlugin getProvidingPlugin(@NotNull Class<?> clazz)`
