---
title: "org.bukkit.block.EntityBlockStorage"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/EntityBlockStorage.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface EntityBlockStorage<T extends Entity>**
`public interface EntityBlockStorage<T extends Entity> extends TileState`
- `boolean isFull()`
- `int getEntityCount()`
- `int getMaxEntities()`
- `void setMaxEntities(int max)`
- `@NotNull List<T> releaseEntities()`
- `void addEntity(@NotNull T entity)`
