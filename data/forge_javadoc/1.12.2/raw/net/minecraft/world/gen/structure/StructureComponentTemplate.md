---
title: "StructureComponentTemplate"
description: "public abstract class StructureComponentTemplate extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/structure/StructureComponentTemplate.html"
sourceType: javadoc
---

# StructureComponentTemplate

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureComponentTemplate

## Class signature

```java
public abstract class StructureComponentTemplate extends StructureComponent
```

## Constructors

- `StructureComponentTemplate()`
- `StructureComponentTemplate(int type)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `protected abstract void handleDataMarker(java.lang.String function, BlockPos pos, World worldIn, java.util.Random rand, StructureBoundingBox sbb)`
- `void offset(int x, int y, int z)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `protected void setup(Template templateIn, BlockPos pos, PlacementSettings settings)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected PlacementSettings placeSettings`
- `protected Template template`
- `protected BlockPos templatePosition`
