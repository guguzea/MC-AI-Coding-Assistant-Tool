---
title: "org.bukkit.block.BlockType.Typed"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/BlockType.Typed.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BlockType.Typed<B extends BlockData>**
`public static interface BlockType.Typed<B extends BlockData> extends BlockType`
- `@NotNull Class<B> getBlockDataClass()`
- `@NotNull B createBlockData(@Nullable Consumer<? super B> consumer)`
- `@NotNull B createBlockData()`
- `@NotNull B createBlockData(@Nullable String data)`
