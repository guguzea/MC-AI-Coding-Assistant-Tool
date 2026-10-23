---
title: "org.bukkit.generator.ChunkGenerator"
package: "org.bukkit.generator"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/generator/ChunkGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public ChunkGenerator()`
- `public void generateNoise(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ, @NotNull @NotNull ChunkGenerator.ChunkData chunkData)`
- `public void generateSurface(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ, @NotNull @NotNull ChunkGenerator.ChunkData chunkData)`
- `public void generateBedrock(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ, @NotNull @NotNull ChunkGenerator.ChunkData chunkData)`
- `public void generateCaves(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ, @NotNull @NotNull ChunkGenerator.ChunkData chunkData)`
- `@Nullable public @Nullable BiomeProvider getDefaultBiomeProvider(@NotNull @NotNull WorldInfo worldInfo)`
- `public int getBaseHeight(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int x, int z, @NotNull @NotNull HeightMap heightMap)`
- `@NotNull @Deprecated public @NotNull ChunkGenerator.ChunkData generateChunkData(@NotNull @NotNull World world, @NotNull @NotNull Random random, int x, int z, @NotNull @NotNull ChunkGenerator.BiomeGrid biome)`
- `@NotNull @Deprecated protected final @NotNull ChunkGenerator.ChunkData createChunkData(@NotNull @NotNull World world)`
- `public boolean canSpawn(@NotNull @NotNull World world, int x, int z)`
- `@NotNull public @NotNull List<BlockPopulator> getDefaultPopulators(@NotNull @NotNull World world)`
- `@Nullable public @Nullable Location getFixedSpawnLocation(@NotNull @NotNull World world, @NotNull @NotNull Random random)`
- `@Deprecated public boolean isParallelCapable()`
- `public boolean shouldGenerateNoise()`
- `public boolean shouldGenerateNoise(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateSurface()`
- `public boolean shouldGenerateSurface(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ)`
- `@Deprecated public boolean shouldGenerateBedrock()`
- `public boolean shouldGenerateCaves()`
- `public boolean shouldGenerateCaves(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateDecorations()`
- `public boolean shouldGenerateDecorations(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateMobs()`
- `public boolean shouldGenerateMobs(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateStructures()`
- `public boolean shouldGenerateStructures(@NotNull @NotNull WorldInfo worldInfo, @NotNull @NotNull Random random, int chunkX, int chunkZ)`
