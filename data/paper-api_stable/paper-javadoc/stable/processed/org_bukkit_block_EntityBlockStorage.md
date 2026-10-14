---
title: "org.bukkit.block.EntityBlockStorage"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/EntityBlockStorage.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EntityBlockStorage<T extends Entity>**
`public interface EntityBlockStorage<T extends Entity> extends TileState`
- `boolean isFull()`
- `int getEntityCount()`
- `int getMaxEntities()`
- `void setMaxEntities(int max)`
- `@NotNull @NotNull List<T> releaseEntities()`
- `void addEntity(@NotNull T entity)`
- `void clearEntities()`
