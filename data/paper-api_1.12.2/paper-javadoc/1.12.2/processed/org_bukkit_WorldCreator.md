---
title: "org.bukkit.WorldCreator"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/WorldCreator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `WorldCreator copy(World world)`
- `WorldCreator copy(WorldCreator creator)`
- `World createWorld()`
- `World.Environment environment()`
- `WorldCreator environment(World.Environment env)`
- `boolean generateStructures()`
- `WorldCreator generateStructures(boolean generate)`
- `ChunkGenerator generator()`
- `WorldCreator generator(String generator)`
- `WorldCreator generator(String generator, CommandSender output)`
- `WorldCreator generator(ChunkGenerator generator)`
- `String generatorSettings()`
- `WorldCreator generatorSettings(String generatorSettings)`
- `static ChunkGenerator getGeneratorForName(String world, String name, CommandSender output)`
- `String name()`
- `static WorldCreator name(String name)`
- `long seed()`
- `WorldCreator seed(long seed)`
- `WorldType type()`
- `WorldCreator type(WorldType type)`
