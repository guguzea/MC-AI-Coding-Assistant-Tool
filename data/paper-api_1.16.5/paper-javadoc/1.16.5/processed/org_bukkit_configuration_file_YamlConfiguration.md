---
title: "org.bukkit.configuration.file.YamlConfiguration"
package: "org.bukkit.configuration.file"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/configuration/file/YamlConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected static final String COMMENT_PREFIX`
- `protected static final String BLANK_CONFIG`
- `public YamlConfiguration()`
- `@NotNull public @NotNull String saveToString()`
- `public void loadFromString&#8203;(@NotNull @NotNull String contents) throws InvalidConfigurationException`
- `protected void convertMapsToSections&#8203;(@NotNull @NotNull Map<?,&#8203;?> input, @NotNull @NotNull ConfigurationSection section)`
- `@NotNull protected @NotNull String parseHeader&#8203;(@NotNull @NotNull String input)`
- `@NotNull protected @NotNull String buildHeader()`
- `@NotNull public @NotNull YamlConfigurationOptions options()`
- `@NotNull public static @NotNull YamlConfiguration loadConfiguration&#8203;(@NotNull @NotNull File file)`
- `@NotNull public static @NotNull YamlConfiguration loadConfiguration&#8203;(@NotNull @NotNull Reader reader)`
