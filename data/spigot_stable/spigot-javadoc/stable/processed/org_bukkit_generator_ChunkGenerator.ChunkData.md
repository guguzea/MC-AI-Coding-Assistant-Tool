---
title: "org.bukkit.generator.ChunkGenerator.ChunkData"
package: "org.bukkit.generator"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/generator/ChunkGenerator.ChunkData.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ChunkGenerator.ChunkData**
`public static interface ChunkGenerator.ChunkData`
- `int getMinHeight()`
- `int getMaxHeight()`
- `@NotNull Biome getBiome(int x, int y, int z)`
- `void setBlock(int x, int y, int z, @NotNull Material material)`
- `void setBlock(int x, int y, int z, @NotNull MaterialData material)`
- `void setBlock(int x, int y, int z, @NotNull BlockData blockData)`
- `void setRegion(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, @NotNull Material material)`
- `void setRegion(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, @NotNull MaterialData material)`
- `void setRegion(int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, @NotNull BlockData blockData)`
- `@NotNull Material getType(int x, int y, int z)`
- `@NotNull MaterialData getTypeAndData(int x, int y, int z)`
- `@NotNull BlockData getBlockData(int x, int y, int z)`
- `@Deprecated(since="1.8.8") byte getData(int x, int y, int z)`
