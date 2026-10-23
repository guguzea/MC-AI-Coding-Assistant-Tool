---
title: "org.bukkit.util.BlockIterator"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/util/BlockIterator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public BlockIterator(@NotNull @NotNull World world, @NotNull @NotNull Vector start, @NotNull @NotNull Vector direction, double yOffset, int maxDistance)`
- `public BlockIterator(@NotNull @NotNull Location loc, double yOffset, int maxDistance)`
- `public BlockIterator(@NotNull @NotNull Location loc, double yOffset)`
- `public BlockIterator(@NotNull @NotNull Location loc)`
- `public BlockIterator(@NotNull @NotNull LivingEntity entity, int maxDistance)`
- `public BlockIterator(@NotNull @NotNull LivingEntity entity)`
- `public boolean hasNext()`
- `@NotNull public @NotNull Block next() throws NoSuchElementException`
- `public void remove()`
