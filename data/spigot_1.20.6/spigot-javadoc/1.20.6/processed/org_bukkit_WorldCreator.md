---
title: "org.bukkit.WorldCreator"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.WorldCreator`
- `public org.bukkit.WorldCreator(java.lang.String)`
- `public org.bukkit.WorldCreator copy(org.bukkit.World)`
- `public org.bukkit.WorldCreator copy(org.bukkit.WorldCreator)`
- `public java.lang.String name()`
- `public long seed()`
- `public org.bukkit.WorldCreator seed(long)`
- `public org.bukkit.World$Environment environment()`
- `public org.bukkit.WorldCreator environment(org.bukkit.World$Environment)`
- `public org.bukkit.WorldType type()`
- `public org.bukkit.WorldCreator type(org.bukkit.WorldType)`
- `public org.bukkit.generator.ChunkGenerator generator()`
- `public org.bukkit.WorldCreator generator(org.bukkit.generator.ChunkGenerator)`
- `public org.bukkit.WorldCreator generator(java.lang.String)`
- `public org.bukkit.WorldCreator generator(java.lang.String, org.bukkit.command.CommandSender)`
- `public org.bukkit.generator.BiomeProvider biomeProvider()`
- `public org.bukkit.WorldCreator biomeProvider(org.bukkit.generator.BiomeProvider)`
- `public org.bukkit.WorldCreator biomeProvider(java.lang.String)`
- `public org.bukkit.WorldCreator biomeProvider(java.lang.String, org.bukkit.command.CommandSender)`
- `public org.bukkit.WorldCreator generatorSettings(java.lang.String)`
- `public java.lang.String generatorSettings()`
- `public org.bukkit.WorldCreator generateStructures(boolean)`
- `public boolean generateStructures()`
- `public org.bukkit.WorldCreator hardcore(boolean)`
- `public boolean hardcore()`
- `public org.bukkit.WorldCreator keepSpawnInMemory(boolean)`
- `public boolean keepSpawnInMemory()`
- `public org.bukkit.World createWorld()`
- `public static org.bukkit.WorldCreator name(java.lang.String)`
- `public static org.bukkit.generator.ChunkGenerator getGeneratorForName(java.lang.String, java.lang.String, org.bukkit.command.CommandSender)`
- `public static org.bukkit.generator.BiomeProvider getBiomeProviderForName(java.lang.String, java.lang.String, org.bukkit.command.CommandSender)`
