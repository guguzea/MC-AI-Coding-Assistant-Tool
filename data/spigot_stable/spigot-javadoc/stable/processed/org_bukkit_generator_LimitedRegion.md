---
title: "org.bukkit.generator.LimitedRegion"
package: "org.bukkit.generator"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/generator/LimitedRegion.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface LimitedRegion**
`public interface LimitedRegion extends RegionAccessor`
- `int getBuffer()`
- `boolean isInRegion(@NotNull Location location)`
- `boolean isInRegion(int x, int y, int z)`
- `@NotNull List<BlockState> getTileEntities()`
