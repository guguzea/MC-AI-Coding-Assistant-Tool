---
title: "org.bukkit.generator.ChunkGenerator"
package: "org.bukkit.generator"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public abstract class org.bukkit.generator.ChunkGenerator`
- `public org.bukkit.generator.ChunkGenerator()`
- `public void generateNoise(org.bukkit.generator.WorldInfo, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$ChunkData)`
- `public void generateSurface(org.bukkit.generator.WorldInfo, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$ChunkData)`
- `public void generateBedrock(org.bukkit.generator.WorldInfo, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$ChunkData)`
- `public void generateCaves(org.bukkit.generator.WorldInfo, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$ChunkData)`
- `public org.bukkit.generator.BiomeProvider getDefaultBiomeProvider(org.bukkit.generator.WorldInfo)`
- `public int getBaseHeight(org.bukkit.generator.WorldInfo, java.util.Random, int, int, org.bukkit.HeightMap)`
- `public org.bukkit.generator.ChunkGenerator$ChunkData generateChunkData(org.bukkit.World, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$BiomeGrid)`
- `protected final org.bukkit.generator.ChunkGenerator$ChunkData createChunkData(org.bukkit.World)`
- `public boolean canSpawn(org.bukkit.World, int, int)`
- `public java.util.List<org.bukkit.generator.BlockPopulator> getDefaultPopulators(org.bukkit.World)`
- `public org.bukkit.Location getFixedSpawnLocation(org.bukkit.World, java.util.Random)`
- `public boolean isParallelCapable()`
- `public boolean shouldGenerateNoise()`
- `public boolean shouldGenerateNoise(org.bukkit.generator.WorldInfo, java.util.Random, int, int)`
- `public boolean shouldGenerateSurface()`
- `public boolean shouldGenerateSurface(org.bukkit.generator.WorldInfo, java.util.Random, int, int)`
- `public boolean shouldGenerateBedrock()`
- `public boolean shouldGenerateCaves()`
- `public boolean shouldGenerateCaves(org.bukkit.generator.WorldInfo, java.util.Random, int, int)`
- `public boolean shouldGenerateDecorations()`
- `public boolean shouldGenerateDecorations(org.bukkit.generator.WorldInfo, java.util.Random, int, int)`
- `public boolean shouldGenerateMobs()`
- `public boolean shouldGenerateMobs(org.bukkit.generator.WorldInfo, java.util.Random, int, int)`
- `public boolean shouldGenerateStructures()`
- `public boolean shouldGenerateStructures(org.bukkit.generator.WorldInfo, java.util.Random, int, int)`
