---
title: "org.bukkit.configuration.file.FileConfiguration"
package: "org.bukkit.configuration.file"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public abstract class org.bukkit.configuration.file.FileConfiguration extends org.bukkit.configuration.MemoryConfiguration`
- `public org.bukkit.configuration.file.FileConfiguration()`
- `public org.bukkit.configuration.file.FileConfiguration(org.bukkit.configuration.Configuration)`
- `public void save(java.io.File) throws java.io.IOException`
- `public void save(java.lang.String) throws java.io.IOException`
- `public abstract java.lang.String saveToString()`
- `public void load(java.io.File) throws java.io.FileNotFoundException, java.io.IOException, org.bukkit.configuration.InvalidConfigurationException`
- `public void load(java.io.Reader) throws java.io.IOException, org.bukkit.configuration.InvalidConfigurationException`
- `public void load(java.lang.String) throws java.io.FileNotFoundException, java.io.IOException, org.bukkit.configuration.InvalidConfigurationException`
- `public abstract void loadFromString(java.lang.String) throws org.bukkit.configuration.InvalidConfigurationException`
- `protected java.lang.String buildHeader()`
- `public org.bukkit.configuration.file.FileConfigurationOptions options()`
- `public org.bukkit.configuration.MemoryConfigurationOptions options()`
- `public org.bukkit.configuration.ConfigurationOptions options()`
