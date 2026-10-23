---
title: "org.bukkit.generator.ChunkGenerator"
package: "org.bukkit.generator"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/generator/ChunkGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public ChunkGenerator()`
- `@NotNull public @NotNull ChunkGenerator.ChunkData generateChunkData&#8203;(@NotNull @NotNull World world, @NotNull @NotNull Random random, int x, int z, @NotNull @NotNull ChunkGenerator.BiomeGrid biome)`
- `@NotNull protected final @NotNull ChunkGenerator.ChunkData createChunkData&#8203;(@NotNull @NotNull World world)`
- `public boolean canSpawn&#8203;(@NotNull @NotNull World world, int x, int z)`
- `@NotNull public @NotNull List<BlockPopulator> getDefaultPopulators&#8203;(@NotNull @NotNull World world)`
- `@Nullable public @Nullable Location getFixedSpawnLocation&#8203;(@NotNull @NotNull World world, @NotNull @NotNull Random random)`
- `public boolean isParallelCapable()`
- `public boolean shouldGenerateCaves()`
- `public boolean shouldGenerateDecorations()`
- `public boolean shouldGenerateMobs()`
- `public boolean shouldGenerateStructures()`
- `@NotNull public @NotNull ChunkGenerator.ChunkData createVanillaChunkData&#8203;(@NotNull @NotNull World world, int x, int z)`
