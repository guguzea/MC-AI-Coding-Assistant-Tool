---
title: "org.bukkit.RegionAccessor"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/RegionAccessor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface RegionAccessor**
`public interface RegionAccessor`
- `@NotNull Biome getBiome(@NotNull Location location)`
- `@NotNull Biome getBiome(int x, int y, int z)`
- `void setBiome(@NotNull Location location, @NotNull Biome biome)`
- `void setBiome(int x, int y, int z, @NotNull Biome biome)`
- `@NotNull BlockState getBlockState(@NotNull Location location)`
- `@NotNull BlockState getBlockState(int x, int y, int z)`
- `@NotNull BlockData getBlockData(@NotNull Location location)`
- `@NotNull BlockData getBlockData(int x, int y, int z)`
- `@NotNull Material getType(@NotNull Location location)`
- `@NotNull Material getType(int x, int y, int z)`
- `void setBlockData(@NotNull Location location, @NotNull BlockData blockData)`
- `void setBlockData(int x, int y, int z, @NotNull BlockData blockData)`
- `void setType(@NotNull Location location, @NotNull Material material)`
- `void setType(int x, int y, int z, @NotNull Material material)`
- `boolean generateTree(@NotNull Location location, @NotNull Random random, @NotNull TreeType type)`
- `boolean generateTree(@NotNull Location location, @NotNull Random random, @NotNull TreeType type, @Nullable Consumer<? super BlockState> stateConsumer)`
- `boolean generateTree(@NotNull Location location, @NotNull Random random, @NotNull TreeType type, @Nullable Predicate<? super BlockState> statePredicate)`
- `@NotNull Entity spawnEntity(@NotNull Location location, @NotNull EntityType type)`
- `@NotNull Entity spawnEntity(@NotNull Location loc, @NotNull EntityType type, boolean randomizeData)`
- `@NotNull List<Entity> getEntities()`
- `@NotNull List<LivingEntity> getLivingEntities()`
- `@NotNull <T extends Entity> Collection<T> getEntitiesByClass(@NotNull Class<T> cls)`
- `@NotNull Collection<Entity> getEntitiesByClasses(@NotNull Class<?>... classes)`
- `@NotNull <T extends Entity> T createEntity(@NotNull Location location, @NotNull Class<T> clazz)`
- `@NotNull <T extends Entity> T spawn(@NotNull Location location, @NotNull Class<T> clazz) throws IllegalArgumentException`
- `@NotNull <T extends Entity> T spawn(@NotNull Location location, @NotNull Class<T> clazz, @Nullable Consumer<? super T> function) throws IllegalArgumentException`
- `@NotNull <T extends Entity> T spawn(@NotNull Location location, @NotNull Class<T> clazz, boolean randomizeData, @Nullable Consumer<? super T> function) throws IllegalArgumentException`
- `int getHighestBlockYAt(int x, int z)`
- `int getHighestBlockYAt(@NotNull Location location)`
- `int getHighestBlockYAt(int x, int z, @NotNull HeightMap heightMap)`
- `int getHighestBlockYAt(@NotNull Location location, @NotNull HeightMap heightMap)`
- `@NotNull <T extends Entity> T addEntity(@NotNull T entity)`
