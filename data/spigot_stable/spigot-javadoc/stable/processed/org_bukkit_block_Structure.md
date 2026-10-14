---
title: "org.bukkit.block.Structure"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Structure.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Structure**
`public interface Structure extends TileState`
- `@NotNull String getStructureName()`
- `void setStructureName(@NotNull String name)`
- `@NotNull String getAuthor()`
- `void setAuthor(@NotNull String author)`
- `void setAuthor(@NotNull LivingEntity livingEntity)`
- `@NotNull BlockVector getRelativePosition()`
- `void setRelativePosition(@NotNull BlockVector vector)`
- `@NotNull BlockVector getStructureSize()`
- `void setStructureSize(@NotNull BlockVector vector)`
- `void setMirror(@NotNull Mirror mirror)`
- `@NotNull Mirror getMirror()`
- `void setRotation(@NotNull StructureRotation rotation)`
- `@NotNull StructureRotation getRotation()`
- `void setUsageMode(@NotNull UsageMode mode)`
- `@NotNull UsageMode getUsageMode()`
- `void setIgnoreEntities(boolean ignoreEntities)`
- `boolean isIgnoreEntities()`
- `void setShowAir(boolean showAir)`
- `boolean isShowAir()`
- `void setBoundingBoxVisible(boolean showBoundingBox)`
- `boolean isBoundingBoxVisible()`
- `void setIntegrity(float integrity)`
- `float getIntegrity()`
- `void setSeed(long seed)`
- `long getSeed()`
- `void setMetadata(@NotNull String metadata)`
- `@NotNull String getMetadata()`
