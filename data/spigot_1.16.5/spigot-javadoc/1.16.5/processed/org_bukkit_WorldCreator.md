---
title: "org.bukkit.WorldCreator"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
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
- `public org.bukkit.WorldCreator generatorSettings(java.lang.String)`
- `public java.lang.String generatorSettings()`
- `public org.bukkit.WorldCreator generateStructures(boolean)`
- `public boolean generateStructures()`
- `public org.bukkit.WorldCreator hardcore(boolean)`
- `public boolean hardcore()`
- `public org.bukkit.World createWorld()`
- `public static org.bukkit.WorldCreator name(java.lang.String)`
- `public static org.bukkit.generator.ChunkGenerator getGeneratorForName(java.lang.String, java.lang.String, org.bukkit.command.CommandSender)`
