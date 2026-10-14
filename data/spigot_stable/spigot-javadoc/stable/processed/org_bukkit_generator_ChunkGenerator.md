---
title: "org.bukkit.generator.ChunkGenerator"
package: "org.bukkit.generator"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/generator/ChunkGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ChunkGenerator**
`public abstract class ChunkGenerator extends Object`
- `public ChunkGenerator()`
- `public void generateNoise(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ, @NotNull ChunkGenerator.ChunkData chunkData)`
- `public void generateSurface(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ, @NotNull ChunkGenerator.ChunkData chunkData)`
- `public void generateBedrock(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ, @NotNull ChunkGenerator.ChunkData chunkData)`
- `public void generateCaves(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ, @NotNull ChunkGenerator.ChunkData chunkData)`
- `@Nullable public BiomeProvider getDefaultBiomeProvider(@NotNull WorldInfo worldInfo)`
- `public int getBaseHeight(@NotNull WorldInfo worldInfo, @NotNull Random random, int x, int z, @NotNull HeightMap heightMap)`
- `@NotNull @Deprecated(since="1.17.1") public ChunkGenerator.ChunkData generateChunkData(@NotNull World world, @NotNull Random random, int x, int z, @NotNull ChunkGenerator.BiomeGrid biome)`
- `@NotNull @Deprecated(since="1.17.1") protected final ChunkGenerator.ChunkData createChunkData(@NotNull World world)`
- `public boolean canSpawn(@NotNull World world, int x, int z)`
- `@NotNull public List<BlockPopulator> getDefaultPopulators(@NotNull World world)`
- `@Nullable public Location getFixedSpawnLocation(@NotNull World world, @NotNull Random random)`
- `@Deprecated(since="1.17.1") public boolean isParallelCapable()`
- `@Deprecated(since="26.3") public boolean shouldGenerateNoise()`
- `@Deprecated(since="26.3") public boolean shouldGenerateNoise(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateSurface()`
- `public boolean shouldGenerateSurface(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ)`
- `@Deprecated(since="1.19.2") public boolean shouldGenerateBedrock()`
- `@Deprecated(since="26.3") public boolean shouldGenerateCaves()`
- `@Deprecated(since="26.3") public boolean shouldGenerateCaves(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateDecorations()`
- `public boolean shouldGenerateDecorations(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateMobs()`
- `public boolean shouldGenerateMobs(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ)`
- `public boolean shouldGenerateStructures()`
- `public boolean shouldGenerateStructures(@NotNull WorldInfo worldInfo, @NotNull Random random, int chunkX, int chunkZ)`
