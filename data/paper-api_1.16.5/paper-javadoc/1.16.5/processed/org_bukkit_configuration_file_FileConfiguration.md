---
title: "org.bukkit.configuration.file.FileConfiguration"
package: "org.bukkit.configuration.file"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/configuration/file/FileConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public FileConfiguration()`
- `public FileConfiguration&#8203;(@Nullable @Nullable Configuration defaults)`
- `public void save&#8203;(@NotNull @NotNull File file) throws IOException`
- `public void save&#8203;(@NotNull @NotNull String file) throws IOException`
- `@NotNull public abstract @NotNull String saveToString()`
- `public void load&#8203;(@NotNull @NotNull File file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public void load&#8203;(@NotNull @NotNull Reader reader) throws IOException, InvalidConfigurationException`
- `public void load&#8203;(@NotNull @NotNull String file) throws FileNotFoundException, IOException, InvalidConfigurationException`
- `public abstract void loadFromString&#8203;(@NotNull @NotNull String contents) throws InvalidConfigurationException`
- `@NotNull protected abstract @NotNull String buildHeader()`
- `@NotNull public @NotNull FileConfigurationOptions options()`
