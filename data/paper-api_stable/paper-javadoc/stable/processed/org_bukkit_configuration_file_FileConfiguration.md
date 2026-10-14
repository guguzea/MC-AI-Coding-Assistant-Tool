---
title: "org.bukkit.configuration.file.FileConfiguration"
package: "org.bukkit.configuration.file"
source: https://jd.papermc.io/paper/26.3/org/bukkit/configuration/file/FileConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class FileConfiguration**
`public abstract class FileConfiguration extends MemoryConfiguration`
- `public FileConfiguration()`
- `public FileConfiguration(@Nullable @Nullable Configuration defaults)`
- `public void save(@NotNull @NotNull File file) throws IOException`
- `public void save(@NotNull @NotNull String file) throws IOException`
- `@NotNull public abstract @NotNull String saveToString()`
- `public void load(@NotNull @NotNull File file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public void load(@NotNull @NotNull Reader reader) throws IOException, InvalidConfigurationException`
- `public void load(@NotNull @NotNull String file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public abstract void loadFromString(@NotNull @NotNull String contents) throws InvalidConfigurationException`
- `@NotNull @Deprecated(since="1.18.1") protected @NotNull String buildHeader()`
- `@NotNull public @NotNull FileConfigurationOptions options()`
