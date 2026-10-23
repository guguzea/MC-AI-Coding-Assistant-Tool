---
title: "org.bukkit.plugin.java.JavaPlugin"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/plugin/java/JavaPlugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public JavaPlugin()`
- `@Deprecated(forRemoval=true) protected JavaPlugin(@NotNull @NotNull JavaPluginLoader loader, @NotNull @NotNull PluginDescriptionFile description, @NotNull @NotNull File dataFolder, @NotNull @NotNull File file)`
- `@NotNull public final @NotNull File getDataFolder()`
- `@NotNull @Deprecated(forRemoval=true) public final @NotNull PluginLoader getPluginLoader()`
- `@NotNull public final @NotNull Server getServer()`
- `public final boolean isEnabled()`
- `@NotNull protected @NotNull File getFile()`
- `@NotNull @Deprecated public final @NotNull PluginDescriptionFile getDescription()`
- `@NotNull public final PluginMeta getPluginMeta()`
- `@NotNull public @NotNull FileConfiguration getConfig()`
- `@Nullable protected final @Nullable Reader getTextResource(@NotNull @NotNull String file)`
- `public void reloadConfig()`
- `public void saveConfig()`
- `public void saveDefaultConfig()`
- `public void saveResource(@NotNull @NotNull String resourcePath, boolean replace)`
- `@Nullable public @Nullable InputStream getResource(@NotNull @NotNull String filename)`
- `@NotNull protected final @NotNull ClassLoader getClassLoader()`
- `@Internal public final void setEnabled(boolean enabled)`
- `public final void init(@NotNull @NotNull PluginLoader loader, @NotNull @NotNull Server server, @NotNull @NotNull PluginDescriptionFile description, @NotNull @NotNull File dataFolder, @NotNull @NotNull File file, @NotNull @NotNull ClassLoader classLoader)`
- `public final void init(@NotNull @NotNull Server server, @NotNull @NotNull PluginDescriptionFile description, @NotNull @NotNull File dataFolder, @NotNull @NotNull File file, @NotNull @NotNull ClassLoader classLoader, @Nullable PluginMeta configuration, @NotNull @NotNull Logger logger)`
- `public boolean onCommand(@NotNull @NotNull CommandSender sender, @NotNull @NotNull Command command, @NotNull @NotNull String label, @NotNull @NotNull String[] args)`
- `@Nullable public @Nullable List<String> onTabComplete(@NotNull @NotNull CommandSender sender, @NotNull @NotNull Command command, @NotNull @NotNull String alias, @NotNull @NotNull String[] args)`
- `@Nullable public @Nullable PluginCommand getCommand(@NotNull @NotNull String name)`
- `public void onLoad()`
- `public void onDisable()`
- `public void onEnable()`
- `@Nullable public @Nullable ChunkGenerator getDefaultWorldGenerator(@NotNull @NotNull String worldName, @Nullable @Nullable String id)`
- `@Nullable public @Nullable BiomeProvider getDefaultBiomeProvider(@NotNull @NotNull String worldName, @Nullable @Nullable String id)`
- `public final boolean isNaggable()`
- `public final void setNaggable(boolean canNag)`
- `@NotNull public @NotNull Logger getLogger()`
- `@NotNull public @NotNull String toString()`
- `@NotNull public static <T extends JavaPlugin> T getPlugin(@NotNull @NotNull Class<T> clazz)`
- `@NotNull public static @NotNull JavaPlugin getProvidingPlugin(@NotNull @NotNull Class<?> clazz)`
