---
title: "org.bukkit.configuration.file.FileConfiguration"
package: "org.bukkit.configuration.file"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/configuration/file/FileConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class FileConfiguration**
`public abstract class FileConfiguration extends MemoryConfiguration`
- `public FileConfiguration()`
- `public FileConfiguration(@Nullable Configuration defaults)`
- `public void save(@NotNull File file) throws IOException`
- `public void save(@NotNull String file) throws IOException`
- `@NotNull public abstract String saveToString()`
- `public void load(@NotNull File file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public void load(@NotNull Reader reader) throws IOException, InvalidConfigurationException`
- `public void load(@NotNull String file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public abstract void loadFromString(@NotNull String contents) throws InvalidConfigurationException`
- `@NotNull @Deprecated(since="1.18.1") protected String buildHeader()`
- `@NotNull public FileConfigurationOptions options()`
