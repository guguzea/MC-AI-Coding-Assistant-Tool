---
title: "org.bukkit.structure.Structure"
package: "org.bukkit.structure"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/structure/Structure.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Structure**
`public interface Structure extends PersistentDataHolder`
- `@NotNull BlockVector getSize()`
- `@NotNull List<Palette> getPalettes()`
- `int getPaletteCount()`
- `@NotNull List<Entity> getEntities()`
- `int getEntityCount()`
- `void place(@NotNull Location location, boolean includeEntities, @NotNull StructureRotation structureRotation, @NotNull Mirror mirror, int palette, float integrity, @NotNull Random random)`
- `@Experimental void place(@NotNull Location location, boolean includeEntities, @NotNull StructureRotation structureRotation, @NotNull Mirror mirror, int palette, float integrity, @NotNull Random random, @NotNull Collection<BlockTransformer> blockTransformers, @NotNull Collection<EntityTransformer> entityTransformers)`
- `void place(@NotNull RegionAccessor regionAccessor, @NotNull BlockVector location, boolean includeEntities, @NotNull StructureRotation structureRotation, @NotNull Mirror mirror, int palette, float integrity, @NotNull Random random)`
- `@Experimental void place(@NotNull RegionAccessor regionAccessor, @NotNull BlockVector location, boolean includeEntities, @NotNull StructureRotation structureRotation, @NotNull Mirror mirror, int palette, float integrity, @NotNull Random random, @NotNull Collection<BlockTransformer> blockTransformers, @NotNull Collection<EntityTransformer> entityTransformers)`
- `void fill(@NotNull Location corner1, @NotNull Location corner2, boolean includeEntities)`
- `void fill(@NotNull Location origin, @NotNull BlockVector size, boolean includeEntities)`
