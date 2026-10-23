---
title: "org.bukkit.generator.ChunkGenerator"
package: "org.bukkit.generator"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public abstract class org.bukkit.generator.ChunkGenerator`
- `public org.bukkit.generator.ChunkGenerator()`
- `public byte[] generate(org.bukkit.World, java.util.Random, int, int)`
- `public short[][] generateExtBlockSections(org.bukkit.World, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$BiomeGrid)`
- `public byte[][] generateBlockSections(org.bukkit.World, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$BiomeGrid)`
- `public org.bukkit.generator.ChunkGenerator$ChunkData generateChunkData(org.bukkit.World, java.util.Random, int, int, org.bukkit.generator.ChunkGenerator$BiomeGrid)`
- `protected final org.bukkit.generator.ChunkGenerator$ChunkData createChunkData(org.bukkit.World)`
- `public boolean canSpawn(org.bukkit.World, int, int)`
- `public java.util.List<org.bukkit.generator.BlockPopulator> getDefaultPopulators(org.bukkit.World)`
- `public org.bukkit.Location getFixedSpawnLocation(org.bukkit.World, java.util.Random)`
