---
title: "org.bukkit.generator.ChunkGenerator.ChunkData"
package: "org.bukkit.generator"
source: https://jd.papermc.io/paper/26.3/org/bukkit/generator/ChunkGenerator.ChunkData.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ChunkGenerator.ChunkData**
`public static interface ChunkGenerator.ChunkData`
- `int getMinHeight()`
- `int getMaxHeight()`
- `@NotNull @NotNull Biome getBiome(int x, int y, int z)`
- `void setBlock(int x, int y, int z, @NotNull @NotNull Material material)`
- `@Deprecated void setBlock(int x, int y, int z, @NotNull @NotNull MaterialData material)`
- `void setBlock(int x, int y, int z, @NotNull @NotNull BlockData blockData)`
- `void setRegion(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, @NotNull @NotNull Material material)`
- `@Deprecated void setRegion(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, @NotNull @NotNull MaterialData material)`
- `void setRegion(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, @NotNull @NotNull BlockData blockData)`
- `@NotNull @NotNull Material getType(int x, int y, int z)`
- `@NotNull @Deprecated @NotNull MaterialData getTypeAndData(int x, int y, int z)`
- `@NotNull @NotNull BlockData getBlockData(int x, int y, int z)`
- `@Deprecated(since="1.8.8") byte getData(int x, int y, int z)`
- `int getHeight(@NotNull @NotNull HeightMap heightMap, @Range(from=0L,to=15L) int x, @Range(from=0L,to=15L) int z)`
