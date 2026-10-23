---
title: "org.bukkit.block.EntityBlockStorage"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.block.EntityBlockStorage<T extends org.bukkit.entity.Entity> extends org.bukkit.block.TileState`
- `public abstract boolean isFull()`
- `public abstract int getEntityCount()`
- `public abstract int getMaxEntities()`
- `public abstract void setMaxEntities(int)`
- `public abstract java.util.List<T> releaseEntities()`
- `public abstract void addEntity(T)`
