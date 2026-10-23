---
title: "org.bukkit.plugin.java.JavaPlugin"
package: "org.bukkit.plugin.java"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/java/JavaPlugin.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public JavaPlugin()`
- `protected JavaPlugin&#8203;(@NotNull @NotNull JavaPluginLoader loader, @NotNull @NotNull PluginDescriptionFile description, @NotNull @NotNull File dataFolder, @NotNull @NotNull File file)`
- `@NotNull public final @NotNull File getDataFolder()`
- `@NotNull public final @NotNull PluginLoader getPluginLoader()`
- `@NotNull public final @NotNull Server getServer()`
- `public final boolean isEnabled()`
- `@NotNull protected @NotNull File getFile()`
- `@NotNull public final @NotNull PluginDescriptionFile getDescription()`
- `@NotNull public @NotNull FileConfiguration getConfig()`
- `@Nullable protected final @Nullable Reader getTextResource&#8203;(@NotNull @NotNull String file)`
- `public void reloadConfig()`
- `public void saveConfig()`
- `public void saveDefaultConfig()`
- `public void saveResource&#8203;(@NotNull @NotNull String resourcePath, boolean replace)`
- `@Nullable public @Nullable InputStream getResource&#8203;(@NotNull @NotNull String filename)`
- `@NotNull protected final @NotNull ClassLoader getClassLoader()`
- `protected final void setEnabled&#8203;(boolean enabled)`
- `public boolean onCommand&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull Command command, @NotNull @NotNull String label, @NotNull @NotNull String[] args)`
- `@Nullable public @Nullable List<String> onTabComplete&#8203;(@NotNull @NotNull CommandSender sender, @NotNull @NotNull Command command, @NotNull @NotNull String alias, @NotNull @NotNull String[] args)`
- `@Nullable public @Nullable PluginCommand getCommand&#8203;(@NotNull @NotNull String name)`
- `public void onLoad()`
- `public void onDisable()`
- `public void onEnable()`
- `@Nullable public @Nullable ChunkGenerator getDefaultWorldGenerator&#8203;(@NotNull @NotNull String worldName, @Nullable @Nullable String id)`
- `public final boolean isNaggable()`
- `public final void setNaggable&#8203;(boolean canNag)`
- `@NotNull public @NotNull Logger getLogger()`
- `@NotNull public @NotNull String toString()`
- `@NotNull public static <T extends JavaPlugin> T getPlugin&#8203;(@NotNull @NotNull Class<T> clazz)`
- `@NotNull public static @NotNull JavaPlugin getProvidingPlugin&#8203;(@NotNull @NotNull Class<?> clazz)`
