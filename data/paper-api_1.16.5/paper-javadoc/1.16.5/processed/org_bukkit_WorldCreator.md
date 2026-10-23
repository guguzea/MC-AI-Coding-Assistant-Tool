---
title: "org.bukkit.WorldCreator"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/WorldCreator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public WorldCreator&#8203;(@NotNull @NotNull String name)`
- `public WorldCreator&#8203;(@NotNull @NotNull String levelName, @NotNull @NotNull NamespacedKey worldKey)`
- `public WorldCreator&#8203;(@NotNull @NotNull NamespacedKey worldKey)`
- `@NotNull public @NotNull NamespacedKey key()`
- `@NotNull public static @NotNull WorldCreator ofNameAndKey&#8203;(@NotNull @NotNull String levelName, @NotNull @NotNull NamespacedKey worldKey)`
- `@NotNull public static @NotNull WorldCreator ofKey&#8203;(@NotNull @NotNull NamespacedKey worldKey)`
- `@NotNull public @NotNull WorldCreator copy&#8203;(@NotNull @NotNull World world)`
- `@NotNull public @NotNull WorldCreator copy&#8203;(@NotNull @NotNull WorldCreator creator)`
- `@NotNull public @NotNull String name()`
- `public long seed()`
- `@NotNull public @NotNull WorldCreator seed&#8203;(long seed)`
- `@NotNull public World.Environment environment()`
- `@NotNull public @NotNull WorldCreator environment&#8203;(@NotNull World.Environment env)`
- `@NotNull public @NotNull WorldType type()`
- `@NotNull public @NotNull WorldCreator type&#8203;(@NotNull @NotNull WorldType type)`
- `@Nullable public @Nullable ChunkGenerator generator()`
- `@NotNull public @NotNull WorldCreator generator&#8203;(@Nullable @Nullable ChunkGenerator generator)`
- `@NotNull public @NotNull WorldCreator generator&#8203;(@Nullable @Nullable String generator)`
- `@NotNull public @NotNull WorldCreator generator&#8203;(@Nullable @Nullable String generator, @Nullable @Nullable CommandSender output)`
- `@NotNull public @NotNull WorldCreator generatorSettings&#8203;(@NotNull @NotNull String generatorSettings)`
- `@NotNull public @NotNull String generatorSettings()`
- `@NotNull public @NotNull WorldCreator generateStructures&#8203;(boolean generate)`
- `public boolean generateStructures()`
- `@NotNull public @NotNull WorldCreator hardcore&#8203;(boolean hardcore)`
- `public boolean hardcore()`
- `@Nullable public @Nullable World createWorld()`
- `@NotNull public static @NotNull WorldCreator name&#8203;(@NotNull @NotNull String name)`
- `@Nullable public static @Nullable ChunkGenerator getGeneratorForName&#8203;(@NotNull @NotNull String world, @Nullable @Nullable String name, @Nullable @Nullable CommandSender output)`
