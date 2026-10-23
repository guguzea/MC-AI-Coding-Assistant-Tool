---
title: "org.bukkit.structure.Structure"
package: "org.bukkit.structure"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/structure/Structure.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull BlockVector getSize()`
- `@NotNull @NotNull List<Palette> getPalettes()`
- `int getPaletteCount()`
- `@NotNull @NotNull List<Entity> getEntities()`
- `int getEntityCount()`
- `void place(@NotNull @NotNull Location location, boolean includeEntities, @NotNull @NotNull StructureRotation structureRotation, @NotNull @NotNull Mirror mirror, int palette, float integrity, @NotNull @NotNull Random random)`
- `void place(@NotNull @NotNull RegionAccessor regionAccessor, @NotNull @NotNull BlockVector location, boolean includeEntities, @NotNull @NotNull StructureRotation structureRotation, @NotNull @NotNull Mirror mirror, int palette, float integrity, @NotNull @NotNull Random random)`
- `void fill(@NotNull @NotNull Location corner1, @NotNull @NotNull Location corner2, boolean includeEntities)`
- `void fill(@NotNull @NotNull Location origin, @NotNull @NotNull BlockVector size, boolean includeEntities)`
