---
title: "org.bukkit.block.Structure"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/block/Structure.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getStructureName()`
- `void setStructureName(@NotNull @NotNull String name)`
- `@NotNull @NotNull String getAuthor()`
- `void setAuthor(@NotNull @NotNull String author)`
- `void setAuthor(@NotNull @NotNull LivingEntity livingEntity)`
- `@NotNull @NotNull BlockVector getRelativePosition()`
- `void setRelativePosition(@NotNull @NotNull BlockVector vector)`
- `@NotNull @NotNull BlockVector getStructureSize()`
- `void setStructureSize(@NotNull @NotNull BlockVector vector)`
- `void setMirror(@NotNull @NotNull Mirror mirror)`
- `@NotNull @NotNull Mirror getMirror()`
- `void setRotation(@NotNull @NotNull StructureRotation rotation)`
- `@NotNull @NotNull StructureRotation getRotation()`
- `void setUsageMode(@NotNull @NotNull UsageMode mode)`
- `@NotNull @NotNull UsageMode getUsageMode()`
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
- `void setMetadata(@NotNull @NotNull String metadata)`
- `@NotNull @NotNull String getMetadata()`
