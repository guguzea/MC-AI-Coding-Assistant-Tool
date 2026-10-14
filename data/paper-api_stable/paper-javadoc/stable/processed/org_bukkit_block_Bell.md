---
title: "org.bukkit.block.Bell"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Bell.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Bell**
`public interface Bell extends TileState`
- `boolean ring(@Nullable @Nullable Entity entity, @Nullable @Nullable BlockFace direction)`
- `default boolean ring(@Nullable @Nullable Entity entity)`
- `default boolean ring(@Nullable @Nullable BlockFace direction)`
- `default boolean ring()`
- `boolean isShaking()`
- `int getShakingTicks()`
- `boolean isResonating()`
- `int getResonatingTicks()`
