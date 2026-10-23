---
title: "org.bukkit.RegionAccessor"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.RegionAccessor`
- `public abstract org.bukkit.block.Biome getBiome(org.bukkit.Location)`
- `public abstract org.bukkit.block.Biome getBiome(int, int, int)`
- `public abstract void setBiome(org.bukkit.Location, org.bukkit.block.Biome)`
- `public abstract void setBiome(int, int, int, org.bukkit.block.Biome)`
- `public abstract org.bukkit.block.BlockState getBlockState(org.bukkit.Location)`
- `public abstract org.bukkit.block.BlockState getBlockState(int, int, int)`
- `public abstract org.bukkit.block.data.BlockData getBlockData(org.bukkit.Location)`
- `public abstract org.bukkit.block.data.BlockData getBlockData(int, int, int)`
- `public abstract org.bukkit.Material getType(org.bukkit.Location)`
- `public abstract org.bukkit.Material getType(int, int, int)`
- `public abstract void setBlockData(org.bukkit.Location, org.bukkit.block.data.BlockData)`
- `public abstract void setBlockData(int, int, int, org.bukkit.block.data.BlockData)`
- `public abstract void setType(org.bukkit.Location, org.bukkit.Material)`
- `public abstract void setType(int, int, int, org.bukkit.Material)`
- `public abstract boolean generateTree(org.bukkit.Location, java.util.Random, org.bukkit.TreeType)`
- `public abstract boolean generateTree(org.bukkit.Location, java.util.Random, org.bukkit.TreeType, java.util.function.Consumer<? super org.bukkit.block.BlockState>)`
- `public abstract boolean generateTree(org.bukkit.Location, java.util.Random, org.bukkit.TreeType, java.util.function.Predicate<? super org.bukkit.block.BlockState>)`
- `public abstract org.bukkit.entity.Entity spawnEntity(org.bukkit.Location, org.bukkit.entity.EntityType)`
- `public abstract org.bukkit.entity.Entity spawnEntity(org.bukkit.Location, org.bukkit.entity.EntityType, boolean)`
- `public abstract java.util.List<org.bukkit.entity.Entity> getEntities()`
- `public abstract java.util.List<org.bukkit.entity.LivingEntity> getLivingEntities()`
- `public abstract <T extends org.bukkit.entity.Entity> java.util.Collection<T> getEntitiesByClass(java.lang.Class<T>)`
- `public abstract java.util.Collection<org.bukkit.entity.Entity> getEntitiesByClasses(java.lang.Class<?>...)`
- `public abstract <T extends org.bukkit.entity.Entity> T createEntity(org.bukkit.Location, java.lang.Class<T>)`
- `public abstract <T extends org.bukkit.entity.Entity> T spawn(org.bukkit.Location, java.lang.Class<T>) throws java.lang.IllegalArgumentException`
- `public abstract <T extends org.bukkit.entity.Entity> T spawn(org.bukkit.Location, java.lang.Class<T>, java.util.function.Consumer<? super T>) throws java.lang.IllegalArgumentException`
- `public abstract <T extends org.bukkit.entity.Entity> T spawn(org.bukkit.Location, java.lang.Class<T>, boolean, java.util.function.Consumer<? super T>) throws java.lang.IllegalArgumentException`
- `public abstract int getHighestBlockYAt(int, int)`
- `public abstract int getHighestBlockYAt(org.bukkit.Location)`
- `public abstract int getHighestBlockYAt(int, int, org.bukkit.HeightMap)`
- `public abstract int getHighestBlockYAt(org.bukkit.Location, org.bukkit.HeightMap)`
- `public abstract <T extends org.bukkit.entity.Entity> T addEntity(T)`
