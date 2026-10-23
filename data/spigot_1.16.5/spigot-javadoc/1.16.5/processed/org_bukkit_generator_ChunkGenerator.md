---
title: "org.bukkit.generator.ChunkGenerator"
package: "org.bukkit.generator"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public abstract class org.bukkit.generator.ChunkGenerator`
- `public org.bukkit.generator.ChunkGenerator()`
- `public org.bukkit.generator.ChunkGenerator$ChunkData generateChunkData(org.bukkit.World, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$BiomeGrid)`
- `protected final org.bukkit.generator.ChunkGenerator$ChunkData createChunkData(org.bukkit.World)`
- `public boolean canSpawn(org.bukkit.World, int, int)`
- `public java.util.List<org.bukkit.generator.BlockPopulator> getDefaultPopulators(org.bukkit.World)`
- `public org.bukkit.Location getFixedSpawnLocation(org.bukkit.World, java.util.Random)`
- `public boolean isParallelCapable()`
- `public boolean shouldGenerateCaves()`
- `public boolean shouldGenerateDecorations()`
- `public boolean shouldGenerateMobs()`
- `public boolean shouldGenerateStructures()`
