---
title: "org.bukkit.plugin.java.JavaPlugin"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/plugin/java/JavaPlugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public JavaPlugin()`
- `@Deprecated(forRemoval=true) protected JavaPlugin(JavaPluginLoader loader, PluginDescriptionFile description, File dataFolder, File file)`
- `public final File getDataFolder()`
- `@Deprecated(forRemoval=true) public final PluginLoader getPluginLoader()`
- `public final Server getServer()`
- `public final boolean isEnabled()`
- `protected File getFile()`
- `@Deprecated public final PluginDescriptionFile getDescription()`
- `public final PluginMeta getPluginMeta()`
- `public FileConfiguration getConfig()`
- `protected final @Nullable Reader getTextResource(String file)`
- `public void reloadConfig()`
- `public void saveConfig()`
- `public void saveDefaultConfig()`
- `public void saveResource(String resourcePath, boolean replace)`
- `public @Nullable InputStream getResource(String filename)`
- `protected final ClassLoader getClassLoader()`
- `@Internal public final void setEnabled(boolean enabled)`
- `public final void init(PluginLoader loader, Server server, PluginDescriptionFile description, File dataFolder, File file, ClassLoader classLoader)`
- `public final void init(Server server, PluginDescriptionFile description, File dataFolder, File file, ClassLoader classLoader, @Nullable PluginMeta configuration, Logger logger)`
- `public boolean onCommand(CommandSender sender, Command command, String label, String[] args)`
- `public @Nullable List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args)`
- `public @Nullable PluginCommand getCommand(String name)`
- `@Experimental public void registerCommand(String label, BasicCommand basicCommand)`
- `@Experimental public void registerCommand(String label, @Nullable String description, BasicCommand basicCommand)`
- `@Experimental public void registerCommand(String label, Collection<String> aliases, BasicCommand basicCommand)`
- `@Experimental public void registerCommand(String label, @Nullable String description, Collection<String> aliases, BasicCommand basicCommand)`
- `public void onLoad()`
- `public void onDisable()`
- `public void onEnable()`
- `public @Nullable ChunkGenerator getDefaultWorldGenerator(String worldName, @Nullable String id)`
- `public @Nullable BiomeProvider getDefaultBiomeProvider(String worldName, @Nullable String id)`
- `public final boolean isNaggable()`
- `public final void setNaggable(boolean canNag)`
- `public Logger getLogger()`
- `public String toString()`
- `public static <T extends JavaPlugin> T getPlugin(Class<T> clazz)`
- `public static JavaPlugin getProvidingPlugin(Class<?> clazz)`
- `public final LifecycleEventManager<Plugin> getLifecycleManager()`
