---
title: "ComponentScatteredFeaturePieces.DesertPyramid"
description: "public static class ComponentScatteredFeaturePieces.DesertPyramid extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/ComponentScatteredFeaturePieces.DesertPyramid.html"
sourceType: javadoc
---

# ComponentScatteredFeaturePieces.DesertPyramid

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.ComponentScatteredFeaturePieces.DesertPyramid

## Class signature

```java
public static class ComponentScatteredFeaturePieces.DesertPyramid extends StructureComponent
```

## Constructors

- `DesertPyramid()`
- `DesertPyramid(java.util.Random p_i2062_1_, int p_i2062_2_, int p_i2062_3_)`

## Methods

- `boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `protected boolean func_74935_a(World worldIn, StructureBoundingBox p_74935_2_, int p_74935_3_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected int field_74936_d`
- `protected int scatteredFeatureSizeX` — The size of the bounding box for this feature in the X axis
- `protected int scatteredFeatureSizeY` — The size of the bounding box for this feature in the Y axis
- `protected int scatteredFeatureSizeZ` — The size of the bounding box for this feature in the Z axis
