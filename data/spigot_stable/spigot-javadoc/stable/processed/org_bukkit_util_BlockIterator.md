---
title: "org.bukkit.util.BlockIterator"
package: "org.bukkit.util"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/util/BlockIterator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockIterator**
`public class BlockIterator extends Object implements Iterator<Block>`
- `public BlockIterator(@NotNull World world, @NotNull Vector start, @NotNull Vector direction, double yOffset, int maxDistance)`
- `public BlockIterator(@NotNull Location loc, double yOffset, int maxDistance)`
- `public BlockIterator(@NotNull Location loc, double yOffset)`
- `public BlockIterator(@NotNull Location loc)`
- `public BlockIterator(@NotNull LivingEntity entity, int maxDistance)`
- `public BlockIterator(@NotNull LivingEntity entity)`
- `public boolean hasNext()`
- `@NotNull public Block next() throws NoSuchElementException`
- `public void remove()`
