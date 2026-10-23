---
title: "org.bukkit.RegionAccessor"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/RegionAccessor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Biome getBiome(@NotNull @NotNull Location location)`
- `@NotNull @NotNull Biome getBiome(int x, int y, int z)`
- `@NotNull @NotNull Biome getComputedBiome(int x, int y, int z)`
- `void setBiome(@NotNull @NotNull Location location, @NotNull @NotNull Biome biome)`
- `void setBiome(int x, int y, int z, @NotNull @NotNull Biome biome)`
- `@NotNull @NotNull BlockState getBlockState(@NotNull @NotNull Location location)`
- `@NotNull @NotNull BlockState getBlockState(int x, int y, int z)`
- `@NotNull FluidData getFluidData(int x, int y, int z)`
- `@NotNull default FluidData getFluidData(@NotNull Position position)`
- `@NotNull default FluidData getFluidData(@NotNull @NotNull Location location)`
- `@NotNull @NotNull BlockData getBlockData(@NotNull @NotNull Location location)`
- `@NotNull @NotNull BlockData getBlockData(int x, int y, int z)`
- `@NotNull @NotNull Material getType(@NotNull @NotNull Location location)`
- `@NotNull @NotNull Material getType(int x, int y, int z)`
- `void setBlockData(@NotNull @NotNull Location location, @NotNull @NotNull BlockData blockData)`
- `void setBlockData(int x, int y, int z, @NotNull @NotNull BlockData blockData)`
- `void setType(@NotNull @NotNull Location location, @NotNull @NotNull Material material)`
- `void setType(int x, int y, int z, @NotNull @NotNull Material material)`
- `boolean generateTree(@NotNull @NotNull Location location, @NotNull @NotNull Random random, @NotNull @NotNull TreeType type)`
- `boolean generateTree(@NotNull @NotNull Location location, @NotNull @NotNull Random random, @NotNull @NotNull TreeType type, @Nullable @Nullable Consumer<? super BlockState> stateConsumer)`
- `boolean generateTree(@NotNull @NotNull Location location, @NotNull @NotNull Random random, @NotNull @NotNull TreeType type, @Nullable @Nullable Predicate<? super BlockState> statePredicate)`
- `@NotNull @NotNull Entity spawnEntity(@NotNull @NotNull Location location, @NotNull @NotNull EntityType type)`
- `@NotNull @NotNull Entity spawnEntity(@NotNull @NotNull Location loc, @NotNull @NotNull EntityType type, boolean randomizeData)`
- `@NotNull @NotNull List<Entity> getEntities()`
- `@NotNull @NotNull List<LivingEntity> getLivingEntities()`
- `@NotNull <T extends Entity> @NotNull Collection<T> getEntitiesByClass(@NotNull @NotNull Class<T> cls)`
- `@NotNull @NotNull Collection<Entity> getEntitiesByClasses(@NotNull @NotNull Class<?>... classes)`
- `@NotNull <T extends Entity> T createEntity(@NotNull @NotNull Location location, @NotNull @NotNull Class<T> clazz)`
- `@NotNull <T extends Entity> T spawn(@NotNull @NotNull Location location, @NotNull @NotNull Class<T> clazz) throws IllegalArgumentException`
- `@NotNull default <T extends Entity> T spawn(@NotNull @NotNull Location location, @NotNull @NotNull Class<T> clazz, @Nullable @Nullable Consumer<? super T> function) throws IllegalArgumentException`
- `@NotNull default <T extends Entity> T spawn(@NotNull @NotNull Location location, @NotNull @NotNull Class<T> clazz, @NotNull CreatureSpawnEvent.SpawnReason reason) throws IllegalArgumentException`
- `@NotNull default <T extends Entity> T spawn(@NotNull @NotNull Location location, @NotNull @NotNull Class<T> clazz, @NotNull CreatureSpawnEvent.SpawnReason reason, @Nullable @Nullable Consumer<? super T> function) throws IllegalArgumentException`
- `@NotNull default @NotNull Entity spawnEntity(@NotNull @NotNull Location loc, @NotNull @NotNull EntityType type, @NotNull CreatureSpawnEvent.SpawnReason reason)`
- `@NotNull default @NotNull Entity spawnEntity(@NotNull @NotNull Location loc, @NotNull @NotNull EntityType type, @NotNull CreatureSpawnEvent.SpawnReason reason, @Nullable @Nullable Consumer<? super Entity> function)`
- `@NotNull <T extends Entity> T spawn(@NotNull @NotNull Location location, @NotNull @NotNull Class<T> clazz, @Nullable @Nullable Consumer<? super T> function, @NotNull CreatureSpawnEvent.SpawnReason reason) throws IllegalArgumentException`
- `@NotNull <T extends Entity> T spawn(@NotNull @NotNull Location location, @NotNull @NotNull Class<T> clazz, boolean randomizeData, @Nullable @Nullable Consumer<? super T> function) throws IllegalArgumentException`
- `int getHighestBlockYAt(int x, int z)`
- `int getHighestBlockYAt(@NotNull @NotNull Location location)`
- `int getHighestBlockYAt(int x, int z, @NotNull @NotNull HeightMap heightMap)`
- `int getHighestBlockYAt(@NotNull @NotNull Location location, @NotNull @NotNull HeightMap heightMap)`
- `@NotNull <T extends Entity> T addEntity(@NotNull T entity)`
- `@NotNull MoonPhase getMoonPhase()`
- `@NotNull @NotNull NamespacedKey getKey()`
- `boolean lineOfSightExists(@NotNull @NotNull Location from, @NotNull @NotNull Location to)`
- `boolean hasCollisionsIn(@NotNull BoundingBox boundingBox)`
