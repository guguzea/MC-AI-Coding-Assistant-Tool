---
title: "org.bukkit.configuration.file.YamlConfiguration"
package: "org.bukkit.configuration.file"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.configuration.file.YamlConfiguration extends org.bukkit.configuration.file.FileConfiguration`
- `protected static final java.lang.String COMMENT_PREFIX`
- `protected static final java.lang.String BLANK_CONFIG`
- `public org.bukkit.configuration.file.YamlConfiguration()`
- `public java.lang.String saveToString()`
- `public void loadFromString(java.lang.String) throws org.bukkit.configuration.InvalidConfigurationException`
- `protected void convertMapsToSections(java.util.Map<?, ?>, org.bukkit.configuration.ConfigurationSection)`
- `protected java.lang.String parseHeader(java.lang.String)`
- `protected java.lang.String buildHeader()`
- `public org.bukkit.configuration.file.YamlConfigurationOptions options()`
- `public static org.bukkit.configuration.file.YamlConfiguration loadConfiguration(java.io.File)`
- `public static org.bukkit.configuration.file.YamlConfiguration loadConfiguration(java.io.Reader)`
- `public org.bukkit.configuration.file.FileConfigurationOptions options()`
- `public org.bukkit.configuration.ConfigurationOptions options()`
- `public org.bukkit.configuration.MemoryConfigurationOptions options()`
