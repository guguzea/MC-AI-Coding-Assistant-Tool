---
title: "org.bukkit.util.BlockIterator"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/util/BlockIterator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public BlockIterator&#8203;(@NotNull @NotNull World world, @NotNull @NotNull Vector start, @NotNull @NotNull Vector direction, double yOffset, int maxDistance)`
- `public BlockIterator&#8203;(@NotNull @NotNull Location loc, double yOffset, int maxDistance)`
- `public BlockIterator&#8203;(@NotNull @NotNull Location loc, double yOffset)`
- `public BlockIterator&#8203;(@NotNull @NotNull Location loc)`
- `public BlockIterator&#8203;(@NotNull @NotNull LivingEntity entity, int maxDistance)`
- `public BlockIterator&#8203;(@NotNull @NotNull LivingEntity entity)`
- `public boolean hasNext()`
- `@NotNull public @NotNull Block next() throws NoSuchElementException`
- `public void remove()`
