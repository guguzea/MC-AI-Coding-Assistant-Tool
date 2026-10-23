---
title: "org.bukkit.WorldCreator"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/WorldCreator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public WorldCreator(@NotNull @NotNull String name)`
- `public WorldCreator(@NotNull @NotNull String levelName, @NotNull @NotNull NamespacedKey worldKey)`
- `public WorldCreator(@NotNull @NotNull NamespacedKey worldKey)`
- `@NotNull public @NotNull NamespacedKey key()`
- `@NotNull public static @NotNull WorldCreator ofNameAndKey(@NotNull @NotNull String levelName, @NotNull @NotNull NamespacedKey worldKey)`
- `@NotNull public static @NotNull WorldCreator ofKey(@NotNull @NotNull NamespacedKey worldKey)`
- `@NotNull public @NotNull WorldCreator copy(@NotNull @NotNull World world)`
- `@NotNull public @NotNull WorldCreator copy(@NotNull @NotNull WorldCreator creator)`
- `@NotNull public @NotNull String name()`
- `public long seed()`
- `@NotNull public @NotNull WorldCreator seed(long seed)`
- `@NotNull public World.Environment environment()`
- `@NotNull public @NotNull WorldCreator environment(@NotNull World.Environment env)`
- `@NotNull public @NotNull WorldType type()`
- `@NotNull public @NotNull WorldCreator type(@NotNull @NotNull WorldType type)`
- `@Nullable public @Nullable ChunkGenerator generator()`
- `@NotNull public @NotNull WorldCreator generator(@Nullable @Nullable ChunkGenerator generator)`
- `@NotNull public @NotNull WorldCreator generator(@Nullable @Nullable String generator)`
- `@NotNull public @NotNull WorldCreator generator(@Nullable @Nullable String generator, @Nullable @Nullable CommandSender output)`
- `@Nullable public @Nullable BiomeProvider biomeProvider()`
- `@NotNull public @NotNull WorldCreator biomeProvider(@Nullable @Nullable BiomeProvider biomeProvider)`
- `@NotNull public @NotNull WorldCreator biomeProvider(@Nullable @Nullable String biomeProvider)`
- `@NotNull public @NotNull WorldCreator biomeProvider(@Nullable @Nullable String biomeProvider, @Nullable @Nullable CommandSender output)`
- `@NotNull public @NotNull WorldCreator generatorSettings(@NotNull @NotNull String generatorSettings)`
- `@NotNull public @NotNull String generatorSettings()`
- `@NotNull public @NotNull WorldCreator generateStructures(boolean generate)`
- `public boolean generateStructures()`
- `@NotNull public @NotNull WorldCreator hardcore(boolean hardcore)`
- `public boolean hardcore()`
- `@Nullable public @Nullable World createWorld()`
- `@NotNull public static @NotNull WorldCreator name(@NotNull @NotNull String name)`
- `@Nullable public static @Nullable ChunkGenerator getGeneratorForName(@NotNull @NotNull String world, @Nullable @Nullable String name, @Nullable @Nullable CommandSender output)`
- `@Nullable public static @Nullable BiomeProvider getBiomeProviderForName(@NotNull @NotNull String world, @Nullable @Nullable String name, @Nullable @Nullable CommandSender output)`
- `@NotNull public TriState keepSpawnLoaded()`
- `@NotNull public @NotNull WorldCreator keepSpawnLoaded(@NotNull TriState keepSpawnLoaded)`
