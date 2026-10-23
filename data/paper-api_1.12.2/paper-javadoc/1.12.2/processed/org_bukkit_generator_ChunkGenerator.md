---
title: "org.bukkit.generator.ChunkGenerator"
package: "org.bukkit.generator"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/generator/ChunkGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static interface ChunkGenerator.BiomeGrid`
- `static interface ChunkGenerator.ChunkData`
- `boolean canSpawn(World world, int x, int z)`
- `protected ChunkGenerator.ChunkData createChunkData(World world)`
- `byte[] generate(World world, Random random, int x, int z)`
- `byte[][] generateBlockSections(World world, Random random, int x, int z, ChunkGenerator.BiomeGrid biomes)`
- `ChunkGenerator.ChunkData generateChunkData(World world, Random random, int x, int z, ChunkGenerator.BiomeGrid biome)`
- `short[][] generateExtBlockSections(World world, Random random, int x, int z, ChunkGenerator.BiomeGrid biomes)`
- `List<BlockPopulator> getDefaultPopulators(World world)`
- `Location getFixedSpawnLocation(World world, Random random)`
