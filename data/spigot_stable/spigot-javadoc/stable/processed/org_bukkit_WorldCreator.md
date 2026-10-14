---
title: "org.bukkit.WorldCreator"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/WorldCreator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class WorldCreator**
`public class WorldCreator extends Object`
- `public WorldCreator(@NotNull String name)`
- `@NotNull public WorldCreator copy(@NotNull World world)`
- `@NotNull public WorldCreator copy(@NotNull WorldCreator creator)`
- `@NotNull public String name()`
- `public long seed()`
- `@NotNull public WorldCreator seed(long seed)`
- `@NotNull public World.Environment environment()`
- `@NotNull public WorldCreator environment(@NotNull World.Environment env)`
- `@NotNull public WorldType type()`
- `@NotNull public WorldCreator type(@NotNull WorldType type)`
- `@Nullable public ChunkGenerator generator()`
- `@NotNull public WorldCreator generator(@Nullable ChunkGenerator generator)`
- `@NotNull public WorldCreator generator(@Nullable String generator)`
- `@NotNull public WorldCreator generator(@Nullable String generator, @Nullable CommandSender output)`
- `@Nullable public BiomeProvider biomeProvider()`
- `@NotNull public WorldCreator biomeProvider(@Nullable BiomeProvider biomeProvider)`
- `@NotNull public WorldCreator biomeProvider(@Nullable String biomeProvider)`
- `@NotNull public WorldCreator biomeProvider(@Nullable String biomeProvider, @Nullable CommandSender output)`
- `@NotNull public WorldCreator generatorSettings(@NotNull String generatorSettings)`
- `@NotNull public String generatorSettings()`
- `@NotNull public WorldCreator generateStructures(boolean generate)`
- `public boolean generateStructures()`
- `@NotNull public WorldCreator hardcore(boolean hardcore)`
- `public boolean hardcore()`
- `@NotNull @Deprecated(since="1.21.9") public WorldCreator keepSpawnInMemory(boolean keepSpawnInMemory)`
- `@Deprecated(since="1.21.9") public boolean keepSpawnInMemory()`
- `@Nullable public World createWorld()`
- `@NotNull public static WorldCreator name(@NotNull String name)`
- `@Nullable public static ChunkGenerator getGeneratorForName(@NotNull String world, @Nullable String name, @Nullable CommandSender output)`
- `@Nullable public static BiomeProvider getBiomeProviderForName(@NotNull String world, @Nullable String name, @Nullable CommandSender output)`
