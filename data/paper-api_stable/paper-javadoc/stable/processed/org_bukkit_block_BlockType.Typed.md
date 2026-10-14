---
title: "org.bukkit.block.BlockType.Typed"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/BlockType.Typed.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BlockType.Typed<B extends BlockData>**
`public static interface BlockType.Typed<B extends BlockData> extends BlockType`
- `Class<B> getBlockDataClass()`
- `B createBlockData(@Nullable Consumer<? super B> consumer)`
- `B createBlockData()`
- `@Unmodifiable Collection<B> createBlockDataStates()`
- `B createBlockData(@Nullable String data)`
