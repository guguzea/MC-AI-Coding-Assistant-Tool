---
title: "org.bukkit.configuration.file.FileConfiguration"
package: "org.bukkit.configuration.file"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/configuration/file/FileConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public FileConfiguration()`
- `public FileConfiguration(@Nullable @Nullable Configuration defaults)`
- `public void save(@NotNull @NotNull File file) throws IOException`
- `public void save(@NotNull @NotNull String file) throws IOException`
- `@NotNull public abstract @NotNull String saveToString()`
- `public void load(@NotNull @NotNull File file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public void load(@NotNull @NotNull Reader reader) throws IOException, InvalidConfigurationException`
- `public void load(@NotNull @NotNull String file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public abstract void loadFromString(@NotNull @NotNull String contents) throws InvalidConfigurationException`
- `@NotNull @Deprecated protected @NotNull String buildHeader()`
- `@NotNull public @NotNull FileConfigurationOptions options()`
