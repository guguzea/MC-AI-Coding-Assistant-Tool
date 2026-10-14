---
title: "org.bukkit.util.BlockIterator"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/26.3/org/bukkit/util/BlockIterator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockIterator**
`public class BlockIterator extends Object implements Iterator<Block>`
- `public BlockIterator(@NotNull @NotNull World world, @NotNull @NotNull Vector start, @NotNull @NotNull Vector direction, double yOffset, int maxDistance)`
- `public BlockIterator(@NotNull @NotNull Location loc, double yOffset, int maxDistance)`
- `public BlockIterator(@NotNull @NotNull Location loc, double yOffset)`
- `public BlockIterator(@NotNull @NotNull Location loc)`
- `public BlockIterator(@NotNull @NotNull LivingEntity entity, int maxDistance)`
- `public BlockIterator(@NotNull @NotNull LivingEntity entity)`
- `public boolean hasNext()`
- `@NotNull public @NotNull Block next() throws NoSuchElementException`
- `public void remove()`
